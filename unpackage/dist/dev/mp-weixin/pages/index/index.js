"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const config_cicadaAssets = require("../../config/cicada-assets.js");
const api_content = require("../../api/content.js");
const repairDraftKey = "repairDraft";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const bootStart = Date.now();
    const logBoot = (stage) => common_vendor.index.__f__("log", "at pages/index/index.vue:1073", "[index-boot]", stage, Date.now() - bootStart);
    const copied = common_vendor.ref("");
    const showQr = common_vendor.ref(false);
    const showOfficial = common_vendor.ref(false);
    const showRepairTools = common_vendor.ref(false);
    const surveyPosterUrl = config_cicadaAssets.cicadaAssets.surveyPoster;
    const moduleHeadPaddingTop = common_vendor.ref(72);
    const pageBootReady = common_vendor.ref(false);
    const searchKeyword = common_vendor.ref("");
    const activeTab = common_vendor.ref("home");
    const activeModule = common_vendor.ref("");
    const previousModule = common_vendor.ref("");
    const logged = common_vendor.ref(true);
    const diagProduct = common_vendor.ref("");
    const diagFault = common_vendor.ref("");
    const diagOpen = common_vendor.ref("");
    const activeTrackTab = common_vendor.ref("全部");
    const activeOrdersTab = common_vendor.ref("全部");
    const trackDetailOrder = common_vendor.ref("");
    const orderDetailOrder = common_vendor.ref("");
    const packageQueryLoading = common_vendor.ref(false);
    const packageQuerySearched = common_vendor.ref(false);
    const feedbackType = common_vendor.ref("建议");
    const feedbackContactKind = common_vendor.ref("phone");
    const feedbackText = common_vendor.ref("");
    const feedbackContactValue = common_vendor.ref("");
    const feedbackOrderId = common_vendor.ref("");
    const packageQuery = common_vendor.ref({
      trackingNo: "",
      phoneLast4: ""
    });
    const packageQueryResult = common_vendor.ref(null);
    const addressForm = common_vendor.ref({
      addressId: "",
      name: "李医生",
      phone: "138 0013 8000",
      region: "广西壮族自治区 / 桂林市 / 象山区",
      detail: "中山中路 88 号 桂林口腔门诊 4 楼",
      unit: "桂林口腔门诊",
      def: true
    });
    const defaultRepairForm = () => ({
      logisticsCompany: "顺丰速运",
      trackingNo: "",
      sendMethod: "顺丰取件",
      receiverName: "李医生",
      receiverPhone: "13800138000",
      receiverAddress: "广西壮族自治区桂林市象山区中山中路 88 号 桂林口腔门诊 4 楼",
      receiverUnit: "桂林口腔门诊"
    });
    const defaultRepairProduct = () => ({
      id: 1,
      name: "",
      model: "",
      serial: "",
      buyDate: "",
      voucher: "",
      voucherList: [],
      faultDesc: "",
      media: []
    });
    const repairForm = common_vendor.ref(defaultRepairForm());
    const submittedOrderId = common_vendor.ref("DR-20260511-0042");
    const repairProducts = common_vendor.ref([defaultRepairProduct()]);
    let repairProductSeed = 1;
    let repairMediaSeed = 1;
    logBoot("base refs ready");
    const basics = [
      { id: "repair", title: "立即报修", icon: "repair", color: "#1E6FE0", bg: "#DCE6FA" },
      { id: "track", title: "维修进度", icon: "track", color: "#C97A6B", bg: "#F8E2DA" },
      { id: "survey", title: "调研有礼", icon: "gift", color: "#8E96A8", bg: "#E5E7EE" }
    ];
    const queries = [
      { id: "diag", title: "故障自查", icon: "diag", color: "#0A4FB8", bg: "#D7E3FA" },
      { id: "package-query", title: "包裹查询", icon: "box", color: "#10B981", bg: "#DCFCE7" },
      { id: "warranty", title: "保修政策", icon: "shield", color: "#1E6FE0", bg: "#E8F1FE" },
      { id: "fees", title: "收费指南", icon: "money", color: "#D97706", bg: "#FFF7E6" }
    ];
    const guides = [
      { id: "guide-quick", title: "快速指南", icon: "book" },
      { id: "guide-repair", title: "报修指南", icon: "repair" },
      { id: "guide-query", title: "查询办法", icon: "search" },
      { id: "guide-invoice", title: "开票指南", icon: "invoice" }
    ];
    const receiver = common_vendor.ref([
      { label: "收件公司", value: "佛山市思科达医疗器械有限公司" },
      { label: "收件人", value: "姚兵" },
      { label: "收件电话", value: "13929198537" },
      { label: "收件地址", value: "广东省佛山市南海区狮山镇罗村广东新光源核心基地B5座五楼" }
    ]);
    const advantages = [
      { icon: "lightning", title: "极速响应", desc: "2小时内接单回复、24小时内到场检修，将诊所停工损失降至最低。" },
      { icon: "microscope", title: "精密检测", desc: "引进国际领先的工业级内窥镜与频率分析仪，精准识别隐匿故障。" }
    ];
    const business = [
      { title: "高低速手机维修", desc: "包含深度清理、动平衡校正、陶瓷轴承更换。", gradient: "linear-gradient(135deg, #2C5985 0%, #6BB0CC 100%)" },
      { title: "综合治疗台保养", desc: "气路水路系统消毒、控制电路检修与压力调校。", gradient: "linear-gradient(135deg, #3D6F9E 0%, #6BB0CC 100%)" },
      { title: "影像系统调试", desc: "CBCT、全景机辐射校验、感光板传感器优化。", gradient: "linear-gradient(135deg, #0A4FB8 0%, #6BB0CC 100%)" }
    ];
    const defaultStatusItems = [
      { id: "all", title: "全部", count: 3, color: "#1E6FE0", bg: "rgba(30, 111, 224, 0.09)", icon: "invoice", type: 0 },
      { id: "pending", title: "待处理", count: 1, color: "#F59E0B", bg: "rgba(245, 158, 11, 0.09)", icon: "track", type: 1 },
      { id: "fixing", title: "维修中", count: 1, color: "#0EA5E9", bg: "rgba(14, 165, 233, 0.09)", icon: "repair", type: 2 },
      { id: "shipped", title: "已发货", count: 1, color: "#10B981", bg: "rgba(16, 185, 129, 0.09)", icon: "truck", type: 3 },
      { id: "not_invoiced", title: "未开票", count: 0, color: "#F59E0B", bg: "rgba(245, 158, 11, 0.09)", icon: "invoice", type: 4 },
      { id: "invoiced", title: "已开票", count: 0, color: "#10B981", bg: "rgba(16, 185, 129, 0.09)", icon: "check", type: 5 }
    ];
    const menus = [
      { icon: "pin", title: "收货地址管理", desc: "表单形式 · 1 个默认地址", go: "address" },
      { icon: "edit", title: "投诉和建议", desc: "问题反馈 / 改进建议", go: "feedback" },
      { icon: "box", title: "我的产品", desc: "已登记 3 件设备", go: "products" },
      { icon: "shield", title: "保修政策", desc: "三重保修条款", go: "warranty" },
      { icon: "phone", title: "联系我们", desc: "在线客服 / 服务热线 / 地址", go: "contact" }
    ];
    const tabs = [
      { id: "home", label: "首页", icon: "home" },
      { id: "company", label: "公司介绍", icon: "company" },
      { id: "mine", label: "我的", icon: "mine" }
    ];
    const tabRoutes = {
      home: true,
      company: true,
      mine: true
    };
    const moduleMap = {
      repair: { title: "立即报修", subtitle: "填写寄出信息、产品信息与寄回信息" },
      "repair-success": { title: "提交成功", subtitle: "工程师已收到您的报修申请" },
      track: { title: "维修进度", subtitle: "支持全部、待处理、维修中和已发货状态查询" },
      "package-query": { title: "包裹查询", subtitle: "按快递单号查询是否签收和当前处理状态" },
      "order-detail": { title: "工单详情", subtitle: "维修时间线、发票进度与负责工程师" },
      survey: { title: "调研有礼", subtitle: "扫码参与调研，领取专属维保福利" },
      diag: { title: "故障自查", subtitle: "选择产品类型和故障类型，查看排查建议" },
      warranty: { title: "保修政策", subtitle: "文字形式展示保修范围、期限和注意事项" },
      fees: { title: "收费指南", subtitle: "文字形式展示收费办法和常见项目" },
      "guide-quick": { title: "快速指南", subtitle: "以图文文档形式浏览操作说明" },
      "guide-repair": { title: "报修指南", subtitle: "了解寄修报修的完整流程" },
      "guide-query": { title: "查询指南", subtitle: "查看进度查询和结果确认办法" },
      "guide-invoice": { title: "开票指南", subtitle: "了解发票申请、抬头和寄送说明" },
      contact: { title: "联系我们", subtitle: "客服热线、工作时间和寄修地址" },
      orders: { title: "维修订单", subtitle: "查看全部维修记录与处理状态" },
      products: { title: "我的产品", subtitle: "已登记设备与保修状态" },
      address: { title: "收货地址", subtitle: "管理默认回寄地址与单位信息" },
      feedback: { title: "投诉和建议", subtitle: "提交问题反馈或服务建议" },
      login: { title: "登录", subtitle: "登录后查看您的维修订单" }
    };
    const moduleInfo = common_vendor.computed(() => moduleMap[activeModule.value] || {});
    const moduleHeadStyle = common_vendor.computed(() => ({
      paddingTop: `${moduleHeadPaddingTop.value}rpx`
    }));
    const progressTabs = ["全部", "待处理", "维修中", "已发货"];
    const repairFlow = ["寄出", "签收", "检测", "维修", "回寄", "完成"];
    const packageFlow = ["待签收", "已签收", "已登记", "处理中", "已关联"];
    const trackOrders = common_vendor.ref([
      { id: "DR-20260508-1147", model: "NSK Ti-Max Z95L", status: "维修中", statusGroup: "维修中", tone: "warn", reached: 4, time: "05-09 14:23" },
      { id: "DR-20260420-0883", model: "CICADA 超声洁牙机", status: "已完成", statusGroup: "已发货", tone: "ok", reached: 5, time: "04-25 09:11" },
      { id: "DR-20260315-0521", model: "根管马达 X-Smart", status: "已完成", statusGroup: "已发货", tone: "ok", reached: 5, time: "03-20 16:48" }
    ]);
    const packageFallbackRecords = [
      {
        trackingNo: "SF0987654321",
        phoneLast4: "8000",
        company: "顺丰速运",
        orderId: "DR-20260508-1147",
        status: "已签收待检测",
        tone: "warn",
        reached: 3,
        timeline: [
          { title: "已签收", desc: "桂林服务中心已签收，等待工程师拆包登记。", time: "2026-05-08 16:20" },
          { title: "运输中", desc: "快递员派送中，请保持寄件电话畅通。", time: "2026-05-08 10:14" },
          { title: "客户寄出", desc: "客户通过顺丰寄出维修设备。", time: "2026-05-07 18:30" }
        ]
      },
      {
        trackingNo: "YT20260517001",
        phoneLast4: "2317",
        company: "圆通速递",
        orderId: "",
        status: "已签收待登记",
        tone: "muted",
        reached: 1,
        timeline: [
          { title: "已签收", desc: "仓库已签收，客服正在核对寄件信息。", time: "2026-05-17 11:08" },
          { title: "到达网点", desc: "快件已到达桂林七星营业部。", time: "2026-05-17 08:46" }
        ]
      }
    ];
    const orderTimeline = [
      { title: "物流回寄", desc: "顺丰 SF1234567890 已签收", time: "2026-05-11 09:32", pending: true },
      { title: "维修完成", desc: "已更换轴承组件，含密封圈与卡簧", time: "2026-05-10 16:48" },
      { title: "维修中", desc: "工程师：王师傅 · 故障定位完成", time: "2026-05-09 14:23" },
      { title: "检测完成", desc: "确认转动卡顿、轴承磨损", time: "2026-05-09 11:05" },
      { title: "已签收", desc: "桂林服务中心 收", time: "2026-05-08 16:20" },
      { title: "已寄出", desc: "顺丰快递 SF0987654321", time: "2026-05-08 10:14" }
    ];
    const orderList = common_vendor.ref([
      { id: "DR-20260508-1147", model: "NSK Ti-Max Z95L", status: "维修中", statusGroup: "维修中", tone: "warn", price: "￥860", date: "2026-05-08" },
      { id: "DR-20260420-0883", model: "CICADA 超声洁牙机", status: "已完成", statusGroup: "已发货", tone: "ok", price: "￥320", date: "2026-04-20" },
      { id: "DR-20260315-0521", model: "根管马达 X-Smart", status: "已完成", statusGroup: "已发货", tone: "ok", price: "￥580", date: "2026-03-15" },
      { id: "DR-20260218-0212", model: "综合治疗椅（主气路）", status: "已完成", statusGroup: "已发货", tone: "ok", price: "￥1,240", date: "2026-02-18" },
      { id: "DR-20260112-0099", model: "光固化机 LED-X", status: "已取消", statusGroup: "待处理", tone: "muted", price: "—", date: "2026-01-12" }
    ]);
    const productList = [
      { title: "NSK Ti-Max Z95L", sn: "TZ95L-2402-0891", date: "2024-02 购入", warranty: "保修中 · 还剩 91 天", expired: false },
      { title: "CICADA 超声洁牙机", sn: "CSC-2306-7723", date: "2023-06 购入", warranty: "已过保 · 可付费维修", expired: true },
      { title: "根管马达 X-Smart", sn: "XSM-2412-0103", date: "2024-12 购入", warranty: "保修中 · 还剩 561 天", expired: false }
    ];
    const diagProducts = common_vendor.ref([
      { id: "hp", title: "高速手机/低速手机" },
      { id: "sc", title: "超声洁牙机" },
      { id: "rm", title: "根管马达" },
      { id: "cu", title: "光固化机/扫描仪" },
      { id: "ch", title: "综合治疗椅" }
    ]);
    const diagFaultMap = common_vendor.ref({
      hp: ["转动卡顿/异响", "喷雾不正常 / 无水", "夹钳松弛、卡针脱落", "气压不足、动力弱", "灯光不亮（光纤型）"],
      sc: ["不出水/水量小", "工作头无振动", "电源指示灯不亮", "发热严重"],
      rm: ["转速异常", "显示屏黑屏", "按键无反应", "扭力不稳"],
      cu: ["不出光/光弱", "电池续航差", "光斑不均匀", "机身过热"],
      ch: ["椅背升降卡顿", "水气泄漏", "灯光无法点亮", "无菌水路报警"]
    });
    const faultRecords = common_vendor.ref([]);
    const diagResult = common_vendor.ref(null);
    const defaultDiagConfirmSections = [
      {
        title: "相关问题",
        color: "#1E6FE0",
        numbered: false,
        items: ["该症状是否在最近一次保养之后出现？", "故障是否伴随明显异响、气味或发热？", "断电重启后症状是否消失？"]
      },
      {
        title: "确认方式",
        color: "#0EA5E9",
        numbered: true,
        items: ["断电冷却 5 分钟后再观察", "更换同型号备机做对照测试", "查看进气压力是否在 0.25 至 0.30 MPa"]
      },
      {
        title: "处理方式",
        color: "#10B981",
        numbered: true,
        items: ["可自行清洁卡簧并喷涂专用润滑油", "若 24 小时内复现，建议寄修更换轴承组件", "若伴随漏气或漏水，请立刻停用并联系工程师"]
      }
    ];
    const warrantyDurations = [
      { name: "综合治疗椅", duration: "整机 1 年 · 主气路 3 年" },
      { name: "高速/低速手机", duration: "机芯 6 个月 · 外壳 1 年" },
      { name: "超声洁牙机", duration: "整机 1 年" },
      { name: "根管马达", duration: "整机 2 年" },
      { name: "光固化机", duration: "整机 1 年 · 灯头 6 个月" }
    ];
    const warrantyRanges = [
      "在保修期内，因产品自身材料、工艺或装配缺陷导致的故障，免费维修。",
      "人为损坏（摔砸/进液/拆改）不在保修范围。",
      "已超出保修期的，按照配件成本与工时收费，价格表事先确认。",
      "所有维修配件均为原厂部件，确保品质一致。"
    ];
    const warrantyServices = [
      { icon: "truck", title: "全国寄修", desc: "顺丰到付 · 全程可追踪" },
      { icon: "phone", title: "1 对 1 工程师", desc: "专属服务 · 售后无忧" },
      { icon: "invoice", title: "发票协助", desc: "增值税普通 / 专用发票" }
    ];
    const warrantyTerms = [
      {
        title: "一、保修时间计算方式：",
        lines: [
          "客户提供购买凭证，以凭证上的购买时间计算，凭证无售出单位盖章或填写信息不完整的不予保修。",
          "客户在思科达售后小程序有产品注册，以注册填写的购买凭证时间来计算。",
          "客户在思科达售后小程序有产品注册，以注册填写的购买凭证时间来计算。",
          "如不能提供任何凭证，则以出厂时间加 1 个月来计算。",
          "保修期限以产品说明书中所述为准。"
        ]
      },
      {
        title: "二、以下状况不属于保修范围：",
        lines: [
          "未按说明书进行安装、操作和维修。",
          "错误使用配件或使用非公司配件造成损坏。",
          "非正常的化学、电力、电解损坏及摔、碰伤。",
          "过度使用或用于牙科以外的其它科目。",
          "因使用、维护、保管不当造成损坏。",
          "不适当的操作或非制造商认可的人员对手机进行错误的维修。"
        ]
      },
      {
        title: "三、不提供售后服务情形",
        lines: [
          "产品序列号被人为故意破坏、假标签、仿制等产品。",
          "在淘宝网、拼多多、微店等平台上购买的「思科达产品」且未授权的商家销售的产品。",
          "针对以上情形，本公司不提供任何技术支持及售后服务。"
        ]
      },
      { title: "四、维修续保", lines: ["所有维修品，同一故障问题，更换同样的零件，非人为因素，续保三个月。"] }
    ];
    logBoot("static blocks ready");
    const docModuleIds = ["fees", "guide-quick", "guide-repair", "guide-query", "guide-invoice"];
    const docFallbacks = {
      fees: {
        title: "收费指南",
        icon: "money",
        lead: "价格透明，先报价后维修，全程无隐形消费。",
        paperTitle: "思科达维修收费指南",
        sections: [
          { title: "一、收费构成", lines: ["配件费：按照思科达原厂配件官方指导价收取。", "工时费：根据维修难度及工程师等级核算，公开透明。", "物流费：保修期内非人为故障往返运费由我司承担（顺丰到付）。"] },
          { title: "二、核心原则", lines: ["免费检测：所有寄修设备均享免费检测，未维修不收取任何检测费用。", "先报后修：工程师检测后出具正式报价单，经客户在线确认后方动工维修。", "拒绝隐形消费：所有收费项目均在报价单中列明，无额外附加费。"] },
          { title: "三、质保说明", lines: ["所有维修更换的配件（非人为因素）均享受 90 天的质保续期服务。"], marker: "" }
        ]
      },
      "guide-quick": {
        title: "快速指南",
        icon: "book",
        lead: "5 分钟了解小程序核心功能，让售后流程一目了然。",
        paperTitle: "思科达医疗小程序 — 快速指南",
        sections: [
          { title: "一、故障自查", marker: "a)", lines: ["点击首页「故障自查」或在导航栏选择「操作指南」。", "选择产品类型，按照指引进行故障排查，即可获得初步解决方案。"] },
          { title: "二、如何报修", marker: "b)", lines: ["点击首页「立即报修」进入报修表单。", "填写产品信息、故障描述、上传附件图片，点击提交完成报修。", "提交后可获得工单号，用于后续进度查询。"] },
          { title: "三、维修进度查询", marker: "c)", lines: ["在首页或「维修进度」页面输入工单号查询。", "维修状态会实时更新，包括：已接单、检测中、维修中、已发货等状态。"] },
          { title: "四、自助开票", marker: "d)", lines: ["维修完成后，在「我的订单」中选择开票。", "选择发票类型，填写开票信息后提交。"] }
        ]
      },
      "guide-repair": {
        title: "报修指南",
        icon: "repair",
        lead: "专业的寄修服务流程，为您的医疗设备保驾护航。",
        paperTitle: "思科达故障报修指南",
        sections: [
          { title: "一、报修前准备", lines: ["产品信息：准备好产品型号、序列号等基本信息。", "故障描述：详细描述故障现象、发生时间及使用环境。", "故障照片/视频：如有可能，拍摄故障发生时的照片或视频。", "购买凭证：准备好购买发票或订单信息（用于保修确认）。"] },
          { title: "二、网上报修流程", lines: ["进入「立即报修」页面。", "填写产品信息。", "填写故障描述并上传图片。", "确认信息并提交。"] },
          { title: "三、思科达 24h 客服指引", lines: ["在线客服：8:00 - 21:00。", "服务热线：400-888-9999。"] }
        ],
        steps: [
          { title: "进入立即报修", desc: "在小程序首页点击「立即报修」按钮，进入报修表单页面。" },
          { title: "填写产品信息", desc: "选择产品类型，输入产品序列号，填写产品购买日期。" },
          { title: "上传故障图片", desc: "详细描述故障现象，上传故障照片或视频。" },
          { title: "确认并提交", desc: "核对报修信息无误后，点击提交完成申请。" }
        ]
      },
      "guide-query": {
        title: "查询办法",
        icon: "search",
        lead: "随时随地掌握维修进度，信息透明更安心。",
        paperTitle: "思科达维修查询办法",
        sections: [
          { title: "一、工单号查询", lines: ["在小程序首页顶部的搜索框中，直接输入 DR 开头的完整工单号。", "点击搜索即可查看该工单的实时物流进度、检测报告及维修状态。"] },
          { title: "二、序列号（SN）查询", lines: ["使用设备机身上刻印的 SN 序列号进行查询。", "该方式可追溯设备的所有历史维修记录及保修剩余时长。"] },
          { title: "三、个人中心查询", lines: ["登录小程序后，点击右下角「我的」。", "进入「维修订单」页面，即可查看名下绑定的所有维修申请及进度。"] },
          { title: "四、人工查询", lines: ["如无法通过以上方式查询，请联系 400 服务热线，提供报修时的手机号由客服协助查询。"], marker: "" }
        ]
      },
      "guide-invoice": {
        title: "开票指南",
        icon: "invoice",
        lead: "支持多种发票类型，在线申请，极速送达。",
        paperTitle: "思科达自助开票指南",
        sections: [
          { title: "一、开票申请流程", lines: ["维修完成并支付后，在「维修订单」中选择对应订单。", "点击「申请开票」按钮，选择发票类型（电子普票/纸质专票）。", "录入单位抬头、税号及接收邮箱/地址，确认提交。"] },
          { title: "二、发票类型说明", lines: ["增值税普通发票：默认开具电子发票，发送至您的预留邮箱。", "增值税专用发票：需上传开票资料，纸质发票将于 3 个工作日内寄出。"] },
          { title: "三、开票时效", lines: ["电子发票申请后 24 小时内开具；纸质发票每周二、周五统一邮寄。"], marker: "" }
        ]
      }
    };
    const docMap = common_vendor.ref({});
    logBoot("doc fallbacks ready");
    const contactInfo = common_vendor.ref({
      companyName: "佛山市思科达医疗器械有限公司",
      phone: "13929198537",
      email: "",
      address: "广东省佛山市南海区狮山镇罗村广东新光源核心基地B5座五楼",
      workTime: "周一至周五 08:00 - 21:00"
    });
    const customerService = common_vendor.ref({
      qrcodeUrl: config_cicadaAssets.cicadaAssets.qrWechat,
      title: "调研有礼",
      description: "扫码添加客服微信，参与调研即可获得精美礼品",
      wechat: "CSD-Service-001"
    });
    const wechatInfo = common_vendor.ref({
      qrcodeUrl: config_cicadaAssets.cicadaAssets.qrWechat,
      name: "思科达售后",
      description: "获取最新维修指南 / 售后政策"
    });
    const contactHotlines = common_vendor.ref([
      { title: "售后技术", number: "13929198537", time: "工作日 08:00-21:00" },
      { title: "购买咨询", number: "13929198537", time: "工作日 08:00-21:00" }
    ]);
    const workTimes = common_vendor.ref([
      { day: "周一至周五", time: "08:00 - 21:00" },
      { day: "周末", time: "09:00 - 18:00" },
      { day: "法定节假日", time: "09:00 - 17:00" }
    ]);
    const feedbackContacts = [
      { id: "phone", title: "手机", label: "手机号码", placeholder: "请输入 11 位手机号码" },
      { id: "qq", title: "QQ", label: "QQ 号码", placeholder: "请输入 QQ 号" },
      { id: "email", title: "邮箱", label: "邮箱地址", placeholder: "请输入常用邮箱" }
    ];
    const feedbackTypes = ["建议", "投诉"];
    const toTextLines = (value) => {
      if (Array.isArray(value))
        return value.filter(Boolean).map(String);
      if (!value)
        return [];
      return String(value).replace(/<[^>]+>/g, "\n").split(/\n|\uFF1B|;/).map((item) => item.replace(/^\s*\d+[.)、]?\s*/, "").trim()).filter(Boolean);
    };
    const normalizeDoc = (doc, fallback = {}) => {
      if (!doc)
        return fallback;
      const content = doc.content || doc.html || "";
      return {
        ...fallback,
        title: doc.title || fallback.title,
        lead: doc.description || doc.summary || fallback.lead,
        paperTitle: doc.paperTitle || doc.title || fallback.paperTitle || fallback.title,
        content,
        updateTime: doc.updateTime || fallback.updateTime,
        sections: Array.isArray(doc.sections) && doc.sections.length ? doc.sections : fallback.sections || [],
        steps: Array.isArray(doc.steps) && doc.steps.length ? doc.steps : fallback.steps
      };
    };
    const normalizeContact = (data = {}) => ({
      companyName: data.companyName || contactInfo.value.companyName,
      phone: data.phone || contactInfo.value.phone,
      email: data.email || contactInfo.value.email,
      address: data.address || contactInfo.value.address,
      workTime: data.workTime || contactInfo.value.workTime
    });
    const splitWorkTimes = (workTime = "") => {
      if (!workTime)
        return workTimes.value;
      const rows = String(workTime).split(/\n|\uFF1B|;/).map((item) => item.trim()).filter(Boolean);
      if (!rows.length)
        return workTimes.value;
      return rows.map((item) => {
        const parts = item.split(/\s+/);
        return {
          day: parts[0] || "工作时间",
          time: parts.slice(1).join(" ") || item
        };
      });
    };
    const normalizeQrUrl = (url) => url || config_cicadaAssets.cicadaAssets.qrWechat;
    const applyContact = (data = {}) => {
      const next = normalizeContact(data);
      contactInfo.value = next;
      contactHotlines.value = [
        { title: "售后技术", number: next.phone, time: next.workTime },
        ...next.email ? [{ title: "邮箱咨询", number: next.email, time: next.workTime }] : []
      ];
      workTimes.value = splitWorkTimes(next.workTime);
      receiver.value = [
        { label: "收件公司", value: next.companyName },
        { label: "收件电话", value: next.phone },
        { label: "收件地址", value: next.address }
      ];
    };
    const statusMeta = {
      0: { status: "待处理", statusGroup: "待处理", tone: "muted", reached: 1 },
      1: { status: "维修中", statusGroup: "维修中", tone: "warn", reached: 3 },
      2: { status: "已发货", statusGroup: "已发货", tone: "ok", reached: 4 },
      3: { status: "已完成", statusGroup: "已发货", tone: "ok", reached: 5 }
    };
    const packageStatusMeta = {
      0: { status: "暂未签收", tone: "muted", reached: 0 },
      1: { status: "已签收待登记", tone: "warn", reached: 1 },
      2: { status: "已登记待检测", tone: "warn", reached: 2 },
      3: { status: "处理中", tone: "warn", reached: 3 },
      4: { status: "已关联工单", tone: "ok", reached: 4 },
      5: { status: "已完成", tone: "ok", reached: 4 }
    };
    const normalizeOrder = (item = {}) => {
      const meta = statusMeta[item.status] || {
        status: item.statusText || item.status || "待处理",
        statusGroup: item.statusText || "待处理",
        tone: "muted",
        reached: 1
      };
      const statusText = item.statusText || meta.status;
      const statusGroup = ["待处理", "维修中", "已发货"].includes(statusText) ? statusText : meta.statusGroup;
      return {
        id: item.orderId || item.id || "",
        model: item.productModel || item.productName || item.model || "维修设备",
        status: statusText,
        statusGroup,
        tone: meta.tone,
        reached: meta.reached,
        time: (item.updateTime || item.createTime || "").slice(5, 16) || item.time || "",
        price: item.price || "—",
        date: (item.createTime || item.date || "").slice(0, 10)
      };
    };
    const normalizePackageTimeline = (timeline = []) => {
      if (!Array.isArray(timeline) || !timeline.length) {
        return [{ title: "等待录入", desc: "后台录入快递单号后，这里会显示签收和处理记录。", time: "", pending: true }];
      }
      return timeline.map((item = {}) => ({
        title: item.title || item.statusText || item.status || "包裹状态更新",
        desc: item.desc || item.description || item.content || "包裹状态已更新。",
        time: item.time || item.createTime || item.updateTime || "",
        pending: Boolean(item.pending)
      }));
    };
    const normalizePackageResult = (data = {}) => {
      const rawStatus = data.status;
      const meta = packageStatusMeta[rawStatus] || {
        status: data.statusText || data.statusName || rawStatus || "已录入",
        tone: data.tone || "muted",
        reached: Number.isFinite(Number(data.reached)) ? Number(data.reached) : 1
      };
      const reachedValue = data.reached !== void 0 && data.reached !== null ? data.reached : meta.reached;
      return {
        trackingNo: data.trackingNo || data.expressNo || data.waybillNo || packageQuery.value.trackingNo,
        company: data.company || data.expressCompany || data.logisticsCompany || "",
        orderId: data.orderId || data.repairOrderId || "",
        status: data.statusText || data.statusName || meta.status,
        tone: data.tone || meta.tone,
        reached: Math.max(0, Math.min(packageFlow.length - 1, Number(reachedValue) || 0)),
        timeline: normalizePackageTimeline(data.timeline || data.logs || data.records)
      };
    };
    const findLocalPackageRecord = (trackingNo, phoneLast4 = "") => {
      const normalizedNo = String(trackingNo).trim().toUpperCase();
      const normalizedPhone = String(phoneLast4).trim();
      return packageFallbackRecords.find((item) => {
        const noMatched = item.trackingNo.toUpperCase() === normalizedNo;
        const phoneMatched = !normalizedPhone || !item.phoneLast4 || item.phoneLast4 === normalizedPhone;
        return noMatched && phoneMatched;
      });
    };
    const queryPackage = async () => {
      if (packageQueryLoading.value)
        return;
      const trackingNo = packageQuery.value.trackingNo.trim();
      if (!trackingNo) {
        common_vendor.index.showToast({ title: "请输入快递单号", icon: "none" });
        return;
      }
      packageQueryLoading.value = true;
      packageQuerySearched.value = false;
      packageQueryResult.value = null;
      try {
        const res = await api_content.queryPackageStatus({
          trackingNo,
          phoneLast4: packageQuery.value.phoneLast4.trim()
        });
        packageQueryResult.value = res ? normalizePackageResult(res) : null;
        packageQuerySearched.value = true;
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/index/index.vue:1685", "package query fallback:", error);
        const localRecord = findLocalPackageRecord(trackingNo, packageQuery.value.phoneLast4);
        if (localRecord) {
          packageQueryResult.value = normalizePackageResult(localRecord);
        } else {
          packageQuerySearched.value = true;
          common_vendor.index.showToast({ title: "包裹查询接口未开放", icon: "none" });
        }
      } finally {
        packageQueryLoading.value = false;
      }
    };
    const applyFaultTypes = (list = []) => {
      if (!Array.isArray(list) || !list.length)
        return;
      const productMap = {};
      const faultMap = {};
      list.forEach((item) => {
        const productName = item.productType || item.productName || "通用设备";
        const productId = item.productTypeId || item.productType || productName;
        const faultName = item.faultName || item.name || item.title;
        if (!faultName)
          return;
        productMap[productId] = { id: productId, title: productName };
        if (!faultMap[productId])
          faultMap[productId] = [];
        faultMap[productId].push(faultName);
      });
      if (Object.keys(productMap).length) {
        diagProducts.value = Object.values(productMap);
        diagFaultMap.value = faultMap;
        faultRecords.value = list;
      }
    };
    const updateDoc = (key, doc) => {
      docMap.value = {
        ...docMap.value,
        [key]: normalizeDoc(doc, docFallbacks[key] || docMap.value[key] || {})
      };
    };
    const statusItems = common_vendor.computed(() => {
      const counts = orderList.value.reduce(
        (acc, item) => {
          acc.all += 1;
          if (item.statusGroup === "待处理")
            acc.pending += 1;
          if (item.statusGroup === "维修中")
            acc.fixing += 1;
          if (item.statusGroup === "已发货")
            acc.shipped += 1;
          return acc;
        },
        { all: 0, pending: 0, fixing: 0, shipped: 0 }
      );
      return defaultStatusItems.map((item) => ({
        ...item,
        count: counts[item.id] !== void 0 && counts[item.id] !== null ? counts[item.id] : item.count
      }));
    });
    const orderTabs = common_vendor.computed(() => [
      `全部 ${orderList.value.length}`,
      `待处理 ${orderList.value.filter((item) => item.statusGroup === "待处理").length}`,
      `维修中 ${orderList.value.filter((item) => item.statusGroup === "维修中").length}`,
      `已发货 ${orderList.value.filter((item) => item.statusGroup === "已发货").length}`,
      `未开票 ${orderList.value.filter((item) => !item.invoiced).length}`,
      `已开票 ${orderList.value.filter((item) => item.invoiced).length}`
    ]);
    const diagProductLabel = common_vendor.computed(() => {
      const product = diagProducts.value.find((item) => item.id === diagProduct.value);
      return product ? product.title : "";
    });
    const diagFaultOptions = common_vendor.computed(() => {
      if (diagProduct.value)
        return diagFaultMap.value[diagProduct.value] || [];
      return Array.from(new Set(Object.values(diagFaultMap.value).flat()));
    });
    const diagConfirmVisible = common_vendor.computed(() => Boolean(diagProduct.value && diagFault.value));
    const diagConfirmSections = common_vendor.computed(() => {
      if (!diagResult.value)
        return defaultDiagConfirmSections;
      const confirmItems = toTextLines(diagResult.value.confirmInfo);
      const solutionItems = toTextLines(diagResult.value.solution);
      return [
        {
          title: "相关问题",
          color: "#1E6FE0",
          numbered: false,
          items: confirmItems.length ? confirmItems : defaultDiagConfirmSections[0].items
        },
        {
          title: "确认方式",
          color: "#0EA5E9",
          numbered: true,
          items: confirmItems.length ? confirmItems : defaultDiagConfirmSections[1].items
        },
        {
          title: "处理方式",
          color: "#10B981",
          numbered: true,
          items: solutionItems.length ? solutionItems : defaultDiagConfirmSections[2].items
        }
      ];
    });
    const diagSheetOptions = common_vendor.computed(() => {
      if (diagOpen.value === "product") {
        return diagProducts.value.map((item) => ({ ...item, active: item.id === diagProduct.value }));
      }
      return diagFaultOptions.value.map((title) => ({ id: title, title, active: title === diagFault.value }));
    });
    const warrantyDoc = common_vendor.computed(() => docMap.value.warranty || {});
    const activeDoc = common_vendor.computed(() => docMap.value[activeModule.value] || docFallbacks[activeModule.value] || docFallbacks["guide-quick"] || {});
    const isDocModule = common_vendor.computed(() => docModuleIds.includes(activeModule.value));
    const feedbackContact = common_vendor.computed(() => feedbackContacts.find((item) => item.id === feedbackContactKind.value) || feedbackContacts[0]);
    const receiverLastIndex = common_vendor.computed(() => receiver.value.length - 1);
    const filteredTrackOrders = common_vendor.computed(() => {
      if (activeTrackTab.value === "全部")
        return trackOrders.value;
      return trackOrders.value.filter((item) => item.statusGroup === activeTrackTab.value);
    });
    const filteredOrderList = common_vendor.computed(() => {
      if (activeOrdersTab.value.includes("待处理"))
        return orderList.value.filter((item) => item.statusGroup === "待处理");
      if (activeOrdersTab.value.includes("维修中"))
        return orderList.value.filter((item) => item.statusGroup === "维修中");
      if (activeOrdersTab.value.includes("已发货"))
        return orderList.value.filter((item) => item.statusGroup === "已发货");
      if (activeOrdersTab.value.includes("未开票"))
        return orderList.value.filter((item) => !item.invoiced);
      if (activeOrdersTab.value.includes("已开票"))
        return orderList.value.filter((item) => item.invoiced);
      return orderList.value;
    });
    const detailOrder = common_vendor.computed(() => {
      const fallbackOrder = trackOrders.value[0] || orderList.value[0] || {};
      const sourceId = trackDetailOrder.value || orderDetailOrder.value || fallbackOrder.id;
      return trackOrders.value.find((item) => item.id === sourceId) || orderList.value.find((item) => item.id === sourceId) || fallbackOrder;
    });
    logBoot("computed state ready");
    let copyTimer = null;
    const initModuleSafeArea = () => {
      try {
        const systemInfo = common_vendor.index.getSystemInfoSync();
        const menuRect = common_vendor.index.getMenuButtonBoundingClientRect ? common_vendor.index.getMenuButtonBoundingClientRect() : null;
        const pixelRatio = 750 / (systemInfo.windowWidth || 375);
        if (menuRect && menuRect.top) {
          const navBottom = menuRect.top + menuRect.height + Math.max(menuRect.top - (systemInfo.statusBarHeight || 0), 8);
          moduleHeadPaddingTop.value = Math.ceil(navBottom * pixelRatio) + 8;
          return;
        }
        moduleHeadPaddingTop.value = Math.ceil(((systemInfo.statusBarHeight || 24) + 24) * pixelRatio);
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/index/index.vue:1842", "safe area fallback:", error);
        moduleHeadPaddingTop.value = 88;
      }
    };
    const markCopied = (label) => {
      copied.value = label;
      if (copyTimer)
        clearTimeout(copyTimer);
      copyTimer = setTimeout(() => {
        copied.value = "";
      }, 1400);
    };
    const copyOne = (value, label) => {
      common_vendor.index.setClipboardData({
        data: value,
        success: () => markCopied(label),
        fail: () => markCopied(label)
      });
    };
    const copyAll = () => {
      const text = receiver.value.map((item) => `${item.label}: ${item.value}`).join("\n");
      common_vendor.index.setClipboardData({
        data: text,
        success: () => markCopied("all"),
        fail: () => markCopied("all")
      });
    };
    const previewSurveyPoster = () => {
      common_vendor.index.previewImage({
        current: surveyPosterUrl,
        urls: [surveyPosterUrl]
      });
    };
    const openModule = (id, type) => {
      previousModule.value = activeModule.value;
      activeModule.value = id;
      showOfficial.value = false;
      showQr.value = false;
      if (id === "orders" && type !== void 0) {
        const typeMap = ["全部", "待处理", "维修中", "已发货", "未开票", "已开票"];
        if (typeMap[type]) {
          activeOrdersTab.value = typeMap[type];
        }
      }
    };
    const closeModule = () => {
      if (activeModule.value === "order-detail" && (previousModule.value === "track" || previousModule.value === "orders")) {
        activeModule.value = previousModule.value;
        previousModule.value = "";
        return;
      }
      activeModule.value = "";
      previousModule.value = "";
    };
    const openTrackDetail = (order) => {
      trackDetailOrder.value = order.id;
      openModule("order-detail");
    };
    const openOrderDetail = (order) => {
      orderDetailOrder.value = order.id;
      openModule("order-detail");
    };
    const addRepairProduct = () => {
      repairProductSeed += 1;
      repairProducts.value.push({
        id: repairProductSeed,
        name: "",
        model: "",
        serial: "",
        buyDate: "",
        voucher: "",
        voucherList: [],
        faultDesc: "",
        media: []
      });
    };
    const syncRepairSeeds = () => {
      repairProductSeed = Math.max(1, ...repairProducts.value.map((item) => Number(item.id) || 1));
    };
    const normalizeRepairProducts = (products = []) => {
      if (!Array.isArray(products) || !products.length)
        return [defaultRepairProduct()];
      return products.map((item, index) => ({
        id: Number(item.id) || index + 1,
        name: item.name || "",
        model: item.model || "",
        serial: item.serial || "",
        buyDate: item.buyDate || "",
        voucher: item.voucher || "",
        voucherList: Array.isArray(item.voucherList) ? item.voucherList : [],
        faultDesc: item.faultDesc || "",
        media: Array.isArray(item.media) ? item.media : []
      }));
    };
    const restoreRepairDraft = () => {
      try {
        const draft = common_vendor.index.getStorageSync(repairDraftKey);
        if (!draft || !draft.repairForm && !draft.repairProducts)
          return;
        repairForm.value = {
          ...defaultRepairForm(),
          ...draft.repairForm || {}
        };
        repairProducts.value = normalizeRepairProducts(draft.repairProducts);
        syncRepairSeeds();
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/index/index.vue:1960", "restore repair draft fallback:", error);
      }
    };
    const saveRepairDraft = () => {
      try {
        common_vendor.index.setStorageSync(repairDraftKey, {
          repairForm: repairForm.value,
          repairProducts: repairProducts.value,
          updateTime: Date.now()
        });
        showRepairTools.value = false;
        common_vendor.index.showToast({ title: "草稿已保存", icon: "success" });
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/index/index.vue:1974", "save repair draft fallback:", error);
        common_vendor.index.showToast({ title: "保存失败，请稍后重试", icon: "none" });
      }
    };
    const clearRepairForm = () => {
      repairForm.value = defaultRepairForm();
      repairProducts.value = [defaultRepairProduct()];
      repairProductSeed = 1;
      repairMediaSeed = 1;
      common_vendor.index.removeStorageSync(repairDraftKey);
      showRepairTools.value = false;
      common_vendor.index.showToast({ title: "已清空，可重新填写", icon: "none" });
    };
    const confirmClearRepair = () => {
      common_vendor.index.showModal({
        title: "清空当前报修单？",
        content: "清空后，已填写的产品、运单号和附件会被删除，回寄信息会恢复默认值，建议先保存草稿。",
        confirmText: "清空",
        confirmColor: "#E5484D",
        cancelText: "取消",
        success: ({ confirm }) => {
          if (confirm)
            clearRepairForm();
        }
      });
    };
    const removeRepairProduct = (index) => {
      if (repairProducts.value.length <= 1)
        return;
      repairProducts.value.splice(index, 1);
    };
    const normalizeUploadUrl = (res = {}, fallbackPath = "") => res.url || res.fileUrl || res.path || res.fullUrl || fallbackPath;
    const uploadRepairImage = async (index) => {
      const product = repairProducts.value[index];
      if (!product || product.media.length >= 3)
        return;
      try {
        const chooseRes = await common_vendor.index.chooseImage({
          count: 3 - product.media.length,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"]
        });
        const paths = chooseRes.tempFilePaths || [];
        if (!paths.length)
          return;
        common_vendor.index.showLoading({ title: "上传中" });
        for (const path of paths) {
          if (product.media.length >= 3)
            break;
          const uploadRes = await api_content.uploadImage(path);
          repairMediaSeed += 1;
          product.media.push({
            id: `img-${repairMediaSeed}`,
            type: "image",
            path,
            url: normalizeUploadUrl(uploadRes, path)
          });
        }
        common_vendor.index.showToast({ title: "上传成功", icon: "success" });
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/index/index.vue:2036", "upload image fallback:", error);
        common_vendor.index.showToast({ title: "图片上传失败", icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    const uploadRepairVideo = async (index) => {
      const product = repairProducts.value[index];
      if (!product || product.media.length >= 3)
        return;
      try {
        const chooseRes = await common_vendor.index.chooseVideo({
          sourceType: ["album", "camera"],
          compressed: true,
          maxDuration: 60
        });
        if (!chooseRes.tempFilePath)
          return;
        common_vendor.index.showLoading({ title: "上传中" });
        const uploadRes = await api_content.uploadVideo(chooseRes.tempFilePath);
        repairMediaSeed += 1;
        product.media.push({
          id: `vid-${repairMediaSeed}`,
          type: "video",
          path: chooseRes.tempFilePath,
          url: normalizeUploadUrl(uploadRes, chooseRes.tempFilePath),
          duration: chooseRes.duration,
          size: chooseRes.size
        });
        common_vendor.index.showToast({ title: "上传成功", icon: "success" });
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/index/index.vue:2068", "upload video fallback:", error);
        common_vendor.index.showToast({ title: "视频上传失败", icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    const addRepairMedia = (index) => {
      const product = repairProducts.value[index];
      if (!product || product.media.length >= 3)
        return;
      common_vendor.index.showActionSheet({
        itemList: ["上传图片", "上传视频"],
        success: ({ tapIndex }) => {
          if (tapIndex === 0)
            uploadRepairImage(index);
          if (tapIndex === 1)
            uploadRepairVideo(index);
        }
      });
    };
    const removeRepairMedia = (productIndex, mediaId) => {
      const product = repairProducts.value[productIndex];
      if (!product)
        return;
      product.media = product.media.filter((item) => item.id !== mediaId);
    };
    const splitRepairMedia = (media = []) => ({
      images: media.filter((item) => item.type === "image").map((item) => item.url).filter(Boolean),
      videos: media.filter((item) => item.type === "video").map((item) => item.url).filter(Boolean)
    });
    const buildRepairPayload = () => {
      const product = repairProducts.value[0] || {};
      const firstMedia = splitRepairMedia(product.media);
      return {
        productName: product.name || product.model || "维修产品",
        productModel: product.model,
        productSerial: product.serial,
        faultType: product.faultType || product.faultDesc || "待检测",
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
          const media = splitRepairMedia(item.media);
          const voucherUrls = (item.voucherList || []).map((v) => v.url || v.path).filter(Boolean);
          return {
            productName: item.name || item.model || "维修产品",
            productModel: item.model,
            productSerial: item.serial,
            buyDate: item.buyDate,
            voucher: item.voucher,
            voucherImages: voucherUrls,
            faultDesc: item.faultDesc,
            images: media.images,
            videos: media.videos
          };
        })
      };
    };
    const submitRepair = async () => {
      const hasInvalidProduct = repairProducts.value.some((item) => !item.model || !item.serial || !item.faultDesc);
      if (hasInvalidProduct || !repairForm.value.logisticsCompany || !repairForm.value.trackingNo) {
        common_vendor.index.showToast({ title: "请完善必填项信息", icon: "none" });
        return;
      }
      try {
        const res = await api_content.submitRepairOrder(buildRepairPayload());
        submittedOrderId.value = res && res.orderId ? res.orderId : submittedOrderId.value;
        openModule("repair-success");
        loadRemoteContent();
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/index/index.vue:2153", "submit repair fallback:", error);
        common_vendor.index.showToast({ title: "后台接口未开放，已保留表单信息", icon: "none" });
      }
    };
    const openFaultSheet = () => {
      diagOpen.value = "fault";
    };
    const loadFaultResult = async () => {
      if (!diagProduct.value || !diagFault.value)
        return;
      const localRecord = faultRecords.value.find(
        (item) => (item.productTypeId || item.productType || item.productName) === diagProduct.value && item.faultName === diagFault.value
      );
      diagResult.value = localRecord || null;
      try {
        const result = await api_content.searchFault({
          productType: diagProduct.value,
          faultTypeId: localRecord ? localRecord.faultTypeId || localRecord.id || "" : ""
        });
        diagResult.value = result || localRecord || null;
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/index/index.vue:2177", "fault search fallback:", error);
      }
    };
    const selectDiagOption = (item) => {
      if (diagOpen.value === "product") {
        diagProduct.value = item.id;
        if (diagFault.value && !(diagFaultMap.value[item.id] || []).includes(diagFault.value)) {
          diagFault.value = "";
          diagResult.value = null;
        }
      } else {
        diagFault.value = item.title;
        loadFaultResult();
      }
      diagOpen.value = "";
    };
    const resetDiag = () => {
      diagProduct.value = "";
      diagFault.value = "";
      diagOpen.value = "";
      diagResult.value = null;
    };
    const removeVoucher = (productIndex, voucherIndex) => {
      const product = repairProducts.value[productIndex];
      if (!product || !product.voucherList)
        return;
      product.voucherList.splice(voucherIndex, 1);
      product.voucher = product.voucherList.map((v) => v.path).join(",");
    };
    const onDateChange = (productIndex, e) => {
      const product = repairProducts.value[productIndex];
      if (!product)
        return;
      product.buyDate = e.detail.value;
    };
    const previewVoucher = (productIndex, voucherIndex) => {
      const product = repairProducts.value[productIndex];
      const voucher = product && product.voucherList ? product.voucherList[voucherIndex] : null;
      if (!voucher)
        return;
      const urls = (product.voucherList || []).map((item) => item.url || item.path).filter(Boolean);
      if (!urls.length)
        return;
      common_vendor.index.previewImage({
        current: voucher.url || voucher.path,
        urls
      });
    };
    const openVoucherPicker = (productIndex) => {
      const product = repairProducts.value[productIndex];
      if (!product)
        return;
      if (!product.voucherList) {
        product.voucherList = [];
      }
      if (product.voucherList.length >= 3) {
        common_vendor.index.showToast({ title: "最多上传3张凭证", icon: "none" });
        return;
      }
      common_vendor.index.chooseImage({
        count: 3 - product.voucherList.length,
        sourceType: ["album", "camera"],
        sizeType: ["compressed"],
        success: (chooseRes) => {
          const tempFilePaths = chooseRes.tempFilePaths || [];
          tempFilePaths.forEach((path) => {
            product.voucherList.push({
              id: `voucher-${Date.now()}-${Math.random()}`,
              path,
              url: path
            });
          });
          product.voucher = product.voucherList.map((v) => v.path).join(",");
          common_vendor.index.showToast({ title: "上传成功", icon: "success" });
        },
        fail: (error) => {
          common_vendor.index.__f__("warn", "at pages/index/index.vue:2260", "choose image cancelled:", error);
        }
      });
    };
    const parseRegion = (region = "") => {
      const parts = String(region).split("/").map((item) => item.trim());
      return {
        province: parts[0] || "",
        city: parts[1] || "",
        district: parts[2] || ""
      };
    };
    const saveAddress = async () => {
      if (!addressForm.value.name || !addressForm.value.phone || !addressForm.value.detail) {
        common_vendor.index.showToast({ title: "请完善地址信息", icon: "none" });
        return;
      }
      const region = parseRegion(addressForm.value.region);
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
      };
      try {
        if (payload.addressId) {
          await api_content.updateAddress(payload);
        } else {
          const res = await api_content.addAddress(payload);
          addressForm.value.addressId = res && res.addressId ? res.addressId : "";
        }
        common_vendor.index.showToast({ title: "地址已保存", icon: "success" });
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/index/index.vue:2302", "save address fallback:", error);
        common_vendor.index.showToast({ title: "地址接口未开放", icon: "none" });
      }
    };
    const submitFeedback = async () => {
      if (!feedbackText.value || !feedbackContactValue.value) {
        common_vendor.index.showToast({ title: "请填写反馈内容和联系方式", icon: "none" });
        return;
      }
      try {
        await api_content.addComplaint({
          type: feedbackType.value === "投诉" ? 0 : 1,
          content: feedbackText.value,
          contactType: feedbackContactKind.value,
          contact: feedbackContactValue.value,
          orderId: feedbackOrderId.value
        });
        common_vendor.index.showToast({ title: "已提交", icon: "success" });
        feedbackText.value = "";
        feedbackContactValue.value = "";
        feedbackOrderId.value = "";
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/index/index.vue:2326", "submit feedback fallback:", error);
        common_vendor.index.showToast({ title: "投诉建议接口未开放", icon: "none" });
      }
    };
    const loginSuccess = async () => {
      try {
        const loginRes = await common_vendor.index.login({ provider: "weixin" });
        const res = await api_content.wechatLogin({ code: loginRes.code });
        if (res && res.token)
          common_vendor.index.setStorageSync("token", res.token);
        logged.value = true;
        activeModule.value = "";
        activeTab.value = "mine";
        common_vendor.index.showToast({ title: "登录成功", icon: "success" });
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/index/index.vue:2341", "wechat login fallback:", error);
        logged.value = true;
        activeModule.value = "";
        activeTab.value = "mine";
        common_vendor.index.showToast({ title: "登录接口未开放，已进入体验模式", icon: "none" });
      }
    };
    const go = (id, type) => {
      if (tabRoutes[id]) {
        activeTab.value = id;
        activeModule.value = "";
        previousModule.value = "";
        return;
      }
      if (moduleMap[id]) {
        openModule(id, type);
        return;
      }
      common_vendor.index.showToast({ title: "功能已接入当前页面", icon: "none" });
    };
    const openCustomerService = () => {
      common_vendor.index.showToast({ title: "正在连接客服...", icon: "none" });
    };
    const makePhoneCall = () => {
      common_vendor.index.makePhoneCall({
        phoneNumber: "13929198537",
        success: () => {
        },
        fail: (error) => {
          common_vendor.index.__f__("warn", "at pages/index/index.vue:2374", "make phone call failed:", error);
          common_vendor.index.showToast({ title: "拨打电话失败", icon: "none" });
        }
      });
    };
    const handleSearch = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "搜索功能正在优化中，敬请期待！",
        showCancel: false,
        confirmText: "知道了"
      });
    };
    const goOfficial = () => {
      showOfficial.value = false;
      go("company");
    };
    const loadRemoteContent = async () => {
      const tasks = [
        api_content.getWarrantyPolicy().then((doc) => updateDoc("warranty", doc)).catch((error) => common_vendor.index.__f__("warn", "at pages/index/index.vue:2402", "warranty fallback:", error)),
        api_content.getFeePolicy().then((doc) => updateDoc("fees", doc)).catch((error) => common_vendor.index.__f__("warn", "at pages/index/index.vue:2405", "fee fallback:", error)),
        api_content.getGuide("quick").then((doc) => updateDoc("guide-quick", doc)).catch((error) => common_vendor.index.__f__("warn", "at pages/index/index.vue:2408", "quick guide fallback:", error)),
        api_content.getGuide("repair").then((doc) => updateDoc("guide-repair", doc)).catch((error) => common_vendor.index.__f__("warn", "at pages/index/index.vue:2411", "repair guide fallback:", error)),
        api_content.getGuide("query").then((doc) => updateDoc("guide-query", doc)).catch((error) => common_vendor.index.__f__("warn", "at pages/index/index.vue:2414", "query guide fallback:", error)),
        api_content.getGuide("invoice").then((doc) => updateDoc("guide-invoice", doc)).catch((error) => common_vendor.index.__f__("warn", "at pages/index/index.vue:2417", "invoice guide fallback:", error)),
        api_content.getContact().then((data) => applyContact(data)).catch((error) => common_vendor.index.__f__("warn", "at pages/index/index.vue:2420", "contact fallback:", error)),
        api_content.getCustomerService().then((data = {}) => {
          customerService.value = {
            ...customerService.value,
            ...data,
            qrcodeUrl: normalizeQrUrl(data.qrcodeUrl),
            wechat: data.wechat || data.wechatId || customerService.value.wechat
          };
        }).catch((error) => common_vendor.index.__f__("warn", "at pages/index/index.vue:2430", "customer service fallback:", error)),
        api_content.getWechat().then((data = {}) => {
          wechatInfo.value = {
            ...wechatInfo.value,
            ...data,
            qrcodeUrl: normalizeQrUrl(data.qrcodeUrl)
          };
        }).catch((error) => common_vendor.index.__f__("warn", "at pages/index/index.vue:2439", "wechat fallback:", error)),
        api_content.getFaultTypes().then((list) => applyFaultTypes(list)).catch((error) => common_vendor.index.__f__("warn", "at pages/index/index.vue:2442", "fault types fallback:", error)),
        api_content.getRepairList({ page: 1, size: 30 }).then((data = {}) => {
          const list = Array.isArray(data) ? data : data.list;
          if (!Array.isArray(list) || !list.length)
            return;
          const normalized = list.map(normalizeOrder).filter((item) => item.id);
          if (!normalized.length)
            return;
          orderList.value = normalized;
          trackOrders.value = normalized;
        }).catch((error) => common_vendor.index.__f__("warn", "at pages/index/index.vue:2452", "repair list fallback:", error))
      ];
      await Promise.allSettled(tasks);
    };
    common_vendor.onMounted(() => {
      logBoot("onMounted start");
      initModuleSafeArea();
      setTimeout(() => {
        pageBootReady.value = true;
        logBoot("full page enabled");
      }, 80);
      setTimeout(() => {
        logBoot("deferred boot start");
        restoreRepairDraft();
        loadRemoteContent();
      }, 220);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: activeModule.value
      }, activeModule.value ? common_vendor.e({
        b: activeModule.value !== "survey"
      }, activeModule.value !== "survey" ? {
        c: common_vendor.o(closeModule, "b8"),
        d: common_vendor.t(moduleInfo.value.title),
        e: common_vendor.t(moduleInfo.value.subtitle),
        f: common_vendor.s(moduleHeadStyle.value)
      } : {}, {
        g: activeModule.value === "repair"
      }, activeModule.value === "repair" ? {
        h: common_vendor.t(repairProducts.value.length),
        i: common_vendor.f(repairProducts.value, (product, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(index + 1),
            b: common_vendor.t(index + 1)
          }, repairProducts.value.length > 1 ? {
            c: common_vendor.o(($event) => removeRepairProduct(index), product.id)
          } : {}, {
            d: product.name,
            e: common_vendor.o(($event) => product.name = $event.detail.value, product.id),
            f: product.model,
            g: common_vendor.o(($event) => product.model = $event.detail.value, product.id),
            h: product.serial,
            i: common_vendor.o(($event) => product.serial = $event.detail.value, product.id),
            j: common_vendor.t(product.buyDate || "请选择日期"),
            k: !product.buyDate ? 1 : "",
            l: product.buyDate,
            m: common_vendor.o((e) => onDateChange(index, e), product.id),
            n: product.voucherList && product.voucherList.length
          }, product.voucherList && product.voucherList.length ? {
            o: common_vendor.t(product.voucherList.length)
          } : {}, {
            p: common_vendor.o(($event) => openVoucherPicker(index), product.id),
            q: product.voucherList && product.voucherList.length
          }, product.voucherList && product.voucherList.length ? {
            r: common_vendor.f(product.voucherList, (voucher, vIndex, i1) => {
              return {
                a: voucher.url || voucher.path,
                b: common_vendor.o(($event) => removeVoucher(index, vIndex), voucher.id),
                c: voucher.id,
                d: common_vendor.o(($event) => previewVoucher(index, vIndex), voucher.id)
              };
            })
          } : {}, {
            s: product.faultDesc,
            t: common_vendor.o(($event) => product.faultDesc = $event.detail.value, product.id),
            v: common_vendor.t(product.media.length),
            w: common_vendor.f(product.media, (media, k1, i1) => {
              return common_vendor.e({
                a: media.type === "image"
              }, media.type === "image" ? {
                b: media.url || media.path
              } : {}, {
                c: common_vendor.o(($event) => removeRepairMedia(index, media.id), media.id),
                d: media.id
              });
            }),
            x: product.media.length < 3
          }, product.media.length < 3 ? {
            y: common_vendor.o(($event) => addRepairMedia(index), product.id)
          } : {}, {
            z: product.id
          });
        }),
        j: repairProducts.value.length > 1,
        k: common_vendor.o(addRepairProduct, "1e"),
        l: repairForm.value.logisticsCompany,
        m: common_vendor.o(($event) => repairForm.value.logisticsCompany = $event.detail.value, "27"),
        n: repairForm.value.trackingNo,
        o: common_vendor.o(($event) => repairForm.value.trackingNo = $event.detail.value, "11"),
        p: repairForm.value.receiverName,
        q: common_vendor.o(($event) => repairForm.value.receiverName = $event.detail.value, "4f"),
        r: repairForm.value.receiverPhone,
        s: common_vendor.o(($event) => repairForm.value.receiverPhone = $event.detail.value, "3a"),
        t: repairForm.value.receiverAddress,
        v: common_vendor.o(($event) => repairForm.value.receiverAddress = $event.detail.value, "1a"),
        w: repairForm.value.receiverUnit,
        x: common_vendor.o(($event) => repairForm.value.receiverUnit = $event.detail.value, "76"),
        y: common_vendor.o(openCustomerService, "7a"),
        z: common_vendor.o(makePhoneCall, "45"),
        A: common_vendor.f(receiver.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: common_vendor.t(item.value),
            c: common_vendor.o(($event) => copyOne(item.value, item.label), item.label),
            d: item.label
          };
        }),
        B: common_vendor.t(copied.value === "all" ? "已复制" : "一键复制以上收件信息"),
        C: common_vendor.o(copyAll, "db"),
        D: common_vendor.o(openCustomerService, "01"),
        E: common_vendor.o(makePhoneCall, "4e"),
        F: common_vendor.o(($event) => showRepairTools.value = true, "0e"),
        G: common_vendor.o(submitRepair, "f8")
      } : activeModule.value === "repair-success" ? {
        I: common_vendor.o(($event) => copyOne(submittedOrderId.value, "工单号"), "6e"),
        J: common_vendor.t(submittedOrderId.value),
        K: common_vendor.o(closeModule, "9d"),
        L: common_vendor.o(($event) => go("track"), "01")
      } : activeModule.value === "track" ? common_vendor.e({
        N: common_vendor.f(progressTabs, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: activeTrackTab.value === item ? 1 : "",
            d: common_vendor.o(($event) => activeTrackTab.value = item, item)
          };
        }),
        O: common_vendor.f(filteredTrackOrders.value, (order, k0, i0) => {
          return {
            a: common_vendor.t(order.id),
            b: common_vendor.t(order.model),
            c: common_vendor.t(order.status),
            d: common_vendor.n("tag-" + order.tone),
            e: common_vendor.f(repairFlow, (step, index, i1) => {
              return {
                a: common_vendor.t(step),
                b: step,
                c: index <= order.reached ? 1 : ""
              };
            }),
            f: common_vendor.t(order.time),
            g: order.id,
            h: common_vendor.o(($event) => openTrackDetail(order), order.id)
          };
        }),
        P: !filteredTrackOrders.value.length
      }, !filteredTrackOrders.value.length ? {} : {}) : activeModule.value === "package-query" ? common_vendor.e({
        R: common_vendor.o(queryPackage, "2d"),
        S: packageQuery.value.trackingNo,
        T: common_vendor.o(($event) => packageQuery.value.trackingNo = $event.detail.value, "54"),
        U: common_vendor.o(queryPackage, "c8"),
        V: packageQuery.value.phoneLast4,
        W: common_vendor.o(($event) => packageQuery.value.phoneLast4 = $event.detail.value, "f9"),
        X: common_vendor.t(packageQueryLoading.value ? "查询中..." : "立即查询"),
        Y: packageQueryLoading.value ? 1 : "",
        Z: common_vendor.o(queryPackage, "17"),
        aa: packageQueryResult.value
      }, packageQueryResult.value ? {
        ab: common_vendor.t(packageQueryResult.value.trackingNo),
        ac: common_vendor.t(packageQueryResult.value.status),
        ad: common_vendor.n("tag-" + packageQueryResult.value.tone),
        ae: common_vendor.t(packageQueryResult.value.company || "待录入"),
        af: common_vendor.t(packageQueryResult.value.orderId || "待关联"),
        ag: common_vendor.f(packageFlow, (step, index, i0) => {
          return {
            a: common_vendor.t(step),
            b: step,
            c: index <= packageQueryResult.value.reached ? 1 : ""
          };
        }),
        ah: common_vendor.f(packageQueryResult.value.timeline, (item, index, i0) => {
          return common_vendor.e({
            a: index < packageQueryResult.value.timeline.length - 1
          }, index < packageQueryResult.value.timeline.length - 1 ? {} : {}, {
            b: item.pending ? 1 : "",
            c: common_vendor.t(item.title),
            d: item.pending ? 1 : "",
            e: common_vendor.t(item.time),
            f: common_vendor.t(item.desc),
            g: item.title + index
          });
        })
      } : packageQuerySearched.value ? {} : {}, {
        ai: packageQuerySearched.value
      }) : activeModule.value === "order-detail" ? {
        ak: common_vendor.t(detailOrder.value.status),
        al: common_vendor.t(detailOrder.value.id),
        am: common_vendor.t(detailOrder.value.model),
        an: common_vendor.t(detailOrder.value.doneTime),
        ao: common_vendor.f(orderTimeline, (item, index, i0) => {
          return common_vendor.e({
            a: index < orderTimeline.length - 1
          }, index < orderTimeline.length - 1 ? {} : {}, {
            b: item.pending ? 1 : "",
            c: common_vendor.t(item.title),
            d: item.pending ? 1 : "",
            e: common_vendor.t(item.time),
            f: common_vendor.t(item.desc),
            g: item.title
          });
        })
      } : activeModule.value === "survey" ? {
        aq: common_vendor.o(closeModule, "7f"),
        ar: common_vendor.unref(surveyPosterUrl),
        as: common_vendor.o(previewSurveyPoster, "1e"),
        at: common_vendor.o(closeModule, "c2"),
        av: common_vendor.o(($event) => go("contact"), "ef")
      } : activeModule.value === "diag" ? common_vendor.e({
        ax: common_vendor.t(diagProductLabel.value || "请选择产品类型"),
        ay: !diagProductLabel.value ? 1 : "",
        az: common_vendor.o(($event) => diagOpen.value = "product", "51"),
        aA: common_vendor.t(diagFault.value || "请选择故障类型"),
        aB: !diagFault.value ? 1 : "",
        aC: common_vendor.o(openFaultSheet, "1e"),
        aD: diagConfirmVisible.value
      }, diagConfirmVisible.value ? {
        aE: common_vendor.f(diagConfirmSections.value, (section, k0, i0) => {
          return {
            a: section.color,
            b: common_vendor.t(section.title),
            c: common_vendor.f(section.items, (item, index, i1) => {
              return {
                a: common_vendor.t(section.numbered ? index + 1 : "·"),
                b: common_vendor.t(item),
                c: item
              };
            }),
            d: section.title
          };
        }),
        aF: common_vendor.o(resetDiag, "62"),
        aG: common_vendor.o(($event) => go("repair"), "fb")
      } : {}, {
        aH: diagOpen.value
      }, diagOpen.value ? {
        aI: common_vendor.o(($event) => diagOpen.value = "", "3f")
      } : {}, {
        aJ: diagOpen.value
      }, diagOpen.value ? {
        aK: common_vendor.o(($event) => diagOpen.value = "", "34"),
        aL: common_vendor.t(diagOpen.value === "product" ? "选择产品类型" : "选择故障类型"),
        aM: common_vendor.f(diagSheetOptions.value, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.title),
            b: item.active
          }, item.active ? {} : {}, {
            c: item.id,
            d: common_vendor.o(($event) => selectDiagOption(item), item.id)
          });
        })
      } : {}) : activeModule.value === "warranty" ? common_vendor.e({
        aO: common_vendor.t(warrantyDoc.value.title || "三重保修承诺"),
        aP: common_vendor.t(warrantyDoc.value.lead || "原厂配件 · 工艺质保 · 终身咨询"),
        aQ: warrantyDoc.value.content
      }, warrantyDoc.value.content ? {
        aR: warrantyDoc.value.content
      } : {}, {
        aS: common_vendor.f(warrantyDurations, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.duration),
            c: item.name
          };
        }),
        aT: common_vendor.f(warrantyRanges, (item, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: common_vendor.t(item),
            c: item
          };
        }),
        aU: common_vendor.f(warrantyServices, (item, k0, i0) => {
          return {
            a: common_vendor.n("glyph-" + item.icon),
            b: common_vendor.t(item.title),
            c: common_vendor.t(item.desc),
            d: item.title
          };
        }),
        aV: !warrantyDoc.value.content
      }, !warrantyDoc.value.content ? {
        aW: common_vendor.f(warrantyTerms, (section, k0, i0) => {
          return {
            a: common_vendor.t(section.title),
            b: common_vendor.f(section.lines, (line, index, i1) => {
              return {
                a: common_vendor.t(index + 1),
                b: common_vendor.t(line),
                c: line
              };
            }),
            c: section.title
          };
        })
      } : {}) : isDocModule.value ? common_vendor.e({
        aY: activeModule.value === "fees"
      }, activeModule.value === "fees" ? {} : {
        aZ: common_vendor.n("glyph-" + activeDoc.value.icon),
        ba: common_vendor.t(activeDoc.value.title),
        bb: common_vendor.t(activeDoc.value.lead)
      }, {
        bc: activeDoc.value.content
      }, activeDoc.value.content ? {
        bd: activeDoc.value.content
      } : {
        be: common_vendor.t(activeDoc.value.paperTitle),
        bf: common_vendor.f(activeDoc.value.sections, (section, k0, i0) => {
          return {
            a: common_vendor.t(section.title),
            b: common_vendor.f(section.lines, (line, index, i1) => {
              return {
                a: common_vendor.t(section.marker || index + 1 + ")"),
                b: common_vendor.t(line),
                c: line
              };
            }),
            c: section.title
          };
        })
      }, {
        bg: activeDoc.value.steps
      }, activeDoc.value.steps ? {
        bh: common_vendor.f(activeDoc.value.steps, (step, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: common_vendor.t(step.title),
            c: common_vendor.t(step.desc),
            d: step.title
          };
        })
      } : {}, {
        bi: activeModule.value !== "fees"
      }, activeModule.value !== "fees" ? {
        bj: common_vendor.o(($event) => go("contact"), "eb"),
        bk: common_vendor.o(($event) => go("repair"), "c8")
      } : {}) : activeModule.value === "contact" ? {
        bm: common_vendor.t(customerService.value.title || "在线客服"),
        bn: common_vendor.t(customerService.value.description || "7×24 小时 · 即时响应"),
        bo: common_vendor.f(contactHotlines.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.number),
            c: common_vendor.t(item.time),
            d: item.title
          };
        }),
        bp: common_vendor.t(contactInfo.value.companyName),
        bq: common_vendor.f(receiver.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: common_vendor.t(item.value),
            c: item.label
          };
        }),
        br: common_vendor.o(copyAll, "35"),
        bs: common_vendor.f(workTimes.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.day),
            b: common_vendor.t(item.time),
            c: item.day
          };
        })
      } : activeModule.value === "orders" ? common_vendor.e({
        bv: common_vendor.f(orderTabs.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: item.startsWith(activeOrdersTab.value) ? 1 : "",
            d: common_vendor.o(($event) => activeOrdersTab.value = item.split(" ")[0], item)
          };
        }),
        bw: common_vendor.f(filteredOrderList.value, (order, k0, i0) => {
          return {
            a: common_vendor.t(order.id),
            b: common_vendor.t(order.model),
            c: common_vendor.t(order.date),
            d: common_vendor.t(order.status),
            e: common_vendor.n("tag-" + order.tone),
            f: common_vendor.t(order.price),
            g: order.id,
            h: common_vendor.o(($event) => openOrderDetail(order), order.id)
          };
        }),
        bx: !filteredOrderList.value.length
      }, !filteredOrderList.value.length ? {} : {}) : activeModule.value === "products" ? {
        bz: common_vendor.f(productList, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.sn),
            c: common_vendor.t(item.date),
            d: common_vendor.t(item.warranty),
            e: common_vendor.n(item.expired ? "tag-muted" : "tag-ok"),
            f: common_vendor.o(($event) => go("repair"), item.sn),
            g: item.sn
          };
        })
      } : activeModule.value === "address" ? {
        bB: addressForm.value.name,
        bC: common_vendor.o(($event) => addressForm.value.name = $event.detail.value, "db"),
        bD: addressForm.value.phone,
        bE: common_vendor.o(($event) => addressForm.value.phone = $event.detail.value, "f0"),
        bF: addressForm.value.region,
        bG: common_vendor.o(($event) => addressForm.value.region = $event.detail.value, "4a"),
        bH: addressForm.value.detail,
        bI: common_vendor.o(($event) => addressForm.value.detail = $event.detail.value, "64"),
        bJ: addressForm.value.unit,
        bK: common_vendor.o(($event) => addressForm.value.unit = $event.detail.value, "fd"),
        bL: addressForm.value.def ? 1 : "",
        bM: common_vendor.o(($event) => addressForm.value.def = !addressForm.value.def, "67"),
        bN: common_vendor.o(saveAddress, "3f")
      } : activeModule.value === "feedback" ? {
        bP: common_vendor.f(feedbackTypes, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: feedbackType.value === item ? 1 : "",
            d: common_vendor.o(($event) => feedbackType.value = item, item)
          };
        }),
        bQ: common_vendor.t(feedbackType.value === "投诉" ? "收到投诉后，主管会在 24 小时内主动联系您" : "欢迎提出您宝贵的建议，采纳后可获赠小礼品"),
        bR: feedbackType.value === "投诉" ? "请描述问题发生的时间、经过以及您的诉求……" : "请描述您的建议与期望，我们会认真评估……",
        bS: feedbackText.value,
        bT: common_vendor.o(($event) => feedbackText.value = $event.detail.value, "e0"),
        bU: common_vendor.t(feedbackText.value.length),
        bV: common_vendor.f(feedbackContacts, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: item.id,
            c: feedbackContactKind.value === item.id ? 1 : "",
            d: common_vendor.o(($event) => feedbackContactKind.value = item.id, item.id)
          };
        }),
        bW: common_vendor.t(feedbackContact.value.label),
        bX: feedbackContact.value.placeholder,
        bY: feedbackContactValue.value,
        bZ: common_vendor.o(($event) => feedbackContactValue.value = $event.detail.value, "47"),
        ca: feedbackOrderId.value,
        cb: common_vendor.o(($event) => feedbackOrderId.value = $event.detail.value, "5a"),
        cc: common_vendor.t(feedbackType.value),
        cd: common_vendor.o(submitFeedback, "af")
      } : activeModule.value === "login" ? {
        cf: common_vendor.o(loginSuccess, "94"),
        cg: common_vendor.o(loginSuccess, "84")
      } : {}, {
        H: activeModule.value === "repair-success",
        M: activeModule.value === "track",
        Q: activeModule.value === "package-query",
        aj: activeModule.value === "order-detail",
        ap: activeModule.value === "survey",
        aw: activeModule.value === "diag",
        aN: activeModule.value === "warranty",
        aX: isDocModule.value,
        bl: activeModule.value === "contact",
        bt: activeModule.value === "orders",
        by: activeModule.value === "products",
        bA: activeModule.value === "address",
        bO: activeModule.value === "feedback",
        ce: activeModule.value === "login",
        ch: activeModule.value === "survey" ? 1 : ""
      }) : pageBootReady.value ? common_vendor.e({
        cj: activeTab.value === "home"
      }, activeTab.value === "home" ? {
        ck: common_assets._imports_0,
        cl: common_vendor.o(($event) => showQr.value = true, "96"),
        cm: common_vendor.o(($event) => go("contact"), "2e"),
        cn: common_vendor.o(handleSearch, "78"),
        co: searchKeyword.value,
        cp: common_vendor.o(($event) => searchKeyword.value = $event.detail.value, "07"),
        cq: common_vendor.o(handleSearch, "d0"),
        cr: common_vendor.unref(config_cicadaAssets.cicadaAssets).photoFactory,
        cs: common_vendor.f(basics, (item, k0, i0) => {
          return {
            a: common_vendor.n("glyph-" + item.icon),
            b: item.bg,
            c: item.color,
            d: common_vendor.t(item.title),
            e: item.id,
            f: common_vendor.o(($event) => go(item.id), item.id)
          };
        }),
        ct: common_vendor.f(queries, (item, k0, i0) => {
          return {
            a: common_vendor.n("glyph-" + item.icon),
            b: item.bg,
            c: item.color,
            d: common_vendor.t(item.title),
            e: item.id,
            f: common_vendor.o(($event) => go(item.id), item.id)
          };
        }),
        cv: common_vendor.f(guides, (item, k0, i0) => {
          return {
            a: common_vendor.n("glyph-" + item.icon),
            b: common_vendor.t(item.title),
            c: item.id,
            d: common_vendor.o(($event) => go(item.id), item.id)
          };
        }),
        cw: common_vendor.o(openCustomerService, "71"),
        cx: common_vendor.o(makePhoneCall, "ae"),
        cy: common_vendor.f(receiver.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.label),
            b: common_vendor.t(item.value),
            c: copied.value === item.label
          }, copied.value === item.label ? {} : {}, {
            d: common_vendor.o(($event) => copyOne(item.value, item.label), item.label),
            e: item.label,
            f: index === receiverLastIndex.value ? 1 : ""
          });
        }),
        cz: common_vendor.t(copied.value === "all" ? "已复制" : "一键复制以上收件信息"),
        cA: common_vendor.o(copyAll, "da"),
        cB: common_vendor.o(($event) => go("contact"), "83")
      } : activeTab.value === "company" ? {
        cD: common_vendor.unref(config_cicadaAssets.cicadaAssets).logoMark,
        cE: common_vendor.unref(config_cicadaAssets.cicadaAssets).photoBuilding,
        cF: common_vendor.unref(config_cicadaAssets.cicadaAssets).logoFull,
        cG: common_vendor.f(advantages, (item, k0, i0) => {
          return {
            a: common_vendor.n("adv-" + item.icon),
            b: common_vendor.t(item.title),
            c: common_vendor.t(item.desc),
            d: item.title
          };
        }),
        cH: common_vendor.f(business, (item, index, i0) => {
          return {
            a: common_vendor.n("device-" + index),
            b: item.gradient,
            c: common_vendor.t(item.title),
            d: common_vendor.t(item.desc),
            e: item.title
          };
        }),
        cI: wechatInfo.value.qrcodeUrl
      } : common_vendor.e({
        cJ: common_vendor.t(logged.value ? "李" : ""),
        cK: common_vendor.t(logged.value ? "李医生" : "未登录"),
        cL: logged.value
      }, logged.value ? {
        cM: common_vendor.o(($event) => logged.value = false, "66")
      } : {
        cN: common_vendor.o(($event) => go("login"), "74")
      }, {
        cO: common_vendor.o(($event) => go("orders"), "64"),
        cP: common_vendor.f(statusItems.value, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.n("glyph-" + item.icon),
            b: item.count
          }, item.count ? {
            c: common_vendor.t(item.count)
          } : {}, {
            d: item.color,
            e: item.bg,
            f: common_vendor.t(item.title),
            g: item.id,
            h: common_vendor.o(($event) => go("orders", item.type), item.id)
          });
        }),
        cQ: common_vendor.f(menus, (item, index, i0) => {
          return {
            a: common_vendor.n("glyph-" + item.icon),
            b: common_vendor.t(item.title),
            c: common_vendor.t(item.desc),
            d: item.title,
            e: index === menus.length - 1 ? 1 : "",
            f: common_vendor.o(($event) => go(item.go), item.title)
          };
        }),
        cR: common_vendor.unref(config_cicadaAssets.cicadaAssets).logoFull
      }), {
        cC: activeTab.value === "company"
      }) : {
        cS: common_vendor.unref(config_cicadaAssets.cicadaAssets).logoMark
      }, {
        ci: pageBootReady.value,
        cT: !activeModule.value && activeTab.value === "home"
      }, !activeModule.value && activeTab.value === "home" ? {
        cU: common_vendor.o(($event) => showOfficial.value = true, "bd")
      } : {}, {
        cV: !activeModule.value
      }, !activeModule.value ? {
        cW: common_vendor.f(tabs, (item, k0, i0) => {
          return {
            a: common_vendor.n("tab-" + item.icon),
            b: common_vendor.t(item.label),
            c: item.id,
            d: activeTab.value === item.id ? 1 : "",
            e: common_vendor.o(($event) => go(item.id), item.id)
          };
        })
      } : {}, {
        cX: showOfficial.value
      }, showOfficial.value ? {
        cY: common_vendor.o(($event) => showOfficial.value = false, "75"),
        cZ: common_vendor.o(($event) => showOfficial.value = false, "43"),
        da: common_vendor.o(goOfficial, "8d"),
        db: common_vendor.o(() => {
        }, "a2"),
        dc: common_vendor.o(($event) => showOfficial.value = false, "4a")
      } : {}, {
        dd: showQr.value
      }, showQr.value ? {
        de: common_vendor.o(($event) => showQr.value = false, "b6"),
        df: common_vendor.unref(config_cicadaAssets.cicadaAssets).logoFull,
        dg: wechatInfo.value.qrcodeUrl,
        dh: common_vendor.o(($event) => showQr.value = false, "f4"),
        di: common_vendor.o(() => {
        }, "bf"),
        dj: common_vendor.o(($event) => showQr.value = false, "0c")
      } : {}, {
        dk: showRepairTools.value
      }, showRepairTools.value ? {
        dl: common_vendor.o(($event) => showRepairTools.value = false, "08")
      } : {}, {
        dm: showRepairTools.value
      }, showRepairTools.value ? {
        dn: common_vendor.o(saveRepairDraft, "6a"),
        dp: common_vendor.o(confirmClearRepair, "7c"),
        dq: common_vendor.o(($event) => showRepairTools.value = false, "00")
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
