'use strict'

const crypto = require('crypto')
// 引入微信配置
const wechatConfig = require('./wechat-config.json')
const TOKEN_TTL = 30 * 24 * 60 * 60 * 1000

const createToken = () => crypto.randomBytes(32).toString('hex')

exports.main = async (event, context) => {
  const { code } = event

  if (!code) {
    return {
      code: 400,
      message: '缺少参数'
    }
  }

  try {
    const db = uniCloud.database()
    
    const { appId, appSecret } = wechatConfig
    
    if (!appId || !appSecret || appId === 'your-appid') {
      return {
        code: 500,
        message: '请先配置微信小程序的 AppID 和 AppSecret'
      }
    }
    
    // 1. 用 code 换取 session_key
    const sessionRes = await uniCloud.httpclient.request(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`,
      {
        method: 'GET',
        dataType: 'json'
      }
    )
    
    if (!sessionRes.data.access_token) {
      return {
        code: 500,
        message: '微信授权失败，请检查 AppID 和 AppSecret 配置'
      }
    }
    
    const accessToken = sessionRes.data.access_token
    
    // 2. 用 code 换取手机号
    const phoneRes = await uniCloud.httpclient.request(
      `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({ code }),
        dataType: 'json'
      }
    )
    
    if (phoneRes.data.errcode !== 0) {
      return {
        code: 400,
        message: phoneRes.data.errmsg || '获取手机号失败'
      }
    }
    
    const phoneInfo = phoneRes.data.phone_info
    const phone = phoneInfo.phoneNumber
    
    if (!phone) {
      return {
        code: 400,
        message: '获取手机号失败'
      }
    }
    
    // 3. 查询或创建用户
    let userRes = await db.collection('users')
      .where({ phone })
      .limit(1)
      .get()
    
    let userId
    let nickname = `用户${phone.slice(-4)}`
    let isNewUser = false
    
    if (!userRes.data.length) {
      // 新用户自动注册
      const addRes = await db.collection('users').add({
        phone,
        nickname: nickname,
        wechatInfo: {
          openId: phoneInfo.openid,
          unionId: phoneInfo.unionId,
          watermark: phoneInfo.watermark
        },
        createTime: Date.now(),
        updateTime: Date.now()
      })
      userId = addRes.id
      isNewUser = true
    } else {
      userId = userRes.data[0]._id
      nickname = userRes.data[0].nickname || nickname
      
      // 更新微信信息
      await db.collection('users').doc(userId).update({
        wechatInfo: {
          openId: phoneInfo.openid,
          unionId: phoneInfo.unionId,
          watermark: phoneInfo.watermark
        },
        updateTime: Date.now()
      })
    }
    
    // 4. 生成不可预测 token
    const token = createToken()
    
    await db.collection('tokens').add({
      userId,
      token,
      createTime: Date.now(),
      expireTime: Date.now() + TOKEN_TTL,
      revoked: false
    })
    
    return {
      code: 0,
      message: isNewUser ? '注册成功' : '登录成功',
      data: {
        token,
        userInfo: {
          id: userId,
          phone,
          nickname,
          isNewUser
        }
      }
    }
  } catch (error) {
    console.error('微信登录失败:', error)
    return {
      code: 500,
      message: '登录失败，请重试'
    }
  }
}
