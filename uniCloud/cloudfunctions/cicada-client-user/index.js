const crypto = require('crypto')
const db = uniCloud.database()
const TOKEN_TTL = 30 * 24 * 60 * 60 * 1000

const createToken = () => crypto.randomBytes(32).toString('hex')

const createSession = async (userId) => {
  const now = Date.now()
  const token = createToken()
  await db.collection('tokens').add({
    userId,
    token,
    createTime: now,
    expireTime: now + TOKEN_TTL,
    revoked: false
  })
  return token
}

const verifyToken = async (token) => {
  if (!token) return null
  const tokenRes = await db.collection('tokens').where({ token, revoked: false }).limit(1).get()
  const record = tokenRes.data && tokenRes.data[0]
  if (!record) return null
  if (record.expireTime && record.expireTime < Date.now()) {
    await db.collection('tokens').doc(record._id).update({ revoked: true, updateTime: Date.now() })
    return null
  }
  return record
}

module.exports = {
  _table: 'users',
  
  async login(event) {
    return { code: 400, message: '暂不支持手机号直登，请使用微信手机号授权登录' }
  },
  
  async loginWithWechat(event) {
    const { code } = event
    const wechatConfig = require('./wechat-config.json')
    const { appId, appSecret } = wechatConfig

    if (!code) return { code: 400, message: '缺少参数' }
    if (!appId || !appSecret) return { code: 500, message: '请先配置微信小程序的 AppID 和 AppSecret' }

    try {
      const sessionRes = await uniCloud.httpclient.request(
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`,
        { method: 'GET', dataType: 'json' }
      )

      if (!sessionRes.data.access_token) {
        return { code: 500, message: '微信授权失败' }
      }

      const phoneRes = await uniCloud.httpclient.request(
        `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${sessionRes.data.access_token}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          data: JSON.stringify({ code }),
          dataType: 'json'
        }
      )

      if (phoneRes.data.errcode !== 0) {
        return { code: 400, message: phoneRes.data.errmsg || '获取手机号失败' }
      }

      const phone = phoneRes.data.phone_info.phoneNumber
      if (!phone) return { code: 400, message: '获取手机号失败' }

      let userRes = await db.collection('users').where({ phone }).limit(1).get()
      let userId
      let nickname = `用户${phone.slice(-4)}`

      if (!userRes.data.length) {
        const addRes = await db.collection('users').add({
          phone,
          nickname,
          wechatInfo: phoneRes.data.phone_info,
          createTime: Date.now(),
          updateTime: Date.now()
        })
        userId = addRes.id
      } else {
        userId = userRes.data[0]._id
        nickname = userRes.data[0].nickname || nickname
        await db.collection('users').doc(userId).update({
          wechatInfo: phoneRes.data.phone_info,
          updateTime: Date.now()
        })
      }

      const token = await createSession(userId)

      return {
        code: 0,
        message: '登录成功',
        data: { token, userInfo: { id: userId, phone, nickname } }
      }
    } catch (error) {
      return { code: 500, message: '登录失败' }
    }
  },

  async getRepairList(event) {
    const { token, status, page = 1, pageSize = 10 } = event
    const tokenRecord = await verifyToken(token)
    
    if (!tokenRecord) {
      return { code: 401, message: '登录已过期，请重新登录' }
    }

    try {
      let query = db.collection('repairOrders').where({ userId: tokenRecord.userId })
      
      if (status && status !== 'all') {
        query = query.where({ status })
      }

      const skip = (page - 1) * pageSize
      const result = await query.orderBy('createTime', 'desc').skip(skip).limit(pageSize).get()

      return {
        code: 0,
        message: 'success',
        data: {
          list: result.data,
          total: result.data.length
        }
      }
    } catch (error) {
      return { code: 500, message: '获取订单列表失败' }
    }
  },

  async getRepairDetail(event) {
    const { id, token } = event
    const tokenRecord = await verifyToken(token)
    
    if (!id) {
      return { code: 400, message: '缺少订单ID' }
    }

    if (!tokenRecord) {
      return { code: 401, message: '登录已过期，请重新登录' }
    }

    try {
      const result = await db.collection('repairOrders').doc(id).get()
      
      if (!result.data || !result.data.length) {
        return { code: 404, message: '订单不存在' }
      }

      if (result.data[0].userId !== tokenRecord.userId) {
        return { code: 403, message: '无权查看该订单' }
      }

      return {
        code: 0,
        message: 'success',
        data: result.data[0]
      }
    } catch (error) {
      return { code: 500, message: '获取订单详情失败' }
    }
  },

  async submitRepair(event) {
    const { data, token } = event
    const tokenRecord = await verifyToken(token)
    
    if (!tokenRecord) {
      return { code: 401, message: '登录已过期，请重新登录' }
    }

    if (!data || !data.products || !data.products.length) {
      return { code: 400, message: '缺少必要参数' }
    }

    try {
      const orderData = {
        ...data,
        userId: tokenRecord.userId,
        status: 'submitted',
        statusText: '已提交',
        createTime: Date.now(),
        updateTime: Date.now()
      }

      const result = await db.collection('repairOrders').add(orderData)

      return {
        code: 0,
        message: '提交成功',
        data: { id: result.id }
      }
    } catch (error) {
      return { code: 500, message: '提交失败' }
    }
  },

  async cancelRepair(event) {
    const { id, reason, token } = event
    const tokenRecord = await verifyToken(token)
    
    if (!id) {
      return { code: 400, message: '缺少订单ID' }
    }

    if (!tokenRecord) {
      return { code: 401, message: '登录已过期，请重新登录' }
    }

    try {
      const orderRes = await db.collection('repairOrders').doc(id).get()
      if (!orderRes.data || !orderRes.data.length) {
        return { code: 404, message: '订单不存在' }
      }
      if (orderRes.data[0].userId !== tokenRecord.userId) {
        return { code: 403, message: '无权取消该订单' }
      }

      await db.collection('repairOrders').doc(id).update({
        status: 'cancelled',
        statusText: '已取消',
        cancelReason: reason,
        updateTime: Date.now()
      })

      return {
        code: 0,
        message: '取消成功'
      }
    } catch (error) {
      return { code: 500, message: '取消失败' }
    }
  }
}
