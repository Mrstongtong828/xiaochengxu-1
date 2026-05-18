<template>
	<view class="page-shell">
		<view v-if="activeModule" class="module-page" :class="{ 'module-page-dialog': activeModule === 'survey' }">
			<view v-if="activeModule !== 'survey'" class="module-head" :style="moduleHeadStyle">
				<view class="back-button tap" @click="closeModule"></view>
				<view class="module-title-wrap">
					<text class="module-title">{{ moduleInfo.title }}</text>
					<text class="module-subtitle">{{ moduleInfo.subtitle }}</text>
				</view>
			</view>

			<view v-if="activeModule === 'repair'" class="module-content repair-module">
				<view class="warm-card">
					<text class="warm-strong">温馨提示：</text>
					<text>为了给您提供更快更好的服务，请务必在快递里面留纸条写明：寄回原因或故障描述，联系方式和收件地址。</text>
				</view>

				<view class="module-section-head">
					<text>产品信息</text>
					<text>共 {{ repairProducts.length }} 件 · 可增加</text>
				</view>
				<view v-for="(product, index) in repairProducts" :key="product.id" class="repair-product">
					<view class="repair-product-strip">
						<view class="repair-product-name">
							<text>{{ index + 1 }}</text>
							<text>报修产品 #{{ index + 1 }}</text>
						</view>
						<view v-if="repairProducts.length > 1" class="remove-link tap" @click="removeRepairProduct(index)">移除</view>
					</view>
					<view class="repair-form-card">
						<view class="repair-field">
							<text>产品名称</text>
							<input v-model="product.name" placeholder="请输入" placeholder-class="input-placeholder" />
						</view>
						<view class="repair-field">
							<text><text class="required-star">*</text>产品型号</text>
							<input v-model="product.model" placeholder="请输入" placeholder-class="input-placeholder" />
						</view>
						<view class="repair-field">
							<text><text class="required-star">*</text>产品序列号</text>
							<input v-model="product.serial" placeholder="请输入" placeholder-class="input-placeholder" />
						</view>
						<view class="repair-field">
							<text>购买日期</text>
							<picker mode="date" :value="product.buyDate" @change="(e) => onDateChange(index, e)">
								<view class="field-action tap">
									<text class="field-action-value" :class="{ placeholder: !product.buyDate }">{{ product.buyDate || '请选择日期' }}</text>
									<view class="field-mini field-calendar"></view>
								</view>
							</picker>
						</view>
						<view class="repair-field voucher-field tap" @click="openVoucherPicker(index)">
							<text>购买凭证</text>
							<view class="voucher-status">
								<text v-if="product.voucherList && product.voucherList.length" class="voucher-count">{{ product.voucherList.length }} 张已上传</text>
								<view v-else class="upload-box voucher-upload">
									<text>+</text>
									<text>上传凭证</text>
								</view>
							</view>
							<view class="field-mini field-clip"></view>
						</view>
						<view v-if="product.voucherList && product.voucherList.length" class="voucher-preview">
							<view v-for="(voucher, vIndex) in product.voucherList" :key="voucher.id" class="voucher-thumb tap" @click="previewVoucher(index, vIndex)">
								<image class="voucher-image" :src="voucher.url || voucher.path" mode="aspectFill"></image>
								<view class="voucher-remove" @click.stop="removeVoucher(index, vIndex)">×</view>
							</view>
						</view>
						<view class="repair-field">
							<text><text class="required-star">*</text>故障描述</text>
							<input v-model="product.faultDesc" placeholder="最多2000字" placeholder-class="input-placeholder" />
						</view>
						<view class="media-area">
							<view class="media-title">
								<text><text class="required-star">*</text>产品清单 / 故障图片或视频</text>
								<text>{{ product.media.length }}/3</text>
							</view>
							<view class="media-grid">
								<view v-for="media in product.media" :key="media.id" class="media-thumb">
									<image v-if="media.type === 'image'" class="media-image" :src="media.url || media.path" mode="aspectFill"></image>
									<view v-else class="media-video">
										<view class="glyph glyph-cam"><view class="glyph-extra"></view></view>
										<text>视频</text>
									</view>
									<view class="media-remove tap" @click.stop="removeRepairMedia(index, media.id)">×</view>
								</view>
								<view v-if="product.media.length < 3" class="media-add tap" @click="addRepairMedia(index)">
									<text>+</text>
									<text>添加</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="dash-add tap" @click="addRepairProduct">
					<text>+</text>
					<text>增加报修产品</text>
				</view>

				<view class="module-section-head single">
					<text>寄出信息</text>
				</view>
				<view class="blue-tip">请妥善包装好设备，顺丰取件请在快递员到达后提供运单号。</view>
				<view class="repair-form-card">
					<view class="repair-field">
						<text><text class="required-star">*</text>物流公司</text>
						<input v-model="repairForm.logisticsCompany" placeholder="请选择物流公司" placeholder-class="input-placeholder" />
						<view class="field-arrow"></view>
					</view>
					<view class="repair-field">
						<text><text class="required-star">*</text>运单号</text>
						<input v-model="repairForm.trackingNo" placeholder="请输入运单号" placeholder-class="input-placeholder" />
						<view class="scan-icon"></view>
					</view>
					<view class="repair-field last">
						<text>寄送方式</text>
						<view class="radio-row">
							<view class="radio-item on"><view></view><text>顺丰取件</text></view>
							<view class="radio-item"><view></view><text>自行寄送</text></view>
						</view>
					</view>
				</view>

				<view class="module-section-head single">
					<text>回寄信息</text>
				</view>
				<view class="repair-form-card">
					<view class="repair-field">
						<text><text class="required-star">*</text>收货人</text>
						<input v-model="repairForm.receiverName" placeholder="请输入用户姓名" placeholder-class="input-placeholder" />
					</view>
					<view class="repair-field">
						<text><text class="required-star">*</text>手机号码</text>
						<input v-model="repairForm.receiverPhone" placeholder="请输入用户手机" placeholder-class="input-placeholder" type="number" />
						<view class="field-arrow"></view>
					</view>
					<view class="repair-field">
						<text><text class="required-star">*</text>详细地址</text>
						<input v-model="repairForm.receiverAddress" placeholder="请输入用户地址" placeholder-class="input-placeholder" />
						<view class="field-mini field-pin"></view>
					</view>
					<view class="repair-field last">
						<text><text class="required-star">*</text>单位名称</text>
						<input v-model="repairForm.receiverUnit" placeholder="请输入单位名称" placeholder-class="input-placeholder" />
					</view>
				</view>

				<view class="module-section-head single">
					<text>联系我们</text>
				</view>
				<view class="contact-mini-list">
					<view class="contact-mini-card tap" @click="go('contact')">
						<view class="contact-mini-icon"><view class="glyph glyph-chat"><view class="glyph-extra"></view></view></view>
						<view class="contact-mini-copy">
							<text>在线客服</text>
							<text>8:00 to 21:00（节假日除外）</text>
						</view>
						<view class="chevron"></view>
					</view>
					<view class="contact-mini-card">
						<view class="contact-mini-icon"><view class="glyph glyph-phone"><view class="glyph-extra"></view></view></view>
						<view class="contact-mini-copy">
							<text>服务热线</text>
							<text class="brand-text">400-888-999</text>
						</view>
					</view>
				</view>
				<view class="receiver-card repair-receiver">
					<view class="receiver-head"><view class="glyph glyph-pin glyph-pin-title"><view class="glyph-extra"></view></view><text>收件信息</text></view>
					<view v-for="item in receiver" :key="item.label" class="receiver-row">
						<view class="receiver-line">
							<view class="receiver-text"><text class="receiver-label">{{ item.label }}</text><text class="receiver-value">{{ item.value }}</text></view>
							<view class="copy-button tap" @click="copyOne(item.value, item.label)"><view class="mini-icon mini-copy"></view></view>
						</view>
					</view>
					<view class="copy-all repair-copy tap" @click="copyAll">
						<view class="mini-icon mini-check mini-check-white"></view>
						<text>{{ copied === 'all' ? '已复制' : '一键复制以上收件信息' }}</text>
					</view>
				</view>
				<view class="repair-fab repair-fab-chat tap" @click="go('contact')"><view class="glyph glyph-chat"><view class="glyph-extra"></view></view></view>
				<view class="repair-fab repair-fab-phone tap" @click="go('contact')"><view class="glyph glyph-phone"><view class="glyph-extra"></view></view></view>
				<view class="repair-bottom-bar">
					<view class="bottom-more tap" @click="showRepairTools = true"><view></view><text>工具</text></view>
					<view class="bottom-submit tap" @click="submitRepair">立即提交报修</view>
				</view>
			</view>

			<view v-else-if="activeModule === 'repair-success'" class="module-content success-module">
				<view class="success-icon"><view class="mini-icon mini-check mini-check-white"></view></view>
				<text class="success-title">报修已提交</text>
				<text class="success-desc">工程师将于 30 分钟内联系您，请保持手机畅通</text>
				<view class="success-card">
					<view class="success-row"><text>工单号</text><text class="copy-link tap" @click="copyOne(submittedOrderId, '工单号')">复制</text></view>
					<text class="success-no">{{ submittedOrderId }}</text>
					<view class="success-grid">
						<view><text>预计响应</text><text>30 分钟内</text></view>
						<view><text>物流方式</text><text>顺丰到付</text></view>
					</view>
				</view>
				<view class="dual-actions">
					<view class="ghost-button tap" @click="closeModule">返回首页</view>
					<view class="primary-button tap" @click="go('track')">查看进度</view>
				</view>
			</view>

			<view v-else-if="activeModule === 'track'" class="track-module">
				<view class="track-search-wrap">
					<view class="track-search">
						<view class="glyph glyph-search glyph-search-small"><view class="glyph-extra"></view></view>
						<input placeholder="输入工单号 / 产品序列号查询" placeholder-class="input-placeholder" />
					</view>
				</view>
				<view class="progress-tabs-line">
					<view v-for="item in progressTabs" :key="item" class="progress-tab tap" :class="{ on: activeTrackTab === item }" @click="activeTrackTab = item">
						<text>{{ item }}</text>
					</view>
				</view>
				<view class="module-list">
					<view v-for="order in filteredTrackOrders" :key="order.id" class="track-card tap" @click="openTrackDetail(order)">
						<view class="track-card-head">
							<view>
								<text class="muted-line">工单 {{ order.id }}</text>
								<text class="track-model">{{ order.model }}</text>
							</view>
							<text :class="['tag', 'tag-' + order.tone]">{{ order.status }}</text>
						</view>
						<view class="progress-steps">
							<view v-for="(step, index) in repairFlow" :key="step" class="progress-step" :class="{ reached: index <= order.reached }">
								<view></view>
								<text>{{ step }}</text>
							</view>
						</view>
						<view class="track-card-foot">
							<text>最后更新 · {{ order.time }}</text>
							<text>查看详情 →</text>
						</view>
					</view>
					<view v-if="!filteredTrackOrders.length" class="empty-hint compact">当前状态暂无工单记录。</view>
				</view>
			</view>

			<view v-else-if="activeModule === 'package-query'" class="module-content package-module">
				<view class="package-hero">
					<view class="package-hero-icon"><view class="glyph glyph-box"><view class="glyph-extra"></view></view></view>
					<view>
						<text>查包裹是否已到仓</text>
						<text>输入快递单号，我们会查询内部收件记录和处理状态。</text>
					</view>
				</view>
				<view class="blue-tip package-tip">为了保护客户隐私，建议同时填写寄件手机号后四位。后台收到包裹并录入快递单号后，这里会显示最新处理进度。</view>
				<view class="repair-form-card">
					<view class="repair-field">
						<text><text class="required-star">*</text>快递单号</text>
						<input v-model="packageQuery.trackingNo" placeholder="请输入快递单号" placeholder-class="input-placeholder" confirm-type="search" @confirm="queryPackage" />
					</view>
					<view class="repair-field last">
						<text>手机号后四位</text>
						<input v-model="packageQuery.phoneLast4" placeholder="用于核验，选填" placeholder-class="input-placeholder" type="number" maxlength="4" confirm-type="search" @confirm="queryPackage" />
					</view>
				</view>
				<view class="primary-button tap save-button" :class="{ disabled: packageQueryLoading }" @click="queryPackage">{{ packageQueryLoading ? '查询中...' : '立即查询' }}</view>
				<view v-if="packageQueryResult" class="package-result-card">
					<view class="package-result-head">
						<view>
							<text class="muted-line">快递单号</text>
							<text class="package-no">{{ packageQueryResult.trackingNo }}</text>
						</view>
						<text :class="['tag', 'tag-' + packageQueryResult.tone]">{{ packageQueryResult.status }}</text>
					</view>
					<view class="package-result-grid">
						<view><text>物流公司</text><text>{{ packageQueryResult.company || '待录入' }}</text></view>
						<view><text>关联工单</text><text>{{ packageQueryResult.orderId || '待关联' }}</text></view>
					</view>
					<view class="package-progress">
						<view v-for="(step, index) in packageFlow" :key="step" class="progress-step" :class="{ reached: index <= packageQueryResult.reached }">
							<view></view>
							<text>{{ step }}</text>
						</view>
					</view>
					<view class="module-section-head single package-timeline-title"><text>包裹记录</text></view>
					<view class="package-timeline">
						<view v-for="(item, index) in packageQueryResult.timeline" :key="item.title + index" class="detail-timeline-row">
							<view class="detail-timeline-pin" :class="{ pending: item.pending }">
								<view></view>
								<view v-if="index < packageQueryResult.timeline.length - 1"></view>
							</view>
							<view class="detail-timeline-copy">
								<view>
									<text :class="{ muted: item.pending }">{{ item.title }}</text>
									<text>{{ item.time }}</text>
								</view>
								<text>{{ item.desc }}</text>
							</view>
						</view>
					</view>
				</view>
				<view v-else-if="packageQuerySearched" class="empty-hint compact package-empty">暂未查到这票包裹。请确认快递单号是否正确，或等我们签收录入后再查询。</view>
			</view>

			<view v-else-if="activeModule === 'order-detail'" class="module-content">
				<view class="detail-hero">
					<view class="detail-hero-top">
						<text>工单号</text>
						<text :class="['tag', 'tag-muted-light']">{{ detailOrder.status }}</text>
					</view>
					<text class="detail-order-no">{{ detailOrder.id }}</text>
					<view class="detail-hero-grid">
						<view><text>产品</text><text>{{ detailOrder.model }}</text></view>
						<view><text>预计完成</text><text>{{ detailOrder.doneTime }}</text></view>
					</view>
				</view>
				<view class="module-section-head single"><text>进度时间线</text></view>
				<view class="timeline-card">
					<view v-for="(item, index) in orderTimeline" :key="item.title" class="detail-timeline-row">
						<view class="detail-timeline-pin" :class="{ pending: item.pending }">
							<view></view>
							<view v-if="index < orderTimeline.length - 1"></view>
						</view>
						<view class="detail-timeline-copy">
							<view>
								<text :class="{ muted: item.pending }">{{ item.title }}</text>
								<text>{{ item.time }}</text>
							</view>
							<text>{{ item.desc }}</text>
						</view>
					</view>
				</view>
				<view class="module-section-head single"><text>发票进度</text></view>
				<view class="info-line-card">
					<view class="info-line-icon invoice-bg"><view class="glyph glyph-invoice"><view class="glyph-extra"></view></view></view>
					<view class="info-line-copy">
						<text>增值税普通发票</text>
						<text>桂林口腔门诊有限公司 · ￥860.00</text>
					</view>
					<text class="tag tag-warn">待开具</text>
				</view>
				<view class="module-section-head single"><text>负责工程师</text></view>
				<view class="engineer-card">
					<view class="engineer-avatar">王</view>
					<view class="info-line-copy">
						<text>王师傅</text>
						<text>10 年高速手机维修经验</text>
					</view>
					<view class="circle-action"><view class="glyph glyph-chat"><view class="glyph-extra"></view></view></view>
					<view class="circle-action primary"><view class="glyph glyph-phone"><view class="glyph-extra"></view></view></view>
				</view>
			</view>

			<view v-else-if="activeModule === 'survey'" class="survey-module">
				<view class="survey-mask"></view>
				<view class="survey-modal-card survey-poster-card">
					<view class="survey-close tap" @click="closeModule">×</view>
					<view class="survey-ribbon"><view class="glyph glyph-gift"><view class="glyph-extra"></view></view><text>调研有礼</text></view>
					<view class="survey-poster-wrap tap" @click="previewSurveyPoster">
						<image
							class="survey-poster"
							:src="surveyPosterUrl"
							mode="widthFix"
							show-menu-by-longpress
						></image>
					</view>
					<text class="survey-poster-tip">点击图片放大查看，长按可保存或识别二维码</text>
					<view class="survey-actions">
						<view class="survey-secondary tap" @click="closeModule">退出</view>
						<view class="survey-primary tap" @click="go('contact')">联系客服</view>
					</view>
				</view>
			</view>

			<view v-else-if="activeModule === 'diag'" class="module-content diag-module">
				<view class="diag-hero-card">
					<view class="diag-icon"><view class="glyph glyph-diag"><view class="glyph-extra"></view></view></view>
					<view>
						<text>2 步快速定位故障</text>
						<text>选择产品类型与故障类型，即查看排查建议</text>
					</view>
				</view>
				<view class="module-section-head single"><text>请选择</text></view>
				<view class="select-card">
					<view class="select-row tap" @click="diagOpen = 'product'">
						<text><text class="required-star">*</text>产品类型</text>
						<text :class="{ placeholder: !diagProductLabel }">{{ diagProductLabel || '请选择产品类型' }}</text>
						<view class="field-arrow"></view>
					</view>
					<view class="select-row tap" @click="openFaultSheet">
						<text><text class="required-star">*</text>故障类型</text>
						<text :class="{ placeholder: !diagFault }">{{ diagFault || '请选择故障类型' }}</text>
						<view class="field-arrow"></view>
					</view>
				</view>
				<view v-if="diagConfirmVisible" class="diag-result">
					<view class="module-section-head single"><text>排查确认信息</text></view>
					<view v-for="section in diagConfirmSections" :key="section.title" class="diag-check-card">
						<view class="diag-check-head"><view :style="{ backgroundColor: section.color }"></view><text>{{ section.title }}</text></view>
						<view v-for="(item, index) in section.items" :key="item" class="diag-check-row">
							<text>{{ section.numbered ? index + 1 : '·' }}</text>
							<text>{{ item }}</text>
						</view>
					</view>
					<view class="dual-actions">
						<view class="ghost-button tap" @click="resetDiag">重新选择</view>
						<view class="primary-button tap" @click="go('repair')">仍未解决 · 立即报修</view>
					</view>
				</view>
				<view v-else class="empty-hint">选择产品类型与故障类型，系统将自动展示排查建议。</view>
				<view v-if="diagOpen" class="sheet-mask" @click="diagOpen = ''"></view>
				<view v-if="diagOpen" class="choice-sheet">
					<view class="choice-head">
						<text class="tap" @click="diagOpen = ''">取消</text>
						<text>{{ diagOpen === 'product' ? '选择产品类型' : '选择故障类型' }}</text>
						<text></text>
					</view>
					<view v-for="item in diagSheetOptions" :key="item.id" class="choice-row tap" @click="selectDiagOption(item)">
						<text>{{ item.title }}</text>
						<view v-if="item.active" class="mini-icon mini-check"></view>
					</view>
				</view>
			</view>

			<view v-else-if="activeModule === 'warranty'" class="module-content warranty-module">
				<view class="warranty-hero">
					<view class="glyph glyph-shield"><view class="glyph-extra"></view></view>
					<text>{{ warrantyDoc.title || '三重保修承诺' }}</text>
					<text>{{ warrantyDoc.lead || '原厂配件 · 工艺质保 · 终身咨询' }}</text>
				</view>
				<view v-if="warrantyDoc.content" class="doc-paper">
					<rich-text :nodes="warrantyDoc.content"></rich-text>
				</view>
				<view class="module-section-head single"><text>保修期限</text></view>
				<view class="white-list-card">
					<view v-for="item in warrantyDurations" :key="item.name" class="list-row">
						<text>{{ item.name }}</text>
						<text>{{ item.duration }}</text>
					</view>
				</view>
				<view class="module-section-head single"><text>保修范围</text></view>
				<view class="text-card">
					<view v-for="(item, index) in warrantyRanges" :key="item" class="number-line">
						<text>{{ index + 1 }}</text>
						<text>{{ item }}</text>
					</view>
				</view>
				<view class="module-section-head single"><text>增值服务</text></view>
				<view class="white-list-card">
					<view v-for="item in warrantyServices" :key="item.title" class="service-line">
						<view class="service-line-icon"><view :class="['glyph', 'glyph-' + item.icon]"><view class="glyph-extra"></view></view></view>
						<view><text>{{ item.title }}</text><text>{{ item.desc }}</text></view>
					</view>
				</view>
				<view v-if="!warrantyDoc.content" class="doc-paper warranty-paper">
					<text class="paper-title">保修政策</text>
					<view v-for="section in warrantyTerms" :key="section.title" class="paper-section">
						<text class="paper-section-title">{{ section.title }}</text>
						<view v-for="(line, index) in section.lines" :key="line" class="paper-line">
							<text>{{ index + 1 }})</text>
							<text>{{ line }}</text>
						</view>
					</view>
				</view>
			</view>

			<view v-else-if="isDocModule" class="module-content">
				<view v-if="activeModule === 'fees'" class="doc-hero fees-hero">
					<view class="glyph glyph-money"><view class="glyph-extra"></view></view>
					<text>收费公开透明</text>
					<text>免费检测 · 先报后修 · 无隐形消费</text>
				</view>
				<view v-else class="doc-hero">
					<view :class="['glyph', 'glyph-' + activeDoc.icon]"><view class="glyph-extra"></view></view>
					<view><text>{{ activeDoc.title }}</text><text>{{ activeDoc.lead }}</text></view>
				</view>
				<view v-if="activeDoc.content" class="doc-paper">
					<rich-text :nodes="activeDoc.content"></rich-text>
				</view>
				<view v-else class="doc-paper">
					<text class="paper-title">{{ activeDoc.paperTitle }}</text>
					<view v-for="section in activeDoc.sections" :key="section.title" class="paper-section">
						<text class="paper-section-title">{{ section.title }}</text>
						<view v-for="(line, index) in section.lines" :key="line" class="paper-line">
							<text>{{ section.marker || index + 1 + ')' }}</text>
							<text>{{ line }}</text>
						</view>
					</view>
				</view>
				<view v-if="activeDoc.steps" class="step-card">
					<view v-for="(step, index) in activeDoc.steps" :key="step.title" class="guide-step-row">
						<text>{{ index + 1 }}</text>
						<view><text>{{ step.title }}</text><text>{{ step.desc }}</text></view>
					</view>
				</view>
				<view v-if="activeModule !== 'fees'" class="dual-actions doc-actions">
					<view class="ghost-button tap" @click="go('contact')">联系客服</view>
					<view class="primary-button tap" @click="go('repair')">立即报修</view>
				</view>
			</view>

			<view v-else-if="activeModule === 'contact'" class="module-content contact-module">
				<view class="online-card">
					<view class="online-icon"><view class="glyph glyph-chat"><view class="glyph-extra"></view></view></view>
					<view class="online-copy">
						<text>{{ customerService.title || '在线客服' }}</text>
						<text>{{ customerService.description || '7×24 小时 · 即时响应' }}</text>
					</view>
					<view class="soft-button">立即咨询</view>
				</view>
				<view class="module-section-head single"><text>服务热线</text></view>
				<view class="hotline-grid">
					<view v-for="item in contactHotlines" :key="item.title" class="hotline-card">
						<view><view class="glyph glyph-phone"><view class="glyph-extra"></view></view><text>{{ item.title }}</text></view>
						<text>{{ item.number }}</text>
						<text>{{ item.time }}</text>
						<view class="small-primary">一键拨号</view>
					</view>
				</view>
				<view class="module-section-head single"><text>收件地址</text></view>
				<view class="address-card">
					<view class="glyph glyph-pin"><view class="glyph-extra"></view></view>
					<view class="address-copy">
						<text>{{ contactInfo.companyName }}</text>
						<text v-for="item in receiver" :key="item.label">{{ item.label }} · {{ item.value }}</text>
					</view>
				</view>
				<view class="address-actions">
					<view class="ghost-button tap" @click="copyAll">复制地址</view>
					<view class="primary-button tap">查看地图</view>
				</view>
				<view class="module-section-head single"><text>工作时间</text></view>
				<view class="white-list-card">
					<view v-for="item in workTimes" :key="item.day" class="list-row">
						<text>{{ item.day }}</text>
						<text>{{ item.time }}</text>
					</view>
				</view>
			</view>

			<view v-else-if="activeModule === 'orders'" class="orders-module">
				<view class="progress-tabs-line orders-tabs">
					<view v-for="item in orderTabs" :key="item" class="progress-tab tap" :class="{ on: item.startsWith(activeOrdersTab) }" @click="activeOrdersTab = item.split(' ')[0]">
						<text>{{ item }}</text>
					</view>
				</view>
				<view class="module-content">
					<view v-for="order in filteredOrderList" :key="order.id" class="order-card-mini tap" @click="openOrderDetail(order)">
						<view>
							<text class="muted-line">工单 {{ order.id }}</text>
							<text>{{ order.model }}</text>
							<text>报修日期 · {{ order.date }}</text>
						</view>
						<view>
							<text :class="['tag', 'tag-' + order.tone]">{{ order.status }}</text>
							<text>{{ order.price }}</text>
						</view>
					</view>
					<view v-if="!filteredOrderList.length" class="empty-hint compact">当前筛选条件下没有订单。</view>
				</view>
			</view>

			<view v-else-if="activeModule === 'products'" class="module-content products-module">
				<view v-for="item in productList" :key="item.sn" class="product-card">
					<view class="product-icon"><view class="glyph glyph-tooth"><view class="glyph-extra"></view></view></view>
					<view class="product-copy">
						<text>{{ item.title }}</text>
						<text>SN · {{ item.sn }}</text>
						<text>{{ item.date }}</text>
						<text :class="['tag', item.expired ? 'tag-muted' : 'tag-ok']">{{ item.warranty }}</text>
					</view>
					<view class="ghost-mini tap" @click="go('repair')">报修</view>
				</view>
				<view class="dash-add tap"><text>+</text><text>添加我的产品</text></view>
			</view>

			<view v-else-if="activeModule === 'address'" class="module-content address-module">
				<view class="repair-form-card">
					<view class="repair-field"><text><text class="required-star">*</text>收货人</text><input v-model="addressForm.name" placeholder="请输入收货人姓名" placeholder-class="input-placeholder" /></view>
					<view class="repair-field"><text><text class="required-star">*</text>手机号码</text><input v-model="addressForm.phone" placeholder="请输入联系电话" placeholder-class="input-placeholder" /></view>
					<view class="repair-field"><text><text class="required-star">*</text>所在地区</text><input v-model="addressForm.region" placeholder="省 / 市 / 区" placeholder-class="input-placeholder" /><view class="field-arrow"></view></view>
					<view class="repair-field"><text><text class="required-star">*</text>详细地址</text><input v-model="addressForm.detail" placeholder="街道 / 门牌号 / 楼层" placeholder-class="input-placeholder" /><view class="field-mini field-pin"></view></view>
					<view class="repair-field last"><text>单位名称</text><input v-model="addressForm.unit" placeholder="诊所 / 医院 名称（选填）" placeholder-class="input-placeholder" /></view>
				</view>
				<view class="switch-card">
					<view><text>设为默认地址</text><text>报修时将优先使用此地址</text></view>
					<view class="switch-btn tap" :class="{ on: addressForm.def }" @click="addressForm.def = !addressForm.def"><view></view></view>
				</view>
				<view class="primary-button tap save-button" @click="saveAddress">保存地址</view>
				<view class="delete-button">删除地址</view>
			</view>

			<view v-else-if="activeModule === 'feedback'" class="module-content feedback-module">
				<view class="segment">
					<view v-for="item in feedbackTypes" :key="item" class="tap" :class="{ on: feedbackType === item }" @click="feedbackType = item">{{ item }}</view>
				</view>
				<text class="feedback-tip">{{ feedbackType === '投诉' ? '收到投诉后，主管会在 24 小时内主动联系您' : '欢迎提出您宝贵的建议，采纳后可获赠小礼品' }}</text>
				<view class="feedback-card">
					<view class="feedback-area">
						<text><text class="required-star">*</text>详细描述</text>
						<textarea v-model="feedbackText" maxlength="500" :placeholder="feedbackType === '投诉' ? '请描述问题发生的时间、经过以及您的诉求……' : '请描述您的建议与期望，我们会认真评估……'" placeholder-class="input-placeholder"></textarea>
						<view><text>可附 0/3 张图片</text><text>{{ feedbackText.length }}/500</text></view>
					</view>
					<view class="feedback-contact">
						<text><text class="required-star">*</text>联系方式</text>
						<view class="contact-kind-row">
							<view v-for="item in feedbackContacts" :key="item.id" class="tap" :class="{ on: feedbackContactKind === item.id }" @click="feedbackContactKind = item.id">{{ item.title }}</view>
						</view>
						<view class="contact-input-row">
							<text>{{ feedbackContact.label }}</text>
							<input v-model="feedbackContactValue" :placeholder="feedbackContact.placeholder" placeholder-class="input-placeholder" />
						</view>
					</view>
				</view>
				<view class="simple-card">
					<text>关联工单</text>
					<text>选填 · 填写后便于我们快速定位问题</text>
					<input v-model="feedbackOrderId" placeholder="如 DR-20260508-1147" placeholder-class="input-placeholder" />
				</view>
				<view class="primary-button tap save-button" @click="submitFeedback">提交{{ feedbackType }}</view>
				<text class="submit-note">提交后预计 1 至 3 个工作日内反馈结果</text>
			</view>

			<view v-else-if="activeModule === 'login'" class="module-content login-module">
				<view class="login-logo"><view class="glyph glyph-tooth"><view class="glyph-extra"></view></view></view>
				<text class="login-title">欢迎使用</text>
				<text class="login-desc">专业牙科仪器 · 全程检修服务</text>
				<view class="wechat-login tap" @click="loginSuccess">微信一键登录</view>
				<view class="phone-login tap" @click="loginSuccess">手机号验证码登录</view>
				<text class="login-agree">登录即视为您同意《用户服务协议》及《隐私政策》</text>
			</view>
		</view>

		<view v-else-if="pageBootReady" class="page-scroll">
			<view v-if="activeTab === 'home'" class="home-body">
				<view class="brand-bar">
					<view class="brand-left">
						<image class="brand-logo" :src="cicadaAssets.logoMark" mode="aspectFit"></image>
						<text class="brand-name">思科达</text>
					</view>
					<view class="wechat-button tap" @click="showQr = true">
						<view class="wechat-glyph">
							<view class="wechat-dot dot-left"></view>
							<view class="wechat-dot dot-right"></view>
						</view>
					</view>
					<view class="hotline-pill tap" @click="go('contact')">
						<view class="glyph glyph-phone glyph-small">
							<view class="glyph-extra"></view>
						</view>
						<text>热线</text>
					</view>
				</view>

				<view class="search-wrap">
					<view class="search-box">
						<view class="glyph glyph-search glyph-search-small">
							<view class="glyph-extra"></view>
						</view>
						<input
							v-model="searchKeyword"
							class="search-input"
							placeholder="请输入常见问题"
							placeholder-class="input-placeholder"
							confirm-type="search"
							@confirm="handleSearch"
						/>
						<text class="search-action tap" @click="handleSearch">搜索</text>
					</view>
				</view>

				<view class="hero-wrap">
					<view class="hero-card">
						<view class="hero-media">
							<image class="hero-image" :src="cicadaAssets.photoFactory" mode="aspectFill"></image>
							<view class="hero-media-mask"></view>
						</view>
						<view class="hero-copy">
							<text class="hero-title">专业医疗设备维保</text>
							<text class="hero-subtitle">高效 · 精准 · 数字化服务体系</text>
						</view>
					</view>
				</view>

				<view class="section section-basic">
					<text class="section-title">基础服务</text>
					<view class="three-grid">
						<view
							v-for="item in basics"
							:key="item.id"
							class="service-card tap"
							@click="go(item.id)"
						>
							<view class="service-icon" :style="{ backgroundColor: item.bg, color: item.color }">
								<view :class="['glyph', 'glyph-' + item.icon]">
									<view class="glyph-extra"></view>
								</view>
							</view>
							<text class="service-title">{{ item.title }}</text>
						</view>
					</view>
				</view>

				<view class="section section-query">
					<text class="section-title">自助查询</text>
					<view class="query-grid">
						<view
							v-for="item in queries"
							:key="item.id"
							class="service-card tap"
							@click="go(item.id)"
						>
							<view class="service-icon" :style="{ backgroundColor: item.bg, color: item.color }">
								<view :class="['glyph', 'glyph-' + item.icon]">
									<view class="glyph-extra"></view>
								</view>
							</view>
							<text class="service-title">{{ item.title }}</text>
						</view>
					</view>
				</view>

				<view class="section section-guide">
					<view class="section-line">
						<text class="section-title">操作教程</text>
						<text class="section-meta">图文文档</text>
					</view>
					<view class="two-grid">
						<view
							v-for="item in guides"
							:key="item.id"
							class="guide-card tap"
							@click="go(item.id)"
						>
							<view class="guide-icon">
								<view :class="['glyph', 'glyph-' + item.icon, 'glyph-guide']">
									<view class="glyph-extra"></view>
								</view>
							</view>
							<text class="guide-title">{{ item.title }}</text>
							<view class="chevron"></view>
						</view>
					</view>
				</view>

				<view class="section section-contact">
					<text class="section-title">联系我们</text>
					<view class="two-grid">
						<view class="contact-card tap" @click="go('contact')">
							<view class="contact-icon">
								<view class="glyph glyph-chat">
									<view class="glyph-extra"></view>
								</view>
							</view>
							<view class="contact-copy">
								<text class="contact-title">在线客服</text>
								<text class="contact-desc">8:00至21:00</text>
							</view>
						</view>
						<view class="contact-card tap" @click="go('contact')">
							<view class="contact-icon">
								<view class="glyph glyph-phone">
									<view class="glyph-extra"></view>
								</view>
							</view>
							<view class="contact-copy">
								<text class="contact-title">服务热线</text>
								<text class="contact-desc">400-888-999</text>
							</view>
						</view>
					</view>
				</view>

				<view class="receiver-wrap">
					<view class="receiver-card">
						<view class="receiver-head">
							<view class="glyph glyph-pin glyph-pin-title">
								<view class="glyph-extra"></view>
							</view>
							<text>收件信息</text>
						</view>
						<view
							v-for="(item, index) in receiver"
							:key="item.label"
							class="receiver-row"
							:class="{ 'receiver-row-last': index === receiverLastIndex }"
						>
							<view class="receiver-line">
								<view class="receiver-text">
									<text class="receiver-label">{{ item.label }}</text>
									<text class="receiver-value">{{ item.value }}</text>
								</view>
								<view class="copy-button tap" @click="copyOne(item.value, item.label)">
									<view v-if="copied === item.label" class="mini-icon mini-check"></view>
									<view v-else class="mini-icon mini-copy"></view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="copy-row">
					<view class="copy-all tap" @click="copyAll">
						<view class="mini-icon mini-check mini-check-white"></view>
						<text>{{ copied === 'all' ? '已复制' : '一键复制以上收件信息' }}</text>
					</view>
					<view class="chat-round tap" @click="go('contact')">
						<view class="glyph glyph-chat">
							<view class="glyph-extra"></view>
						</view>
					</view>
				</view>
			</view>

			<view v-else-if="activeTab === 'company'" class="company-body">
				<view class="company-brand">
					<view class="brand-left">
						<image class="brand-logo" :src="cicadaAssets.logoMark" mode="aspectFit"></image>
						<text class="brand-name">思科达</text>
					</view>
					<view class="company-tools">
						<view class="glyph glyph-search"><view class="glyph-extra"></view></view>
						<view class="bell-icon"></view>
					</view>
				</view>

				<view class="company-hero">
					<image class="company-hero-image" :src="cicadaAssets.photoBuilding" mode="aspectFill"></image>
					<view class="company-hero-mask"></view>
					<image class="company-hero-logo" :src="cicadaAssets.logoFull" mode="aspectFit"></image>
					<view class="company-hero-title-wrap">
						<text class="company-hero-title">十年匠心，守护诊疗安全</text>
					</view>
				</view>

				<text class="company-desc">我们致力于为齿科机构提供全方位的精密仪器维保服务，成为中国口腔医疗领域最值得信赖的设备管家。</text>

				<view class="company-section">
					<view class="rule-title">
						<view></view>
						<text>核心优势</text>
					</view>
					<view class="auth-card">
						<view class="auth-head">
							<view class="cert-icon"></view>
							<text>官方授权认证</text>
						</view>
						<text class="auth-desc">全品类齿科大品牌原厂技术授权，使用原厂正品零部件，确保修复精度与耐用性。</text>
					</view>
					<view class="adv-grid">
						<view v-for="item in advantages" :key="item.title" class="adv-card">
							<view :class="['adv-icon', 'adv-' + item.icon]"></view>
							<text class="adv-title">{{ item.title }}</text>
							<text class="adv-desc">{{ item.desc }}</text>
						</view>
					</view>
				</view>

				<view class="company-section">
					<view class="rule-title">
						<view></view>
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
					<view class="qr-image-wrap company-qr">
						<image class="qr-image" :src="wechatInfo.qrcodeUrl" mode="aspectFill" show-menu-by-longpress></image>
					</view>
					<text class="follow-title">关注官方公众号</text>
					<text class="follow-desc">获取最新的维保优惠政策、设备保养秘籍以及一键预约上门服务。</text>
					<view class="follow-button tap" @click="go('contact')">
						<view class="plus-icon"></view>
						<text>立即关注</text>
					</view>
				</view>
			</view>

			<view v-else class="mine-body">
				<view class="mine-hero">
					<view class="profile-row">
						<view class="avatar"><text>{{ logged ? '李' : '' }}</text></view>
						<view class="profile-copy">
							<text class="profile-name">{{ logged ? '李医生' : '未登录' }}</text>
							<view v-if="logged" class="profile-meta">
								<text>桂林口腔门诊</text>
								<text class="member-tag">高级会员</text>
								<text class="logout-btn tap" @click="logged = false">退出</text>
							</view>
							<view v-else class="profile-meta">
								<text>登录后查看您的维修订单</text>
								<text class="logout-btn tap" @click="go('login')">注册/登录</text>
							</view>
						</view>
					</view>
				</view>

				<view class="order-card">
					<view class="order-head tap" @click="go('orders')">
						<view class="rule-title order-rule">
							<view></view>
							<text>我的维修单</text>
						</view>
						<view class="order-more">
							<text>查看全部</text>
							<view class="chevron"></view>
						</view>
					</view>
					<view class="status-grid">
						<view v-for="item in statusItems" :key="item.id" class="status-item tap" @click="go('orders')">
							<view class="status-icon" :style="{ color: item.color, backgroundColor: item.bg }">
								<view :class="['glyph', 'glyph-' + item.icon]"><view class="glyph-extra"></view></view>
								<text v-if="item.count" class="badge">{{ item.count }}</text>
							</view>
							<text class="status-text">{{ item.title }}</text>
						</view>
					</view>
				</view>

				<view class="settings-section">
					<view class="rule-title">
						<view></view>
						<text>服务与设置</text>
					</view>
					<view class="settings-card">
						<view v-for="(item, index) in menus" :key="item.title" class="menu-row tap" :class="{ last: index === menus.length - 1 }" @click="go(item.go)">
							<view class="menu-icon">
								<view :class="['glyph', 'glyph-' + item.icon]"><view class="glyph-extra"></view></view>
							</view>
							<view class="menu-copy">
								<text class="menu-title">{{ item.title }}</text>
								<text class="menu-desc">{{ item.desc }}</text>
							</view>
							<view class="chevron"></view>
						</view>
					</view>
				</view>

				<view class="mine-footer">
					<image :src="cicadaAssets.logoFull" mode="aspectFit"></image>
					<text>佛山思科达 · 牙医仪器检修 v1.2.0</text>
				</view>
			</view>
		</view>

		<view v-else class="boot-screen">
			<view class="boot-card">
				<image class="boot-logo" :src="cicadaAssets.logoMark" mode="aspectFit"></image>
				<text class="boot-title">CICADA 维修服务</text>
				<text class="boot-desc">正在为您加载首页、报修与查询功能</text>
			</view>
		</view>

		<view v-if="!activeModule && activeTab === 'home'" class="side-tab tap" @click="showOfficial = true">
			<text class="side-wordmark">CICADA</text>
			<text class="side-text">思科达官网</text>
		</view>

		<view v-if="!activeModule" class="bottom-tabbar">
			<view
				v-for="item in tabs"
				:key="item.id"
				class="tab-item tap"
				:class="{ 'tab-item-active': activeTab === item.id }"
				@click="go(item.id)"
			>
				<view :class="['tab-glyph', 'tab-' + item.icon]">
					<view class="tab-extra"></view>
				</view>
				<text>{{ item.label }}</text>
			</view>
		</view>

		<view v-if="showOfficial" class="modal-mask" @click="showOfficial = false">
			<view class="official-modal" @click.stop>
				<text class="modal-close tap" @click="showOfficial = false">×</text>
				<view class="official-head">
					<view class="official-logo">C</view>
					<view class="official-title-wrap">
						<text class="official-title">CICADA 思科达官网</text>
						<text class="official-subtitle">佛山市思科达医疗器械</text>
					</view>
				</view>
				<view class="official-tip">
					<text>即将跳转至「</text>
					<text class="official-tip-brand">CICADA 思科达官网</text>
					<text>」小程序，浏览全品类产品、查看资质证书与最新动态。</text>
				</view>
				<view class="official-actions">
					<view class="modal-btn modal-btn-ghost tap" @click="showOfficial = false">取消</view>
					<view class="modal-btn modal-btn-primary tap" @click="goOfficial">
						<view class="mini-icon mini-external"></view>
						<text>立即前往</text>
					</view>
				</view>
			</view>
		</view>

		<view v-if="showQr" class="modal-mask" @click="showQr = false">
			<view class="qr-modal" @click.stop>
				<text class="modal-close tap" @click="showQr = false">×</text>
				<image class="qr-logo" :src="cicadaAssets.logoFull" mode="aspectFit"></image>
				<text class="qr-title">关注官方公众号</text>
				<text class="qr-subtitle">获取最新维修指南 / 售后政策</text>
				<view class="qr-image-wrap">
					<image
						class="qr-image"
						:src="wechatInfo.qrcodeUrl"
						mode="aspectFill"
						show-menu-by-longpress
					></image>
				</view>
				<view class="qr-action tap" @click="showQr = false">长按识别 / 保存图片</view>
			</view>
		</view>

		<view v-if="showRepairTools" class="tool-sheet-mask" @click="showRepairTools = false"></view>
		<view v-if="showRepairTools" class="repair-tool-sheet">
			<view class="repair-tool-grabber"></view>
			<view class="repair-tool-head">
				<text>报修工具</text>
				<text>保存进度或重新填写当前报修单</text>
			</view>
			<view class="repair-tool-list">
				<view class="repair-tool-row tap" @click="saveRepairDraft">
					<view class="repair-tool-icon tool-save"><view class="mini-icon mini-check"></view></view>
					<view>
						<text>保存草稿</text>
						<text>把当前填写内容保存在本机，下次继续填写</text>
					</view>
				</view>
				<view class="repair-tool-row tap danger" @click="confirmClearRepair">
					<view class="repair-tool-icon tool-clear">×</view>
					<view>
						<text>清空重填</text>
						<text>清除产品和寄出信息，回寄信息恢复默认值</text>
					</view>
				</view>
			</view>
			<view class="repair-tool-cancel tap" @click="showRepairTools = false">取消</view>
		</view>
	</view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { cicadaAssets } from '@/config/cicada-assets'
