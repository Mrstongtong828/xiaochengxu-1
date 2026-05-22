'use strict'

exports.main = async (event, context) => {
  const { token, status, page = 1, pageSize = 10 } = event

  try {
    const db = uniCloud.database()

    const tokenRes = await db.collection('tokens')
      .where({ token })
      .limit(1)
      .get()

    const tokenRecord = tokenRes.data[0]
    if (!tokenRecord || tokenRecord.revoked || (tokenRecord.expireTime && tokenRecord.expireTime < Date.now())) {
      return {
        code: 401,
        message: '登录已过期，请重新登录'
      }
    }

    const userId = tokenRecord.userId

    let whereCondition = { userId }
    if (status) {
      whereCondition.status = status
    }

    const listRes = await db.collection('repair-orders')
      .where(whereCondition)
      .orderBy('createTime', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()

    const countRes = await db.collection('repair-orders')
      .where(whereCondition)
      .count()

    return {
      code: 0,
      data: {
        list: listRes.data,
        total: countRes.total,
        page,
        pageSize
      }
    }
  } catch (error) {
    console.error(error)
    return {
      code: 500,
      message: '获取失败'
    }
  }
}
