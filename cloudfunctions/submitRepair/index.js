'use strict'

exports.main = async (event, context) => {
  const { data, token } = event

  try {
    const db = uniCloud.database()

    const tokenRes = await db.collection('tokens')
      .where({ token })
      .limit(1)
      .get()

    if (!tokenRes.data.length) {
      return {
        code: 401,
        message: '请先登录'
      }
    }

    const userId = tokenRes.data[0].userId

    if (!data.receiverName || !data.receiverPhone) {
      return {
        code: 400,
        message: '收件人信息不完整'
      }
    }

    if (!data.products || data.products.length === 0) {
      return {
        code: 400,
        message: '请至少添加一件维修产品'
      }
    }

    const orderNo = 'WX' + Date.now()

    const result = await db.collection('repair-orders').add({
      orderNo,
      userId,
      receiverName: data.receiverName,
      receiverPhone: data.receiverPhone,
      receiverAddress: data.receiverAddress || '',
      products: data.products,
      status: 'pending',
      createTime: Date.now(),
      updateTime: Date.now()
    })

    return {
      code: 0,
      message: '提交成功',
      data: {
        id: result.id,
        orderNo
      }
    }
  } catch (error) {
    console.error(error)
    return {
      code: 500,
      message: '提交失败'
    }
  }
}