import {
	getContact,
	getCustomerService,
	getFaultTypes,
	getFeePolicy,
	getGuide,
	getRepairList,
	getWechat,
	getWarrantyPolicy,
	queryPackageStatus,
	searchFault,
	submitRepairOrder,
	addAddress,
	updateAddress,
	addComplaint,
	wechatLogin,
	uploadImage,
	uploadVideo
} from '@/api/content'

const bootStart = Date.now()
const logBoot = (stage) => console.log('[index-boot]', stage, Date.now() - bootStart)

const copied = ref('')
const showQr = ref(false)
const showOfficial = ref(false)
const showRepairTools = ref(false)
const surveyPosterUrl = cicadaAssets.surveyPoster
const moduleHeadPaddingTop = ref(72)
const pageBootReady = ref(false)
const searchKeyword = ref('')
const activeTab = ref('home')
const activeModule = ref('')
const previousModule = ref('')
const logged = ref(true)
const diagProduct = ref('')
const diagFault = ref('')
const diagOpen = ref('')
const activeTrackTab = ref('全部')
const activeOrdersTab = ref('全部')
const trackDetailOrder = ref('')
const orderDetailOrder = ref('')
const packageQueryLoading = ref(false)
const packageQuerySearched = ref(false)
const feedbackType = ref('建议')
const feedbackContactKind = ref('phone')
const feedbackText = ref('')
const feedbackContactValue = ref('')
const feedbackOrderId = ref('')
const packageQuery = ref({
	trackingNo: '',
	phoneLast4: ''
})
const packageQueryResult = ref(null)
const addressForm = ref({
	addressId: '',
	name: '李医生',
	phone: '138 0013 8000',
	region: '广西壮族自治区 / 桂林市 / 象山区',
	detail: '中山中路 88 号 桂林口腔门诊 4 楼',
	unit: '桂林口腔门诊',
	def: true
})
const defaultRepairForm = () => ({
	logisticsCompany: '顺丰速运',
	trackingNo: '',
	sendMethod: '顺丰取件',
	receiverName: '李医生',
	receiverPhone: '13800138000',
	receiverAddress: '广西壮族自治区桂林市象山区中山中路 88 号 桂林口腔门诊 4 楼',
	receiverUnit: '桂林口腔门诊'
})
const defaultRepairProduct = () => ({ 
	id: 1, 
	name: '', 
	model: '', 
	serial: '', 
	buyDate: '', 
	voucher: '', 
	voucherList: [],
	faultDesc: '', 
	media: [] 
})
const repairDraftKey = 'repairDraft'
const repairForm = ref(defaultRepairForm())
const submittedOrderId = ref('DR-20260511-0042')
const repairProducts = ref([defaultRepairProduct()])

let repairProductSeed = 1
let repairMediaSeed = 1

logBoot('base refs ready')

const basics = [
	{ id: 'repair', title: '立即报修', icon: 'repair', color: '#1E6FE0', bg: '#DCE6FA' },
	{ id: 'track', title: '维修进度', icon: 'track', color: '#C97A6B', bg: '#F8E2DA' },
	{ id: 'survey', title: '调研有礼', icon: 'gift', color: '#8E96A8', bg: '#E5E7EE' }
]

