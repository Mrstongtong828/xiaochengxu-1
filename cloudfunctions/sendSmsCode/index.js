'use strict'

exports.main = async (event, context) => {
  const { phone } = event

  try {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return {
        code: 400,
        message: '手机号格式不正确'
      }
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()

    const db = uniCloud.database()
    await db.collection('sms-codes').add({
      phone,
      code,
      createTime: Date.now(),
      expireTime: Date.now() + 10 * 60 * 1000,
      used: false
    })

    console.log('验证码:', code, '发送给:', phone)

    return {
      code: 0,
      message: '验证码发送成功'
    }
  } catch (error) {
    console.error(error)
    return {
      code: 500,
      message: '发送失败'
    }
  }
}
