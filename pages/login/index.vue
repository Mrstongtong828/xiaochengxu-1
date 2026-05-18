<template>
	<view class="page-shell">
		<view class="wx-top">
			<view class="status-row">
				<text class="status-time">9:41</text>
				<view class="status-icons">
					<view class="signal">
						<view class="signal-bar signal-one"></view>
						<view class="signal-bar signal-two"></view>
						<view class="signal-bar signal-three"></view>
						<view class="signal-bar signal-four"></view>
					</view>
					<view class="wifi-dot"></view>
					<view class="battery"><view class="battery-fill"></view></view>
				</view>
			</view>
			<view class="nav-row">
				<view class="back-btn tap" @click="goBack">
					<view class="chevron-left"></view>
				</view>
				<text class="nav-title">登录</text>
				<view class="nav-spacer"></view>
			</view>
		</view>

		<view class="login-content">
			<view class="brand-section">
				<image class="brand-logo" :src="cicadaAssets.brandToothBlue" mode="aspectFit"></image>
				<text class="brand-name">佛山思科达</text>
				<text class="brand-desc">牙医仪器检修</text>
			</view>

			<view class="form-section">
				<view class="form-card">
					<view class="form-title">手机号验证登录</view>
					
					<view class="field-wrap">
						<view class="field-label">手机号</view>
						<view class="input-field">
							<input 
								class="input-control" 
								type="number" 
								maxlength="11" 
								placeholder="请输入手机号" 
								v-model="phone"
								@input="validatePhone"
							/>
							<text v-if="phone" class="clear-btn tap" @click="clearPhone">×</text>
						</view>
					</view>

					<view class="field-wrap">
						<view class="field-label">验证码</view>
						<view class="input-field code-field">
							<input 
								class="input-control" 
								type="number" 
								maxlength="6" 
								placeholder="请输入验证码" 
								v-model="code"
							/>
							<view class="code-btn tap" :class="{ disabled: counting }" @click="sendCode">
								{{ counting ? countdown + 's' : '获取验证码' }}
							</view>
						</view>
					</view>

					<view class="btn-wrap">
						<view 
							class="login-btn tap" 
							:class="{ disabled: !canSubmit, loading: loading }" 
							@click="handleLogin"
						>
							{{ loading ? '登录中...' : '登录' }}
						</view>
					</view>

					<view class="agreement-wrap">
						<checkbox-group @change="onAgreeChange">
							<label class="agreement-item">
								<checkbox value="agree" color="#1E6FE0" :checked="agreed" />
								<text class="agreement-text">已阅读并同意</text>
							</label>
						</checkbox-group>
						<text class="link tap">《用户服务协议》</text>
						<text class="link tap">《隐私政策》</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { sendSmsCode, loginWithCode } from '@/api/auth.js'
import { cicadaAssets } from '@/config/cicada-assets'

const phone = ref('')
const code = ref('')
const agreed = ref(false)
const counting = ref(false)
const countdown = ref(60)
const loading = ref(false)

const canSubmit = computed(() => {
	return phone.value.length === 11 && code.value.length === 6 && agreed.value
})

const validatePhone = () => {
	const reg = /^1[3-9]\d{9}$/
	return reg.test(phone.value)
}

const clearPhone = () => {
	phone.value = ''
}

let timer = null

const sendCode = async () => {
	if (counting.value) return
	
	if (!validatePhone()) {
		uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
		return
	}

	try {
		uni.showLoading({ title: '发送中...' })
		await sendSmsCode(phone.value)
		uni.hideLoading()
		
		uni.showToast({ title: '验证码已发送', icon: 'success' })
		
		counting.value = true
		countdown.value = 60
		
		timer = setInterval(() => {
			countdown.value--
			if (countdown.value <= 0) {
				counting.value = false
				clearInterval(timer)
			}
		}, 1000)
	} catch (error) {
		uni.hideLoading()
		uni.showToast({ title: error.message || '发送失败', icon: 'none' })
	}
}

const handleLogin = async () => {
	if (!canSubmit.value) return
	
	loading.value = true
	
	try {
		const result = await loginWithCode(phone.value, code.value)
		loading.value = false
		
		uni.setStorageSync('token', result.token)
		uni.setStorageSync('userInfo', result.userInfo)
		
		uni.showToast({ title: '登录成功', icon: 'success' })
		
		setTimeout(() => {
			uni.navigateBack()
		}, 1500)
	} catch (error) {
		loading.value = false
		uni.showToast({ title: error.message || '登录失败', icon: 'none' })
	}
}

const onAgreeChange = (e) => {
	agreed.value = e.detail.value.includes('agree')
}

const goBack = () => {
	uni.navigateBack()
}
</script>

<style scoped>
.page-shell {
	position: relative;
	min-height: 100vh;
	background: #E8EEFA;
	color: #0F1F3A;
	font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
	box-sizing: border-box;
}

.tap:active {
	opacity: 0.82;
	transform: scale(0.98);
}