const queries = [
	{ id: 'diag', title: '故障自查', icon: 'diag', color: '#0A4FB8', bg: '#D7E3FA' },
	{ id: 'package-query', title: '包裹查询', icon: 'box', color: '#10B981', bg: '#DCFCE7' },
	{ id: 'warranty', title: '保修政策', icon: 'shield', color: '#1E6FE0', bg: '#E8F1FE' },
	{ id: 'fees', title: '收费指南', icon: 'money', color: '#D97706', bg: '#FFF7E6' }
]

const guides = [
	{ id: 'guide-quick', title: '快速指南', icon: 'book' },
	{ id: 'guide-repair', title: '报修指南', icon: 'repair' },
	{ id: 'guide-query', title: '查询办法', icon: 'search' },
	{ id: 'guide-invoice', title: '开票指南', icon: 'invoice' }
]

const receiver = ref([
	{ label: '收件公司', value: '桂林市啄木鸟医疗器械有限公司' },
	{ label: '收件人', value: '售后李山' },
	{ label: '收件电话', value: '13977382317' },
	{ label: '收件地址', value: '广西壮族自治区桂林市七星区朝阳路国家高新区信息产业园' }
])

const advantages = [
	{ icon: 'lightning', title: '极速响应', desc: '2小时内接单回复、24小时内到场检修，将诊所停工损失降至最低。' },
	{ icon: 'microscope', title: '精密检测', desc: '引进国际领先的工业级内窥镜与频率分析仪，精准识别隐匿故障。' }
]

const business = [
	{ title: '高低速手机维修', desc: '包含深度清理、动平衡校正、陶瓷轴承更换。', gradient: 'linear-gradient(135deg, #2C5985 0%, #6BB0CC 100%)' },
	{ title: '综合治疗台保养', desc: '气路水路系统消毒、控制电路检修与压力调校。', gradient: 'linear-gradient(135deg, #3D6F9E 0%, #6BB0CC 100%)' },
	{ title: '影像系统调试', desc: 'CBCT、全景机辐射校验、感光板传感器优化。', gradient: 'linear-gradient(135deg, #0A4FB8 0%, #6BB0CC 100%)' }
]

const defaultStatusItems = [
	{ id: 'all', title: '全部', count: 3, color: '#1E6FE0', bg: 'rgba(30, 111, 224, 0.09)', icon: 'invoice' },
	{ id: 'pending', title: '待处理', count: 1, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.09)', icon: 'track' },
	{ id: 'fixing', title: '维修中', count: 1, color: '#0EA5E9', bg: 'rgba(14, 165, 233, 0.09)', icon: 'repair' },
	{ id: 'shipped', title: '已发货', count: 1, color: '#10B981', bg: 'rgba(16, 185, 129, 0.09)', icon: 'truck' }
]

const menus = [
	{ icon: 'pin', title: '收货地址管理', desc: '表单形式 · 1 个默认地址', go: 'address' },
	{ icon: 'edit', title: '投诉和建议', desc: '问题反馈 / 改进建议', go: 'feedback' },
	{ icon: 'box', title: '我的产品', desc: '已登记 3 件设备', go: 'products' },
	{ icon: 'invoice', title: '我的发票', desc: '电子发票/纸质发票', go: 'guide-invoice' },
	{ icon: 'shield', title: '保修政策', desc: '三重保修条款', go: 'warranty' },
	{ icon: 'phone', title: '联系我们', desc: '在线客服 / 服务热线 / 地址', go: 'contact' }
]

const tabs = [
	{ id: 'home', label: '首页', icon: 'home' },
	{ id: 'company', label: '公司介绍', icon: 'company' },
	{ id: 'mine', label: '我的', icon: 'mine' }
]

const tabRoutes = {
	home: true,
	company: true,
	mine: true
}

const moduleMap = {
	repair: { title: '立即报修', subtitle: '填写寄出信息、产品信息与寄回信息' },
	'repair-success': { title: '提交成功', subtitle: '工程师已收到您的报修申请' },
	track: { title: '维修进度', subtitle: '支持全部、待处理、维修中和已发货状态查询' },
	'package-query': { title: '包裹查询', subtitle: '按快递单号查询是否签收和当前处理状态' },
	'order-detail': { title: '工单详情', subtitle: '维修时间线、发票进度与负责工程师' },
	survey: { title: '调研有礼', subtitle: '扫码参与调研，领取专属维保福利' },
	diag: { title: '故障自查', subtitle: '选择产品类型和故障类型，查看排查建议' },
	warranty: { title: '保修政策', subtitle: '文字形式展示保修范围、期限和注意事项' },
	fees: { title: '收费指南', subtitle: '文字形式展示收费办法和常见项目' },
	'guide-quick': { title: '快速指南', subtitle: '以图文文档形式浏览操作说明' },
	'guide-repair': { title: '报修指南', subtitle: '了解寄修报修的完整流程' },
	'guide-query': { title: '查询指南', subtitle: '查看进度查询和结果确认办法' },
	'guide-invoice': { title: '开票指南', subtitle: '了解发票申请、抬头和寄送说明' },
	contact: { title: '联系我们', subtitle: '客服热线、工作时间和寄修地址' },
	orders: { title: '维修订单', subtitle: '查看全部维修记录与处理状态' },
	products: { title: '我的产品', subtitle: '已登记设备与保修状态' },
	address: { title: '收货地址', subtitle: '管理默认回寄地址与单位信息' },
	feedback: { title: '投诉和建议', subtitle: '提交问题反馈或服务建议' },
	login: { title: '登录', subtitle: '登录后查看您的维修订单' }
}

const moduleInfo = computed(() => moduleMap[activeModule.value] || {})
const moduleHeadStyle = computed(() => ({
	paddingTop: `${moduleHeadPaddingTop.value}rpx`
}))

const progressTabs = ['全部', '待处理', '维修中', '已发货']

const repairFlow = ['寄出', '签收', '检测', '维修', '回寄', '完成']

const packageFlow = ['待签收', '已签收', '已登记', '处理中', '已关联']

const trackOrders = ref([
	{ id: 'DR-20260508-1147', model: 'NSK Ti-Max Z95L', status: '维修中', statusGroup: '维修中', tone: 'warn', reached: 4, time: '05-09 14:23' },
	{ id: 'DR-20260420-0883', model: 'CICADA 超声洁牙机', status: '已完成', statusGroup: '已发货', tone: 'ok', reached: 5, time: '04-25 09:11' },
	{ id: 'DR-20260315-0521', model: '根管马达 X-Smart', status: '已完成', statusGroup: '已发货', tone: 'ok', reached: 5, time: '03-20 16:48' }
])

const packageFallbackRecords = [
	{
		trackingNo: 'SF0987654321',
		phoneLast4: '8000',
		company: '顺丰速运',
		orderId: 'DR-20260508-1147',
		status: '已签收待检测',
		tone: 'warn',
		reached: 3,
		timeline: [
			{ title: '已签收', desc: '桂林服务中心已签收，等待工程师拆包登记。', time: '2026-05-08 16:20' },
			{ title: '运输中', desc: '快递员派送中，请保持寄件电话畅通。', time: '2026-05-08 10:14' },
			{ title: '客户寄出', desc: '客户通过顺丰寄出维修设备。', time: '2026-05-07 18:30' }
		]
	},
	{
		trackingNo: 'YT20260517001',
		phoneLast4: '2317',
		company: '圆通速递',
		orderId: '',
		status: '已签收待登记',
		tone: 'muted',
		reached: 1,
		timeline: [
			{ title: '已签收', desc: '仓库已签收，客服正在核对寄件信息。', time: '2026-05-17 11:08' },
			{ title: '到达网点', desc: '快件已到达桂林七星营业部。', time: '2026-05-17 08:46' }
		]
	}
]

const orderTimeline = [
	{ title: '物流回寄', desc: '顺丰 SF1234567890 已签收', time: '2026-05-11 09:32', pending: true },
	{ title: '维修完成', desc: '已更换轴承组件，含密封圈与卡簧', time: '2026-05-10 16:48' },
	{ title: '维修中', desc: '工程师：王师傅 · 故障定位完成', time: '2026-05-09 14:23' },
	{ title: '检测完成', desc: '确认转动卡顿、轴承磨损', time: '2026-05-09 11:05' },
	{ title: '已签收', desc: '桂林服务中心 收', time: '2026-05-08 16:20' },
	{ title: '已寄出', desc: '顺丰快递 SF0987654321', time: '2026-05-08 10:14' }
]

const orderList = ref([
	{ id: 'DR-20260508-1147', model: 'NSK Ti-Max Z95L', status: '维修中', statusGroup: '维修中', tone: 'warn', price: '￥860', date: '2026-05-08' },
	{ id: 'DR-20260420-0883', model: 'CICADA 超声洁牙机', status: '已完成', statusGroup: '已发货', tone: 'ok', price: '￥320', date: '2026-04-20' },
	{ id: 'DR-20260315-0521', model: '根管马达 X-Smart', status: '已完成', statusGroup: '已发货', tone: 'ok', price: '￥580', date: '2026-03-15' },
	{ id: 'DR-20260218-0212', model: '综合治疗椅（主气路）', status: '已完成', statusGroup: '已发货', tone: 'ok', price: '￥1,240', date: '2026-02-18' },
	{ id: 'DR-20260112-0099', model: '光固化机 LED-X', status: '已取消', statusGroup: '待处理', tone: 'muted', price: '—', date: '2026-01-12' }
])

const productList = [
	{ title: 'NSK Ti-Max Z95L', sn: 'TZ95L-2402-0891', date: '2024-02 购入', warranty: '保修中 · 还剩 91 天', expired: false },
	{ title: 'CICADA 超声洁牙机', sn: 'CSC-2306-7723', date: '2023-06 购入', warranty: '已过保 · 可付费维修', expired: true },
	{ title: '根管马达 X-Smart', sn: 'XSM-2412-0103', date: '2024-12 购入', warranty: '保修中 · 还剩 561 天', expired: false }
]

const diagProducts = ref([
	{ id: 'hp', title: '高速手机/低速手机' },
	{ id: 'sc', title: '超声洁牙机' },
	{ id: 'rm', title: '根管马达' },
	{ id: 'cu', title: '光固化机/扫描仪' },
	{ id: 'ch', title: '综合治疗椅' }
])

const diagFaultMap = ref({
	hp: ['转动卡顿/异响', '喷雾不正常 / 无水', '夹钳松弛、卡针脱落', '气压不足、动力弱', '灯光不亮（光纤型）'],
	sc: ['不出水/水量小', '工作头无振动', '电源指示灯不亮', '发热严重'],
	rm: ['转速异常', '显示屏黑屏', '按键无反应', '扭力不稳'],
	cu: ['不出光/光弱', '电池续航差', '光斑不均匀', '机身过热'],
	ch: ['椅背升降卡顿', '水气泄漏', '灯光无法点亮', '无菌水路报警']
})

const faultRecords = ref([])
const diagResult = ref(null)

const defaultDiagConfirmSections = [
	{
		title: '相关问题',
		color: '#1E6FE0',
		numbered: false,
		items: ['该症状是否在最近一次保养之后出现？', '故障是否伴随明显异响、气味或发热？', '断电重启后症状是否消失？']
	},
	{
		title: '确认方式',
		color: '#0EA5E9',
		numbered: true,
		items: ['断电冷却 5 分钟后再观察', '更换同型号备机做对照测试', '查看进气压力是否在 0.25 至 0.30 MPa']
	},
	{
		title: '处理方式',
		color: '#10B981',
		numbered: true,
		items: ['可自行清洁卡簧并喷涂专用润滑油', '若 24 小时内复现，建议寄修更换轴承组件', '若伴随漏气或漏水，请立刻停用并联系工程师']
	}
]

const warrantyDurations = [
	{ name: '综合治疗椅', duration: '整机 1 年 · 主气路 3 年' },
	{ name: '高速/低速手机', duration: '机芯 6 个月 · 外壳 1 年' },
	{ name: '超声洁牙机', duration: '整机 1 年' },
	{ name: '根管马达', duration: '整机 2 年' },
	{ name: '光固化机', duration: '整机 1 年 · 灯头 6 个月' }
]

const warrantyRanges = [
	'在保修期内，因产品自身材料、工艺或装配缺陷导致的故障，免费维修。',
	'人为损坏（摔砸/进液/拆改）不在保修范围。',
	'已超出保修期的，按照配件成本与工时收费，价格表事先确认。',
	'所有维修配件均为原厂部件，确保品质一致。'
]

const warrantyServices = [
	{ icon: 'truck', title: '全国寄修', desc: '顺丰到付 · 全程可追踪' },
	{ icon: 'phone', title: '1 对 1 工程师', desc: '专属服务 · 售后无忧' },
	{ icon: 'invoice', title: '发票协助', desc: '增值税普通 / 专用发票' }
]

const warrantyTerms = [
	{
		title: '一、保修时间计算方式：',
		lines: [
			'客户提供购买凭证，以凭证上的购买时间计算，凭证无售出单位盖章或填写信息不完整的不予保修。',
			'客户在思科达售后小程序有产品注册，以注册填写的购买凭证时间来计算。',
			'客户在思科达售后小程序有产品注册，以注册填写的购买凭证时间来计算。',
			'如不能提供任何凭证，则以出厂时间加 1 个月来计算。',
			'保修期限以产品说明书中所述为准。'
		]
	},
	{
		title: '二、以下状况不属于保修范围：',
		lines: [
			'未按说明书进行安装、操作和维修。',
			'错误使用配件或使用非公司配件造成损坏。',
			'非正常的化学、电力、电解损坏及摔、碰伤。',
			'过度使用或用于牙科以外的其它科目。',
			'因使用、维护、保管不当造成损坏。',
			'不适当的操作或非制造商认可的人员对手机进行错误的维修。'
		]
	},
	{
		title: '三、不提供售后服务情形',
		lines: [
			'产品序列号被人为故意破坏、假标签、仿制等产品。',
			'在淘宝网、拼多多、微店等平台上购买的「思科达产品」且未授权的商家销售的产品。',
			'针对以上情形，本公司不提供任何技术支持及售后服务。'
		]
	},
	{ title: '四、维修续保', lines: ['所有维修品，同一故障问题，更换同样的零件，非人为因素，续保三个月。'] }
]

logBoot('static blocks ready')

const docModuleIds = ['fees', 'guide-quick', 'guide-repair', 'guide-query', 'guide-invoice']

const docFallbacks = {
	fees: {
		title: '收费指南',
		icon: 'money',
		lead: '价格透明，先报价后维修，全程无隐形消费。',
		paperTitle: '思科达维修收费指南',
		sections: [
			{ title: '一、收费构成', lines: ['配件费：按照思科达原厂配件官方指导价收取。', '工时费：根据维修难度及工程师等级核算，公开透明。', '物流费：保修期内非人为故障往返运费由我司承担（顺丰到付）。'] },
			{ title: '二、核心原则', lines: ['免费检测：所有寄修设备均享免费检测，未维修不收取任何检测费用。', '先报后修：工程师检测后出具正式报价单，经客户在线确认后方动工维修。', '拒绝隐形消费：所有收费项目均在报价单中列明，无额外附加费。'] },
			{ title: '三、质保说明', lines: ['所有维修更换的配件（非人为因素）均享受 90 天的质保续期服务。'], marker: '' }
		]
	},
	'guide-quick': {
		title: '快速指南',
		icon: 'book',
		lead: '5 分钟了解小程序核心功能，让售后流程一目了然。',
		paperTitle: '思科达医疗小程序 — 快速指南',
		sections: [
			{ title: '一、故障自查', marker: 'a)', lines: ['点击首页「故障自查」或在导航栏选择「操作指南」。', '选择产品类型，按照指引进行故障排查，即可获得初步解决方案。'] },
			{ title: '二、如何报修', marker: 'b)', lines: ['点击首页「立即报修」进入报修表单。', '填写产品信息、故障描述、上传附件图片，点击提交完成报修。', '提交后可获得工单号，用于后续进度查询。'] },
			{ title: '三、维修进度查询', marker: 'c)', lines: ['在首页或「维修进度」页面输入工单号查询。', '维修状态会实时更新，包括：已接单、检测中、维修中、已发货等状态。'] },
			{ title: '四、自助开票', marker: 'd)', lines: ['维修完成后，在「我的订单」中选择开票。', '选择发票类型，填写开票信息后提交。'] }
		]
	},
	'guide-repair': {
		title: '报修指南',
		icon: 'repair',
		lead: '专业的寄修服务流程，为您的医疗设备保驾护航。',
		paperTitle: '思科达故障报修指南',
		sections: [
			{ title: '一、报修前准备', lines: ['产品信息：准备好产品型号、序列号等基本信息。', '故障描述：详细描述故障现象、发生时间及使用环境。', '故障照片/视频：如有可能，拍摄故障发生时的照片或视频。', '购买凭证：准备好购买发票或订单信息（用于保修确认）。'] },
			{ title: '二、网上报修流程', lines: ['进入「立即报修」页面。', '填写产品信息。', '填写故障描述并上传图片。', '确认信息并提交。'] },
			{ title: '三、思科达 24h 客服指引', lines: ['在线客服：8:00 - 21:00。', '服务热线：400-888-9999。'] }
		],
		steps: [
			{ title: '进入立即报修', desc: '在小程序首页点击「立即报修」按钮，进入报修表单页面。' },
			{ title: '填写产品信息', desc: '选择产品类型，输入产品序列号，填写产品购买日期。' },
			{ title: '上传故障图片', desc: '详细描述故障现象，上传故障照片或视频。' },
			{ title: '确认并提交', desc: '核对报修信息无误后，点击提交完成申请。' }
		]
	},
	'guide-query': {
		title: '查询办法',
		icon: 'search',
		lead: '随时随地掌握维修进度，信息透明更安心。',
		paperTitle: '思科达维修查询办法',
		sections: [
			{ title: '一、工单号查询', lines: ['在小程序首页顶部的搜索框中，直接输入 DR 开头的完整工单号。', '点击搜索即可查看该工单的实时物流进度、检测报告及维修状态。'] },
			{ title: '二、序列号（SN）查询', lines: ['使用设备机身上刻印的 SN 序列号进行查询。', '该方式可追溯设备的所有历史维修记录及保修剩余时长。'] },
			{ title: '三、个人中心查询', lines: ['登录小程序后，点击右下角「我的」。', '进入「维修订单」页面，即可查看名下绑定的所有维修申请及进度。'] },
			{ title: '四、人工查询', lines: ['如无法通过以上方式查询，请联系 400 服务热线，提供报修时的手机号由客服协助查询。'], marker: '' }
		]
	},
	'guide-invoice': {
		title: '开票指南',
		icon: 'invoice',
		lead: '支持多种发票类型，在线申请，极速送达。',
		paperTitle: '思科达自助开票指南',
		sections: [
			{ title: '一、开票申请流程', lines: ['维修完成并支付后，在「维修订单」中选择对应订单。', '点击「申请开票」按钮，选择发票类型（电子普票/纸质专票）。', '录入单位抬头、税号及接收邮箱/地址，确认提交。'] },
			{ title: '二、发票类型说明', lines: ['增值税普通发票：默认开具电子发票，发送至您的预留邮箱。', '增值税专用发票：需上传开票资料，纸质发票将于 3 个工作日内寄出。'] },
			{ title: '三、开票时效', lines: ['电子发票申请后 24 小时内开具；纸质发票每周二、周五统一邮寄。'], marker: '' }
		]
	}
}

const docMap = ref({})

logBoot('doc fallbacks ready')

const contactInfo = ref({
	companyName: '桂林市啄木鸟医疗器械有限公司',
	phone: '139 7738 2317',
	email: '',
	address: '广西壮族自治区桂林市七星区朝阳路国家高新区信息产业园',
	workTime: '周一至周五 08:00 - 21:00'
})

const customerService = ref({
	qrcodeUrl: cicadaAssets.qrWechat,
	title: '调研有礼',
	description: '扫码添加客服微信，参与调研即可获得精美礼品',
	wechat: 'CSD-Service-001'
})

const wechatInfo = ref({
	qrcodeUrl: cicadaAssets.qrWechat,
	name: '思科达售后',
	description: '获取最新维修指南 / 售后政策'
})

const contactHotlines = ref([
	{ title: '售后技术', number: '139 7738 2317', time: '工作日 08:00-21:00' },
	{ title: '购买咨询', number: '139 7738 2398', time: '工作日 08:00-21:00' }
])

const workTimes = ref([
	{ day: '周一至周五', time: '08:00 - 21:00' },
	{ day: '周末', time: '09:00 - 18:00' },
	{ day: '法定节假日', time: '09:00 - 17:00' }
])

const feedbackContacts = [
	{ id: 'phone', title: '手机', label: '手机号码', placeholder: '请输入 11 位手机号码' },
	{ id: 'qq', title: 'QQ', label: 'QQ 号码', placeholder: '请输入 QQ 号' },
	{ id: 'email', title: '邮箱', label: '邮箱地址', placeholder: '请输入常用邮箱' }
]

const feedbackTypes = ['建议', '投诉']

const toTextLines = (value) => {
	if (Array.isArray(value)) return value.filter(Boolean).map(String)
	if (!value) return []
	return String(value)
		.replace(/<[^>]+>/g, '\n')
		.split(/\n|\uFF1B|;/)
		.map((item) => item.replace(/^\s*\d+[.)、]?\s*/, '').trim())
		.filter(Boolean)
}

const normalizeDoc = (doc, fallback = {}) => {
	if (!doc) return fallback
	const content = doc.content || doc.html || ''

	return {
		...fallback,
		title: doc.title || fallback.title,
		lead: doc.description || doc.summary || fallback.lead,
		paperTitle: doc.paperTitle || doc.title || fallback.paperTitle || fallback.title,
		content,
		updateTime: doc.updateTime || fallback.updateTime,
		sections: Array.isArray(doc.sections) && doc.sections.length ? doc.sections : fallback.sections || [],
		steps: Array.isArray(doc.steps) && doc.steps.length ? doc.steps : fallback.steps
	}
}

const normalizeContact = (data = {}) => ({
	companyName: data.companyName || contactInfo.value.companyName,
	phone: data.phone || contactInfo.value.phone,
	email: data.email || contactInfo.value.email,
	address: data.address || contactInfo.value.address,
	workTime: data.workTime || contactInfo.value.workTime
})

const splitWorkTimes = (workTime = '') => {
	if (!workTime) return workTimes.value
	const rows = String(workTime)
		.split(/\n|\uFF1B|;/)
		.map((item) => item.trim())
		.filter(Boolean)

	if (!rows.length) return workTimes.value

	return rows.map((item) => {
		const parts = item.split(/\s+/)
		return {
			day: parts[0] || '工作时间',
			time: parts.slice(1).join(' ') || item
		}
	})
}

const normalizeQrUrl = (url) => url || cicadaAssets.qrWechat

const applyContact = (data = {}) => {
	const next = normalizeContact(data)
	contactInfo.value = next
	contactHotlines.value = [
		{ title: '售后技术', number: next.phone, time: next.workTime },
		...(next.email ? [{ title: '邮箱咨询', number: next.email, time: next.workTime }] : [])
	]
	workTimes.value = splitWorkTimes(next.workTime)
	receiver.value = [
		{ label: '收件公司', value: next.companyName },
		{ label: '收件电话', value: next.phone },
		{ label: '收件地址', value: next.address }
	]
}

