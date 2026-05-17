'use strict'

exports.main = async (event, context) => {
  const { phone, code } = event

  try {
    const db = uniCloud.database()

    const smsRes = await db.collection('sms-codes')
      .where({
        phone,
        used: false
      })
      .orderBy('createTime', 'desc')
      .limit(1)
      .get()

    if (!smsRes.data.length) {
      return {
        code: 400,
        message: '请先获取验证码'
      }
    }

    const lastSms = smsRes.data[0]
    if (lastSms.code !== code) {
      return {
        code: 400,
        message: '验证码错误'
      }
    }

    if (Date.now() > lastSms.expireTime) {
      return {
        code: 400,
        message: '验证码已过期'
      }
    }

    await db.collection('sms-codes').doc(lastSms._id).update({
      used: true
    })

    let userRes = await db.collection('users')
      .where({ phone })
      .limit(1)
      .get()

    let userId
    if (!userRes.data.length) {
      const addRes = await db.collection('users').add({
        phone,
        nickname: `用户${phone.slice(-4)}`,
        createTime: Date.now(),
        updateTime: Date.now()
      })
      userId = addRes.id
    } else {
      userId = userRes.data[0]._id
    }

    const token = `token_${userId}_${Date.now()}`

    await db.collection('tokens').add({
      userId,
      token,
      createTime: Date.now(),
      expireTime: Date.now() + 30 * 24 * 60 * 60 * 1000
    })

    return {
      code: 0,
      message: '登录成功',
      data: {
        token,
        userInfo: {
          id: userId,
          phone,
          nickname: userRes.data.length ? userRes.data[0].nickname : `用户${phone.slice(-4)}`
        }
      }
    }
  } catch (error) {
    console.error(error)
    return {
      code: 500,
      message: '登录失败'
    }
  }
}