.wx-top {
	position: relative;
	z-index: 30;
	padding-top: 44rpx;
	background: #E8EEFA;
}

.status-row {
	height: 88rpx;
	padding: 0 44rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-sizing: border-box;
}

.status-time {
	font-size: 30rpx;
	font-weight: 600;
	line-height: 1;
	color: #0F1F3A;
}

.status-icons {
	display: flex;
	align-items: center;
	gap: 10rpx;
}

.signal {
	height: 22rpx;
	display: flex;
	align-items: flex-end;
	gap: 4rpx;
}

.signal-bar {
	width: 4rpx;
	border-radius: 2rpx;
	background: #0F1F3A;
}

.signal-one { height: 6rpx; }
.signal-two { height: 10rpx; }
.signal-three { height: 14rpx; }
.signal-four { height: 20rpx; }

.wifi-dot {
	width: 12rpx;
	height: 12rpx;
	border-radius: 999rpx;
	border: 4rpx solid #0F1F3A;
	border-left-color: transparent;
	border-bottom-color: transparent;
	transform: rotate(-45deg);
}

.battery {
	width: 44rpx;
	height: 20rpx;
	padding: 2rpx;
	border: 2rpx solid rgba(15, 31, 58, 0.6);
	border-radius: 5rpx;
	box-sizing: border-box;
}

.battery-fill {
	width: 85%;
	height: 100%;
	border-radius: 2rpx;
	background: #0F1F3A;
}

.nav-row {
	position: relative;
	height: 88rpx;
	padding: 0 28rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-sizing: border-box;
}

.nav-spacer {
	width: 48rpx;
	height: 48rpx;
}

.nav-title {
	position: absolute;
	left: 50%;
	font-size: 32rpx;
	font-weight: 600;
	line-height: 1;
	color: #0F1F3A;
	transform: translateX(-50%);
}

.back-btn {
	width: 48rpx;
	height: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.chevron-left {
	width: 20rpx;
	height: 20rpx;
	border-top: 4rpx solid #0F1F3A;
	border-left: 4rpx solid #0F1F3A;
	transform: rotate(-45deg);
}

.login-content {
	padding: 40rpx 36rpx;
}

.brand-section {
	padding: 80rpx 0 60rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.brand-logo {
	width: 160rpx;
	height: 160rpx;
	margin-bottom: 24rpx;
}

.brand-name {
	font-size: 40rpx;
	font-weight: 700;
	color: #0F1F3A;
	margin-bottom: 8rpx;
}

.brand-desc {
	font-size: 26rpx;
	color: #6B7C97;
}

.form-section {
	padding: 0 8rpx;
}

.form-card {
	background: #FFFFFF;
	border-radius: 32rpx;
	padding: 48rpx 36rpx;
	box-shadow: 0 4rpx 24rpx rgba(30, 111, 224, 0.1);
}

.form-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #0F1F3A;
	margin-bottom: 48rpx;
	text-align: center;
}

.field-wrap {
	margin-bottom: 40rpx;
}

.field-label {
	font-size: 26rpx;
	color: #324563;
	margin-bottom: 12rpx;
	font-weight: 500;
}

.input-field {
	position: relative;
	height: 96rpx;
	background: #F8FBFF;
	border: 2rpx solid #E4ECF7;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	padding: 0 28rpx;
	box-sizing: border-box;
}

.input-control {
	flex: 1;
	height: 100%;
	font-size: 28rpx;
	color: #0F1F3A;
}

.clear-btn {
	width: 44rpx;
	height: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 40rpx;
	color: #94A3B8;
	line-height: 1;
}

.code-field {
	padding-right: 8rpx;
}

.code-btn {
	flex-shrink: 0;
	height: 72rpx;
	padding: 0 28rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	font-weight: 600;
	color: #FFFFFF;
	background: linear-gradient(180deg, #2A6CD3 0%, #0A4FB8 100%);
	border-radius: 999rpx;
	margin-left: 16rpx;
}

.code-btn.disabled {
	background: #C4D1E4;
	color: #94A3B8;
}

.btn-wrap {
	margin-top: 56rpx;
}

.login-btn {
	height: 100rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(180deg, #2A6CD3 0%, #0A4FB8 100%);
	border-radius: 999rpx;
	color: #FFFFFF;
	font-size: 30rpx;
	font-weight: 700;
	box-shadow: 0 12rpx 32rpx rgba(10, 79, 184, 0.35);
}

.login-btn.disabled {
	background: #C4D1E4;
	box-shadow: none;
}

.login-btn.loading {
	opacity: 0.7;
}

.agreement-wrap {
	margin-top: 36rpx;
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 6rpx;
	justify-content: center;
	font-size: 22rpx;
}

.agreement-item {
	display: flex;
	align-items: center;
	gap: 6rpx;
}

.agreement-text {
	color: #6B7C97;
}

.link {
	color: #1E6FE0;
}
</style>