const statusMeta = {
	0: { status: '待处理', statusGroup: '待处理', tone: 'muted', reached: 1 },
	1: { status: '维修中', statusGroup: '维修中', tone: 'warn', reached: 3 },
	2: { status: '已发货', statusGroup: '已发货', tone: 'ok', reached: 4 },
	3: { status: '已完成', statusGroup: '已发货', tone: 'ok', reached: 5 }
}

const packageStatusMeta = {
	0: { status: '暂未签收', tone: 'muted', reached: 0 },
	1: { status: '已签收待登记', tone: 'warn', reached: 1 },
	2: { status: '已登记待检测', tone: 'warn', reached: 2 },
	3: { status: '处理中', tone: 'warn', reached: 3 },
	4: { status: '已关联工单', tone: 'ok', reached: 4 },
	5: { status: '已完成', tone: 'ok', reached: 4 }
}

const normalizeOrder = (item = {}) => {
	const meta = statusMeta[item.status] || {
		status: item.statusText || item.status || '待处理',
		statusGroup: item.statusText || '待处理',
		tone: 'muted',
		reached: 1
	}
	const statusText = item.statusText || meta.status
	const statusGroup = ['待处理', '维修中', '已发货'].includes(statusText) ? statusText : meta.statusGroup

	return {
		id: item.orderId || item.id || '',
		model: item.productModel || item.productName || item.model || '维修设备',
		status: statusText,
		statusGroup,
		tone: meta.tone,
		reached: meta.reached,
		time: (item.updateTime || item.createTime || '').slice(5, 16) || item.time || '',
		price: item.price || '—',
		date: (item.createTime || item.date || '').slice(0, 10)
	}
}

const normalizePackageTimeline = (timeline = []) => {
	if (!Array.isArray(timeline) || !timeline.length) {
		return [{ title: '等待录入', desc: '后台录入快递单号后，这里会显示签收和处理记录。', time: '', pending: true }]
	}

	return timeline.map((item = {}) => ({
		title: item.title || item.statusText || item.status || '包裹状态更新',
		desc: item.desc || item.description || item.content || '包裹状态已更新。',
		time: item.time || item.createTime || item.updateTime || '',
		pending: Boolean(item.pending)
	}))
}

const normalizePackageResult = (data = {}) => {
	const rawStatus = data.status
	const meta = packageStatusMeta[rawStatus] || {
		status: data.statusText || data.statusName || rawStatus || '已录入',
		tone: data.tone || 'muted',
		reached: Number.isFinite(Number(data.reached)) ? Number(data.reached) : 1
	}

	const reachedValue = data.reached !== undefined && data.reached !== null ? data.reached : meta.reached

	return {
		trackingNo: data.trackingNo || data.expressNo || data.waybillNo || packageQuery.value.trackingNo,
		company: data.company || data.expressCompany || data.logisticsCompany || '',
		orderId: data.orderId || data.repairOrderId || '',
		status: data.statusText || data.statusName || meta.status,
		tone: data.tone || meta.tone,
		reached: Math.max(0, Math.min(packageFlow.length - 1, Number(reachedValue) || 0)),
		timeline: normalizePackageTimeline(data.timeline || data.logs || data.records)
	}
}

const findLocalPackageRecord = (trackingNo, phoneLast4 = '') => {
	const normalizedNo = String(trackingNo).trim().toUpperCase()
	const normalizedPhone = String(phoneLast4).trim()
	return packageFallbackRecords.find((item) => {
		const noMatched = item.trackingNo.toUpperCase() === normalizedNo
		const phoneMatched = !normalizedPhone || !item.phoneLast4 || item.phoneLast4 === normalizedPhone
		return noMatched && phoneMatched
	})
}

const queryPackage = async () => {
	if (packageQueryLoading.value) return

	const trackingNo = packageQuery.value.trackingNo.trim()
	if (!trackingNo) {
		uni.showToast({ title: '请输入快递单号', icon: 'none' })
		return
	}

	packageQueryLoading.value = true
	packageQuerySearched.value = false
	packageQueryResult.value = null

	try {
		const res = await queryPackageStatus({
			trackingNo,
			phoneLast4: packageQuery.value.phoneLast4.trim()
		})
		packageQueryResult.value = res ? normalizePackageResult(res) : null
		packageQuerySearched.value = true
	} catch (error) {
		console.warn('package query fallback:', error)
		const localRecord = findLocalPackageRecord(trackingNo, packageQuery.value.phoneLast4)
		if (localRecord) {
			packageQueryResult.value = normalizePackageResult(localRecord)
		} else {
			packageQuerySearched.value = true
			uni.showToast({ title: '包裹查询接口未开放', icon: 'none' })
		}
	} finally {
		packageQueryLoading.value = false
	}
}

const applyFaultTypes = (list = []) => {
	if (!Array.isArray(list) || !list.length) return
	const productMap = {}
	const faultMap = {}

	list.forEach((item) => {
		const productName = item.productType || item.productName || '通用设备'
		const productId = item.productTypeId || item.productType || productName
		const faultName = item.faultName || item.name || item.title

		if (!faultName) return
		productMap[productId] = { id: productId, title: productName }
		if (!faultMap[productId]) faultMap[productId] = []
		faultMap[productId].push(faultName)
	})

	if (Object.keys(productMap).length) {
		diagProducts.value = Object.values(productMap)
		diagFaultMap.value = faultMap
		faultRecords.value = list
	}
}

const updateDoc = (key, doc) => {
	docMap.value = {
		...docMap.value,
		[key]: normalizeDoc(doc, docFallbacks[key] || docMap.value[key] || {})
	}
}

const statusItems = computed(() => {
	const counts = orderList.value.reduce(
		(acc, item) => {
			acc.all += 1
			if (item.statusGroup === '待处理') acc.pending += 1
			if (item.statusGroup === '维修中') acc.fixing += 1
			if (item.statusGroup === '已发货') acc.shipped += 1
			return acc
		},
		{ all: 0, pending: 0, fixing: 0, shipped: 0 }
	)

	return defaultStatusItems.map((item) => ({
		...item,
		count: counts[item.id] !== undefined && counts[item.id] !== null ? counts[item.id] : item.count
	}))
})

const orderTabs = computed(() => [
	`全部 ${orderList.value.length}`,
	`待处理 ${orderList.value.filter((item) => item.statusGroup === '待处理').length}`,
	`维修中 ${orderList.value.filter((item) => item.statusGroup === '维修中').length}`,
	`已发货 ${orderList.value.filter((item) => item.statusGroup === '已发货').length}`
])

const diagProductLabel = computed(() => {
	const product = diagProducts.value.find((item) => item.id === diagProduct.value)
	return product ? product.title : ''
})
const diagFaultOptions = computed(() => {
	if (diagProduct.value) return diagFaultMap.value[diagProduct.value] || []
	return Array.from(new Set(Object.values(diagFaultMap.value).flat()))
})
const diagConfirmVisible = computed(() => Boolean(diagProduct.value && diagFault.value))
const diagConfirmSections = computed(() => {
	if (!diagResult.value) return defaultDiagConfirmSections

	const confirmItems = toTextLines(diagResult.value.confirmInfo)
	const solutionItems = toTextLines(diagResult.value.solution)

	return [
		{
			title: '相关问题',
			color: '#1E6FE0',
			numbered: false,
			items: confirmItems.length ? confirmItems : defaultDiagConfirmSections[0].items
		},
		{
			title: '确认方式',
			color: '#0EA5E9',
			numbered: true,
			items: confirmItems.length ? confirmItems : defaultDiagConfirmSections[1].items
		},
		{
			title: '处理方式',
			color: '#10B981',
			numbered: true,
			items: solutionItems.length ? solutionItems : defaultDiagConfirmSections[2].items
		}
	]
})
const diagSheetOptions = computed(() => {
	if (diagOpen.value === 'product') {
		return diagProducts.value.map((item) => ({ ...item, active: item.id === diagProduct.value }))
	}
	return diagFaultOptions.value.map((title) => ({ id: title, title, active: title === diagFault.value }))
})
const warrantyDoc = computed(() => docMap.value.warranty || {})
const activeDoc = computed(() => docMap.value[activeModule.value] || docFallbacks[activeModule.value] || docFallbacks['guide-quick'] || {})
const isDocModule = computed(() => docModuleIds.includes(activeModule.value))
const feedbackContact = computed(() => feedbackContacts.find((item) => item.id === feedbackContactKind.value) || feedbackContacts[0])
const receiverLastIndex = computed(() => receiver.value.length - 1)
const filteredTrackOrders = computed(() => {
	if (activeTrackTab.value === '全部') return trackOrders.value
	return trackOrders.value.filter((item) => item.statusGroup === activeTrackTab.value)
})
const filteredOrderList = computed(() => {
	if (activeOrdersTab.value.includes('待处理')) return orderList.value.filter((item) => item.statusGroup === '待处理')
	if (activeOrdersTab.value.includes('维修中')) return orderList.value.filter((item) => item.statusGroup === '维修中')
	if (activeOrdersTab.value.includes('已发货')) return orderList.value.filter((item) => item.statusGroup === '已发货')
	return orderList.value
})
const detailOrder = computed(() => {
	const fallbackOrder = trackOrders.value[0] || orderList.value[0] || {}
	const sourceId = trackDetailOrder.value || orderDetailOrder.value || fallbackOrder.id
	return (
		trackOrders.value.find((item) => item.id === sourceId) ||
		orderList.value.find((item) => item.id === sourceId) ||
		fallbackOrder
	)
})

logBoot('computed state ready')

let copyTimer = null

const initModuleSafeArea = () => {
	try {
		const systemInfo = uni.getSystemInfoSync()
		const menuRect = uni.getMenuButtonBoundingClientRect ? uni.getMenuButtonBoundingClientRect() : null
		const pixelRatio = 750 / (systemInfo.windowWidth || 375)

		if (menuRect && menuRect.top) {
			const navBottom = menuRect.top + menuRect.height + Math.max(menuRect.top - (systemInfo.statusBarHeight || 0), 8)
			moduleHeadPaddingTop.value = Math.ceil(navBottom * pixelRatio) + 8
			return
		}

		moduleHeadPaddingTop.value = Math.ceil(((systemInfo.statusBarHeight || 24) + 24) * pixelRatio)
	} catch (error) {
		console.warn('safe area fallback:', error)
		moduleHeadPaddingTop.value = 88
	}
}

const markCopied = (label) => {
	copied.value = label
	if (copyTimer) clearTimeout(copyTimer)
	copyTimer = setTimeout(() => {
		copied.value = ''
	}, 1400)
}

const copyOne = (value, label) => {
	uni.setClipboardData({
		data: value,
		success: () => markCopied(label),
		fail: () => markCopied(label)
	})
}

const copyAll = () => {
	const text = receiver.value.map((item) => `${item.label}: ${item.value}`).join('\n')
	uni.setClipboardData({
		data: text,
		success: () => markCopied('all'),
		fail: () => markCopied('all')
	})
}

const previewSurveyPoster = () => {
	uni.previewImage({
		current: surveyPosterUrl,
		urls: [surveyPosterUrl]
	})
}

const openModule = (id) => {
	previousModule.value = activeModule.value
	activeModule.value = id
	showOfficial.value = false
	showQr.value = false
}

const closeModule = () => {
	if (activeModule.value === 'order-detail' && (previousModule.value === 'track' || previousModule.value === 'orders')) {
		activeModule.value = previousModule.value
		previousModule.value = ''
		return
	}
	activeModule.value = ''
	previousModule.value = ''
}

const openTrackDetail = (order) => {
	trackDetailOrder.value = order.id
	openModule('order-detail')
}

const openOrderDetail = (order) => {
	orderDetailOrder.value = order.id
	openModule('order-detail')
}

const addRepairProduct = () => {
	repairProductSeed += 1
	repairProducts.value.push({ 
		id: repairProductSeed, 
		name: '', 
		model: '', 
		serial: '', 
		buyDate: '', 
		voucher: '', 
		voucherList: [],
		faultDesc: '', 
		media: [] 
	})
}

const syncRepairSeeds = () => {
	repairProductSeed = Math.max(1, ...repairProducts.value.map((item) => Number(item.id) || 1))
}

const normalizeRepairProducts = (products = []) => {
	if (!Array.isArray(products) || !products.length) return [defaultRepairProduct()]

	return products.map((item, index) => ({
		id: Number(item.id) || index + 1,
		name: item.name || '',
		model: item.model || '',
		serial: item.serial || '',
		buyDate: item.buyDate || '',
		voucher: item.voucher || '',
		voucherList: Array.isArray(item.voucherList) ? item.voucherList : [],
		faultDesc: item.faultDesc || '',
		media: Array.isArray(item.media) ? item.media : []
	}))
}

const restoreRepairDraft = () => {
	try {
		const draft = uni.getStorageSync(repairDraftKey)
		if (!draft || (!draft.repairForm && !draft.repairProducts)) return

		repairForm.value = {
			...defaultRepairForm(),
			...(draft.repairForm || {})
		}
		repairProducts.value = normalizeRepairProducts(draft.repairProducts)
		syncRepairSeeds()
	} catch (error) {
		console.warn('restore repair draft fallback:', error)
	}
}

const saveRepairDraft = () => {
	try {
		uni.setStorageSync(repairDraftKey, {
			repairForm: repairForm.value,
			repairProducts: repairProducts.value,
			updateTime: Date.now()
		})
		showRepairTools.value = false
		uni.showToast({ title: '草稿已保存', icon: 'success' })
	} catch (error) {
		console.warn('save repair draft fallback:', error)
		uni.showToast({ title: '保存失败，请稍后重试', icon: 'none' })
	}
}

const clearRepairForm = () => {
	repairForm.value = defaultRepairForm()
	repairProducts.value = [defaultRepairProduct()]
	repairProductSeed = 1
	repairMediaSeed = 1
	uni.removeStorageSync(repairDraftKey)
	showRepairTools.value = false
	uni.showToast({ title: '已清空，可重新填写', icon: 'none' })
}

const confirmClearRepair = () => {
	uni.showModal({
		title: '清空当前报修单？',
		content: '清空后，已填写的产品、运单号和附件会被删除，回寄信息会恢复默认值，建议先保存草稿。',
		confirmText: '清空',
		confirmColor: '#E5484D',
		cancelText: '取消',
		success: ({ confirm }) => {
			if (confirm) clearRepairForm()
		}
	})
}

const removeRepairProduct = (index) => {
	if (repairProducts.value.length <= 1) return
	repairProducts.value.splice(index, 1)
}

const normalizeUploadUrl = (res = {}, fallbackPath = '') => res.url || res.fileUrl || res.path || res.fullUrl || fallbackPath

const uploadRepairImage = async (index) => {
	const product = repairProducts.value[index]
	if (!product || product.media.length >= 3) return

	try {
		const chooseRes = await uni.chooseImage({
			count: 3 - product.media.length,
			sizeType: ['compressed'],
			sourceType: ['album', 'camera']
		})
		const paths = chooseRes.tempFilePaths || []
		if (!paths.length) return

		uni.showLoading({ title: '上传中' })
		for (const path of paths) {
			if (product.media.length >= 3) break
			const uploadRes = await uploadImage(path)
			repairMediaSeed += 1
			product.media.push({
				id: `img-${repairMediaSeed}`,
				type: 'image',
				path,
				url: normalizeUploadUrl(uploadRes, path)
			})
		}
		uni.showToast({ title: '上传成功', icon: 'success' })
	} catch (error) {
		console.warn('upload image fallback:', error)
		uni.showToast({ title: '图片上传失败', icon: 'none' })
	} finally {
		uni.hideLoading()
	}
}

const uploadRepairVideo = async (index) => {
	const product = repairProducts.value[index]
	if (!product || product.media.length >= 3) return

	try {
		const chooseRes = await uni.chooseVideo({
			sourceType: ['album', 'camera'],
			compressed: true,
			maxDuration: 60
		})
		if (!chooseRes.tempFilePath) return

		uni.showLoading({ title: '上传中' })
		const uploadRes = await uploadVideo(chooseRes.tempFilePath)
		repairMediaSeed += 1
		product.media.push({
			id: `vid-${repairMediaSeed}`,
			type: 'video',
			path: chooseRes.tempFilePath,
			url: normalizeUploadUrl(uploadRes, chooseRes.tempFilePath),
			duration: chooseRes.duration,
			size: chooseRes.size
		})
		uni.showToast({ title: '上传成功', icon: 'success' })
	} catch (error) {
		console.warn('upload video fallback:', error)
		uni.showToast({ title: '视频上传失败', icon: 'none' })
	} finally {
		uni.hideLoading()
	}
}

const addRepairMedia = (index) => {
	const product = repairProducts.value[index]
	if (!product || product.media.length >= 3) return

	uni.showActionSheet({
		itemList: ['上传图片', '上传视频'],
		success: ({ tapIndex }) => {
			if (tapIndex === 0) uploadRepairImage(index)
			if (tapIndex === 1) uploadRepairVideo(index)
		}
	})
}

const removeRepairMedia = (productIndex, mediaId) => {
	const product = repairProducts.value[productIndex]
	if (!product) return
	product.media = product.media.filter((item) => item.id !== mediaId)
}

const splitRepairMedia = (media = []) => ({
	images: media.filter((item) => item.type === 'image').map((item) => item.url).filter(Boolean),
	videos: media.filter((item) => item.type === 'video').map((item) => item.url).filter(Boolean)
})

const buildRepairPayload = () => {
	const product = repairProducts.value[0] || {}
	const firstMedia = splitRepairMedia(product.media)
	return {
		productName: product.name || product.model || '维修产品',
		productModel: product.model,
		productSerial: product.serial,
		faultType: product.faultType || product.faultDesc || '待检测',
		faultDesc: product.faultDesc,
		images: firstMedia.images,
		videos: firstMedia.videos,
		logisticsCompany: repairForm.value.logisticsCompany,
		trackingNo: repairForm.value.trackingNo,
		sendMethod: repairForm.value.sendMethod,
		senderName: repairForm.value.receiverName,
		senderPhone: repairForm.value.receiverPhone,
		senderAddress: repairForm.value.receiverAddress,
		receiverName: repairForm.value.receiverName,
		receiverPhone: repairForm.value.receiverPhone,
		receiverAddress: repairForm.value.receiverAddress,
		receiverUnit: repairForm.value.receiverUnit,
		products: repairProducts.value.map((item) => {
			const media = splitRepairMedia(item.media)
			const voucherUrls = (item.voucherList || []).map(v => v.url || v.path).filter(Boolean)
			return {
				productName: item.name || item.model || '维修产品',
				productModel: item.model,
				productSerial: item.serial,
				buyDate: item.buyDate,
				voucher: item.voucher,
				voucherImages: voucherUrls,
				faultDesc: item.faultDesc,
				images: media.images,
				videos: media.videos
			}
		})
	}
}

const submitRepair = async () => {
	const invalid = repairProducts.value.some((item) => !item.model || !item.serial || !item.faultDesc || !item.media.length)
	if (invalid || !repairForm.value.receiverName || !repairForm.value.receiverPhone || !repairForm.value.receiverAddress) {
		uni.showToast({ title: '请完善必填报修信息', icon: 'none' })
		return
	}

	try {
		const res = await submitRepairOrder(buildRepairPayload())
		submittedOrderId.value = res && res.orderId ? res.orderId : submittedOrderId.value
		openModule('repair-success')
		loadRemoteContent()
	} catch (error) {
		console.warn('submit repair fallback:', error)
		uni.showToast({ title: '后台接口未开放，已保留表单信息', icon: 'none' })
	}
}

const openFaultSheet = () => {
	diagOpen.value = 'fault'
}

const loadFaultResult = async () => {
	if (!diagProduct.value || !diagFault.value) return

	const localRecord = faultRecords.value.find(
		(item) => (item.productTypeId || item.productType || item.productName) === diagProduct.value && item.faultName === diagFault.value
	)
	diagResult.value = localRecord || null

	try {
		const result = await searchFault({
			productType: diagProduct.value,
			faultTypeId: localRecord ? (localRecord.faultTypeId || localRecord.id || '') : ''
		})
		diagResult.value = result || localRecord || null
	} catch (error) {
		console.warn('fault search fallback:', error)
	}
}

const selectDiagOption = (item) => {
	if (diagOpen.value === 'product') {
		diagProduct.value = item.id
		if (diagFault.value && !(diagFaultMap.value[item.id] || []).includes(diagFault.value)) {
			diagFault.value = ''
			diagResult.value = null
		}
	} else {
		diagFault.value = item.title
		loadFaultResult()
	}
	diagOpen.value = ''
}

const resetDiag = () => {
	diagProduct.value = ''
	diagFault.value = ''
	diagOpen.value = ''
	diagResult.value = null
}

const removeVoucher = (productIndex, voucherIndex) => {
	const product = repairProducts.value[productIndex]
	if (!product || !product.voucherList) return
	
	product.voucherList.splice(voucherIndex, 1)
	product.voucher = product.voucherList.map(v => v.path).join(',')
}

const onDateChange = (productIndex, e) => {
	const product = repairProducts.value[productIndex]
	if (!product) return
	product.buyDate = e.detail.value
}

const previewVoucher = (productIndex, voucherIndex) => {
	const product = repairProducts.value[productIndex]
	const voucher = product && product.voucherList ? product.voucherList[voucherIndex] : null
	if (!voucher) return

	const urls = (product.voucherList || []).map((item) => item.url || item.path).filter(Boolean)
	if (!urls.length) return

	uni.previewImage({
		current: voucher.url || voucher.path,
		urls
	})
}

const openVoucherPicker = (productIndex) => {
	const product = repairProducts.value[productIndex]
	if (!product) return
	
	if (!product.voucherList) {
		product.voucherList = []
	}
	
	if (product.voucherList.length >= 3) {
		uni.showToast({ title: '最多上传3张凭证', icon: 'none' })
		return
	}
	
	uni.chooseImage({
		count: 3 - product.voucherList.length,
		sourceType: ['album', 'camera'],
		sizeType: ['compressed'],
		success: (chooseRes) => {
			const tempFilePaths = chooseRes.tempFilePaths || []
			tempFilePaths.forEach((path) => {
				product.voucherList.push({
					id: `voucher-${Date.now()}-${Math.random()}`,
					path,
					url: path
				})
			})
			product.voucher = product.voucherList.map(v => v.path).join(',')
			uni.showToast({ title: '上传成功', icon: 'success' })
		},
		fail: (error) => {
			console.warn('choose image cancelled:', error)
		}
	})
}

const parseRegion = (region = '') => {
	const parts = String(region).split('/').map((item) => item.trim())
	return {
		province: parts[0] || '',
		city: parts[1] || '',
		district: parts[2] || ''
	}
}

const saveAddress = async () => {
	if (!addressForm.value.name || !addressForm.value.phone || !addressForm.value.detail) {
		uni.showToast({ title: '请完善地址信息', icon: 'none' })
		return
	}

	const region = parseRegion(addressForm.value.region)
	const payload = {
		addressId: addressForm.value.addressId,
		name: addressForm.value.name,
		phone: addressForm.value.phone,
		province: region.province,
		city: region.city,
		district: region.district,
		detail: addressForm.value.detail,
		unit: addressForm.value.unit,
		isDefault: addressForm.value.def ? 1 : 0
	}

	try {
		if (payload.addressId) {
			await updateAddress(payload)
		} else {
			const res = await addAddress(payload)
			addressForm.value.addressId = res && res.addressId ? res.addressId : ''
		}
		uni.showToast({ title: '地址已保存', icon: 'success' })
	} catch (error) {
		console.warn('save address fallback:', error)
		uni.showToast({ title: '地址接口未开放', icon: 'none' })
	}
}

