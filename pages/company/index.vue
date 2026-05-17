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
				<view class="nav-spacer"></view>
				<text class="nav-title"></text>
				<view class="capsule">
					<view class="capsule-dots"><view></view><view></view><view></view></view>
					<view class="capsule-line"></view>
					<view class="capsule-circle"></view>
				</view>
			</view>
		</view>

		<view class="page-body">
			<view class="brand-bar">
				<view class="brand-left">
					<image class="brand-logo" src="/static/cicada/logo-cicada-mark.jpg" mode="aspectFit"></image>
					<text class="brand-name">思科达</text>
				</view>
				<view class="brand-actions">
					<view class="icon-search tap"></view>
					<view class="icon-bell tap"></view>
				</view>
			</view>

			<view class="company-hero">
				<image class="hero-image" src="/static/cicada/photo-building.jpg" mode="aspectFill"></image>
				<view class="hero-mask"></view>
				<image class="hero-logo" src="/static/cicada/logo-cicada-full.jpg" mode="aspectFit"></image>
				<view class="hero-title-wrap">
					<text class="hero-title">十年匠心，守护诊疗安全</text>
				</view>
			</view>

			<view class="company-desc">
				<text>我们致力于为齿科机构提供全方位的精密仪器维保服务，成为中国口腔医疗领域最值得信赖的设备管家。</text>
			</view>

			<view class="section">
				<view class="section-head">
					<view class="section-rule"></view>
					<text>核心优势</text>
				</view>
				<view class="auth-card">
					<view class="auth-title-row">
						<view class="icon-cert"><view></view></view>
						<text>官方授权认证</text>
					</view>
					<text class="auth-desc">全品类齿科大品牌原厂技术授权，使用原厂正品零部件，确保修复精度与耐用性。</text>
				</view>
				<view class="adv-grid">
					<view v-for="item in advantages" :key="item.title" class="adv-card">
						<view class="adv-icon" :class="'adv-' + item.icon"></view>
						<text class="adv-title">{{ item.title }}</text>
						<text class="adv-desc">{{ item.desc }}</text>
					</view>
				</view>
			</view>

			<view class="section">
				<view class="section-head">
					<view class="section-rule"></view>
					<text>业务范围</text>
				</view>
				<view class="business-list">
					<view v-for="(item, index) in business" :key="item.title" class="business-card tap" @click="go('repair')">
						<view class="business-visual" :style="{ background: item.gradient }">
							<view :class="['device-shape', 'device-' + index]"></view>
						</view>
						<view class="business-copy">
							<text class="business-title">{{ item.title }}</text>
							<text class="business-desc">{{ item.desc }}</text>
						</view>
						<view class="chevron"></view>
					</view>
				</view>
			</view>

			<view class="follow-card">
				<view class="qr-wrap">
					<image class="qr-image" src="/static/cicada/qr-wechat.jpg" mode="aspectFill" show-menu-by-longpress></image>
				</view>
				<text class="follow-title">关注官方公众号</text>
				<text class="follow-desc">获取最新的维保优惠政策、设备保养秘籍以及一键预约上门服务。</text>
				<view class="follow-button tap" @click="go('contact')">
					<view class="icon-plus"></view>
					<text>立即关注</text>
				</view>
			</view>
		</view>

		<view class="float-actions">
			<view class="float-btn tap" @click="go('contact')"><view class="icon-chat"></view></view>
			<view class="float-btn tap" @click="go('contact')"><view class="icon-phone"></view></view>
		</view>

		<view class="bottom-tabbar">
			<view v-for="item in tabs" :key="item.id" class="tab-item tap" :class="{ active: item.id === 'company' }" @click="go(item.id)">
				<view :class="['tab-icon', 'tab-' + item.icon]"><view></view></view>
				<text>{{ item.label }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
const advantages = [
	{ icon: 'lightning', title: '极速响应', desc: '2小时内接单回复、24小时内到场检修，将诊所停工损失降至最低。' },
	{ icon: 'microscope', title: '精密检测', desc: '引进国际领先的工业级内窥镜与频率分析仪，精准识别隐匿故障。' }
]

const business = [
	{
		title: '高低速手机维修',
		desc: '包含深度清理、动平衡校正、陶瓷轴承更换。',
		gradient: 'linear-gradient(135deg, #2C5985 0%, #6BB0CC 100%)'
	},
	{
		title: '综合治疗台保养',
		desc: '气路水路系统消毒、控制电路检修与压力调校。',
		gradient: 'linear-gradient(135deg, #3D6F9E 0%, #6BB0CC 100%)'
	},
	{
		title: '影像系统调试',
		desc: 'CBCT、全景机辐射校验、感光板传感器优化。',
		gradient: 'linear-gradient(135deg, #0A4FB8 0%, #6BB0CC 100%)'
	}
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
	repair: '/pages/repair/index',
	contact: '/pages/contact/index'
}

const go = (id) => {
	if (id === 'company') return
	uni.navigateTo({
		url: routes[id] || `/pages/${id}/index`,
		fail: () => uni.showToast({ title: '页面建设中', icon: 'none' })
	})
}
</script>

<style scoped>
.page-shell {
	position: relative;
	min-height: 100vh;
	background: #E8EEFA;
	color: #0F1F3A;
	font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.page-body {
	padding: 176rpx 28rpx 220rpx;
	box-sizing: border-box;
}

.tap:active {
	opacity: 0.82;
	transform: scale(0.98);
}

.wx-top {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 30;
	height: 176rpx;
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
	border: 2rpx solid rgba(15, 31, 58, 0.5);
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

.capsule {
	width: 174rpx;
	height: 64rpx;
	display: flex;
	align-items: center;
	justify-content: space-around;
	border: 1rpx solid rgba(0, 0, 0, 0.08);
	border-radius: 999rpx;
	background: rgba(255, 255, 255, 0.78);
	box-shadow: 0 4rpx 14rpx rgba(15, 31, 58, 0.08);
}

.capsule-dots {
	display: flex;
	gap: 10rpx;
}

.capsule-dots view {
	width: 7rpx;
	height: 7rpx;
	border-radius: 999rpx;
	background: #000000;
}

.capsule-line {
	width: 1rpx;
	height: 32rpx;
	background: rgba(0, 0, 0, 0.15);
}

.capsule-circle {
	width: 30rpx;
	height: 30rpx;
	border: 4rpx solid #000000;
	border-radius: 999rpx;
}

.brand-bar {
	margin-top: 0;
	margin-bottom: 28rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.brand-left {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.brand-logo {
	width: 104rpx;
	height: 44rpx;
}

.brand-name {
	padding-left: 16rpx;
	border-left: 2rpx solid #C4D1E4;
	font-size: 30rpx;
	font-weight: 700;
	line-height: 1.2;
	color: #0F1F3A;
	letter-spacing: 1.2rpx;
}

.brand-actions {
	display: flex;
	align-items: center;
	gap: 28rpx;
	color: #324563;
}

.icon-search,
.icon-bell,
.icon-phone,
.icon-chat,
.icon-plus,
.icon-cert,
.adv-icon,
.tab-icon {
	position: relative;
	box-sizing: border-box;
}

.icon-search {
	width: 40rpx;
	height: 40rpx;
	border: 4rpx solid currentColor;
	border-radius: 999rpx;
}

.icon-search::after {
	content: "";
	position: absolute;
	right: -9rpx;
	bottom: -6rpx;
	width: 18rpx;
	height: 4rpx;
	border-radius: 4rpx;
	background: currentColor;
	transform: rotate(45deg);
}

.icon-bell {
	width: 36rpx;
	height: 36rpx;
	border: 4rpx solid currentColor;
	border-bottom: none;
	border-radius: 20rpx 20rpx 8rpx 8rpx;
}

.icon-bell::after {
	content: "";
	position: absolute;
	left: 8rpx;
	bottom: -10rpx;
	width: 14rpx;
	height: 8rpx;
	border-bottom: 4rpx solid currentColor;
	border-radius: 0 0 999rpx 999rpx;
}

.company-hero {
	position: relative;
	height: 480rpx;
	overflow: hidden;
	border-radius: 28rpx;
	background: linear-gradient(135deg, #1A3C5C 0%, #2C5985 50%, #4A7BA6 100%);
	box-shadow: 0 10rpx 28rpx rgba(44, 89, 133, 0.16);
}

.hero-image {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
}

.hero-mask {
	position: absolute;
	inset: 0;
	background: linear-gradient(180deg, rgba(15, 46, 102, 0.35) 0%, rgba(15, 31, 58, 0.65) 100%);
}

.hero-logo {
	position: absolute;
	top: 28rpx;
	right: 28rpx;
	width: 168rpx;
	height: 44rpx;
	padding: 8rpx 16rpx;
	border-radius: 8rpx;
	background: rgba(255, 255, 255, 0.92);
	box-sizing: border-box;
}

.hero-title-wrap {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 56rpx 36rpx 36rpx;
	background: linear-gradient(180deg, transparent 0%, rgba(15, 31, 58, 0.55) 100%);
}

.hero-title {
	font-size: 36rpx;
	font-weight: 700;
	line-height: 1.3;
	color: #FFFFFF;
	letter-spacing: 1.2rpx;
}

.company-desc {
	padding: 28rpx 8rpx 0;
	font-size: 27rpx;
	line-height: 1.7;
	color: #324563;
	letter-spacing: 0.4rpx;
}

.section {
	padding-top: 44rpx;
}

.section-head {
	padding: 0 4rpx 24rpx;
	display: flex;
	align-items: center;
	gap: 12rpx;
	font-size: 30rpx;
	font-weight: 700;
	line-height: 1.2;
	color: #0F1F3A;
	letter-spacing: 0.6rpx;
}

.section-rule {
	width: 6rpx;
	height: 28rpx;
	border-radius: 4rpx;
	background: #1E6FE0;
}

.auth-card {
	margin-bottom: 20rpx;
	padding: 32rpx;
	border-left: 6rpx solid #1E6FE0;
	border-radius: 24rpx;
	background: #FFFFFF;
	box-shadow: 0 2rpx 4rpx rgba(15, 31, 58, 0.04), 0 8rpx 28rpx rgba(30, 111, 224, 0.05);
	box-sizing: border-box;
}

.auth-title-row {
	margin-bottom: 16rpx;
	display: flex;
	align-items: center;
	gap: 16rpx;
	font-size: 30rpx;
	font-weight: 700;
	color: #0F1F3A;
}

.icon-cert {
	width: 44rpx;
	height: 44rpx;
	border: 4rpx solid #1E6FE0;
	border-radius: 999rpx;
}

.icon-cert::before {
	content: "";
	position: absolute;
	left: 11rpx;
	top: 15rpx;
	width: 18rpx;
	height: 10rpx;
	border-left: 4rpx solid #1E6FE0;
	border-bottom: 4rpx solid #1E6FE0;
	transform: rotate(-45deg);
}

.icon-cert::after {
	content: "";
	position: absolute;
	left: 8rpx;
	bottom: -18rpx;
	width: 24rpx;
	height: 20rpx;
	border-left: 4rpx solid #1E6FE0;
	border-right: 4rpx solid #1E6FE0;
	transform: skew(-12deg);
}

.auth-desc {
	font-size: 26rpx;
	line-height: 1.7;
	color: #324563;
}

.adv-grid {
	display: flex;
	align-items: stretch;
	justify-content: space-between;
}

.adv-card {
	width: 337rpx;
	padding: 32rpx 28rpx;
	border-radius: 24rpx;
	background: #FFFFFF;
	box-shadow: 0 2rpx 4rpx rgba(15, 31, 58, 0.04), 0 8rpx 28rpx rgba(30, 111, 224, 0.05);
	box-sizing: border-box;
}

.adv-icon {
	width: 64rpx;
	height: 64rpx;
	margin-bottom: 20rpx;
	border-radius: 16rpx;
	background: #1E6FE0;
}

.adv-lightning::before {
	content: "";
	position: absolute;
	left: 22rpx;
	top: 10rpx;
	width: 20rpx;
	height: 42rpx;
	background: #FFFFFF;
	clip-path: polygon(58% 0, 100% 0, 66% 40%, 100% 40%, 30% 100%, 44% 54%, 10% 54%);
}

.adv-microscope::before {
	content: "";
	position: absolute;
	left: 18rpx;
	top: 12rpx;
	width: 22rpx;
	height: 30rpx;
	border-radius: 4rpx;
	background: #FFFFFF;
	transform: rotate(-18deg);
}

.adv-microscope::after {
	content: "";
	position: absolute;
	left: 14rpx;
	bottom: 12rpx;
	width: 36rpx;
	height: 7rpx;
	border-radius: 8rpx;
	background: #FFFFFF;
}

.adv-title {
	display: inline-block;
	padding-bottom: 16rpx;
	border-bottom: 4rpx solid #1E6FE0;
	font-size: 28rpx;
	font-weight: 700;
	line-height: 1.2;
	color: #0F1F3A;
}

.adv-desc {
	display: block;
	margin-top: 20rpx;
	font-size: 23rpx;
	line-height: 1.7;
	color: #6B7C97;
}

.business-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.business-card {
	padding: 28rpx;
	display: flex;
	align-items: center;
	gap: 28rpx;
	border-radius: 24rpx;
	background: #FFFFFF;
	box-shadow: 0 2rpx 4rpx rgba(15, 31, 58, 0.04), 0 8rpx 28rpx rgba(30, 111, 224, 0.05);
	box-sizing: border-box;
}

.business-visual {
	position: relative;
	width: 128rpx;
	height: 120rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	overflow: hidden;
	border-radius: 16rpx;
}

.device-shape {
	position: relative;
	width: 96rpx;
	height: 96rpx;
}

.device-0::before {
	content: "";
	position: absolute;
	left: 8rpx;
	top: 42rpx;
	width: 72rpx;
	height: 12rpx;
	border-radius: 5rpx;
	background: #4A8AB8;
}

.device-0::after {
	content: "";
	position: absolute;
	left: 66rpx;
	top: 46rpx;
	width: 28rpx;
	height: 4rpx;
	background: #1E6FE0;
	box-shadow: -56rpx 4rpx 0 #0F1F3A, -12rpx 20rpx 0 rgba(107, 176, 204, 0.75);
}

.device-1::before {
	content: "";
	position: absolute;
	left: 10rpx;
	top: 48rpx;
	width: 76rpx;
	height: 38rpx;
	border-top: 6rpx solid #4A8AB8;
	border-radius: 999rpx 999rpx 0 0;
}

.device-1::after {
	content: "";
	position: absolute;
	left: 58rpx;
	top: 28rpx;
	width: 16rpx;
	height: 16rpx;
	border-radius: 999rpx;
	background: #1E6FE0;
	box-shadow: -46rpx 48rpx 0 0 #6BB0CC;
}

.device-2::before {
	content: "";
	position: absolute;
	left: 12rpx;
	top: 16rpx;
	width: 72rpx;
	height: 56rpx;
	border: 4rpx solid #4A8AB8;
	border-radius: 8rpx;
	background: rgba(30, 79, 168, 0.15);
}

.device-2::after {
	content: "";
	position: absolute;
	left: 36rpx;
	top: 36rpx;
	width: 22rpx;
	height: 22rpx;
	border: 4rpx solid #1E6FE0;
	border-radius: 999rpx;
	background: transparent;
}

.business-copy {
	min-width: 0;
	flex: 1;
	display: flex;
	flex-direction: column;
}

.business-title {
	font-size: 29rpx;
	font-weight: 700;
	line-height: 1.25;
	color: #0F1F3A;
}

.business-desc {
	margin-top: 8rpx;
	font-size: 24rpx;
	line-height: 1.6;
	color: #6B7C97;
}

.chevron {
	width: 18rpx;
	height: 18rpx;
	border-top: 3rpx solid #C4D1E4;
	border-right: 3rpx solid #C4D1E4;
	transform: rotate(45deg);
	flex-shrink: 0;
}

.follow-card {
	margin-top: 44rpx;
	padding: 44rpx 36rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	border-radius: 28rpx;
	background: #D7E3FA;
	text-align: center;
	box-shadow: 0 8rpx 26rpx rgba(30, 111, 224, 0.12);
	box-sizing: border-box;
}

.qr-wrap {
	width: 208rpx;
	height: 208rpx;
	padding: 12rpx;
	border-radius: 24rpx;
	background: #FFFFFF;
	box-shadow: 0 8rpx 28rpx rgba(30, 111, 224, 0.18);
	box-sizing: border-box;
}

.qr-image {
	width: 100%;
	height: 100%;
	border-radius: 12rpx;
}

.follow-title {
	margin-top: 28rpx;
	font-size: 28rpx;
	font-weight: 600;
	line-height: 1.2;
	color: #1E6FE0;
}

.follow-desc {
	margin-top: 16rpx;
	padding: 0 24rpx;
	font-size: 24rpx;
	line-height: 1.7;
	color: #324563;
}

.follow-button {
	width: 100%;
	height: 92rpx;
	margin-top: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 16rpx;
	border-radius: 999rpx;
	background: linear-gradient(180deg, #2A6CD3 0%, #0A4FB8 100%);
	box-shadow: 0 20rpx 48rpx -20rpx rgba(10, 79, 184, 0.55);
	color: #FFFFFF;
	font-size: 29rpx;
	font-weight: 600;
}

.icon-plus {
	width: 36rpx;
	height: 36rpx;
	border: 4rpx solid #FFFFFF;
	border-radius: 999rpx;
}

.icon-plus::before,
.icon-plus::after {
	content: "";
	position: absolute;
	left: 8rpx;
	top: 14rpx;
	width: 12rpx;
	height: 4rpx;
	border-radius: 4rpx;
	background: #FFFFFF;
}

.icon-plus::after {
	transform: rotate(90deg);
}

.float-actions {
	position: fixed;
	right: 36rpx;
	bottom: 180rpx;
	z-index: 20;
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.float-btn {
	width: 96rpx;
	height: 96rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 4rpx solid #FFFFFF;
	border-radius: 999rpx;
	background: linear-gradient(180deg, #3A86FF 0%, #1E6FE0 100%);
	box-shadow: 0 20rpx 48rpx -12rpx rgba(30, 111, 224, 0.55);
	color: #FFFFFF;
}

.icon-chat {
	width: 44rpx;
	height: 32rpx;
	border: 4rpx solid currentColor;
	border-radius: 10rpx;
}

.icon-chat::after {
	content: "";
	position: absolute;
	left: 8rpx;
	bottom: -12rpx;
	width: 14rpx;
	height: 14rpx;
	border-left: 4rpx solid currentColor;
	border-bottom: 4rpx solid currentColor;
	transform: rotate(-45deg);
}

.icon-phone {
	width: 42rpx;
	height: 42rpx;
	border-right: 8rpx solid currentColor;
	border-bottom: 8rpx solid currentColor;
	border-radius: 0 0 18rpx 0;
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
