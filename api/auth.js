import request from '@/utils/request.js'
import { callCloudFunction } from '@/utils/cloud.js'

const USE_CLOUD = true

export const sendSmsCode = (phone) => {
  if (USE_CLOUD) {
    return callCloudFunction('sendSmsCode', { phone })
  }
  return request({
    url: '/auth/sendCode',
    method: 'POST',
    data: { phone }
  })
}

export const loginWithCode = (phone, code) => {
  if (USE_CLOUD) {
    return callCloudFunction('login', { phone, code })
  }
  return request({
    url: '/auth/login',
    method: 'POST',
    data: { phone, code }
  })
}

export const logout = () => {
  if (USE_CLOUD) {
    return Promise.resolve()
  }
  return request({
    url: '/auth/logout',
    method: 'POST'
  })
}

export const getUserInfo = () => {
  if (USE_CLOUD) {
    const userInfo = uni.getStorageSync('userInfo')
    return Promise.resolve(userInfo)
  }
  return request({
    url: '/user/info',
    method: 'GET'
  })
}