const submitFeedback = async () => {
	if (!feedbackText.value || !feedbackContactValue.value) {
		uni.showToast({ title: '请填写反馈内容和联系方式', icon: 'none' })
		return
	}

	try {
		await addComplaint({
			type: feedbackType.value === '投诉' ? 0 : 1,
			content: feedbackText.value,
			contactType: feedbackContactKind.value,
			contact: feedbackContactValue.value,
			orderId: feedbackOrderId.value
		})
		uni.showToast({ title: '已提交', icon: 'success' })
		feedbackText.value = ''
		feedbackContactValue.value = ''
		feedbackOrderId.value = ''
	} catch (error) {
		console.warn('submit feedback fallback:', error)
		uni.showToast({ title: '投诉建议接口未开放', icon: 'none' })
	}
}

const loginSuccess = async () => {
	try {
		const loginRes = await uni.login({ provider: 'weixin' })
		const res = await wechatLogin({ code: loginRes.code })
		if (res && res.token) uni.setStorageSync('token', res.token)
		logged.value = true
		activeModule.value = ''
		activeTab.value = 'mine'
		uni.showToast({ title: '登录成功', icon: 'success' })
	} catch (error) {
		console.warn('wechat login fallback:', error)
		logged.value = true
		activeModule.value = ''
		activeTab.value = 'mine'
		uni.showToast({ title: '登录接口未开放，已进入体验模式', icon: 'none' })
	}
}

const go = (id) => {
	if (tabRoutes[id]) {
		activeTab.value = id
		activeModule.value = ''
		previousModule.value = ''
		return
	}

	if (moduleMap[id]) {
		openModule(id)
		return
	}

	uni.showToast({ title: '功能已接入当前页面', icon: 'none' })
}

const handleSearch = () => {
	go('guide-query')
}

const goOfficial = () => {
	showOfficial.value = false
	go('company')
}

const loadRemoteContent = async () => {
	const tasks = [
		getWarrantyPolicy()
			.then((doc) => updateDoc('warranty', doc))
			.catch((error) => console.warn('warranty fallback:', error)),
		getFeePolicy()
			.then((doc) => updateDoc('fees', doc))
			.catch((error) => console.warn('fee fallback:', error)),
		getGuide('quick')
			.then((doc) => updateDoc('guide-quick', doc))
			.catch((error) => console.warn('quick guide fallback:', error)),
		getGuide('repair')
			.then((doc) => updateDoc('guide-repair', doc))
			.catch((error) => console.warn('repair guide fallback:', error)),
		getGuide('query')
			.then((doc) => updateDoc('guide-query', doc))
			.catch((error) => console.warn('query guide fallback:', error)),
		getGuide('invoice')
			.then((doc) => updateDoc('guide-invoice', doc))
			.catch((error) => console.warn('invoice guide fallback:', error)),
		getContact()
			.then((data) => applyContact(data))
			.catch((error) => console.warn('contact fallback:', error)),
		getCustomerService()
			.then((data = {}) => {
				customerService.value = {
					...customerService.value,
					...data,
					qrcodeUrl: normalizeQrUrl(data.qrcodeUrl),
					wechat: data.wechat || data.wechatId || customerService.value.wechat
				}
			})
			.catch((error) => console.warn('customer service fallback:', error)),
		getWechat()
			.then((data = {}) => {
				wechatInfo.value = {
					...wechatInfo.value,
					...data,
					qrcodeUrl: normalizeQrUrl(data.qrcodeUrl)
				}
			})
			.catch((error) => console.warn('wechat fallback:', error)),
		getFaultTypes()
			.then((list) => applyFaultTypes(list))
			.catch((error) => console.warn('fault types fallback:', error)),
		getRepairList({ page: 1, size: 30 })
			.then((data = {}) => {
				const list = Array.isArray(data) ? data : data.list
				if (!Array.isArray(list) || !list.length) return
				const normalized = list.map(normalizeOrder).filter((item) => item.id)
				if (!normalized.length) return
				orderList.value = normalized
				trackOrders.value = normalized
			})
			.catch((error) => console.warn('repair list fallback:', error))
	]

	await Promise.allSettled(tasks)
}

onMounted(() => {
	logBoot('onMounted start')
	initModuleSafeArea()
	setTimeout(() => {
		pageBootReady.value = true
		logBoot('full page enabled')
	}, 80)
	setTimeout(() => {
		logBoot('deferred boot start')
		restoreRepairDraft()
		loadRemoteContent()
	}, 220)
})
</script>

