<template>
	<view class="page-shell">
		<view class="mine-hero">
			<view class="wx-top dark">
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
					<view class="nav-spacer"></view>
					<text class="nav-title">我的</text>
					<view class="capsule">
						<view class="capsule-dots"><view></view><view></view><view></view></view>
						<view class="capsule-line"></view>
						<view class="capsule-circle"></view>
					</view>
				</view>
			</view>

			<view class="profile-row">
				<view class="avatar">
					<text v-if="logged">李</text>
					<view v-else class="avatar-empty"></view>
				</view>
				<view class="profile-copy">
					<text class="profile-name">{{ logged ? '李医生' : '未登录' }}</text>
					<view v-if="logged" class="profile-meta">
						<text>桂林口腔门诊</text>
						<text class="member-tag">高级会员</text>
					</view>
					<text v-else class="profile-meta-text">登录后查看您的维修订单</text>
				</view>
				<view class="logout-btn tap" @click="toggleLogin">{{ logged ? '退出' : '注册/登录' }}</view>
			</view>
		</view>

		<view class="order-wrap">
			<view class="order-card">
				<view class="order-head tap" @click="go('orders')">
					<view class="order-title-row">
						<view class="section-rule"></view>
						<text>我的维修单</text>
					</view>
					<view class="order-more">
						<text>查看全部</text>
						<view class="chevron"></view>
					</view>
				</view>
				<view class="status-grid">
					<view v-for="item in statusItems" :key="item.id" class="status-item tap" @click="goOrder(item.type)">
						<view class="status-icon" :style="{ color: item.color, backgroundColor: item.bg }">
							<view :class="['glyph', 'glyph-' + item.icon]"><view></view></view>
							<text v-if="item.count > 0" class="badge">{{ item.count }}</text>
						</view>
						<text class="status-text">{{ item.title }}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="settings-section">
			<view class="section-head">
				<view class="section-rule"></view>
				<text>服务与设置</text>
			</view>
			<view class="settings-card">
				<view v-for="(item, index) in menus" :key="item.title" class="menu-row tap" :class="{ last: index === menus.length - 1 }" @click="go(item.go)">
					<view class="menu-icon">
						<view :class="['glyph', 'glyph-' + item.icon]"><view></view></view>
					</view>
					<view class="menu-copy">
						<text class="menu-title">{{ item.title }}</text>
						<text class="menu-desc">{{ item.desc }}</text>
					</view>
					<view class="chevron"></view>
				</view>
			</view>
		</view>

		<view class="footer-brand">
			<image class="footer-logo" :src="cicadaAssets.logoFull" mode="aspectFit"></image>
			<text>佛山思科达 · 牙医仪器检修 v1.2.0</text>
		</view>

		<view class="bottom-tabbar">
			<view v-for="item in tabs" :key="item.id" class="tab-item tap" :class="{ active: item.id === 'mine' }" @click="go(item.id)">
				<view :class="['tab-icon', 'tab-' + item.icon]"><view></view></view>
				<text>{{ item.label }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { cicadaAssets } from '@/config/cicada-assets'

const logged = ref(false)

onMounted(() => {
	// 检查登录状态
	const isLoggedIn = uni.getStorageSync('isLoggedIn')
	logged.value = isLoggedIn === true
})

const statusItems = [
	{ id: 'all', title: '全部', count: 3, color: '#1E6FE0', bg: 'rgba(30, 111, 224, 0.09)', icon: 'invoice', type: 0 },
	{ id: 'pending', title: '待处理', count: 1, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.09)', icon: 'track', type: 1 },
	{ id: 'fixing', title: '维修中', count: 1, color: '#0EA5E9', bg: 'rgba(14, 165, 233, 0.09)', icon: 'repair', type: 2 },
	{ id: 'shipped', title: '已发货', count: 1, color: '#10B981', bg: 'rgba(16, 185, 129, 0.09)', icon: 'truck', type: 3 },
	{ id: 'not_invoiced', title: '未开票', count: 0, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.09)', icon: 'invoice', type: 4 },
	{ id: 'invoiced', title: '已开票', count: 0, color: '#10B981', bg: 'rgba(16, 185, 129, 0.09)', icon: 'check', type: 5 }
]

const menus = [
	{ icon: 'pin', title: '收货地址管理', desc: '表单形式 · 1 个默认地址', go: 'address' },
	{ icon: 'edit', title: '投诉和建议', desc: '问题反馈 / 改进建议', go: 'feedback' },
	{ icon: 'box', title: '我的产品', desc: '已登记 3 件设备', go: 'products' },
	{ icon: 'shield', title: '保修政策', desc: '三重保修条款', go: 'warranty' },
	{ icon: 'phone', title: '联系我们', desc: '在线客服 / 服务热线 / 地址', go: 'contact' }
]

const tabs = [
	{ id: 'home', label: '首页', icon: 'home' },
	{ id: 'company', label: '公司介绍', icon: 'company' },
	{ id: 'mine', label: '我的', icon: 'mine' }
]

const routes = {
	home: '/pages/index/index',
	company: '/pages/company/index',
	mine: '/pages/mine/index',
	orders: '/pages/orders/index',
	address: '/pages/address/index',
	feedback: '/pages/feedback/index',
	products: '/pages/products/index',
	'guide-invoice': '/pages/guide/invoice',
	warranty: '/pages/warranty/index',
	contact: '/pages/contact/index'
}

const toggleLogin = () => {
	if (logged.value) {
		// 退出登录
		uni.showModal({
			title: '提示',
			content: '确定要退出登录吗？',
			success: (res) => {
				if (res.confirm) {
					uni.removeStorageSync('isLoggedIn')
					uni.removeStorageSync('userInfo')
					logged.value = false
					uni.showToast({ title: '已退出登录', icon: 'success' })
				}
			}
		})
	} else {
		// 去登录
		uni.navigateTo({ url: '/pages/login/index' })
	}
}

const go = (id) => {
	if (id === 'mine') return
	uni.navigateTo({
		url: routes[id] || `/pages/${id}/index`,
		fail: () => uni.showToast({ title: '页面建设中', icon: 'none' })
	})
}

const goOrder = (type) => {
	uni.navigateTo({
		url: `/pages/index/index?type=${type}`,
		fail: () => uni.showToast({ title: '页面建设中', icon: 'none' })
	})
}
</script>

<style scoped>
.page-shell {
	position: relative;
	min-height: 100vh;
	padding-bottom: 220rpx;
	background: #E8EEFA;
	color: #0F1F3A;
	font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
	box-sizing: border-box;
}

.tap:active {
	opacity: 0.82;
	transform: scale(0.98);
}

.mine-hero {
	position: relative;
	padding: 188rpx 36rpx 160rpx;
	background: linear-gradient(180deg, #1E6FE0 0%, #3A86FF 100%);
	color: #FFFFFF;
	box-sizing: border-box;
}

.wx-top {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: 30;
	height: 176rpx;
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
	color: #FFFFFF;
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
	background: #FFFFFF;
}

.signal-one { height: 6rpx; }
.signal-two { height: 10rpx; }
.signal-three { height: 14rpx; }
.signal-four { height: 20rpx; }

.wifi-dot {
	width: 12rpx;
	height: 12rpx;
	border-radius: 999rpx;
	border: 4rpx solid #FFFFFF;
	border-left-color: transparent;
	border-bottom-color: transparent;
	transform: rotate(-45deg);
}

.battery {
	width: 44rpx;
	height: 20rpx;
	padding: 2rpx;
	border: 2rpx solid rgba(255, 255, 255, 0.6);
	border-radius: 5rpx;
	box-sizing: border-box;
}

.battery-fill {
	width: 85%;
	height: 100%;
	border-radius: 2rpx;
	background: #FFFFFF;
}

.nav-row {
	position: relative;
	height: 88rpx;
	padding: 0 14rpx 0 28rpx;
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
	color: #FFFFFF;
	transform: translateX(-50%);
}

.capsule {
	width: 174rpx;
	height: 64rpx;
	display: flex;
	align-items: center;
	justify-content: space-around;
	border: 1rpx solid rgba(255, 255, 255, 0.25);
	border-radius: 999rpx;
	background: rgba(255, 255, 255, 0.12);
}

.capsule-dots {
	display: flex;
	gap: 10rpx;
}

.capsule-dots view {
	width: 7rpx;
	height: 7rpx;
	border-radius: 999rpx;
	background: #FFFFFF;
}

.capsule-line {
	width: 1rpx;
	height: 32rpx;
	background: rgba(255, 255, 255, 0.3);
}

.capsule-circle {
	width: 30rpx;
	height: 30rpx;
	border: 3rpx solid #FFFFFF;
	border-radius: 999rpx;
}

.profile-row {
	display: flex;
	align-items: center;
	gap: 28rpx;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	overflow: hidden;
	border-radius: 999rpx;
	background: #FFFFFF;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
	color: #1E6FE0;
	font-size: 48rpx;
	font-weight: 700;
}

.avatar-empty {
	width: 64rpx;
	height: 64rpx;
	position: relative;
}

.avatar-empty::before {
	content: "";
	position: absolute;
	left: 18rpx;
	top: 0;
	width: 28rpx;
	height: 28rpx;
	border-radius: 999rpx;
	background: #C4D1E4;
}

.avatar-empty::after {
	content: "";
	position: absolute;
	left: 4rpx;
	bottom: 0;
	width: 56rpx;
	height: 34rpx;
	border-radius: 999rpx 999rpx 0 0;
	background: #C4D1E4;
}

.profile-copy {
	min-width: 0;
	flex: 1;
	display: flex;
	flex-direction: column;
}

.profile-name {
	font-size: 34rpx;
	font-weight: 700;
	line-height: 1.25;
	color: #FFFFFF;
}

.profile-meta {
	margin-top: 6rpx;
	display: flex;
	align-items: center;
	gap: 12rpx;
	font-size: 23rpx;
	line-height: 1.4;
	color: rgba(255, 255, 255, 0.85);
}

.profile-meta-text {
	margin-top: 6rpx;
	font-size: 23rpx;
	line-height: 1.4;
	color: rgba(255, 255, 255, 0.85);
}

.member-tag {
	padding: 2rpx 14rpx;
	border-radius: 999rpx;
	background: rgba(255, 255, 255, 0.18);
	font-size: 20rpx;
	font-weight: 600;
	letter-spacing: 0.4rpx;
}

.logout-btn {
	padding: 14rpx 28rpx;
	flex-shrink: 0;
	border: 2rpx solid rgba(255, 255, 255, 0.3);
	border-radius: 999rpx;
	background: rgba(255, 255, 255, 0.18);
	color: #FFFFFF;
	font-size: 24rpx;
	font-weight: 500;
}

.order-wrap {
	position: relative;
	z-index: 2;
	margin-top: -116rpx;
	padding: 0 28rpx;
}

.order-card {
	overflow: hidden;
	border-radius: 28rpx;
	background: #FFFFFF;
	box-shadow: 0 2rpx 4rpx rgba(15, 31, 58, 0.04), 0 8rpx 28rpx rgba(30, 111, 224, 0.05);
}

.order-head {
	padding: 28rpx 32rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 2rpx solid #F1F5FB;
	box-sizing: border-box;
}

.order-title-row,
.section-head {
	display: flex;
	align-items: center;
	gap: 16rpx;
	font-size: 30rpx;
	font-weight: 700;
	line-height: 1.2;
	color: #0F1F3A;
}

.section-rule {
	width: 6rpx;
	height: 28rpx;
	border-radius: 4rpx;
	background: #1E6FE0;
}

.order-more {
	display: flex;
	align-items: center;
	gap: 8rpx;
	font-size: 24rpx;
	color: #6B7C97;
}

.chevron {
	width: 14rpx;
	height: 14rpx;
	border-top: 3rpx solid #C4D1E4;
	border-right: 3rpx solid #C4D1E4;
	transform: rotate(45deg);
	flex-shrink: 0;
}

.status-grid {
	padding: 36rpx 12rpx 32rpx;
	display: flex;
	align-items: flex-start;
	justify-content: space-around;
}

.status-item {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12rpx;
}

.status-icon {
	position: relative;
	width: 84rpx;
	height: 84rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 24rpx;
}

.badge {
	position: absolute;
	top: -8rpx;
	right: -8rpx;
	min-width: 32rpx;
	height: 32rpx;
	padding: 0 10rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 4rpx solid #FFFFFF;
	border-radius: 999rpx;
	background: #E5484D;
	color: #FFFFFF;
	font-size: 20rpx;
	font-weight: 700;
	box-sizing: border-box;
}

.status-text {
	font-size: 24rpx;
	font-weight: 500;
	line-height: 1.2;
	color: #324563;
}

.settings-section {
	padding: 28rpx 28rpx 0;
}

.section-head {
	padding: 0 8rpx 20rpx;
}

.settings-card {
	overflow: hidden;
	border-radius: 28rpx;
	background: #FFFFFF;
	box-shadow: 0 2rpx 4rpx rgba(15, 31, 58, 0.04), 0 8rpx 28rpx rgba(30, 111, 224, 0.05);
}

.menu-row {
	padding: 28rpx;
	display: flex;
	align-items: center;
	gap: 24rpx;
	border-bottom: 2rpx solid #F1F5FB;
	box-sizing: border-box;
}

.menu-row.last {
	border-bottom: none;
}

.menu-icon {
	width: 64rpx;
	height: 64rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border-radius: 20rpx;
	background: #F3F8FF;
	color: #1E6FE0;
}

.menu-copy {
	min-width: 0;
	flex: 1;
	display: flex;
	flex-direction: column;
}

.menu-title {
	font-size: 28rpx;
	font-weight: 500;
	line-height: 1.25;
	color: #0F1F3A;
}

.menu-desc {
	margin-top: 4rpx;
	font-size: 22rpx;
	line-height: 1.3;
	color: #94A3B8;
}

.footer-brand {
	padding: 48rpx 28rpx 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	color: #94A3B8;
	font-size: 22rpx;
	line-height: 1.3;
}

.footer-logo {
	width: 260rpx;
	height: 48rpx;
	margin-bottom: 12rpx;
	opacity: 0.55;
}

.glyph {
	position: relative;
	width: 44rpx;
	height: 44rpx;
	color: currentColor;
	box-sizing: border-box;
}

.glyph::before,
.glyph::after,
.glyph view {
	content: "";
	position: absolute;
	box-sizing: border-box;
}

.glyph-invoice::before,
.glyph-box::before {
	left: 10rpx;
	top: 6rpx;
	width: 24rpx;
	height: 32rpx;
	border: 4rpx solid currentColor;
	border-radius: 5rpx;
}

.glyph-invoice::after {
	left: 15rpx;
	top: 17rpx;
	width: 14rpx;
	height: 4rpx;
	border-radius: 4rpx;
	background: currentColor;
	box-shadow: 0 9rpx 0 currentColor;
}

.glyph-track::before {
	left: 5rpx;
	top: 5rpx;
	width: 34rpx;
	height: 34rpx;
	border: 4rpx solid currentColor;
	border-radius: 999rpx;
}

.glyph-track::after {
	left: 20rpx;
	top: 11rpx;
	width: 4rpx;
	height: 15rpx;
	border-radius: 4rpx;
	background: currentColor;
}

.glyph-track view {
	left: 21rpx;
	top: 23rpx;
	width: 13rpx;
	height: 4rpx;
	border-radius: 4rpx;
	background: currentColor;
	transform: rotate(26deg);
}

.glyph-repair::before,
.glyph-edit::before {
	left: 6rpx;
	top: 20rpx;
	width: 34rpx;
	height: 7rpx;
	border-radius: 8rpx;
	background: currentColor;
	transform: rotate(-45deg);
}

.glyph-repair::after,
.glyph-edit::after {
	left: 24rpx;
	top: 5rpx;
	width: 14rpx;
	height: 14rpx;
	border: 4rpx solid currentColor;
	border-radius: 5rpx;
	transform: rotate(45deg);
}

.glyph-truck::before {
	left: 4rpx;
	top: 13rpx;
	width: 24rpx;
	height: 18rpx;
	border: 4rpx solid currentColor;
}

.glyph-truck::after {
	left: 28rpx;
	top: 18rpx;
	width: 14rpx;
	height: 13rpx;
	border: 4rpx solid currentColor;
	border-left: none;
}

.glyph-truck view {
	left: 9rpx;
	bottom: 4rpx;
	width: 8rpx;
	height: 8rpx;
	border: 3rpx solid currentColor;
	border-radius: 999rpx;
	box-shadow: 21rpx 0 0 -1rpx #FFFFFF, 21rpx 0 0 2rpx currentColor;
}

.glyph-pin::before {
	left: 11rpx;
	top: 4rpx;
	width: 22rpx;
	height: 22rpx;
	border: 4rpx solid currentColor;
	border-radius: 999rpx;
}

.glyph-pin::after {
	left: 15rpx;
	top: 23rpx;
	width: 14rpx;
	height: 14rpx;
	border-right: 4rpx solid currentColor;
	border-bottom: 4rpx solid currentColor;
	transform: rotate(45deg);
}

.glyph-box::after {
	left: 6rpx;
	top: 12rpx;
	width: 32rpx;
	height: 24rpx;
	border: 4rpx solid currentColor;
	border-radius: 5rpx;
}

.glyph-box view {
	left: 8rpx;
	top: 18rpx;
	width: 28rpx;
	height: 4rpx;
	background: currentColor;
	transform: rotate(20deg);
}

.glyph-shield::before {
	left: 7rpx;
	top: 4rpx;
	width: 30rpx;
	height: 36rpx;
	border: 4rpx solid currentColor;
	border-radius: 18rpx 18rpx 12rpx 12rpx;
}

.glyph-shield::after {
	left: 14rpx;
	top: 19rpx;
	width: 17rpx;
	height: 10rpx;
	border-left: 4rpx solid currentColor;
	border-bottom: 4rpx solid currentColor;
	transform: rotate(-45deg);
}

.glyph-phone::before {
	left: 8rpx;
	top: 8rpx;
	width: 28rpx;
	height: 28rpx;
	border-right: 7rpx solid currentColor;
	border-bottom: 7rpx solid currentColor;
	border-radius: 0 0 14rpx 0;
	transform: rotate(45deg);
}

.bottom-tabbar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 40;
	height: 128rpx;
	padding: 16rpx 38rpx 36rpx;
	display: flex;
	align-items: flex-start;
	justify-content: space-around;
	border-top: 2rpx solid #E4ECF7;
	background: #FFFFFF;
	box-sizing: border-box;
}

.tab-item {
	min-width: 112rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4rpx;
	color: #94A3B8;
	font-size: 21rpx;
	line-height: 1.2;
}

.tab-item.active {
	color: #1E6FE0;
	font-weight: 600;
}

.tab-icon {
	position: relative;
	width: 48rpx;
	height: 48rpx;
	color: currentColor;
}

.tab-icon::before,
.tab-icon::after,
.tab-icon view {
	content: "";
	position: absolute;
	box-sizing: border-box;
}

.tab-home::before {
	left: 8rpx;
	top: 20rpx;
	width: 32rpx;
	height: 22rpx;
	border: 4rpx solid currentColor;
	border-top: none;
	border-radius: 0 0 5rpx 5rpx;
}

.tab-home::after {
	left: 7rpx;
	top: 9rpx;
	width: 34rpx;
	height: 34rpx;
	border-left: 4rpx solid currentColor;
	border-top: 4rpx solid currentColor;
	transform: rotate(45deg);
}

.tab-home view {
	left: 19rpx;
	top: 30rpx;
	width: 10rpx;
	height: 12rpx;
	background: currentColor;
}

.tab-company::before {
	left: 8rpx;
	top: 7rpx;
	width: 32rpx;
	height: 36rpx;
	border: 4rpx solid currentColor;
	border-radius: 5rpx;
}

.tab-company::after {
	left: 16rpx;
	top: 16rpx;
	width: 5rpx;
	height: 5rpx;
	background: currentColor;
	box-shadow: 12rpx 0 0 currentColor, 0 12rpx 0 currentColor, 12rpx 12rpx 0 currentColor, 6rpx 24rpx 0 currentColor;
}

.tab-mine::before {
	left: 15rpx;
	top: 7rpx;
	width: 18rpx;
	height: 18rpx;
	border: 4rpx solid currentColor;
	border-radius: 999rpx;
}

.tab-mine::after {
	left: 8rpx;
	top: 30rpx;
	width: 32rpx;
	height: 16rpx;
	border: 4rpx solid currentColor;
	border-bottom: none;
	border-radius: 24rpx 24rpx 0 0;
}