<style scoped>
.page-shell {
	position: relative;
	width: 100%;
	min-height: 100vh;
	color: #0F1F3A;
	background: #E8EEFA;
	font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.page-scroll {
	width: 100%;
	min-height: 100vh;
	background: #E8EEFA;
}

.boot-screen {
	min-height: 100vh;
	padding: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background:
		radial-gradient(circle at top, rgba(30, 111, 224, 0.14), transparent 42%),
		linear-gradient(180deg, #EEF4FF 0%, #E8EEFA 100%);
	box-sizing: border-box;
}

.boot-card {
	width: 100%;
	max-width: 560rpx;
	padding: 56rpx 40rpx;
	border-radius: 36rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	background: rgba(255, 255, 255, 0.92);
	box-shadow: 0 20rpx 56rpx rgba(15, 31, 58, 0.08);
	box-sizing: border-box;
}

.boot-logo {
	width: 148rpx;
	height: 148rpx;
}

.boot-title {
	margin-top: 24rpx;
	font-size: 36rpx;
	font-weight: 700;
	line-height: 1.35;
	color: #0F1F3A;
}

.boot-desc {
	margin-top: 14rpx;
	font-size: 26rpx;
	line-height: 1.7;
	text-align: center;
	color: #5A6C8D;
}

.home-body {
	min-height: 100vh;
	padding-bottom: 220rpx;
	background: #E8EEFA;
}

.tap {
	transition-property: opacity, transform;
	transition-duration: 120ms;
}

.tap:active {
	opacity: 0.82;
	transform: scale(0.98);
}

.module-page {
	min-height: 100vh;
	padding-bottom: 48rpx;
	background: #E8EEFA;
	box-sizing: border-box;
}

.module-head {
	position: sticky;
	top: 0;
	z-index: 20;
	min-height: 176rpx;
	padding: 72rpx 28rpx 24rpx;
	display: flex;
	align-items: center;
	gap: 20rpx;
	background: rgba(232, 238, 250, 0.96);
	box-shadow: 0 8rpx 24rpx rgba(15, 31, 58, 0.05);
	box-sizing: border-box;
}

.back-button {
	position: relative;
	width: 64rpx;
	height: 64rpx;
	flex-shrink: 0;
	border-radius: 999rpx;
	background: #FFFFFF;
	box-shadow: 0 4rpx 16rpx rgba(30, 111, 224, 0.08);
}

.back-button::before {
	content: "";
	position: absolute;
	left: 25rpx;
	top: 20rpx;
	width: 18rpx;
	height: 18rpx;
	border-left: 4rpx solid #1E6FE0;
	border-bottom: 4rpx solid #1E6FE0;
	transform: rotate(45deg);
}

.module-title-wrap {
	min-width: 0;
	flex: 1;
	display: flex;
	flex-direction: column;
}

.module-title {
	font-size: 36rpx;
	font-weight: 700;
	line-height: 1.25;
	color: #0F1F3A;
}

.module-subtitle {
	margin-top: 6rpx;
	font-size: 23rpx;
	line-height: 1.4;
	color: #6B7C97;
}

.module-content {
	padding: 28rpx;
	box-sizing: border-box;
}

.notice-card,
.form-card,
.order-list-card,
.survey-card,
.check-card,
.policy-card,
.doc-card,
.contact-page-card {
	margin-bottom: 24rpx;
	padding: 32rpx;
	border-radius: 28rpx;
	background: #FFFFFF;
	box-shadow: 0 2rpx 4rpx rgba(15, 31, 58, 0.04), 0 8rpx 28rpx rgba(30, 111, 224, 0.05);
	box-sizing: border-box;
}

.notice-card {
	background: linear-gradient(135deg, #F3F8FF 0%, #FFFFFF 100%);
	border: 2rpx solid #D7E3FA;
}

.notice-title,
.form-title,
.survey-title,
.check-title,
.policy-title,
.doc-title,
.contact-page-title {
	display: block;
	font-size: 30rpx;
	font-weight: 700;
	line-height: 1.3;
	color: #0F1F3A;
}

.notice-desc,
.auth-desc,
.survey-desc,
.check-desc,
.policy-desc,
.contact-page-desc {
	display: block;
	margin-top: 12rpx;
	font-size: 25rpx;
	line-height: 1.7;
	color: #324563;
}

.form-title-line {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 8rpx;
}

.add-product {
	font-size: 24rpx;
	font-weight: 600;
	color: #1E6FE0;
}

.field-row {
	min-height: 92rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 24rpx;
	border-bottom: 2rpx solid #F1F5FB;
	font-size: 26rpx;
	color: #324563;
}

.field-row input {
	min-width: 0;
	flex: 1;
	text-align: right;
	font-size: 26rpx;
	color: #0F1F3A;
}

.field-value {
	flex: 1;
	text-align: right;
	color: #94A3B8;
	line-height: 1.5;
}

.textarea-box {
	margin-top: 24rpx;
	min-height: 144rpx;
	padding: 24rpx;
	border-radius: 20rpx;
	background: #F3F8FF;
	font-size: 25rpx;
	line-height: 1.6;
	color: #94A3B8;
	box-sizing: border-box;
}

.upload-grid {
	margin-top: 24rpx;
	display: flex;
	gap: 20rpx;
}

.upload-box {
	width: 180rpx;
	height: 150rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 10rpx;
	border: 2rpx dashed #BFD6F7;
	border-radius: 22rpx;
	background: #F8FBFF;
	color: #1E6FE0;
	font-size: 24rpx;
	box-sizing: border-box;
}

.upload-box text:first-child {
	font-size: 44rpx;
	font-weight: 300;
	line-height: 1;
}

.helper-text {
	display: block;
	margin-top: 16rpx;
	font-size: 22rpx;
	line-height: 1.5;
	color: #94A3B8;
}

.module-receiver {
	margin: 0 0 24rpx;
	background: #E2EAF8;
}

.primary-button {
	height: 96rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 999rpx;
	background: linear-gradient(180deg, #2A6CD3 0%, #0A4FB8 100%);
	box-shadow: 0 20rpx 48rpx -20rpx rgba(10, 79, 184, 0.55);
	color: #FFFFFF;
	font-size: 30rpx;
	font-weight: 700;
}

.primary-button.disabled {
	opacity: 0.68;
	pointer-events: none;
}

.status-tabs {
	margin-bottom: 24rpx;
	padding: 8rpx;
	display: flex;
	border-radius: 999rpx;
	background: #D7E3FA;
}

.status-tab {
	flex: 1;
	height: 64rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 999rpx;
	font-size: 24rpx;
	font-weight: 600;
	color: #6B7C97;
}

.status-tab.on {
	background: #FFFFFF;
	color: #1E6FE0;
	box-shadow: 0 4rpx 14rpx rgba(30, 111, 224, 0.12);
}

.order-list-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 25rpx;
	font-weight: 600;
	color: #6B7C97;
}

.order-state {
	padding: 6rpx 16rpx;
	border-radius: 999rpx;
	font-size: 22rpx;
	font-weight: 700;
}

.state-fixing {
	background: #E0F2FE;
	color: #0369A1;
}

.state-shipped {
	background: #DCFCE7;
	color: #047857;
}

.order-device {
	display: block;
	margin-top: 18rpx;
	font-size: 30rpx;
	font-weight: 700;
	line-height: 1.3;
	color: #0F1F3A;
}

.timeline {
	margin-top: 24rpx;
}

.timeline-row {
	position: relative;
	padding: 0 0 28rpx 40rpx;
}

.timeline-row::before {
	content: "";
	position: absolute;
	left: 11rpx;
	top: 22rpx;
	bottom: -2rpx;
	width: 2rpx;
	background: #D7E3FA;
}

.timeline-row:last-child::before {
	display: none;
}

.timeline-dot {
	position: absolute;
	left: 0;
	top: 4rpx;
	width: 24rpx;
	height: 24rpx;
	border: 4rpx solid #C4D1E4;
	border-radius: 999rpx;
	background: #FFFFFF;
	box-sizing: border-box;
}

.timeline-row.done .timeline-dot {
	border-color: #1E6FE0;
	background: #1E6FE0;
}

.timeline-copy {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.timeline-copy text:first-child {
	font-size: 26rpx;
	font-weight: 600;
	color: #0F1F3A;
}

.timeline-copy text:last-child {
	font-size: 22rpx;
	color: #94A3B8;
}

.survey-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	background: linear-gradient(180deg, #FFFFFF 0%, #F3F8FF 100%);
}

.tag-row {
	margin-top: 28rpx;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 16rpx;
}

.tag-row text {
	padding: 8rpx 18rpx;
	border-radius: 999rpx;
	background: #E8F1FE;
	color: #0A4FB8;
	font-size: 23rpx;
	font-weight: 600;
}

.check-card {
	border-left: 6rpx solid #1E6FE0;
}

.policy-card {
	background: #FFFFFF;
}

.policy-card::before {
	content: "";
	display: block;
	width: 52rpx;
	height: 8rpx;
	margin-bottom: 22rpx;
	border-radius: 999rpx;
	background: #1E6FE0;
}

.doc-card {
	padding: 36rpx 32rpx;
}

.doc-step {
	margin-top: 28rpx;
	display: flex;
	align-items: flex-start;
	gap: 18rpx;
	font-size: 27rpx;
	line-height: 1.7;
	color: #324563;
}

.doc-index {
	width: 44rpx;
	height: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border-radius: 999rpx;
	background: #1E6FE0;
	color: #FFFFFF;
	font-size: 24rpx;
	font-weight: 700;
	line-height: 1;
}

.contact-page-card {
	text-align: center;
	background: linear-gradient(135deg, #2A6CD3 0%, #0A4FB8 100%);
	color: #FFFFFF;
}

.contact-page-title,
.contact-page-desc {
	color: #FFFFFF;
}

.contact-page-phone {
	display: block;
	margin-top: 16rpx;
	font-size: 44rpx;
	font-weight: 800;
	letter-spacing: 1rpx;
	color: #FFFFFF;
}

.brand-bar {
	padding: 56rpx 32rpx 28rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20rpx;
	background: #E8EEFA;
	box-sizing: border-box;
}

.brand-left {
	min-width: 0;
	flex: 1;
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.brand-logo {
	width: 104rpx;
	height: 44rpx;
	flex-shrink: 0;
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

.wechat-button {
	width: 68rpx;
	height: 68rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border: 2rpx solid #BFD6F7;
	border-radius: 20rpx;
	background: #FFFFFF;
	box-sizing: border-box;
}

.wechat-glyph {
	position: relative;
	width: 42rpx;
	height: 42rpx;
}

.wechat-glyph::before,
.wechat-glyph::after {
	content: "";
	position: absolute;
	background: #1AAD19;
	border-radius: 50%;
}

.wechat-glyph::before {
	left: 0;
	top: 5rpx;
	width: 30rpx;
	height: 24rpx;
}

.wechat-glyph::after {
	right: 0;
	bottom: 5rpx;
	width: 28rpx;
	height: 22rpx;
}

.wechat-dot {
	position: absolute;
	z-index: 2;
	width: 4rpx;
	height: 4rpx;
	border-radius: 999rpx;
	background: #FFFFFF;
}

.dot-left {
	left: 9rpx;
	top: 15rpx;
}

.dot-right {
	right: 10rpx;
	bottom: 14rpx;
}

.hotline-pill {
	height: 56rpx;
	padding: 0 22rpx;
	display: flex;
	align-items: center;
	gap: 10rpx;
	flex-shrink: 0;
	border-radius: 999rpx;
	background: #D7E3FA;
	color: #1E6FE0;
	font-size: 24rpx;
	font-weight: 600;
	white-space: nowrap;
	box-sizing: border-box;
}

.search-wrap {
	padding: 0 28rpx;
}

.search-box {
	height: 76rpx;
	padding: 0 28rpx;
	display: flex;
	align-items: center;
	gap: 16rpx;
	border-radius: 24rpx;
	background: #FFFFFF;
	box-shadow: 0 2rpx 4rpx rgba(15, 31, 58, 0.03), 0 8rpx 24rpx rgba(30, 111, 224, 0.04);
	box-sizing: border-box;
}

.search-input {
	min-width: 0;
	flex: 1;
	height: 76rpx;
	font-size: 27rpx;
	color: #0F1F3A;
}

.input-placeholder {
	color: #94A3B8;
}

.search-action {
	font-size: 26rpx;
	font-weight: 600;
	color: #1E6FE0;
}

.hero-wrap {
	padding: 28rpx 28rpx 0;
}

.hero-card {
	position: relative;
	height: 280rpx;
	overflow: hidden;
	border-radius: 28rpx;
	background: linear-gradient(120deg, #2C5985 0%, #4A8AB8 50%, #6BB0CC 100%);
	box-shadow: 0 10rpx 30rpx rgba(44, 89, 133, 0.14);
}

.hero-media {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	width: 55%;
}

.hero-image {
	width: 100%;
	height: 100%;
}

.hero-media-mask {
	position: absolute;
	inset: 0;
	background: linear-gradient(90deg, rgba(44, 89, 133, 0.85) 0%, rgba(44, 89, 133, 0.15) 50%, rgba(0, 0, 0, 0.18) 100%);
}

.hero-copy {
	position: relative;
	z-index: 1;
	height: 100%;
	padding: 48rpx 36rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	color: #FFFFFF;
	box-sizing: border-box;
}

.hero-title {
	font-size: 36rpx;
	font-weight: 700;
	line-height: 1.25;
	letter-spacing: 1rpx;
}

.hero-subtitle {
	margin-top: 16rpx;
	font-size: 24rpx;
	line-height: 1.3;
	color: rgba(255, 255, 255, 0.9);
	letter-spacing: 1rpx;
}

.section {
	padding-left: 28rpx;
	padding-right: 28rpx;
	box-sizing: border-box;
}

.section-basic {
	padding-top: 48rpx;
}

.section-query,
.section-guide,
.section-contact {
	padding-top: 44rpx;
}

.section-title {
	display: block;
	padding: 0 4rpx 24rpx;
	font-size: 32rpx;
	font-weight: 700;
	line-height: 1.25;
	color: #0F1F3A;
}

.section-line {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 4rpx 24rpx;
}

.section-line .section-title {
	padding: 0;
}

.section-meta {
	font-size: 23rpx;
	line-height: 1.2;
	color: #94A3B8;
}

.three-grid {
	display: flex;
	align-items: stretch;
	justify-content: space-between;
}

.query-grid {
	display: flex;
	align-items: stretch;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 20rpx 0;
}

.query-grid .service-card {
	width: 337rpx;
	min-height: 172rpx;
	padding: 30rpx 16rpx;
}

.service-card {
	width: 218rpx;
	padding: 36rpx 16rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20rpx;
	border-radius: 28rpx;
	background: #FFFFFF;
	box-shadow: 0 2rpx 4rpx rgba(15, 31, 58, 0.04), 0 8rpx 28rpx rgba(30, 111, 224, 0.05);
	box-sizing: border-box;
}

.service-icon {
	width: 96rpx;
	height: 96rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 999rpx;
}

.service-title {
	font-size: 26rpx;
	font-weight: 500;
	line-height: 1.2;
	color: #0F1F3A;
}

.two-grid {
	display: flex;
	align-items: stretch;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 20rpx 0;
}

.guide-card {
	width: 337rpx;
	min-height: 96rpx;
	padding: 28rpx;
	display: flex;
	align-items: center;
	gap: 20rpx;
	border-radius: 24rpx;
	background: #FFFFFF;
	box-shadow: 0 2rpx 4rpx rgba(15, 31, 58, 0.04), 0 8rpx 24rpx rgba(30, 111, 224, 0.05);
	box-sizing: border-box;
}

.guide-icon {
	width: 68rpx;
	height: 68rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border-radius: 18rpx;
	background: #E8F1FE;
	color: #1E6FE0;
}

.guide-title {
	min-width: 0;
	flex: 1;
	font-size: 27rpx;
	font-weight: 500;
	line-height: 1.25;
	color: #0F1F3A;
}

.chevron {
	position: relative;
	width: 16rpx;
	height: 24rpx;
	flex-shrink: 0;
}

.chevron::before {
	content: "";
	position: absolute;
	top: 4rpx;
	left: 0;
	width: 14rpx;
	height: 14rpx;
	border-top: 3rpx solid #C4D1E4;
	border-right: 3rpx solid #C4D1E4;
	transform: rotate(45deg);
	box-sizing: border-box;
}

.contact-card {
	width: 337rpx;
	min-height: 104rpx;
	padding: 28rpx;
	display: flex;
	align-items: center;
	gap: 20rpx;
	border-radius: 24rpx;
	background: #D7E3FA;
	box-shadow: 0 4rpx 16rpx rgba(30, 111, 224, 0.08);
	box-sizing: border-box;
}

.contact-icon {
	width: 76rpx;
	height: 76rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border-radius: 999rpx;
	background: rgba(255, 255, 255, 0.6);
	color: #1E6FE0;
}

.contact-copy {
	min-width: 0;
	display: flex;
	flex-direction: column;
}

.contact-title {
	font-size: 27rpx;
	font-weight: 700;
	line-height: 1.2;
	color: #0F1F3A;
}

.contact-desc {
	margin-top: 6rpx;
	font-size: 22rpx;
	line-height: 1.2;
	color: #1E6FE0;
}

.receiver-wrap {
	padding: 36rpx 28rpx 0;
}

.receiver-card {
	padding: 32rpx 32rpx 12rpx;
	border-radius: 28rpx;
	background: #E2EAF8;
	box-shadow: 0 4rpx 18rpx rgba(30, 111, 224, 0.08);
	box-sizing: border-box;
}

.receiver-head {
	padding-bottom: 24rpx;
	display: flex;
	align-items: center;
	gap: 16rpx;
	border-bottom: 2rpx solid rgba(30, 111, 224, 0.18);
	font-size: 30rpx;
	font-weight: 700;
	line-height: 1.2;
	color: #0F1F3A;
}

.receiver-row {
	padding: 24rpx 0 20rpx;
	border-bottom: 2rpx dashed rgba(30, 111, 224, 0.12);
}

.receiver-row-last {
	border-bottom: none;
}

.receiver-line {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 16rpx;
}

.receiver-text {
	min-width: 0;
	flex: 1;
	display: flex;
	flex-direction: column;
}

.receiver-label {
	font-size: 23rpx;
	line-height: 1.2;
	color: #6B7C97;
}

.receiver-value {
	margin-top: 6rpx;
	font-size: 27rpx;
	font-weight: 600;
	line-height: 1.5;
	color: #0F1F3A;
}

.copy-button {
	width: 52rpx;
	height: 52rpx;
	margin-top: 4rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.copy-row {
	padding: 28rpx 28rpx 0;
	display: flex;
	align-items: center;
	gap: 24rpx;
}

.copy-all {
	height: 100rpx;
	min-width: 0;
	flex: 1;
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
	box-sizing: border-box;
}

.chat-round {
	width: 100rpx;
	height: 100rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border-radius: 999rpx;
	background: #FFFFFF;
	color: #1E6FE0;
	box-shadow: 0 12rpx 28rpx -8rpx rgba(15, 31, 58, 0.18);
}

.company-body {
	min-height: 100vh;
	padding: 56rpx 28rpx 220rpx;
	background: #E8EEFA;
	box-sizing: border-box;
}

.company-brand {
	margin-bottom: 28rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.company-tools {
	display: flex;
	align-items: center;
	gap: 28rpx;
	color: #324563;
}

.bell-icon {
	position: relative;
	width: 40rpx;
	height: 40rpx;
	border: 4rpx solid currentColor;
	border-bottom: none;
	border-radius: 22rpx 22rpx 8rpx 8rpx;
	box-sizing: border-box;
}

.bell-icon::after {
	content: "";
	position: absolute;
	left: 9rpx;
	bottom: -11rpx;
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

.company-hero-image {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
}

.company-hero-mask {
	position: absolute;
	inset: 0;
	background: linear-gradient(180deg, rgba(15, 46, 102, 0.35) 0%, rgba(15, 31, 58, 0.65) 100%);
}

.company-hero-logo {
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

.company-hero-title-wrap {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 56rpx 36rpx 36rpx;
	background: linear-gradient(180deg, transparent 0%, rgba(15, 31, 58, 0.55) 100%);
}

.company-hero-title {
	font-size: 36rpx;
	font-weight: 700;
	line-height: 1.3;
	color: #FFFFFF;
	letter-spacing: 1.2rpx;
}

.company-desc {
	display: block;
	padding: 28rpx 8rpx 0;
	font-size: 27rpx;
	line-height: 1.7;
	color: #324563;
	letter-spacing: 0.4rpx;
}

.company-section {
	padding-top: 44rpx;
}

.rule-title {
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

.rule-title > view {
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

.auth-head {
	margin-bottom: 16rpx;
	display: flex;
	align-items: center;
	gap: 16rpx;
	font-size: 30rpx;
	font-weight: 700;
	color: #0F1F3A;
}

.cert-icon {
	position: relative;
	width: 44rpx;
	height: 44rpx;
	border: 4rpx solid #1E6FE0;
	border-radius: 999rpx;
	box-sizing: border-box;
}

.cert-icon::before {
	content: "";
	position: absolute;
	left: 10rpx;
	top: 14rpx;
	width: 18rpx;
	height: 10rpx;
	border-left: 4rpx solid #1E6FE0;
	border-bottom: 4rpx solid #1E6FE0;
	transform: rotate(-45deg);
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
	position: relative;
	width: 64rpx;
	height: 64rpx;
	margin-bottom: 20rpx;
	border-radius: 16rpx;
	background: #1E6FE0;
}

.adv-lightning::before {
	content: "";
	position: absolute;
	left: 24rpx;
	top: 10rpx;
	width: 0;
	height: 0;
	border-left: 12rpx solid transparent;
	border-right: 6rpx solid transparent;
	border-bottom: 24rpx solid #FFFFFF;
	transform: skew(-18deg);
}

.adv-lightning::after {
	content: "";
	position: absolute;
	left: 18rpx;
	top: 30rpx;
	width: 0;
	height: 0;
	border-left: 6rpx solid transparent;
	border-right: 12rpx solid transparent;
	border-top: 24rpx solid #FFFFFF;
	transform: skew(-18deg);
}

.adv-microscope::before {
	content: "";
	position: absolute;
	left: 20rpx;
	top: 12rpx;
	width: 20rpx;
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

.device-shape::before,
.device-shape::after {
	content: "";
	position: absolute;
	box-sizing: border-box;
}

.device-0::before {
	left: 8rpx;
	top: 42rpx;
	width: 72rpx;
	height: 12rpx;
	border-radius: 5rpx;
	background: #4A8AB8;
}

.device-0::after {
	left: 66rpx;
	top: 46rpx;
	width: 28rpx;
	height: 4rpx;
	background: #1E6FE0;
	box-shadow: -56rpx 4rpx 0 #0F1F3A, -12rpx 20rpx 0 rgba(107, 176, 204, 0.75);
}

.device-1::before {
	left: 10rpx;
	top: 48rpx;
	width: 76rpx;
	height: 38rpx;
	border-top: 6rpx solid #4A8AB8;
	border-radius: 999rpx 999rpx 0 0;
}

.device-1::after {
	left: 58rpx;
	top: 28rpx;
	width: 16rpx;
	height: 16rpx;
	border-radius: 999rpx;
	background: #1E6FE0;
	box-shadow: -46rpx 48rpx 0 0 #6BB0CC;
}

.device-2::before {
	left: 12rpx;
	top: 16rpx;
	width: 72rpx;
	height: 56rpx;
	border: 4rpx solid #4A8AB8;
	border-radius: 8rpx;
	background: rgba(30, 79, 168, 0.15);
}

.device-2::after {
	left: 36rpx;
	top: 36rpx;
	width: 22rpx;
	height: 22rpx;
	border: 4rpx solid #1E6FE0;
	border-radius: 999rpx;
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

.company-qr {
	width: 208rpx;
	height: 208rpx;
	margin: 0;
	padding: 12rpx;
	background: #FFFFFF;
	box-shadow: 0 8rpx 28rpx rgba(30, 111, 224, 0.18);
}

.company-qr .qr-image {
	width: 100%;
	height: 100%;
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

.plus-icon {
	position: relative;
	width: 36rpx;
	height: 36rpx;
	border: 4rpx solid #FFFFFF;
	border-radius: 999rpx;
	box-sizing: border-box;
}

.plus-icon::before,
.plus-icon::after {
	content: "";
	position: absolute;
	left: 8rpx;
	top: 14rpx;
	width: 12rpx;
	height: 4rpx;
	border-radius: 4rpx;
	background: #FFFFFF;
}

.plus-icon::after {
	transform: rotate(90deg);
}

.mine-body {
	min-height: 100vh;
	padding-bottom: 220rpx;
	background: #E8EEFA;
	box-sizing: border-box;
}

.mine-hero {
	padding: 96rpx 36rpx 156rpx;
	background: linear-gradient(180deg, #1E6FE0 0%, #3A86FF 100%);
	color: #FFFFFF;
	box-sizing: border-box;
}

.profile-row {
	position: relative;
	display: flex;
	align-items: center;
	gap: 28rpx;
	padding-right: 184rpx;
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
	flex-wrap: wrap;
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
	display: inline-flex;
	padding: 3rpx 14rpx;
	border: 2rpx solid rgba(255, 255, 255, 0.3);
	border-radius: 999rpx;
	background: rgba(255, 255, 255, 0.18);
	color: #FFFFFF;
	font-size: 20rpx;
	font-weight: 500;
	box-sizing: border-box;
}

.order-card {
	position: relative;
	z-index: 2;
	margin: -116rpx 28rpx 0;
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

.order-rule {
	padding: 0;
}

.order-more {
	display: flex;
	align-items: center;
	gap: 8rpx;
	font-size: 24rpx;
	color: #6B7C97;
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

.settings-section .rule-title {
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

.menu-icon .glyph {
	width: 40rpx;
	height: 40rpx;
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

.mine-footer {
	padding: 48rpx 28rpx 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	color: #94A3B8;
	font-size: 22rpx;
	line-height: 1.3;
}

.mine-footer image {
	width: 260rpx;
	height: 48rpx;
	margin-bottom: 12rpx;
	opacity: 0.55;
}

.glyph-truck::before {
	left: 4rpx;
	top: 14rpx;
	width: 24rpx;
	height: 18rpx;
	border: 4rpx solid currentColor;
}

.glyph-truck::after {
	left: 28rpx;
	top: 19rpx;
	width: 14rpx;
	height: 13rpx;
	border: 4rpx solid currentColor;
	border-left: none;
}

.glyph-truck .glyph-extra {
	left: 9rpx;
	bottom: 5rpx;
	width: 8rpx;
	height: 8rpx;
	border: 3rpx solid currentColor;
	border-radius: 999rpx;
	box-shadow: 21rpx 0 0 -1rpx #FFFFFF, 21rpx 0 0 2rpx currentColor;
}

.glyph-edit::before {
	left: 6rpx;
	top: 20rpx;
	width: 34rpx;
	height: 7rpx;
	border-radius: 8rpx;
	background: currentColor;
	transform: rotate(-45deg);
}

.glyph-edit::after {
	left: 24rpx;
	top: 5rpx;
	width: 14rpx;
	height: 14rpx;
	border: 4rpx solid currentColor;
	border-radius: 5rpx;
	transform: rotate(45deg);
}

.glyph-box::before {
	left: 6rpx;
	top: 12rpx;
	width: 36rpx;
	height: 26rpx;
	border: 4rpx solid currentColor;
	border-radius: 5rpx;
}

.glyph-box::after {
	left: 8rpx;
	top: 20rpx;
	width: 32rpx;
	height: 4rpx;
	background: currentColor;
	transform: rotate(20deg);
}

.side-tab {
	position: fixed;
	right: 0;
	top: 42%;
	z-index: 25;
	padding: 20rpx 16rpx 20rpx 28rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2rpx;
	border: 2rpx solid rgba(255, 255, 255, 0.25);
	border-right: none;
	border-radius: 28rpx 0 0 28rpx;
	background: linear-gradient(135deg, #3A86FF 0%, #0A4FB8 100%);
	box-shadow: -8rpx 12rpx 32rpx -8rpx rgba(10, 79, 184, 0.4);
	color: #FFFFFF;
	line-height: 1.1;
	letter-spacing: 1.2rpx;
	transform: translateY(-50%);
	box-sizing: border-box;
}

.side-wordmark {
	font-family: Georgia, "Times New Roman", serif;
	font-size: 21rpx;
	font-weight: 800;
	line-height: 1.1;
	letter-spacing: 2.4rpx;
}

.side-text {
	font-size: 19rpx;
	font-weight: 600;
	line-height: 1.1;
	color: rgba(255, 255, 255, 0.95);
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

.tab-item-active {
	color: #1E6FE0;
	font-weight: 600;
}

.modal-mask {
	position: fixed;
	inset: 0;
	z-index: 75;
	padding: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(15, 31, 58, 0.55);
	box-sizing: border-box;
}

.official-modal,
.qr-modal {
	position: relative;
	width: 600rpx;
	border-radius: 36rpx;
	background: #FFFFFF;
	box-sizing: border-box;
}

.official-modal {
	padding: 44rpx 44rpx 36rpx;
}

.qr-modal {
	padding: 48rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
}

.modal-close {
	position: absolute;
	top: 20rpx;
	right: 28rpx;
	z-index: 2;
	font-size: 44rpx;
	font-weight: 300;
	line-height: 1;
	color: #94A3B8;
}

.official-head {
	margin-bottom: 28rpx;
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.official-logo {
	width: 84rpx;
	height: 84rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border-radius: 20rpx;
	background: linear-gradient(135deg, #3A86FF 0%, #0A4FB8 100%);
	color: #FFFFFF;
	font-family: Georgia, serif;
	font-size: 36rpx;
	font-weight: 800;
	letter-spacing: 1rpx;
}

.official-title-wrap {
	min-width: 0;
	display: flex;
	flex-direction: column;
}

.official-title {
	font-size: 28rpx;
	font-weight: 700;
	line-height: 1.25;
	color: #0F1F3A;
}

.official-subtitle {
	margin-top: 4rpx;
	font-size: 22rpx;
	line-height: 1.3;
	color: #94A3B8;
}

.official-tip {
	padding: 28rpx;
	border-radius: 24rpx;
	background: #F3F8FF;
	font-size: 24rpx;
	line-height: 1.7;
	color: #324563;
}

.official-tip-brand {
	font-weight: 700;
	color: #1E6FE0;
}

.official-actions {
	margin-top: 28rpx;
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.modal-btn {
	height: 84rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 999rpx;
	font-size: 26rpx;
	font-weight: 600;
	box-sizing: border-box;
}

.modal-btn-ghost {
	flex: 1;
	border: 2rpx solid #BFD6F7;
	background: #FFFFFF;
	color: #324563;
}

.modal-btn-primary {
	flex: 1.5;
	gap: 10rpx;
	background: linear-gradient(180deg, #3A86FF 0%, #1E6FE0 100%);
	color: #FFFFFF;
	font-weight: 700;
}

.qr-logo {
	width: 300rpx;
	height: 60rpx;
	margin-bottom: 28rpx;
}

.qr-title {
	font-size: 28rpx;
	font-weight: 700;
	line-height: 1.25;
	color: #0F1F3A;
}

.qr-subtitle {
	margin-top: 8rpx;
	font-size: 23rpx;
	line-height: 1.3;
	color: #94A3B8;
}

.qr-image-wrap {
	margin: 32rpx auto;
	padding: 20rpx;
	display: inline-flex;
	border-radius: 24rpx;
	background: #F3F8FF;
	box-sizing: border-box;
}

.qr-image {
	width: 360rpx;
	height: 360rpx;
	border-radius: 12rpx;
}

.qr-action {
	width: 100%;
	height: 84rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 999rpx;
	background: linear-gradient(180deg, #3A86FF 0%, #1E6FE0 100%);
	color: #FFFFFF;
	font-size: 28rpx;
	font-weight: 600;
	box-sizing: border-box;
}

.glyph,
.mini-icon,
.tab-glyph {
	position: relative;
	flex-shrink: 0;
	box-sizing: border-box;
}

.glyph {
	width: 48rpx;
	height: 48rpx;
	color: inherit;
}

.glyph-small {
	width: 26rpx;
	height: 26rpx;
}

.glyph-search-small {
	width: 32rpx;
	height: 32rpx;
	color: #94A3B8;
}

.glyph-guide {
	width: 40rpx;
	height: 40rpx;
}

.glyph-pin-title {
	width: 36rpx;
	height: 36rpx;
	color: #1E6FE0;
}

.glyph::before,
.glyph::after,
.glyph-extra,
.mini-icon::before,
.mini-icon::after,
.tab-glyph::before,
.tab-glyph::after,
.tab-extra {
	content: "";
	position: absolute;
	box-sizing: border-box;
}

.glyph-repair::before {
	left: 7rpx;
	top: 22rpx;
	width: 36rpx;
	height: 8rpx;
	border-radius: 8rpx;
	background: currentColor;
	transform: rotate(-45deg);
}

.glyph-repair::after {
	left: 25rpx;
	top: 5rpx;
	width: 16rpx;
	height: 16rpx;
	border: 4rpx solid currentColor;
	border-radius: 5rpx;
	transform: rotate(45deg);
}

.glyph-repair .glyph-extra {
	left: 7rpx;
	bottom: 5rpx;
	width: 16rpx;
	height: 16rpx;
	border: 4rpx solid currentColor;
	border-radius: 5rpx;
	transform: rotate(45deg);
}

.glyph-track::before {
	left: 6rpx;
	top: 6rpx;
	width: 36rpx;
	height: 36rpx;
	border: 4rpx solid currentColor;
	border-radius: 999rpx;
}

.glyph-track::after {
	left: 22rpx;
	top: 12rpx;
	width: 4rpx;
	height: 16rpx;
	border-radius: 4rpx;
	background: currentColor;
}

.glyph-track .glyph-extra {
	left: 23rpx;
	top: 25rpx;
	width: 14rpx;
	height: 4rpx;
	border-radius: 4rpx;
	background: currentColor;
	transform: rotate(26deg);
	transform-origin: left center;
}

.glyph-gift::before {
	left: 5rpx;
	top: 18rpx;
	width: 38rpx;
	height: 26rpx;
	border: 4rpx solid currentColor;
	border-radius: 5rpx;
}

.glyph-gift::after {
	left: 22rpx;
	top: 18rpx;
	width: 4rpx;
	height: 26rpx;
	background: currentColor;
}

.glyph-gift .glyph-extra {
	left: 5rpx;
	top: 26rpx;
	width: 38rpx;
	height: 4rpx;
	background: currentColor;
}

.glyph-diag::before,
.glyph-invoice::before,
.glyph-book::before {
	left: 10rpx;
	top: 6rpx;
	width: 28rpx;
	height: 36rpx;
	border: 4rpx solid currentColor;
	border-radius: 5rpx;
}

.glyph-diag::after,
.glyph-invoice::after,
.glyph-book::after {
	left: 16rpx;
	top: 20rpx;
	width: 16rpx;
	height: 4rpx;
	border-radius: 4rpx;
	background: currentColor;
	box-shadow: 0 10rpx 0 currentColor;
}

.glyph-diag .glyph-extra,
.glyph-invoice .glyph-extra,
.glyph-book .glyph-extra {
	left: 30rpx;
	top: 7rpx;
	width: 8rpx;
	height: 8rpx;
	border-left: 4rpx solid currentColor;
	border-bottom: 4rpx solid currentColor;
}

.glyph-shield::before {
	left: 8rpx;
	top: 4rpx;
	width: 32rpx;
	height: 40rpx;
	border: 4rpx solid currentColor;
	border-radius: 18rpx 18rpx 12rpx 12rpx;
	transform: perspective(80rpx) rotateX(-8deg);
}

.glyph-shield::after {
	left: 15rpx;
	top: 21rpx;
	width: 18rpx;
	height: 10rpx;
	border-left: 4rpx solid currentColor;
	border-bottom: 4rpx solid currentColor;
	transform: rotate(-45deg);
}

.glyph-money::before {
	left: 6rpx;
	top: 6rpx;
	width: 36rpx;
	height: 36rpx;
	border: 4rpx solid currentColor;
	border-radius: 999rpx;
}

.glyph-money::after {
	content: "¥";
	left: 0;
	top: 7rpx;
	width: 48rpx;
	height: 34rpx;
	font-size: 28rpx;
	font-weight: 700;
	line-height: 34rpx;
	text-align: center;
	color: currentColor;
}

.glyph-search::before {
	left: 5rpx;
	top: 5rpx;
	width: 27rpx;
	height: 27rpx;
	border: 4rpx solid currentColor;
	border-radius: 999rpx;
}

.glyph-search::after {
	left: 29rpx;
	top: 31rpx;
	width: 17rpx;
	height: 4rpx;
	border-radius: 4rpx;
	background: currentColor;
	transform: rotate(45deg);
}

.glyph-phone::before {
	left: 9rpx;
	top: 9rpx;
	width: 30rpx;
	height: 30rpx;
	border-right: 7rpx solid currentColor;
	border-bottom: 7rpx solid currentColor;
	border-radius: 0 0 15rpx 0;
	transform: rotate(45deg);
}

.glyph-phone::after {
	left: 8rpx;
	top: 8rpx;
	width: 13rpx;
	height: 20rpx;
	border-radius: 8rpx;
	background: currentColor;
	transform: rotate(-26deg);
}

.glyph-chat::before {
	left: 5rpx;
	top: 8rpx;
	width: 38rpx;
	height: 28rpx;
	border: 4rpx solid currentColor;
	border-radius: 10rpx;
}

.glyph-chat::after {
	left: 14rpx;
	top: 32rpx;
	width: 12rpx;
	height: 12rpx;
	border-left: 4rpx solid currentColor;
	border-bottom: 4rpx solid currentColor;
	transform: rotate(-45deg);
}

.glyph-chat .glyph-extra {
	left: 15rpx;
	top: 21rpx;
	width: 5rpx;
	height: 5rpx;
	border-radius: 999rpx;
	background: currentColor;
	box-shadow: 9rpx 0 0 currentColor, 18rpx 0 0 currentColor;
}

.glyph-pin::before {
	left: 12rpx;
	top: 5rpx;
	width: 24rpx;
	height: 24rpx;
	border: 4rpx solid currentColor;
	border-radius: 999rpx;
}

.glyph-pin::after {
	left: 16rpx;
	top: 24rpx;
	width: 16rpx;
	height: 16rpx;
	border-right: 4rpx solid currentColor;
	border-bottom: 4rpx solid currentColor;
	transform: rotate(45deg);
}

.glyph-pin .glyph-extra {
	left: 22rpx;
	top: 15rpx;
	width: 5rpx;
	height: 5rpx;
	border-radius: 999rpx;
	background: currentColor;
}

.mini-icon {
	width: 36rpx;
	height: 36rpx;
}

.mini-check::before {
	left: 7rpx;
	top: 8rpx;
	width: 22rpx;
	height: 13rpx;
	border-left: 5rpx solid #10B981;
	border-bottom: 5rpx solid #10B981;
	transform: rotate(-45deg);
}

.mini-check-white::before {
	border-color: #FFFFFF;
}

.mini-copy::before {
	left: 12rpx;
	top: 10rpx;
	width: 20rpx;
	height: 22rpx;
	border: 3rpx solid #6B7C97;
	border-radius: 5rpx;
}

.mini-copy::after {
	left: 5rpx;
	top: 4rpx;
	width: 20rpx;
	height: 22rpx;
	border: 3rpx solid #6B7C97;
	border-radius: 5rpx;
	background: transparent;
}

.mini-external::before {
	left: 8rpx;
	top: 8rpx;
	width: 20rpx;
	height: 4rpx;
	border-radius: 4rpx;
	background: #FFFFFF;
	transform: rotate(-45deg);
}

.mini-external::after {
	right: 6rpx;
	top: 6rpx;
	width: 14rpx;
	height: 14rpx;
	border-top: 4rpx solid #FFFFFF;
	border-right: 4rpx solid #FFFFFF;
}

.tab-glyph {
	width: 48rpx;
	height: 48rpx;
	color: currentColor;
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

.tab-home .tab-extra {
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

.module-page-dialog {
	position: relative;
	overflow: hidden;
	padding-bottom: 0;
}

.module-section-head {
	padding: 36rpx 4rpx 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-sizing: border-box;
}

.module-section-head.single {
	justify-content: flex-start;
}

.module-section-head text:first-child {
	font-size: 30rpx;
	font-weight: 700;
	line-height: 1.25;
	color: #1E6FE0;
}

.module-section-head text:last-child {
	font-size: 23rpx;
	line-height: 1.2;
	color: #94A3B8;
}

.warm-card {
	padding: 24rpx 28rpx;
	border-radius: 16rpx;
	background: #FDE9D9;
	color: #6B4226;
	font-size: 25rpx;
	line-height: 1.7;
	box-sizing: border-box;
}

.warm-strong {
	font-weight: 700;
	color: #E5484D;
}

.repair-module {
	padding-bottom: 168rpx;
}

.repair-product {
	margin-bottom: 20rpx;
}

.repair-product-strip {
	padding: 16rpx 28rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-radius: 20rpx 20rpx 0 0;
	background: #D7E3FA;
	box-sizing: border-box;
}

.repair-product-name {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.repair-product-name text:first-child {
	width: 40rpx;
	height: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 999rpx;
	background: #1E6FE0;
	color: #FFFFFF;
	font-size: 23rpx;
	font-weight: 700;
	line-height: 1;
}

.repair-product-name text:last-child {
	font-size: 26rpx;
	font-weight: 700;
	color: #0A4FB8;
}

.remove-link {
	font-size: 24rpx;
	font-weight: 600;
	color: #E5484D;
}

.repair-form-card,
.select-card,
.timeline-card,
.white-list-card,
.text-card,
.doc-paper,
.step-card,
.feedback-card,
.simple-card,
.success-card,
.product-card,
.order-card-mini,
.switch-card,
.info-line-card,
.engineer-card {
	border-radius: 24rpx;
	background: #FFFFFF;
	box-shadow: 0 2rpx 4rpx rgba(15, 31, 58, 0.04), 0 8rpx 28rpx rgba(30, 111, 224, 0.05);
	box-sizing: border-box;
}

.repair-product .repair-form-card {
	border-radius: 0 0 24rpx 24rpx;
}

.repair-field,
.select-row {
	min-height: 96rpx;
	padding: 0 28rpx;
	display: flex;
	align-items: center;
	gap: 20rpx;
	border-bottom: 2rpx solid #F1F5FB;
	box-sizing: border-box;
}

.repair-field.last,
.select-row:last-child {
	border-bottom: none;
}

.repair-field > text,
.select-row > text:first-child {
	width: 172rpx;
	flex-shrink: 0;
	font-size: 27rpx;
	line-height: 1.3;
	color: #324563;
}

.repair-field input {
	min-width: 0;
	flex: 1;
	height: 72rpx;
	font-size: 27rpx;
	text-align: right;
	color: #0F1F3A;
}

.field-action {
	min-width: 0;
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 12rpx;
}

.field-action-value {
	font-size: 27rpx;
	color: #0F1F3A;
}

.voucher-preview {
	padding: 20rpx 28rpx 28rpx;
	display: flex;
	gap: 16rpx;
	flex-wrap: wrap;
}

.voucher-thumb {
	position: relative;
	width: 120rpx;
	height: 120rpx;
	border-radius: 12rpx;
	overflow: hidden;
	background: #F3F8FF;
}

.voucher-image {
	width: 100%;
	height: 100%;
}

.voucher-remove {
	position: absolute;
	top: 0;
	right: 0;
	width: 40rpx;
	height: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, 0.5);
	color: #FFFFFF;
	font-size: 32rpx;
	font-weight: 700;
	line-height: 1;
}

.date-value {
	min-width: 0;
	flex: 1;
	height: 72rpx;
	font-size: 27rpx;
	text-align: right;
	color: #0F1F3A;
	line-height: 72rpx;
}

.voucher-status {
	min-width: 0;
	flex: 1;
	display: flex;
	justify-content: flex-end;
	align-items: center;
}

.voucher-count {
	font-size: 27rpx;
	color: #1E6FE0;
	font-weight: 600;
}

.voucher-status .placeholder {
	font-size: 27rpx;
	color: #94A3B8;
}

.voucher-upload {
	width: 186rpx;
	height: 120rpx;
	margin-left: auto;
}

.voucher-upload text:first-child {
	font-size: 44rpx;
	line-height: 1;
}

.voucher-upload text:last-child {
	font-size: 22rpx;
	font-weight: 500;
}

.repair-field .placeholder {
	color: #94A3B8;
}

.required-star {
	color: #E5484D;
}

.field-mini,
.field-arrow,
.scan-icon {
	position: relative;
	flex-shrink: 0;
	box-sizing: border-box;
}

.field-arrow {
	width: 16rpx;
	height: 16rpx;
	border-right: 3rpx solid #C4D1E4;
	border-bottom: 3rpx solid #C4D1E4;
	transform: rotate(-45deg);
}

.field-mini {
	width: 36rpx;
	height: 36rpx;
	color: #94A3B8;
}

.field-calendar::before {
	content: "";
	position: absolute;
	left: 3rpx;
	top: 6rpx;
	width: 30rpx;
	height: 26rpx;
	border: 3rpx solid currentColor;
	border-radius: 5rpx;
	box-sizing: border-box;
}

.field-calendar::after {
	content: "";
	position: absolute;
	left: 8rpx;
	top: 14rpx;
	width: 20rpx;
	height: 3rpx;
	background: currentColor;
}

.field-clip::before {
	content: "";
	position: absolute;
	left: 9rpx;
	top: 4rpx;
	width: 18rpx;
	height: 28rpx;
	border: 3rpx solid currentColor;
	border-left-color: transparent;
	border-radius: 12rpx;
	transform: rotate(38deg);
	box-sizing: border-box;
}

.field-pin::before {
	content: "";
	position: absolute;
	left: 8rpx;
	top: 3rpx;
	width: 20rpx;
	height: 20rpx;
	border: 3rpx solid #1E6FE0;
	border-radius: 999rpx;
	box-sizing: border-box;
}

.field-pin::after {
	content: "";
	position: absolute;
	left: 12rpx;
	top: 21rpx;
	width: 12rpx;
	height: 12rpx;
	border-right: 3rpx solid #1E6FE0;
	border-bottom: 3rpx solid #1E6FE0;
	transform: rotate(45deg);
	box-sizing: border-box;
}

.scan-icon {
	width: 40rpx;
	height: 40rpx;
}

.scan-icon::before {
	content: "";
	position: absolute;
	inset: 4rpx;
	border: 3rpx solid #1E6FE0;
	border-radius: 6rpx;
	box-sizing: border-box;
}

.scan-icon::after {
	content: "";
	position: absolute;
	left: 10rpx;
	top: 18rpx;
	width: 20rpx;
	height: 3rpx;
	border-radius: 4rpx;
	background: #1E6FE0;
	box-shadow: 0 8rpx 0 #1E6FE0;
}

.media-area {
	padding: 28rpx;
	box-sizing: border-box;
}

.media-title {
	margin-bottom: 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 26rpx;
	font-weight: 600;
	color: #324563;
}

.media-title text:last-child {
	font-size: 23rpx;
	font-weight: 400;
	color: #94A3B8;
}

.media-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.media-thumb,
.media-add {
	width: 148rpx;
	height: 148rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 16rpx;
	box-sizing: border-box;
}

.media-thumb {
	background: linear-gradient(135deg, #BFD6F7 0%, #1E6FE0 100%);
	color: #FFFFFF;
}

.media-add {
	flex-direction: column;
	gap: 8rpx;
	border: 3rpx dashed #BFD6F7;
	background: #F3F8FF;
	color: #94A3B8;
	font-size: 20rpx;
}

.media-add text:first-child {
	font-size: 44rpx;
	line-height: 1;
}

.dash-add {
	height: 92rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	border: 3rpx dashed #BFD6F7;
	border-radius: 24rpx;
	background: #F3F8FF;
	color: #1E6FE0;
	font-size: 28rpx;
	font-weight: 700;
	box-sizing: border-box;
}

.dash-add text:first-child {
	font-size: 34rpx;
	line-height: 1;
}

.blue-tip {
	margin-bottom: 20rpx;
	padding: 24rpx 28rpx;
	border-radius: 16rpx;
	background: #D7E3FA;
	color: #0A4FB8;
	font-size: 25rpx;
	line-height: 1.7;
	box-sizing: border-box;
}

.radio-row {
	flex: 1;
	display: flex;
	align-items: center;
	gap: 36rpx;
}

.radio-item {
	display: flex;
	align-items: center;
	gap: 12rpx;
	font-size: 26rpx;
	color: #0F1F3A;
}

.radio-item > view {
	width: 28rpx;
	height: 28rpx;
	border: 3rpx solid #C4D1E4;
	border-radius: 999rpx;
	background: #FFFFFF;
	box-sizing: border-box;
}

.radio-item.on > view {
	border: 8rpx solid #1E6FE0;
}

.contact-mini-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.contact-mini-card {
	padding: 28rpx;
	display: flex;
	align-items: center;
	gap: 24rpx;
	border-radius: 24rpx;
	background: #FFFFFF;
	box-shadow: 0 2rpx 4rpx rgba(15, 31, 58, 0.04), 0 8rpx 28rpx rgba(30, 111, 224, 0.05);
	box-sizing: border-box;
}

.contact-mini-icon {
	width: 76rpx;
	height: 76rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border-radius: 20rpx;
	background: #D7E3FA;
	color: #1E6FE0;
}

.contact-mini-icon .glyph {
	width: 40rpx;
	height: 40rpx;
}

.contact-mini-copy {
	min-width: 0;
	flex: 1;
	display: flex;
	flex-direction: column;
}

.contact-mini-copy text:first-child {
	font-size: 28rpx;
	font-weight: 700;
	color: #0F1F3A;
}

.contact-mini-copy text:last-child {
	margin-top: 6rpx;
	font-size: 23rpx;
	color: #6B7C97;
}

.contact-mini-copy .brand-text {
	color: #1E6FE0;
	font-size: 25rpx;
	font-weight: 700;
}

.repair-receiver {
	margin-top: 20rpx;
	background: #FFFFFF;
}

.repair-copy {
	height: 84rpx;
	margin-top: 20rpx;
}

.repair-fab {
	position: fixed;
	right: 36rpx;
	z-index: 18;
	width: 92rpx;
	height: 92rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 4rpx solid #FFFFFF;
	border-radius: 999rpx;
	box-shadow: 0 16rpx 40rpx -12rpx rgba(30, 111, 224, 0.5);
	color: #FFFFFF;
}

.repair-fab-chat {
	bottom: 280rpx;
	background: linear-gradient(180deg, #3A86FF 0%, #1E6FE0 100%);
}

.repair-fab-phone {
	bottom: 168rpx;
	background: #FFFFFF;
	color: #1E6FE0;
	box-shadow: 0 12rpx 28rpx -8rpx rgba(15, 31, 58, 0.2);
}

.repair-bottom-bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 30;
	height: 132rpx;
	padding: 16rpx 28rpx 28rpx;
	display: flex;
	align-items: center;
	gap: 20rpx;
	border-top: 2rpx solid #E4ECF7;
	background: #FFFFFF;
	box-sizing: border-box;
}

.bottom-more {
	width: 116rpx;
	height: 96rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 6rpx;
	border-radius: 16rpx;
	color: #324563;
	font-size: 21rpx;
}

.bottom-more > view {
	width: 36rpx;
	height: 8rpx;
	border-radius: 999rpx;
	background: #324563;
	box-shadow: 0 -12rpx 0 #324563, 0 12rpx 0 #324563;
}

.bottom-submit {
	flex: 1;
	height: 96rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 16rpx;
	background: linear-gradient(180deg, #2A6CD3 0%, #0A4FB8 100%);
	box-shadow: 0 20rpx 48rpx -20rpx rgba(10, 79, 184, 0.55);
	color: #FFFFFF;
	font-size: 30rpx;
	font-weight: 700;
}

.tool-sheet-mask {
	position: fixed;
	inset: 0;
	z-index: 70;
	background: rgba(15, 31, 58, 0.45);
}

.repair-tool-sheet {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 80;
	padding: 18rpx 28rpx 42rpx;
	border-radius: 36rpx 36rpx 0 0;
	background: #F7FAFF;
	box-shadow: 0 -16rpx 44rpx rgba(15, 31, 58, 0.16);
	box-sizing: border-box;
}

.repair-tool-grabber {
	width: 72rpx;
	height: 8rpx;
	margin: 0 auto 24rpx;
	border-radius: 999rpx;
	background: #C4D1E4;
}

.repair-tool-head {
	margin-bottom: 20rpx;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.repair-tool-head text:first-child {
	font-size: 32rpx;
	font-weight: 800;
	color: #0F1F3A;
}

.repair-tool-head text:last-child {
	font-size: 24rpx;
	color: #6B7C97;
}

.repair-tool-list {
	overflow: hidden;
	border-radius: 24rpx;
	background: #FFFFFF;
	box-shadow: 0 2rpx 4rpx rgba(15, 31, 58, 0.04), 0 8rpx 28rpx rgba(30, 111, 224, 0.05);
}

.repair-tool-row {
	min-height: 116rpx;
	padding: 24rpx;
	display: flex;
	align-items: center;
	gap: 22rpx;
	border-bottom: 2rpx solid #F1F5FB;
	box-sizing: border-box;
}

.repair-tool-row:last-child {
	border-bottom: none;
}

.repair-tool-icon {
	width: 64rpx;
	height: 64rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border-radius: 20rpx;
	font-size: 34rpx;
	font-weight: 800;
	box-sizing: border-box;
}

.tool-save {
	background: #E8F1FE;
	color: #1E6FE0;
}

.tool-clear {
	background: #FEE2E2;
	color: #E5484D;
}

.repair-tool-row > view:last-child {
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.repair-tool-row > view:last-child text:first-child {
	font-size: 28rpx;
	font-weight: 800;
	color: #0F1F3A;
}

.repair-tool-row > view:last-child text:last-child {
	font-size: 23rpx;
	line-height: 1.5;
	color: #6B7C97;
}

.repair-tool-row.danger > view:last-child text:first-child {
	color: #E5484D;
}

.repair-tool-cancel {
	height: 88rpx;
	margin-top: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 22rpx;
	background: #FFFFFF;
	color: #324563;
	font-size: 28rpx;
	font-weight: 700;
	box-shadow: 0 2rpx 4rpx rgba(15, 31, 58, 0.04);
}

.success-module {
	padding-top: 60rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
}

.success-icon {
	width: 160rpx;
	height: 160rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 999rpx;
	background: linear-gradient(135deg, #3A86FF 0%, #1E6FE0 100%);
	box-shadow: 0 24rpx 56rpx -16rpx rgba(30, 111, 224, 0.5);
}

.success-icon .mini-icon {
	transform: scale(1.8);
}

.success-title {
	margin-top: 36rpx;
	font-size: 40rpx;
	font-weight: 700;
	color: #0F1F3A;
}

.success-desc {
	margin-top: 16rpx;
	font-size: 26rpx;
	line-height: 1.7;
	color: #6B7C97;
}

.success-card {
	width: 100%;
	margin-top: 48rpx;
	padding: 32rpx;
	text-align: left;
}

.success-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 22rpx;
	color: #94A3B8;
}

.copy-link {
	color: #1E6FE0;
}

.success-no {
	display: block;
	margin-top: 8rpx;
	font-size: 32rpx;
	font-weight: 700;
	color: #0F1F3A;
	letter-spacing: 1rpx;
}

.success-grid {
	margin-top: 28rpx;
	padding-top: 28rpx;
	display: flex;
	gap: 24rpx;
	border-top: 2rpx solid #F1F5FB;
}

.success-grid view {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 6rpx;
}

.success-grid text:first-child {
	font-size: 22rpx;
	color: #94A3B8;
}

.success-grid text:last-child {
	font-size: 26rpx;
	font-weight: 700;
	color: #0F1F3A;
}

.dual-actions {
	width: 100%;
	margin-top: 40rpx;
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.dual-actions .primary-button,
.dual-actions .ghost-button {
	flex: 1;
}

.ghost-button {
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 2rpx solid #BFD6F7;
	border-radius: 999rpx;
	background: #FFFFFF;
	color: #1E6FE0;
	font-size: 28rpx;
	font-weight: 700;
	box-sizing: border-box;
}

.track-module {
	padding-bottom: 48rpx;
}

.track-search-wrap {
	padding: 24rpx 28rpx;
	background: #FFFFFF;
	box-sizing: border-box;
}

.track-search {
	height: 76rpx;
	padding: 0 28rpx;
	display: flex;
	align-items: center;
	gap: 16rpx;
	border-radius: 999rpx;
	background: #F3F8FF;
	box-sizing: border-box;
}

.track-search input {
	min-width: 0;
	flex: 1;
	height: 76rpx;
	font-size: 26rpx;
	color: #0F1F3A;
}

.progress-tabs-line {
	padding: 16rpx 28rpx 0;
	display: flex;
	gap: 36rpx;
	border-bottom: 2rpx solid #F1F5FB;
	background: #FFFFFF;
	box-sizing: border-box;
}

.progress-tab {
	position: relative;
	padding: 16rpx 0 20rpx;
	font-size: 26rpx;
	color: #6B7C97;
}

.progress-tab.on {
	font-weight: 700;
	color: #1E6FE0;
}

.progress-tab.on::after {
	content: "";
	position: absolute;
	left: 50%;
	bottom: 0;
	width: 36rpx;
	height: 4rpx;
	border-radius: 999rpx;
	background: #1E6FE0;
	transform: translateX(-50%);
}

.module-list {
	padding: 28rpx;
}

.track-card {
	margin-bottom: 20rpx;
	overflow: hidden;
	border-radius: 28rpx;
	background: #FFFFFF;
	box-shadow: 0 2rpx 4rpx rgba(15, 31, 58, 0.04), 0 8rpx 28rpx rgba(30, 111, 224, 0.05);
}

.track-card-head {
	padding: 28rpx 28rpx 0;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 20rpx;
}

.muted-line {
	display: block;
	font-size: 22rpx;
	line-height: 1.3;
	color: #94A3B8;
}

.track-model {
	display: block;
	margin-top: 8rpx;
	font-size: 28rpx;
	font-weight: 700;
	line-height: 1.35;
	color: #0F1F3A;
}

.tag {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 6rpx 16rpx;
	border-radius: 999rpx;
	font-size: 22rpx;
	font-weight: 700;
	line-height: 1.2;
	white-space: nowrap;
}

.tag-warn {
	background: #FEF3C7;
	color: #92400E;
}

.tag-ok {
	background: #DCFCE7;
	color: #047857;
}

.tag-info {
	background: #DBEAFE;
	color: #1D4ED8;
}

.tag-muted {
	background: #EEF2F8;
	color: #6B7C97;
}

.tag-muted-light {
	background: rgba(255, 255, 255, 0.22);
	color: #FFFFFF;
}

.progress-steps {
	padding: 28rpx;
	display: flex;
	align-items: flex-start;
}

.progress-step {
	position: relative;
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
}

.progress-step::after {
	content: "";
	position: absolute;
	left: 50%;
	right: -50%;
	top: 13rpx;
	height: 3rpx;
	background: #E4ECF7;
	z-index: 0;
}

.progress-step:last-child::after {
	display: none;
}

.progress-step > view {
	position: relative;
	z-index: 1;
	width: 28rpx;
	height: 28rpx;
	border-radius: 999rpx;
	background: #E4ECF7;
	box-sizing: border-box;
}

.progress-step.reached::after,
.progress-step.reached > view {
	background: #1E6FE0;
}

.progress-step.reached > view {
	box-shadow: 0 0 0 8rpx rgba(30, 111, 224, 0.12);
}

.progress-step text {
	font-size: 20rpx;
	color: #94A3B8;
}

.progress-step.reached text {
	color: #1E6FE0;
}

.track-card-foot {
	padding: 20rpx 28rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-top: 2rpx solid #F1F5FB;
	font-size: 23rpx;
	color: #6B7C97;
}

.track-card-foot text:last-child {
	font-weight: 700;
	color: #1E6FE0;
}

.package-module {
	padding-bottom: 80rpx;
}

.package-hero {
	padding: 34rpx;
	display: flex;
	align-items: center;
	gap: 24rpx;
	border-radius: 30rpx;
	background: linear-gradient(135deg, #0F766E 0%, #2DD4BF 100%);
	box-shadow: 0 22rpx 50rpx -24rpx rgba(15, 118, 110, 0.62);
	color: #FFFFFF;
	box-sizing: border-box;
}

.package-hero-icon {
	width: 96rpx;
	height: 96rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border-radius: 28rpx;
	background: rgba(255, 255, 255, 0.18);
}

.package-hero > view:last-child {
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.package-hero > view:last-child text:first-child {
	font-size: 34rpx;
	font-weight: 800;
	line-height: 1.25;
}

.package-hero > view:last-child text:last-child {
	font-size: 24rpx;
	line-height: 1.6;
	color: rgba(255, 255, 255, 0.86);
}

.package-tip {
	margin-top: 24rpx;
	background: #E7F8F4;
	color: #0F766E;
}

.package-result-card {
	margin-top: 28rpx;
	padding: 30rpx;
	border-radius: 28rpx;
	background: #FFFFFF;
	box-shadow: 0 2rpx 4rpx rgba(15, 31, 58, 0.04), 0 8rpx 28rpx rgba(30, 111, 224, 0.05);
	box-sizing: border-box;
}

.package-result-head {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 20rpx;
}

.package-no {
	display: block;
	margin-top: 8rpx;
	font-size: 32rpx;
	font-weight: 800;
	line-height: 1.3;
	color: #0F1F3A;
}

.package-result-grid {
	margin-top: 28rpx;
	padding: 24rpx;
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 24rpx;
	border-radius: 22rpx;
	background: #F3F8FF;
	box-sizing: border-box;
}

.package-result-grid view {
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.package-result-grid text:first-child {
	font-size: 22rpx;
	color: #94A3B8;
}

.package-result-grid text:last-child {
	font-size: 25rpx;
	font-weight: 700;
	color: #0F1F3A;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.package-progress {
	padding: 30rpx 0 20rpx;
	display: flex;
	align-items: flex-start;
}

.package-timeline-title {
	margin-top: 8rpx;
}

.package-timeline {
	padding-top: 4rpx;
}

.package-empty {
	margin-top: 28rpx;
	border-radius: 24rpx;
	background: #FFFFFF;
}

.detail-hero {
	padding: 36rpx;
	border-radius: 28rpx;
	background: linear-gradient(135deg, #1E6FE0 0%, #3A86FF 100%);
	color: #FFFFFF;
	box-shadow: 0 20rpx 48rpx -18rpx rgba(30, 111, 224, 0.55);
	box-sizing: border-box;
}

.detail-hero-top,
.detail-hero-grid {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.detail-hero-top {
	font-size: 22rpx;
	color: rgba(255, 255, 255, 0.85);
}

.detail-order-no {
	display: block;
	margin-top: 8rpx;
	font-size: 32rpx;
	font-weight: 800;
	letter-spacing: 1rpx;
}

.detail-hero-grid {
	margin-top: 28rpx;
	padding-top: 28rpx;
	gap: 28rpx;
	border-top: 2rpx solid rgba(255, 255, 255, 0.2);
}

.detail-hero-grid view {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 6rpx;
}

.detail-hero-grid text:first-child {
	font-size: 22rpx;
	color: rgba(255, 255, 255, 0.75);
}

.detail-hero-grid text:last-child {
	font-size: 26rpx;
	font-weight: 700;
}

.timeline-card {
	padding: 32rpx;
}

.detail-timeline-row {
	display: flex;
	gap: 24rpx;
}

.detail-timeline-pin {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.detail-timeline-pin view:first-child {
	width: 20rpx;
	height: 20rpx;
	margin-top: 12rpx;
	border-radius: 999rpx;
	background: #1E6FE0;
	box-shadow: 0 0 0 8rpx #E8F1FE;
	box-sizing: border-box;
}

.detail-timeline-pin.pending view:first-child {
	border: 4rpx solid #1E6FE0;
	background: #FFFFFF;
	box-shadow: none;
}

.detail-timeline-pin view:last-child {
	flex: 1;
	width: 3rpx;
	margin-top: 8rpx;
	background: #E4ECF7;
}

.detail-timeline-copy {
	flex: 1;
	padding-bottom: 32rpx;
}

.detail-timeline-copy > view {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16rpx;
}

.detail-timeline-copy > view text:first-child {
	font-size: 28rpx;
	font-weight: 700;
	color: #0F1F3A;
}

.detail-timeline-copy > view text:first-child.muted {
	color: #94A3B8;
}

.detail-timeline-copy > view text:last-child,
.detail-timeline-copy > text {
	font-size: 22rpx;
	color: #94A3B8;
}

.detail-timeline-copy > text {
	display: block;
	margin-top: 8rpx;
	line-height: 1.6;
	color: #6B7C97;
}

.info-line-card,
.engineer-card {
	padding: 28rpx;
	display: flex;
	align-items: center;
	gap: 24rpx;
}

.info-line-icon,
.engineer-avatar,
.circle-action {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.info-line-icon {
	width: 84rpx;
	height: 84rpx;
	border-radius: 24rpx;
	color: #D97706;
}

.invoice-bg {
	background: #FFF7E6;
}

.info-line-copy {
	min-width: 0;
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 6rpx;
}

.info-line-copy text:first-child {
	font-size: 28rpx;
	font-weight: 700;
	color: #0F1F3A;
}

.info-line-copy text:last-child {
	font-size: 23rpx;
	line-height: 1.4;
	color: #6B7C97;
}

.engineer-avatar {
	width: 88rpx;
	height: 88rpx;
	border-radius: 999rpx;
	background: linear-gradient(135deg, #BFD6F7 0%, #1E6FE0 100%);
	color: #FFFFFF;
	font-size: 32rpx;
	font-weight: 800;
}

.circle-action {
	width: 64rpx;
	height: 64rpx;
	border: 2rpx solid #BFD6F7;
	border-radius: 999rpx;
	background: #FFFFFF;
	color: #1E6FE0;
}

.circle-action.primary {
	border-color: transparent;
	background: #1E6FE0;
	color: #FFFFFF;
}

.survey-module {
	position: relative;
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40rpx 32rpx;
	background: rgba(232, 238, 250, 0.65);
	box-sizing: border-box;
}

.survey-mask {
	position: absolute;
	inset: 0;
	background: rgba(15, 31, 58, 0.45);
}

.survey-modal-card {
	position: relative;
	z-index: 2;
	width: 100%;
	padding: 44rpx 44rpx 36rpx;
	border-radius: 36rpx;
	background: #FFFFFF;
	box-shadow: 0 48rpx 120rpx -24rpx rgba(15, 31, 58, 0.4);
	text-align: center;
	box-sizing: border-box;
}

.survey-poster-card {
	max-height: calc(100vh - 80rpx);
	padding: 36rpx 28rpx 32rpx;
	overflow-y: auto;
}

.survey-close {
	position: absolute;
	top: 18rpx;
	right: 22rpx;
	color: #94A3B8;
	font-size: 36rpx;
	line-height: 1;
}

.survey-ribbon {
	margin: 0 auto;
	padding: 8rpx 24rpx;
	display: inline-flex;
	align-items: center;
	gap: 10rpx;
	border-radius: 999rpx;
	background: #FFF7E6;
	color: #A16207;
	font-size: 22rpx;
	font-weight: 700;
}

.survey-ribbon .glyph {
	width: 28rpx;
	height: 28rpx;
}

.survey-poster-wrap {
	width: 100%;
	margin-top: 24rpx;
	overflow: hidden;
	border: 2rpx solid #E4ECF7;
	border-radius: 24rpx;
	background: #FFFFFF;
	box-shadow: 0 16rpx 44rpx -24rpx rgba(15, 31, 58, 0.22);
}

.survey-poster {
	width: 100%;
	display: block;
}

.survey-poster-tip {
	display: block;
	margin-top: 18rpx;
	font-size: 22rpx;
	line-height: 1.5;
	color: #94A3B8;
}

.survey-title {
	display: block;
	margin-top: 24rpx;
	font-size: 36rpx;
	font-weight: 800;
	color: #0F1F3A;
}

.survey-desc {
	display: block;
	margin-top: 12rpx;
	font-size: 25rpx;
	line-height: 1.7;
	color: #6B7C97;
}

.survey-qr-wrap {
	width: 320rpx;
	height: 320rpx;
	margin: 36rpx auto 12rpx;
	padding: 20rpx;
	border: 2rpx solid #E4ECF7;
	border-radius: 28rpx;
	background: #FFFFFF;
	box-shadow: 0 16rpx 44rpx -20rpx rgba(15, 31, 58, 0.18);
	box-sizing: border-box;
}

.survey-qr {
	width: 100%;
	height: 100%;
	border-radius: 12rpx;
}

.survey-wx {
	display: block;
	font-size: 23rpx;
	color: #94A3B8;
}

.survey-actions {
	margin-top: 36rpx;
	display: flex;
	gap: 20rpx;
}

.survey-primary {
	flex: 1;
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 999rpx;
	font-size: 27rpx;
	font-weight: 700;
}

.survey-primary {
	background: linear-gradient(180deg, #2A6CD3 0%, #0A4FB8 100%);
	box-shadow: 0 20rpx 44rpx -20rpx rgba(10, 79, 184, 0.55);
	color: #FFFFFF;
}

.survey-secondary {
	flex: 1;
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 999rpx;
	font-size: 27rpx;
	font-weight: 700;
	background: #F3F8FF;
	border: 2rpx solid #D7E3FA;
	color: #1E6FE0;
}

.diag-hero-card {
	padding: 28rpx;
	display: flex;
	align-items: center;
	gap: 24rpx;
	border: 2rpx solid #BFD6F7;
	border-radius: 28rpx;
	background: linear-gradient(135deg, #F3F8FF 0%, #E8F1FE 100%);
	box-sizing: border-box;
}

.diag-icon {
	width: 84rpx;
	height: 84rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border-radius: 24rpx;
	background: #FFFFFF;
	color: #1E6FE0;
}

.diag-hero-card > view:last-child {
	display: flex;
	flex-direction: column;
	gap: 6rpx;
}

.diag-hero-card > view:last-child text:first-child {
	font-size: 28rpx;
	font-weight: 700;
	color: #0F1F3A;
}

.diag-hero-card > view:last-child text:last-child {
	font-size: 23rpx;
	line-height: 1.6;
	color: #6B7C97;
}

.select-row > text:nth-child(2) {
	min-width: 0;
	flex: 1;
	text-align: right;
	font-size: 27rpx;
	color: #0F1F3A;
}

.select-row > text.placeholder,
.select-row.disabled > text:nth-child(2) {
	color: #94A3B8;
}

.select-row.disabled {
	opacity: 0.55;
}

.diag-check-card {
	margin-bottom: 20rpx;
	padding: 28rpx 32rpx;
	border-radius: 24rpx;
	background: #FFFFFF;
	box-shadow: 0 2rpx 4rpx rgba(15, 31, 58, 0.04), 0 8rpx 28rpx rgba(30, 111, 224, 0.05);
	box-sizing: border-box;
}

.diag-check-head {
	padding-bottom: 20rpx;
	display: flex;
	align-items: center;
	gap: 16rpx;
	border-bottom: 2rpx solid #F1F5FB;
}

.diag-check-head view {
	width: 12rpx;
	height: 12rpx;
	border-radius: 999rpx;
}

.diag-check-head text {
	font-size: 27rpx;
	font-weight: 700;
	color: #0F1F3A;
}

.diag-check-row {
	padding-top: 20rpx;
	display: flex;
	align-items: flex-start;
	gap: 18rpx;
	font-size: 26rpx;
	line-height: 1.6;
	color: #324563;
}

.diag-check-row text:first-child {
	width: 36rpx;
	height: 36rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border-radius: 999rpx;
	background: #E8F1FE;
	color: #1E6FE0;
	font-size: 22rpx;
	font-weight: 700;
}

.empty-hint {
	padding: 80rpx 60rpx;
	text-align: center;
	font-size: 26rpx;
	line-height: 1.7;
	color: #94A3B8;
}

.sheet-mask {
	position: fixed;
	inset: 0;
	z-index: 45;
	background: rgba(15, 31, 58, 0.45);
}

.choice-sheet {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 50;
	max-height: 70vh;
	overflow-y: auto;
	border-radius: 32rpx 32rpx 0 0;
	background: #FFFFFF;
	box-sizing: border-box;
}

.choice-head {
	padding: 28rpx 32rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 2rpx solid #F1F5FB;
}

.choice-head text:first-child,
.choice-head text:last-child {
	width: 72rpx;
	font-size: 26rpx;
	color: #94A3B8;
}

.choice-head text:nth-child(2) {
	font-size: 30rpx;
	font-weight: 700;
	color: #0F1F3A;
}

.choice-row {
	min-height: 96rpx;
	padding: 0 32rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 2rpx solid #F1F5FB;
	font-size: 28rpx;
	color: #0F1F3A;
	box-sizing: border-box;
}

.warranty-hero,
.doc-hero {
	padding: 36rpx;
	border-radius: 28rpx;
	background: linear-gradient(180deg, #1E6FE0 0%, #3A86FF 100%);
	color: #FFFFFF;
	box-shadow: 0 20rpx 48rpx -18rpx rgba(30, 111, 224, 0.55);
	box-sizing: border-box;
}

.warranty-hero {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.warranty-hero .glyph,
.doc-hero .glyph {
	width: 72rpx;
	height: 72rpx;
	color: #FFFFFF;
}

.warranty-hero text:nth-child(2),
.doc-hero > text:first-child,
.doc-hero > text:nth-child(2),
.doc-hero > view text:first-child {
	margin-top: 12rpx;
	font-size: 40rpx;
	font-weight: 800;
	color: #FFFFFF;
}

.warranty-hero text:last-child,
.doc-hero > text:last-child,
.doc-hero > view text:last-child {
	margin-top: 12rpx;
	font-size: 24rpx;
	line-height: 1.6;
	color: rgba(255, 255, 255, 0.88);
}

.doc-hero {
	display: flex;
	align-items: center;
	gap: 24rpx;
	margin-bottom: 24rpx;
}

.doc-hero > view {
	min-width: 0;
	display: flex;
	flex-direction: column;
}

.fees-hero {
	margin-bottom: 24rpx;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.white-list-card,
.text-card,
.doc-paper,
.step-card {
	overflow: hidden;
}

.list-row {
	min-height: 92rpx;
	padding: 0 28rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20rpx;
	border-bottom: 2rpx solid #F1F5FB;
	box-sizing: border-box;
}

.list-row:last-child {
	border-bottom: none;
}

.list-row text:first-child {
	font-size: 28rpx;
	font-weight: 600;
	color: #0F1F3A;
}

.list-row text:last-child {
	font-size: 24rpx;
	font-weight: 600;
	color: #0A4FB8;
	text-align: right;
}

.text-card {
	padding: 24rpx 28rpx;
}

.number-line {
	padding: 12rpx 0;
	display: flex;
	align-items: flex-start;
	gap: 20rpx;
	font-size: 26rpx;
	line-height: 1.7;
	color: #324563;
}

.number-line text:first-child {
	width: 36rpx;
	height: 36rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border-radius: 999rpx;
	background: #E8F1FE;
	color: #1E6FE0;
	font-size: 22rpx;
	font-weight: 700;
}

.service-line {
	padding: 28rpx;
	display: flex;
	align-items: center;
	gap: 24rpx;
	border-bottom: 2rpx solid #F1F5FB;
}

.service-line:last-child {
	border-bottom: none;
}

.service-line-icon {
	width: 72rpx;
	height: 72rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border-radius: 20rpx;
	background: #E8F1FE;
	color: #1E6FE0;
}

.service-line > view:last-child {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.service-line > view:last-child text:first-child {
	font-size: 27rpx;
	font-weight: 700;
	color: #0F1F3A;
}

.service-line > view:last-child text:last-child {
	font-size: 23rpx;
	color: #6B7C97;
}

.doc-paper {
	padding: 32rpx;
}

.warranty-paper {
	margin-top: 32rpx;
}

.paper-title {
	display: block;
	padding: 24rpx 0 32rpx;
	border-bottom: 4rpx solid #1E6FE0;
	text-align: center;
	font-size: 34rpx;
	font-weight: 800;
	color: #0F1F3A;
}

.paper-section {
	padding: 28rpx 0;
	border-bottom: 2rpx solid #F1F5FB;
}

.paper-section:last-child {
	border-bottom: none;
	padding-bottom: 0;
}

.paper-section-title {
	display: block;
	margin-bottom: 20rpx;
	font-size: 29rpx;
	font-weight: 700;
	color: #0F1F3A;
}

.paper-line {
	padding: 8rpx 0 8rpx 20rpx;
	display: flex;
	align-items: flex-start;
	gap: 14rpx;
	font-size: 26rpx;
	line-height: 1.8;
	color: #324563;
}

.paper-line text:first-child {
	flex-shrink: 0;
	font-weight: 700;
	color: #1E6FE0;
}

.step-card {
	margin-top: 24rpx;
}

.guide-step-row {
	padding: 32rpx;
	display: flex;
	align-items: flex-start;
	gap: 28rpx;
	border-bottom: 2rpx solid #F1F5FB;
}

.guide-step-row:last-child {
	border-bottom: none;
}

.guide-step-row > text {
	width: 56rpx;
	height: 56rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border-radius: 18rpx;
	background: linear-gradient(135deg, #3A86FF 0%, #1E6FE0 100%);
	box-shadow: 0 8rpx 20rpx -4rpx rgba(30, 111, 224, 0.35);
	color: #FFFFFF;
	font-size: 26rpx;
	font-weight: 800;
}

.guide-step-row > view {
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}

.guide-step-row > view text:first-child {
	font-size: 29rpx;
	font-weight: 700;
	color: #0F1F3A;
}

.guide-step-row > view text:last-child {
	font-size: 25rpx;
	line-height: 1.6;
	color: #6B7C97;
}

.doc-actions {
	margin-bottom: 72rpx;
}

.online-card {
	padding: 36rpx;
	display: flex;
	align-items: center;
	gap: 24rpx;
	border-radius: 28rpx;
	background: linear-gradient(135deg, #1E6FE0 0%, #3A86FF 100%);
	color: #FFFFFF;
	box-shadow: 0 20rpx 48rpx -18rpx rgba(30, 111, 224, 0.55);
	box-sizing: border-box;
}

.online-icon {
	width: 88rpx;
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border-radius: 24rpx;
	background: rgba(255, 255, 255, 0.18);
}

.online-copy {
	min-width: 0;
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 6rpx;
}

.online-copy text:first-child {
	font-size: 30rpx;
	font-weight: 800;
}

.online-copy text:last-child {
	font-size: 23rpx;
	color: rgba(255, 255, 255, 0.85);
}

.soft-button {
	height: 64rpx;
	padding: 0 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 999rpx;
	background: #FFFFFF;
	color: #0A4FB8;
	font-size: 24rpx;
	font-weight: 700;
}

.hotline-grid {
	display: flex;
	gap: 20rpx;
}

.hotline-card {
	min-width: 0;
	flex: 1;
	padding: 28rpx;
	border-radius: 24rpx;
	background: #FFFFFF;
	box-shadow: 0 2rpx 4rpx rgba(15, 31, 58, 0.04), 0 8rpx 28rpx rgba(30, 111, 224, 0.05);
	box-sizing: border-box;
}

.hotline-card > view:first-child {
	display: flex;
	align-items: center;
	gap: 12rpx;
	color: #1E6FE0;
}

.hotline-card > view:first-child .glyph {
	width: 36rpx;
	height: 36rpx;
}

.hotline-card > view:first-child text {
	font-size: 25rpx;
	font-weight: 700;
	color: #0F1F3A;
}

.hotline-card > text:nth-child(2) {
	display: block;
	margin-top: 16rpx;
	font-size: 30rpx;
	font-weight: 800;
	color: #1E6FE0;
}

.hotline-card > text:nth-child(3) {
	display: block;
	margin-top: 6rpx;
	font-size: 21rpx;
	color: #94A3B8;
}

.small-primary {
	height: 64rpx;
	margin-top: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 999rpx;
	background: linear-gradient(180deg, #3A86FF 0%, #1E6FE0 100%);
	color: #FFFFFF;
	font-size: 25rpx;
	font-weight: 700;
}

.address-card {
	padding: 32rpx;
	display: flex;
	align-items: flex-start;
	gap: 20rpx;
	border-radius: 24rpx;
	background: #FFFFFF;
	box-shadow: 0 2rpx 4rpx rgba(15, 31, 58, 0.04), 0 8rpx 28rpx rgba(30, 111, 224, 0.05);
	box-sizing: border-box;
}

.address-card > .glyph {
	width: 44rpx;
	height: 44rpx;
	color: #DC2626;
}

.address-copy {
	min-width: 0;
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}

.address-copy text:first-child {
	font-size: 27rpx;
	font-weight: 700;
	color: #0F1F3A;
}

.address-copy text:not(:first-child) {
	font-size: 24rpx;
	line-height: 1.5;
	color: #6B7C97;
}

.address-actions {
	margin-top: 20rpx;
	display: flex;
	gap: 16rpx;
}

.address-actions .ghost-button,
.address-actions .primary-button {
	flex: 1;
	height: 72rpx;
	font-size: 25rpx;
}

.orders-tabs {
	padding-top: 0;
	gap: 30rpx;
}

.order-card-mini {
	margin-bottom: 20rpx;
	padding: 28rpx;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 20rpx;
}

.order-card-mini > view:first-child {
	min-width: 0;
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.order-card-mini > view:first-child text:nth-child(2) {
	font-size: 28rpx;
	font-weight: 700;
	line-height: 1.35;
	color: #0F1F3A;
}

.order-card-mini > view:first-child text:last-child {
	font-size: 23rpx;
	color: #6B7C97;
}

.order-card-mini > view:last-child {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 12rpx;
}

.order-card-mini > view:last-child text:last-child {
	font-size: 30rpx;
	font-weight: 800;
	color: #0F1F3A;
}

.product-card {
	margin-bottom: 20rpx;
	padding: 28rpx;
	display: flex;
	align-items: center;
	gap: 24rpx;
}

.product-icon {
	width: 108rpx;
	height: 108rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border-radius: 24rpx;
	background: #E8F1FE;
	color: #1E6FE0;
}

.product-copy {
	min-width: 0;
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 6rpx;
}

.product-copy > text:first-child {
	font-size: 28rpx;
	font-weight: 700;
	color: #0F1F3A;
}

.product-copy > text:nth-child(2),
.product-copy > text:nth-child(3) {
	font-size: 22rpx;
	color: #94A3B8;
}

.ghost-mini {
	height: 64rpx;
	padding: 0 22rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border: 2rpx solid #BFD6F7;
	border-radius: 999rpx;
	background: #FFFFFF;
	color: #1E6FE0;
	font-size: 24rpx;
	font-weight: 700;
}

.switch-card {
	margin-top: 20rpx;
	padding: 28rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.switch-card > view:first-child {
	display: flex;
	flex-direction: column;
	gap: 6rpx;
}

.switch-card > view:first-child text:first-child {
	font-size: 28rpx;
	font-weight: 700;
	color: #0F1F3A;
}

.switch-card > view:first-child text:last-child {
	font-size: 23rpx;
	color: #94A3B8;
}

.switch-btn {
	position: relative;
	width: 88rpx;
	height: 48rpx;
	border-radius: 999rpx;
	background: #D7E1EE;
	transition: background 120ms;
}

.switch-btn view {
	position: absolute;
	left: 4rpx;
	top: 4rpx;
	width: 40rpx;
	height: 40rpx;
	border-radius: 999rpx;
	background: #FFFFFF;
	box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.15);
	transition: left 120ms;
}

.switch-btn.on {
	background: #1E6FE0;
}

.switch-btn.on view {
	left: 44rpx;
}

.save-button {
	margin-top: 40rpx;
}

.delete-button {
	height: 80rpx;
	margin-top: 10rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #94A3B8;
	font-size: 26rpx;
}

.segment {
	padding: 8rpx;
	display: flex;
	gap: 8rpx;
	border-radius: 999rpx;
	background: #EAF0FA;
}

.segment view {
	flex: 1;
	height: 76rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 999rpx;
	color: #6B7C97;
	font-size: 28rpx;
	font-weight: 600;
}

.segment view.on {
	background: #FFFFFF;
	box-shadow: 0 8rpx 24rpx -8rpx rgba(30, 111, 224, 0.25);
	color: #0A4FB8;
	font-weight: 800;
}

.feedback-tip {
	display: block;
	margin-top: 16rpx;
	padding: 0 8rpx;
	font-size: 23rpx;
	color: #94A3B8;
}

.feedback-card {
	margin-top: 24rpx;
	overflow: hidden;
}

.feedback-area {
	padding: 28rpx 28rpx 12rpx;
	border-bottom: 2rpx solid #F1F5FB;
}

.feedback-area > text,
.feedback-contact > text {
	display: block;
	margin-bottom: 16rpx;
	font-size: 26rpx;
	font-weight: 700;
	color: #324563;
}

.feedback-area textarea {
	width: 100%;
	height: 220rpx;
	font-size: 28rpx;
	line-height: 1.6;
	color: #0F1F3A;
}

.feedback-area > view {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-bottom: 16rpx;
	font-size: 22rpx;
	color: #94A3B8;
}

.feedback-contact {
	padding: 28rpx;
}

.contact-kind-row {
	display: flex;
	gap: 16rpx;
	margin-bottom: 20rpx;
}

.contact-kind-row view {
	flex: 1;
	height: 72rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 3rpx solid #E4ECF7;
	border-radius: 20rpx;
	color: #324563;
	font-size: 26rpx;
	font-weight: 600;
	box-sizing: border-box;
}

.contact-kind-row view.on {
	border-color: #1E6FE0;
	background: #E8F1FE;
	color: #0A4FB8;
	font-weight: 800;
}

.contact-input-row {
	height: 84rpx;
	padding: 0 28rpx;
	display: flex;
	align-items: center;
	gap: 20rpx;
	border-radius: 20rpx;
	background: #F5F9FF;
	box-sizing: border-box;
}

.contact-input-row text {
	flex-shrink: 0;
	font-size: 25rpx;
	color: #6B7C97;
}

.contact-input-row input {
	min-width: 0;
	flex: 1;
	height: 72rpx;
	text-align: right;
	font-size: 27rpx;
	color: #0F1F3A;
}

.simple-card {
	margin-top: 20rpx;
	padding: 28rpx;
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}

.simple-card text:first-child {
	font-size: 27rpx;
	font-weight: 700;
	color: #0F1F3A;
}

.simple-card text:nth-child(2) {
	font-size: 23rpx;
	color: #94A3B8;
}

.simple-card input {
	height: 72rpx;
	font-size: 27rpx;
	color: #0F1F3A;
}

.submit-note {
	display: block;
	margin-top: 16rpx;
	text-align: center;
	font-size: 22rpx;
	color: #94A3B8;
}

.login-module {
	padding-top: 80rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
}

.login-logo {
	width: 152rpx;
	height: 152rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 44rpx;
	background: linear-gradient(135deg, #3A86FF 0%, #1E6FE0 100%);
	box-shadow: 0 24rpx 56rpx -16rpx rgba(30, 111, 224, 0.45);
	color: #FFFFFF;
}

.login-logo .glyph {
	width: 84rpx;
	height: 84rpx;
}

.login-title {
	margin-top: 36rpx;
	font-size: 44rpx;
	font-weight: 800;
	color: #0F1F3A;
}

.login-desc {
	margin-top: 12rpx;
	font-size: 26rpx;
	color: #6B7C97;
}

.wechat-login,
.phone-login {
	width: 100%;
	height: 100rpx;
	margin-top: 72rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 999rpx;
	font-size: 30rpx;
	font-weight: 700;
	box-sizing: border-box;
}

.wechat-login {
	background: #07C160;
	box-shadow: 0 16rpx 36rpx -12rpx rgba(7, 193, 96, 0.45);
	color: #FFFFFF;
}

.phone-login {
	margin-top: 20rpx;
	border: 2rpx solid #E4ECF7;
	background: #FFFFFF;
	color: #0F1F3A;
}

.login-agree {
	margin-top: 48rpx;
	padding: 0 40rpx;
	font-size: 23rpx;
	line-height: 1.7;
	color: #94A3B8;
}

.glyph-cam::before {
	left: 5rpx;
	top: 14rpx;
	width: 38rpx;
	height: 28rpx;
	border: 4rpx solid currentColor;
	border-radius: 6rpx;
}

.glyph-cam::after {
	left: 17rpx;
	top: 21rpx;
	width: 14rpx;
	height: 14rpx;
	border: 4rpx solid currentColor;
	border-radius: 999rpx;
}

.glyph-cam .glyph-extra {
	left: 14rpx;
	top: 7rpx;
	width: 20rpx;
	height: 10rpx;
	border-radius: 8rpx 8rpx 0 0;
	background: currentColor;
}

.glyph-tooth::before {
	left: 8rpx;
	top: 4rpx;
	width: 32rpx;
	height: 40rpx;
	border: 4rpx solid currentColor;
	border-radius: 18rpx 18rpx 22rpx 22rpx;
}

.glyph-tooth::after {
	left: 16rpx;
	top: 8rpx;
	width: 8rpx;
	height: 8rpx;
	border-radius: 999rpx;
	background: currentColor;
	box-shadow: 8rpx 0 0 currentColor;
}
</style>
