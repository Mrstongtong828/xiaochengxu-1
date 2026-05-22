"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const config_cicadaAssets = require("../../config/cicada-assets.js");
const api_content = require("../../api/content.js");
if (!Math) {
  BottomTabbar();
}
const BottomTabbar = () => "../../components/BottomTabbar.js";
const repairDraftKey = "repairDraft";
const localOrderPatchKey = "repairOrderLocalPatches";
const feedbackRecordKey = "feedbackRecords";
const maxRepairImageSize = 10 * 1024 * 1024;
const maxRepairVideoSize = 50 * 1024 * 1024;
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const bootStart = Date.now();
    const logBoot = (stage) => common_vendor.index.__f__("log", "at pages/index/index.vue:1353", "[index-boot]", stage, Date.now() - bootStart);
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
    const logged = common_vendor.ref(Boolean(common_vendor.index.getStorageSync("token")));
    const currentUser = common_vendor.ref(common_vendor.index.getStorageSync("userInfo") || {});
    const diagProduct = common_vendor.ref("");
    const diagFault = common_vendor.ref("");
    const diagOpen = common_vendor.ref("");
    const activeTrackTab = common_vendor.ref("全部");
    const activeOrdersTab = common_vendor.ref("全部");
    const trackSearchKeyword = common_vendor.ref("");
    const activeInvoiceTab = common_vendor.ref("待开票");
    const activeInvoiceOrderId = common_vendor.ref("");
    const trackDetailOrder = common_vendor.ref("");
    const orderDetailOrder = common_vendor.ref("");
    const packageQueryLoading = common_vendor.ref(false);
    const packageQuerySearched = common_vendor.ref(false);
    const repairSubmitting = common_vendor.ref(false);
    const invoiceSubmitting = common_vendor.ref(false);
    const paymentProofUploading = common_vendor.ref(false);
    const feedbackType = common_vendor.ref("建议");
    const feedbackContactKind = common_vendor.ref("phone");
    const feedbackText = common_vendor.ref("");
    const logisticsList = [
      { value: "顺丰快递", label: "顺丰快递" },
      { value: "申通快递", label: "申通快递" },
      { value: "中通快递", label: "中通快递" },
      { value: "德邦快递", label: "德邦快递" },
      { value: "圆通快递", label: "圆通快递" },
      { value: "韵达快递", label: "韵达快递" },
      { value: "中国邮政", label: "中国邮政" },
      { value: "京东快递", label: "京东快递" },
      { value: "极兔快递", label: "极兔快递" },
      { value: "菜鸟裹裹", label: "菜鸟裹裹" },
      { value: "信丰快递", label: "信丰快递" },
      { value: "其他", label: "其他" }
    ];
    const showLogisticsPicker = common_vendor.ref(false);
    const feedbackContactValue = common_vendor.ref("");
    const feedbackOrderId = common_vendor.ref("");
    const feedbackRecords = common_vendor.ref([]);
    const packageQuery = common_vendor.ref({
      trackingNo: "",
      phoneLast4: ""
    });
    const packageQueryResult = common_vendor.ref(null);
    const invoiceForm = common_vendor.ref({
      invoiceType: "电子普通发票",
      titleType: "company",
      title: "",
      taxNo: "",
      email: "",
      remark: ""
    });
    const addressForm = common_vendor.ref({
      addressId: "",
      name: "",
      phone: "",
      region: "",
      detail: "",
      unit: "",
      def: false
    });
    const defaultRepairForm = () => ({
      logisticsCompany: "顺丰速运",
      trackingNo: "",
      sendMethod: "顺丰取件",
      receiverName: "",
      receiverPhone: "",
      receiverAddress: "",
      receiverUnit: ""
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
    const submittedOrderId = common_vendor.ref("");
    const repairProducts = common_vendor.ref([defaultRepairProduct()]);
    const orderLocalPatches = common_vendor.ref({});
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
    const companyStats = [
      { value: "20", label: "年品牌积累", desc: "品牌发展经验" },
      { value: "27", label: "产品线", desc: "覆盖诊疗场景" },
      { value: "195", label: "出口国家", desc: "服务全球市场" },
      { value: "150", label: "专利成果", desc: "持续研发创新" }
    ];
    const companyIntro = [
      "CICADA Dental（思科达 / 登煌医疗）是扎根佛山的口腔医疗设备研发制造品牌。",
      "公司从光固化设备制造起步，逐步发展为覆盖根管治疗设备、牙科手机、电动微马达、牙齿美白仪及临床辅助器械的综合口腔解决方案提供商。",
      "我们坚持以安全与质量为核心，通过研发、制造、售后和培训协同，为牙科专业人士提供稳定、高效、易用的设备支持。"
    ];
    const companyAdvantages = [
      { icon: "lightning", title: "研发制造", desc: "高标准研发中心，配套来自德国、日本、韩国等地的精密设备，支撑产品快速迭代。" },
      { icon: "microscope", title: "质量合规", desc: "围绕医疗器械安全标准建立质量体系，产品满足国内外相关行业标准与注册要求。" }
    ];
    const companyProductLines = [
      { title: "根管治疗设备", desc: "覆盖根管马达、根管测量、热牙胶充填、冲洗等临床根管治疗场景。", gradient: "linear-gradient(135deg, #2C5985 0%, #6BB0CC 100%)" },
      { title: "牙科手机与电动微马达", desc: "提供高速手机、增速弯机、电动微马达等高效、低噪、稳定的动力设备。", gradient: "linear-gradient(135deg, #3D6F9E 0%, #6BB0CC 100%)" },
      { title: "光固化与美白设备", desc: "以光固化灯为起点，延伸到牙齿美白仪及修复、美学相关设备。", gradient: "linear-gradient(135deg, #0A4FB8 0%, #6BB0CC 100%)" },
      { title: "洁牙抛光与辅助器械", desc: "覆盖喷砂抛光、临床器械及耗材配套，满足诊所日常诊疗效率需求。", gradient: "linear-gradient(135deg, #1D8A96 0%, #7BC9C7 100%)" }
    ];
    const companyServiceTags = ["及时售后", "临床培训", "全球服务网络"];
    const defaultStatusItems = [
      { id: "all", title: "全部", count: 0, color: "#1E6FE0", bg: "rgba(30, 111, 224, 0.09)", icon: "invoice", type: 0 },
      { id: "pending", title: "待处理", count: 0, color: "#F59E0B", bg: "rgba(245, 158, 11, 0.09)", icon: "track", type: "pending" },
      { id: "fixing", title: "维修中", count: 0, color: "#0EA5E9", bg: "rgba(14, 165, 233, 0.09)", icon: "repair", type: "维修中" },
      { id: "shipped", title: "已发货", count: 0, color: "#10B981", bg: "rgba(16, 185, 129, 0.09)", icon: "truck", type: "已发货" }
    ];
    const menus = [
      { icon: "pin", title: "收货地址管理", desc: "多地址 · 默认回寄地址", go: "address" },
      { icon: "edit", title: "投诉和建议", desc: "问题反馈 / 改进建议", go: "feedback" },
      { icon: "box", title: "我的产品", desc: "登录后查看已登记设备", go: "products" },
      { icon: "invoice", title: "发票与开票", desc: "申请开票 / 下载电子发票", go: "invoices" },
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
      track: { title: "维修进度", subtitle: "按标准售后节点查看维修闭环进度" },
      "package-query": { title: "包裹查询", subtitle: "按快递单号查询是否签收和当前处理状态" },
      "order-detail": { title: "工单详情", subtitle: "维修时间线与发票进度" },
      survey: { title: "调研有礼", subtitle: "扫码参与调研，领取专属维保福利" },
      diag: { title: "故障自查", subtitle: "选择产品类型和故障类型，查看排查建议" },
      warranty: { title: "保修政策", subtitle: "文字形式展示保修范围、期限和注意事项" },
      fees: { title: "收费指南", subtitle: "文字形式展示收费办法和常见项目" },
      "guide-quick": { title: "快速指南", subtitle: "以图文文档形式浏览操作说明" },
      "guide-repair": { title: "报修指南", subtitle: "了解寄修报修的完整流程" },
      "guide-query": { title: "查询指南", subtitle: "查看进度查询和结果确认办法" },
      "guide-invoice": { title: "开票指南", subtitle: "了解发票申请、抬头和寄送说明" },
      invoices: { title: "发票与开票", subtitle: "申请开票、查看进度与复制电子发票" },
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
    const showBottomTabbar = common_vendor.computed(() => pageBootReady.value && activeModule.value !== "survey" && activeModule.value !== "repair");
    const repairStatusFlow = ["已提交", "已寄出", "已签收", "检测中", "待报价", "待确认", "维修中", "已发货", "已完成", "已评价"];
    const pendingRepairStatuses = ["已提交", "已寄出", "已签收", "检测中", "待报价", "待确认"];
    const progressTabs = ["全部", ...repairStatusFlow];
    const repairFlow = ["提交", "寄出", "签收", "检测", "报价", "确认", "维修", "发货", "完成", "评价"];
    const packageFlow = ["待签收", "已签收", "已登记", "处理中", "已关联"];
    const invoiceFlow = [
      { title: "待申请", desc: "选择已完成工单" },
      { title: "审核中", desc: "客服核对抬头与金额" },
      { title: "开票中", desc: "财务开具电子发票" },
      { title: "已开票", desc: "复制链接查看发票" }
    ];
    const invoiceTitleTypes = [
      { value: "company", label: "企业单位", desc: "适合诊所 / 医院" },
      { value: "personal", label: "个人", desc: "无需填写税号" }
    ];
    const trackOrders = common_vendor.ref([]);
    const orderList = common_vendor.ref([]);
    const productList = common_vendor.ref([]);
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
    const phoneRegex = /^1[3-9]\d{9}$/;
    const trackingNoRegex = /^[A-Za-z0-9-]{6,32}$/;
    const normalizePhone = (value = "") => String(value || "").replace(/\D/g, "");
    const normalizeTrackingNo = (value = "") => String(value || "").replace(/\s/g, "").trim();
    const isValidPhone = (value = "") => phoneRegex.test(normalizePhone(value));
    const isValidTrackingNo = (value = "") => trackingNoRegex.test(normalizeTrackingNo(value));
    const isFileTooLarge = (file = {}, limit = maxRepairImageSize) => Number(file.size || 0) > limit;
    const formatFileSize = (size) => `${Math.round(size / 1024 / 1024)}MB`;
    const formatMoney = (value) => {
      if (value === void 0 || value === null || value === "")
        return "待确认";
      const numberValue = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
      if (!Number.isFinite(numberValue))
        return "待确认";
      return `¥${numberValue.toFixed(2)}`;
    };
    const todayText = () => {
      const date = /* @__PURE__ */ new Date();
      const pad = (num) => String(num).padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    };
    const feedbackTicketNo = () => `FB-${todayText().replace(/-/g, "")}-${String(Date.now()).slice(-4)}`;
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
    const selectLogistics = (item) => {
      repairForm.value.logisticsCompany = item.value;
      showLogisticsPicker.value = false;
    };
    const scanTrackingNo = () => {
      common_vendor.index.scanCode({
        onlyFromCamera: false,
        scanType: ["qrCode", "barCode"],
        success: (res) => {
          if (res.result) {
            repairForm.value.trackingNo = res.result;
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/index/index.vue:1899", "扫码失败:", err);
        }
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
    const repairStatusAliases = {
      0: "已提交",
      1: "维修中",
      2: "已发货",
      3: "已完成",
      submitted: "已提交",
      created: "已提交",
      pending: "已提交",
      sent: "已寄出",
      mailed: "已寄出",
      received: "已签收",
      signed: "已签收",
      checking: "检测中",
      inspecting: "检测中",
      quoted: "待报价",
      quote_pending: "待报价",
      waiting_quote: "待报价",
      confirming: "待确认",
      waiting_confirm: "待确认",
      fixing: "维修中",
      repairing: "维修中",
      shipped: "已发货",
      completed: "已完成",
      done: "已完成",
      reviewed: "已评价",
      rated: "已评价",
      cancelled: "已取消",
      canceled: "已取消"
    };
    const repairStatusMeta = repairStatusFlow.reduce((acc, label, index) => {
      acc[label] = {
        status: label,
        statusGroup: label,
        tone: index < 3 ? "muted" : index < 6 ? "warn" : "ok",
        reached: index
      };
      return acc;
    }, {
      已取消: { status: "已取消", statusGroup: "已取消", tone: "muted", reached: 0 }
    });
    const normalizeRepairStatus = (value, fallback = "已提交") => {
      const raw = value === void 0 || value === null ? "" : String(value).trim();
      if (!raw)
        return fallback;
      return repairStatusAliases[raw] || repairStatusAliases[raw.toLowerCase()] || raw;
    };
    const packageStatusMeta = {
      0: { status: "暂未签收", tone: "muted", reached: 0 },
      1: { status: "已签收待登记", tone: "warn", reached: 1 },
      2: { status: "已登记待检测", tone: "warn", reached: 2 },
      3: { status: "处理中", tone: "warn", reached: 3 },
      4: { status: "已关联工单", tone: "ok", reached: 4 },
      5: { status: "已完成", tone: "ok", reached: 4 }
    };
    const formatDateTime = (value = "", sliceStart = 0, sliceEnd = 16) => {
      if (!value)
        return "";
      if (typeof value === "number") {
        const date = new Date(value);
        if (Number.isNaN(date.getTime()))
          return "";
        const pad = (num) => String(num).padStart(2, "0");
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`.slice(sliceStart, sliceEnd);
      }
      return String(value).slice(sliceStart, sliceEnd);
    };
    const formatOrderListPrice = (order = {}) => {
      const rawValue = order.totalFee || order.amount || order.price;
      if (rawValue === void 0 || rawValue === null || rawValue === "")
        return "—";
      const numberValue = Number(String(rawValue).replace(/[^\d.-]/g, ""));
      if (!Number.isFinite(numberValue) || numberValue <= 0)
        return "—";
      return `¥${Number.isInteger(numberValue) ? numberValue : numberValue.toFixed(2)}`;
    };
    const getOrderStatusTone = (order = {}) => {
      if (order.statusGroup === "维修中")
        return "warn";
      if (order.statusGroup === "已发货" || order.statusGroup === "已完成" || order.statusGroup === "已评价")
        return "ok";
      if (order.statusGroup === "已取消")
        return "muted";
      return order.tone || "info";
    };
    const normalizeOrder = (item = {}) => {
      var _a, _b, _c, _d;
      const statusText = normalizeRepairStatus(item.statusText || item.statusName || item.status);
      const meta = repairStatusMeta[statusText] || {
        status: statusText,
        statusGroup: statusText,
        tone: "muted",
        reached: Math.max(0, repairStatusFlow.indexOf(statusText))
      };
      const orderId = item.orderNo || item.orderId || item.id || item._id || "";
      const createTime = item.createTime || item.createdAt || item.date || "";
      const updateTime = item.updateTime || item.updatedAt || createTime;
      const localPatch = orderLocalPatches.value[orderId] || {};
      const merged = { ...item, ...localPatch };
      const quoteItems = normalizeQuoteItems({ ...merged, status: statusText, statusGroup: meta.statusGroup });
      const partsFee = Number(merged.partsFee ?? merged.materialFee ?? ((_a = merged.quote) == null ? void 0 : _a.partsFee) ?? sumQuoteFee(quoteItems, "partsFee")) || 0;
      const laborFee = Number(merged.laborFee ?? merged.workFee ?? ((_b = merged.quote) == null ? void 0 : _b.laborFee) ?? sumQuoteFee(quoteItems, "laborFee")) || 0;
      const totalFee = Number(merged.totalFee ?? merged.amount ?? merged.price ?? ((_c = merged.quote) == null ? void 0 : _c.totalFee) ?? partsFee + laborFee) || 0;
      return {
        id: orderId,
        model: merged.productModel || merged.productName || merged.model || merged.deviceName || "维修设备",
        status: statusText,
        statusGroup: meta.statusGroup,
        tone: meta.tone,
        reached: meta.reached,
        time: formatDateTime(updateTime, 5, 16) || merged.time || "",
        price: merged.price || merged.amount || merged.totalFee || (totalFee ? formatMoney(totalFee) : ""),
        date: formatDateTime(createTime, 0, 10),
        doneTime: merged.doneTime || merged.expectedDoneTime || "待后台同步",
        invoiceStatus: merged.invoiceStatus,
        invoiced: merged.invoiced,
        invoiceTitle: merged.invoiceTitle,
        invoiceNo: merged.invoiceNo,
        invoiceDate: merged.invoiceDate,
        invoiceUrl: merged.invoiceUrl,
        quoteStatus: merged.quoteStatus || ((_d = merged.quote) == null ? void 0 : _d.status) || (quoteItems.length ? "issued" : "pending"),
        authorizationStatus: merged.authorizationStatus || merged.authStatus || (localPatch.authorizationStatus || ""),
        paymentStatus: merged.paymentStatus || (Array.isArray(merged.paymentProofs) && merged.paymentProofs.length ? "uploaded" : "pending"),
        quoteItems,
        partsFee,
        laborFee,
        totalFee,
        paymentProofs: Array.isArray(merged.paymentProofs) ? merged.paymentProofs : [],
        timeline: Array.isArray(merged.timeline) ? merged.timeline : []
      };
    };
    const readStorage = (key, fallback) => {
      try {
        const value = common_vendor.index.getStorageSync(key);
        return value || fallback;
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/index/index.vue:2056", "read storage fallback:", key, error);
        return fallback;
      }
    };
    const writeStorage = (key, value) => {
      try {
        common_vendor.index.setStorageSync(key, value);
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/index/index.vue:2065", "write storage fallback:", key, error);
      }
    };
    const createDemoQuoteItems = (item = {}) => {
      const isQuoteStage = ["待确认", "维修中", "已发货", "已完成", "已评价"].includes(item.statusGroup || item.status);
      if (!isQuoteStage)
        return [];
      return [
        { name: "故障检测与清洁", desc: "拆机检测、清洁消毒与基础调试", partsFee: 0, laborFee: 80 },
        { name: "轴承/密封件更换", desc: "按检测结果更换磨损配件", partsFee: 180, laborFee: 120 }
      ];
    };
    const normalizeQuoteItems = (item = {}) => {
      var _a, _b;
      const rawItems = item.quoteItems || item.repairItems || ((_a = item.quote) == null ? void 0 : _a.items) || ((_b = item.quotation) == null ? void 0 : _b.items);
      const list = Array.isArray(rawItems) && rawItems.length ? rawItems : createDemoQuoteItems(item);
      return list.map((row = {}) => ({
        name: row.name || row.title || row.projectName || "维修项目",
        desc: row.desc || row.description || row.remark || "",
        partsFee: Number(row.partsFee ?? row.partFee ?? row.materialFee ?? row.partsAmount ?? 0) || 0,
        laborFee: Number(row.laborFee ?? row.workFee ?? row.serviceFee ?? row.laborAmount ?? 0) || 0
      }));
    };
    const sumQuoteFee = (items = [], key) => items.reduce((total, item) => total + (Number(item[key]) || 0), 0);
    const normalizeProduct = (item = {}) => ({
      title: item.title || item.name || item.productName || item.model || "已登记设备",
      sn: item.sn || item.serial || item.productSerial || item.id || "",
      date: item.buyDate || item.purchaseDate || item.date || "",
      warranty: item.warrantyText || item.warranty || item.warrantyStatus || "保修信息待同步",
      expired: Boolean(item.expired || item.isExpired)
    });
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
        common_vendor.index.__f__("warn", "at pages/index/index.vue:2154", "package query failed:", error);
        packageQuerySearched.value = true;
        common_vendor.index.showToast({ title: error.message || "暂未查到包裹记录", icon: "none" });
      } finally {
        packageQueryLoading.value = false;
      }
    };
    const scanPackageCode = () => {
      common_vendor.index.scanCode({
        scanType: ["qrCode", "barCode"],
        success: (res) => {
          if (res.result) {
            packageQuery.value.trackingNo = res.result.trim();
            common_vendor.index.showToast({ title: "已识别单号", icon: "success" });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("warn", "at pages/index/index.vue:2172", "scan failed:", err);
          common_vendor.index.showToast({ title: "扫码失败", icon: "none" });
        }
      });
    };
    const pastePackageCode = () => {
      common_vendor.index.getClipboardData({
        success: (res) => {
          if (res.data && res.data.trim()) {
            packageQuery.value.trackingNo = res.data.trim();
            common_vendor.index.showToast({ title: "已粘贴单号", icon: "success" });
          } else {
            common_vendor.index.showToast({ title: "剪贴板为空", icon: "none" });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("warn", "at pages/index/index.vue:2189", "get clipboard failed:", err);
          common_vendor.index.showToast({ title: "获取剪贴板失败", icon: "none" });
        }
      });
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
          if (pendingRepairStatuses.includes(item.statusGroup))
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
    const countOrdersByStatus = (status) => orderList.value.filter((item) => item.statusGroup === status).length;
    const orderTabs = common_vendor.computed(() => [
      { key: "全部", label: "全部", count: orderList.value.length },
      { key: "待处理", label: "待处理", count: orderList.value.filter((item) => pendingRepairStatuses.includes(item.statusGroup)).length },
      { key: "维修中", label: "维修中", count: countOrdersByStatus("维修中") },
      { key: "已发货", label: "已发货", count: countOrdersByStatus("已发货") },
      { key: "未开票", label: "未开票", count: orderList.value.filter((item) => invoiceTodoStatusKeys.includes(getInvoiceStatusKey(item))).length },
      { key: "已开票", label: "已开票", count: orderList.value.filter((item) => getInvoiceStatusKey(item) === "issued").length }
    ]);
    const invoiceTodoStatusKeys = ["available", "processing", "reviewing", "approved", "issuing"];
    const invoiceTodoOrders = common_vendor.computed(() => orderList.value.filter((item) => invoiceTodoStatusKeys.includes(getInvoiceStatusKey(item))));
    const invoiceIssuedOrders = common_vendor.computed(() => orderList.value.filter((item) => getInvoiceStatusKey(item) === "issued"));
    const invoiceTabs = common_vendor.computed(() => [
      `待开票 ${invoiceTodoOrders.value.length}`,
      `已开票 ${invoiceIssuedOrders.value.length}`
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
    const userDisplayName = common_vendor.computed(() => currentUser.value.nickname || currentUser.value.name || (currentUser.value.phone ? `用户${String(currentUser.value.phone).slice(-4)}` : "已登录用户"));
    const userDisplayUnit = common_vendor.computed(() => currentUser.value.unit || currentUser.value.companyName || "已绑定手机号");
    const userAvatarText = common_vendor.computed(() => String(userDisplayName.value || "用").slice(0, 1));
    const feedbackContact = common_vendor.computed(() => feedbackContacts.find((item) => item.id === feedbackContactKind.value) || feedbackContacts[0]);
    const receiverLastIndex = common_vendor.computed(() => receiver.value.length - 1);
    const filteredTrackOrders = common_vendor.computed(() => {
      const keyword = trackSearchKeyword.value.trim().toLowerCase();
      return trackOrders.value.filter((item) => {
        const statusMatched = activeTrackTab.value === "全部" || item.statusGroup === activeTrackTab.value;
        if (!statusMatched)
          return false;
        if (!keyword)
          return true;
        const searchable = [item.id, item.model, item.serial, item.productSerial, item.trackingNo].filter(Boolean).join(" ").toLowerCase();
        return searchable.includes(keyword);
      });
    });
    const filteredOrderList = common_vendor.computed(() => {
      if (activeOrdersTab.value === "待处理")
        return orderList.value.filter((item) => pendingRepairStatuses.includes(item.statusGroup));
      if (activeOrdersTab.value === "未开票")
        return orderList.value.filter((item) => invoiceTodoStatusKeys.includes(getInvoiceStatusKey(item)));
      if (activeOrdersTab.value === "已开票")
        return orderList.value.filter((item) => getInvoiceStatusKey(item) === "issued");
      const matchedStatus = repairStatusFlow.find((status) => activeOrdersTab.value === status);
      if (matchedStatus)
        return orderList.value.filter((item) => item.statusGroup === matchedStatus);
      return orderList.value;
    });
    const detailOrder = common_vendor.computed(() => {
      const sourceId = trackDetailOrder.value || orderDetailOrder.value;
      return trackOrders.value.find((item) => item.id === sourceId) || orderList.value.find((item) => item.id === sourceId) || {};
    });
    const detailTimeline = common_vendor.computed(() => {
      const timeline = detailOrder.value.timeline;
      if (Array.isArray(timeline) && timeline.length)
        return normalizePackageTimeline(timeline);
      if (!detailOrder.value.id)
        return [];
      return [
        {
          title: detailOrder.value.status || "已提交",
          desc: "工单进度已同步，更多节点会在后台更新后展示。",
          time: detailOrder.value.time || detailOrder.value.date || "",
          pending: false
        }
      ];
    });
    const detailInvoiceOrder = common_vendor.computed(() => resolveOrderRecord(detailOrder.value));
    const activeInvoiceOrder = common_vendor.computed(() => orderList.value.find((item) => item.id === activeInvoiceOrderId.value) || {});
    const detailQuoteItems = common_vendor.computed(() => Array.isArray(detailOrder.value.quoteItems) ? detailOrder.value.quoteItems : []);
    const detailPaymentProofs = common_vendor.computed(() => Array.isArray(detailOrder.value.paymentProofs) ? detailOrder.value.paymentProofs : []);
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
        common_vendor.index.__f__("warn", "at pages/index/index.vue:2377", "safe area fallback:", error);
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
    function resolveOrderRecord(order = {}) {
      return orderList.value.find((item) => item.id === order.id) || order || {};
    }
    const patchOrderRecord = (orderId, patch = {}) => {
      if (!orderId)
        return;
      const nextPatch = {
        ...orderLocalPatches.value[orderId] || {},
        ...patch
      };
      orderLocalPatches.value = {
        ...orderLocalPatches.value,
        [orderId]: nextPatch
      };
      writeStorage(localOrderPatchKey, orderLocalPatches.value);
      const applyPatch = (list) => list.map((item) => item.id === orderId ? { ...item, ...nextPatch } : item);
      orderList.value = applyPatch(orderList.value);
      trackOrders.value = applyPatch(trackOrders.value);
    };
    const getQuoteTotal = (order = {}) => Number(order.totalFee || 0) || sumQuoteFee(order.quoteItems || [], "partsFee") + sumQuoteFee(order.quoteItems || [], "laborFee");
    const getQuoteMeta = (order = {}) => {
      if (!order.id)
        return { label: "待同步", tone: "muted", desc: "请选择一个工单查看报价。" };
      if (!Array.isArray(order.quoteItems) || !order.quoteItems.length)
        return { label: "待检测", tone: "muted", desc: "工程师检测完成后会生成正式报价。" };
      if (order.quoteStatus === "rejected")
        return { label: "已拒绝", tone: "warn", desc: "客户暂未同意该维修报价。" };
      if (order.authorizationStatus === "confirmed")
        return { label: "已确认", tone: "ok", desc: "报价已确认，工程师可继续维修。" };
      return { label: "待确认", tone: "warn", desc: "请确认维修项目、配件、工时和总价后再授权维修。" };
    };
    const getAuthorizationMeta = (order = {}) => {
      if (!Array.isArray(order.quoteItems) || !order.quoteItems.length)
        return { label: "待报价", tone: "muted", desc: "检测报价生成后才需要授权。" };
      if (order.authorizationStatus === "confirmed")
        return { label: "已授权", tone: "ok", desc: order.authorizationTime ? `客户已于 ${order.authorizationTime} 授权维修。` : "客户已授权维修。" };
      return { label: "待授权", tone: "warn", desc: "客户确认报价后，后台再安排维修。" };
    };
    const getPaymentMeta = (order = {}) => {
      const proofs = Array.isArray(order.paymentProofs) ? order.paymentProofs : [];
      if (!getQuoteTotal(order))
        return { label: "待报价", tone: "muted", desc: "报价金额确认后，可上传付款或对公转账凭证。" };
      if (proofs.length || order.paymentStatus === "uploaded")
        return { label: "待核销", tone: "warn", desc: "凭证已留痕，等待财务核对到账。" };
      if (order.paymentStatus === "paid")
        return { label: "已支付", tone: "ok", desc: "财务已确认到账。" };
      return { label: "待上传", tone: "muted", desc: "如该维修需要收费，请上传支付截图或对公转账凭证。" };
    };
    const canConfirmRepair = (order = {}) => Array.isArray(order.quoteItems) && order.quoteItems.length && order.authorizationStatus !== "confirmed";
    const canUploadPaymentProof = (order = {}) => Boolean(order.id && getQuoteTotal(order) > 0);
    const confirmRepairAuthorization = (order = {}) => {
      if (!canConfirmRepair(order))
        return;
      common_vendor.index.showModal({
        title: "确认维修授权",
        content: `确认报价总额 ${formatMoney(getQuoteTotal(order))}，并授权工程师继续维修？`,
        confirmText: "确认授权",
        cancelText: "再看看",
        success: ({ confirm }) => {
          if (!confirm)
            return;
          patchOrderRecord(order.id, {
            authorizationStatus: "confirmed",
            authorizationTime: todayText(),
            quoteStatus: "confirmed"
          });
          common_vendor.index.showToast({ title: "已授权维修", icon: "success" });
        }
      });
    };
    const uploadPaymentProof = async (order = {}) => {
      if (!canUploadPaymentProof(order) || paymentProofUploading.value)
        return;
      try {
        const chooseRes = await common_vendor.index.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"]
        });
        const path = chooseRes.tempFilePaths && chooseRes.tempFilePaths[0];
        if (!path)
          return;
        const oversized = (chooseRes.tempFiles || []).find((file) => isFileTooLarge(file, maxRepairImageSize));
        if (oversized) {
          common_vendor.index.showToast({ title: `图片不能超过${formatFileSize(maxRepairImageSize)}`, icon: "none" });
          return;
        }
        paymentProofUploading.value = true;
        common_vendor.index.showLoading({ title: "上传中" });
        let proofUrl = path;
        try {
          const uploadRes = await api_content.uploadImage(path);
          proofUrl = normalizeUploadUrl(uploadRes, path);
        } catch (error) {
          common_vendor.index.__f__("warn", "at pages/index/index.vue:2498", "payment proof upload fallback:", error);
        }
        const nextProofs = [
          ...Array.isArray(order.paymentProofs) ? order.paymentProofs : [],
          { id: `pay-${Date.now()}`, path, url: proofUrl, time: todayText() }
        ];
        patchOrderRecord(order.id, {
          paymentStatus: "uploaded",
          paymentProofs: nextProofs
        });
        common_vendor.index.showToast({ title: "凭证已留痕", icon: "success" });
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/index/index.vue:2510", "choose payment proof failed:", error);
        common_vendor.index.showToast({ title: "上传凭证失败", icon: "none" });
      } finally {
        paymentProofUploading.value = false;
        common_vendor.index.hideLoading();
      }
    };
    const previewPaymentProof = (index = 0) => {
      const urls = detailPaymentProofs.value.map((item) => item.url || item.path).filter(Boolean);
      if (!urls.length)
        return;
      common_vendor.index.previewImage({
        current: urls[index] || urls[0],
        urls
      });
    };
    function getInvoiceStatusKey(order = {}) {
      if (order.invoiceStatus)
        return order.invoiceStatus;
      if (order.invoiced)
        return "issued";
      if (order.status === "已取消")
        return "disabled";
      if (["已完成", "已评价"].includes(order.statusGroup) || ["已完成", "已评价"].includes(order.status))
        return "available";
      return "unavailable";
    }
    function getInvoiceMeta(order = {}) {
      const status = getInvoiceStatusKey(order);
      const metaMap = {
        available: { label: "可申请", tone: "ok", stage: "待申请", desc: "维修已完成，可申请电子普通发票。" },
        processing: { label: "审核中", tone: "warn", stage: "审核中", desc: "申请已提交，客服正在核对抬头、税号和维修金额。" },
        reviewing: { label: "审核中", tone: "warn", stage: "审核中", desc: "申请已提交，客服正在核对抬头、税号和维修金额。" },
        approved: { label: "开票中", tone: "info", stage: "开票中", desc: "开票资料已审核通过，等待财务开具电子发票。" },
        issuing: { label: "开票中", tone: "info", stage: "开票中", desc: "财务正在开具电子发票，完成后会同步链接。" },
        issued: { label: "已开票", tone: "ok", stage: "已开票", desc: "电子发票已开具，可复制链接查看。" },
        unavailable: { label: "待完成", tone: "muted", stage: "不可申请", desc: "维修完成并结算后即可申请开票。" },
        disabled: { label: "不可开票", tone: "muted", stage: "不可申请", desc: "该订单暂不支持开票。" }
      };
      return metaMap[status] || metaMap.unavailable;
    }
    const resetInvoiceForm = (order = {}) => {
      invoiceForm.value = {
        invoiceType: "电子普通发票",
        titleType: "company",
        title: order.invoiceTitle || addressForm.value.unit || "",
        taxNo: order.taxNo || "",
        email: order.invoiceEmail || "",
        remark: ""
      };
    };
    const startInvoiceApply = (order = {}) => {
      const sourceOrder = resolveOrderRecord(order);
      const status = getInvoiceStatusKey(sourceOrder);
      if (status === "processing") {
        common_vendor.index.showToast({ title: "发票正在开具中", icon: "none" });
        return;
      }
      if (status !== "available") {
        common_vendor.index.showToast({ title: getInvoiceMeta(sourceOrder).desc, icon: "none" });
        return;
      }
      resetInvoiceForm(sourceOrder);
      activeInvoiceOrderId.value = sourceOrder.id;
    };
    const cancelInvoiceApply = () => {
      activeInvoiceOrderId.value = "";
    };
    const submitInvoiceApply = async () => {
      if (invoiceSubmitting.value)
        return;
      const order = activeInvoiceOrder.value;
      if (!order.id) {
        common_vendor.index.showToast({ title: "请选择开票工单", icon: "none" });
        return;
      }
      if (!invoiceForm.value.title.trim()) {
        common_vendor.index.showToast({ title: "请填写发票抬头", icon: "none" });
        return;
      }
      if (invoiceForm.value.titleType === "company" && !invoiceForm.value.taxNo.trim()) {
        common_vendor.index.showToast({ title: "请填写税号", icon: "none" });
        return;
      }
      if (!invoiceForm.value.email.trim()) {
        common_vendor.index.showToast({ title: "请填写接收邮箱", icon: "none" });
        return;
      }
      invoiceSubmitting.value = true;
      try {
        await api_content.applyInvoice({
          orderId: order.id,
          invoiceType: invoiceForm.value.invoiceType,
          titleType: invoiceForm.value.titleType,
          title: invoiceForm.value.title.trim(),
          taxNo: invoiceForm.value.titleType === "company" ? invoiceForm.value.taxNo.trim() : "",
          email: invoiceForm.value.email.trim(),
          remark: invoiceForm.value.remark.trim()
        });
        patchOrderRecord(order.id, {
          invoiceStatus: "processing",
          invoiceType: invoiceForm.value.invoiceType,
          invoiceTitle: invoiceForm.value.title.trim(),
          taxNo: invoiceForm.value.titleType === "company" ? invoiceForm.value.taxNo.trim() : "",
          invoiceEmail: invoiceForm.value.email.trim()
        });
        activeInvoiceOrderId.value = "";
        activeInvoiceTab.value = "待开票";
        common_vendor.index.showModal({
          title: "提交成功",
          content: "开票申请已提交，后续会在发票与开票中同步审核、开票和电子发票链接。",
          showCancel: false,
          confirmText: "知道了"
        });
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/index/index.vue:2635", "submit invoice failed:", error);
        patchOrderRecord(order.id, {
          invoiceStatus: "processing",
          invoiceType: invoiceForm.value.invoiceType,
          invoiceTitle: invoiceForm.value.title.trim(),
          taxNo: invoiceForm.value.titleType === "company" ? invoiceForm.value.taxNo.trim() : "",
          invoiceEmail: invoiceForm.value.email.trim()
        });
        activeInvoiceOrderId.value = "";
        activeInvoiceTab.value = "待开票";
        common_vendor.index.showModal({
          title: "已记录开票申请",
          content: "当前开票接口暂未开放，前端已先保留申请记录；后台上线后可同步审核、开票状态和电子发票链接。",
          showCancel: false,
          confirmText: "知道了"
        });
      } finally {
        invoiceSubmitting.value = false;
      }
    };
    const copyInvoiceLink = (order = {}) => {
      const sourceOrder = resolveOrderRecord(order);
      const invoiceLink = sourceOrder.invoiceUrl;
      if (!invoiceLink) {
        common_vendor.index.showToast({ title: "暂无电子发票链接", icon: "none" });
        return;
      }
      common_vendor.index.setClipboardData({
        data: invoiceLink,
        success: () => common_vendor.index.showToast({ title: "发票链接已复制", icon: "success" }),
        fail: () => common_vendor.index.showToast({ title: "复制失败", icon: "none" })
      });
    };
    const handleInvoiceAction = (order = {}) => {
      const sourceOrder = resolveOrderRecord(order);
      const status = getInvoiceStatusKey(sourceOrder);
      if (status === "issued") {
        copyInvoiceLink(sourceOrder);
        return;
      }
      activeModule.value = "invoices";
      activeInvoiceTab.value = "待开票";
      if (status === "available")
        startInvoiceApply(sourceOrder);
    };
    const restoreLocalBusinessState = () => {
      orderLocalPatches.value = readStorage(localOrderPatchKey, {});
      const records = readStorage(feedbackRecordKey, []);
      feedbackRecords.value = Array.isArray(records) ? records : [];
    };
    const saveFeedbackRecords = () => {
      writeStorage(feedbackRecordKey, feedbackRecords.value);
    };
    const getFeedbackMeta = (record = {}) => {
      const metaMap = {
        submitted: { label: "已提交", tone: "info" },
        processing: { label: "处理中", tone: "warn" },
        replied: { label: "已回复", tone: "ok" },
        closed: { label: "已完成", tone: "ok" }
      };
      return metaMap[record.status] || metaMap.submitted;
    };
    const addLocalFeedbackRecord = (status = "submitted") => {
      const ticketNo = feedbackTicketNo();
      const record = {
        ticketNo,
        type: feedbackType.value,
        content: feedbackText.value.trim(),
        contactType: feedbackContactKind.value,
        contact: feedbackContactValue.value.trim(),
        orderId: feedbackOrderId.value.trim(),
        status,
        reply: "",
        time: todayText()
      };
      feedbackRecords.value = [record, ...feedbackRecords.value].slice(0, 10);
      saveFeedbackRecords();
      return record;
    };
    const previewSurveyPoster = () => {
      common_vendor.index.previewImage({
        current: surveyPosterUrl,
        urls: [surveyPosterUrl]
      });
    };
    const openModule = (id, type) => {
      if (id === "address") {
        openAddressPage();
        return;
      }
      previousModule.value = activeModule.value;
      activeModule.value = id;
      showOfficial.value = false;
      showQr.value = false;
      if (id === "invoices") {
        activeInvoiceOrderId.value = "";
        activeInvoiceTab.value = "待开票";
      }
      if (id === "orders" && type !== void 0) {
        const typeMap = ["全部", "待处理", "维修中", "已发货", "未开票", "已开票"];
        if (typeof type === "string") {
          activeOrdersTab.value = type === "pending" ? "待处理" : type;
        } else if (typeMap[type]) {
          activeOrdersTab.value = typeMap[type];
        }
      }
    };
    const closeModule = () => {
      if (activeModule.value === "order-detail" && (previousModule.value === "track" || previousModule.value === "orders" || previousModule.value === "invoices")) {
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
        common_vendor.index.__f__("warn", "at pages/index/index.vue:2823", "restore repair draft fallback:", error);
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
        common_vendor.index.__f__("warn", "at pages/index/index.vue:2837", "save repair draft fallback:", error);
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
        const oversized = (chooseRes.tempFiles || []).find((file) => isFileTooLarge(file, maxRepairImageSize));
        if (oversized) {
          common_vendor.index.showToast({ title: `图片不能超过${formatFileSize(maxRepairImageSize)}`, icon: "none" });
          return;
        }
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
        common_vendor.index.__f__("warn", "at pages/index/index.vue:2904", "upload image fallback:", error);
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
        if (isFileTooLarge(chooseRes, maxRepairVideoSize)) {
          common_vendor.index.showToast({ title: `视频不能超过${formatFileSize(maxRepairVideoSize)}`, icon: "none" });
          return;
        }
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
        common_vendor.index.__f__("warn", "at pages/index/index.vue:2940", "upload video fallback:", error);
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
      const trackingNo = normalizeTrackingNo(repairForm.value.trackingNo);
      const receiverPhone = normalizePhone(repairForm.value.receiverPhone);
      return {
        status: "submitted",
        statusText: "已提交",
        productName: (product.name || product.model || "维修产品").trim(),
        productModel: String(product.model || "").trim(),
        productSerial: String(product.serial || "").trim(),
        faultType: product.faultType || product.faultDesc || "待检测",
        faultDesc: String(product.faultDesc || "").trim(),
        images: firstMedia.images,
        videos: firstMedia.videos,
        logisticsCompany: repairForm.value.logisticsCompany,
        trackingNo,
        sendMethod: repairForm.value.sendMethod,
        senderName: String(repairForm.value.receiverName || "").trim(),
        senderPhone: receiverPhone,
        senderAddress: String(repairForm.value.receiverAddress || "").trim(),
        receiverName: String(repairForm.value.receiverName || "").trim(),
        receiverPhone,
        receiverAddress: String(repairForm.value.receiverAddress || "").trim(),
        receiverUnit: String(repairForm.value.receiverUnit || "").trim(),
        products: repairProducts.value.map((item) => {
          const media = splitRepairMedia(item.media);
          const voucherUrls = (item.voucherList || []).map((v) => v.url || v.path).filter(Boolean);
          return {
            productName: (item.name || item.model || "维修产品").trim(),
            productModel: String(item.model || "").trim(),
            productSerial: String(item.serial || "").trim(),
            buyDate: item.buyDate,
            voucher: item.voucher,
            voucherImages: voucherUrls,
            faultDesc: String(item.faultDesc || "").trim(),
            images: media.images,
            videos: media.videos
          };
        })
      };
    };
    const validateRepairForm = () => {
      for (let index = 0; index < repairProducts.value.length; index += 1) {
        const product = repairProducts.value[index] || {};
        const label = `第 ${index + 1} 个产品`;
        if (!String(product.serial || "").trim()) {
          common_vendor.index.showToast({ title: `${label}请填写序列号`, icon: "none" });
          return false;
        }
        if (!String(product.faultDesc || "").trim()) {
          common_vendor.index.showToast({ title: `${label}请填写故障描述`, icon: "none" });
          return false;
        }
        if (!Array.isArray(product.media) || !product.media.length) {
          common_vendor.index.showToast({ title: `${label}请上传故障附件`, icon: "none" });
          return false;
        }
      }
      if (!repairForm.value.logisticsCompany) {
        common_vendor.index.showToast({ title: "请选择物流公司", icon: "none" });
        return false;
      }
      if (!isValidTrackingNo(repairForm.value.trackingNo)) {
        common_vendor.index.showToast({ title: "请输入正确运单号", icon: "none" });
        return false;
      }
      if (!String(repairForm.value.receiverName || "").trim()) {
        common_vendor.index.showToast({ title: "请填写收货人", icon: "none" });
        return false;
      }
      if (!isValidPhone(repairForm.value.receiverPhone)) {
        common_vendor.index.showToast({ title: "请输入正确手机号", icon: "none" });
        return false;
      }
      if (!String(repairForm.value.receiverAddress || "").trim()) {
        common_vendor.index.showToast({ title: "请填写详细地址", icon: "none" });
        return false;
      }
      if (!String(repairForm.value.receiverUnit || "").trim()) {
        common_vendor.index.showToast({ title: "请填写单位名称", icon: "none" });
        return false;
      }
      repairForm.value.trackingNo = normalizeTrackingNo(repairForm.value.trackingNo);
      repairForm.value.receiverPhone = normalizePhone(repairForm.value.receiverPhone);
      return true;
    };
    const submitRepair = async () => {
      if (repairSubmitting.value)
        return;
      if (!validateRepairForm())
        return;
      repairSubmitting.value = true;
      try {
        const res = await api_content.submitRepairOrder(buildRepairPayload());
        submittedOrderId.value = res && (res.orderNo || res.orderId || res.id) ? res.orderNo || res.orderId || res.id : "";
        common_vendor.index.removeStorageSync(repairDraftKey);
        openModule("repair-success");
        loadRemoteContent();
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/index/index.vue:3079", "submit repair failed:", error);
        common_vendor.index.showToast({ title: error.message || "报修接口暂未开放，已保留草稿", icon: "none" });
      } finally {
        repairSubmitting.value = false;
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
        common_vendor.index.__f__("warn", "at pages/index/index.vue:3105", "fault search fallback:", error);
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
          const oversized = (chooseRes.tempFiles || []).find((file) => isFileTooLarge(file, maxRepairImageSize));
          if (oversized) {
            common_vendor.index.showToast({ title: `凭证图片不能超过${formatFileSize(maxRepairImageSize)}`, icon: "none" });
            return;
          }
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
          common_vendor.index.__f__("warn", "at pages/index/index.vue:3193", "choose image cancelled:", error);
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
      const phoneRegex2 = /^1[3-9]\d{9}$/;
      if (!phoneRegex2.test(addressForm.value.phone.replace(/\s/g, ""))) {
        common_vendor.index.showToast({ title: "请输入正确的手机号", icon: "none" });
        return;
      }
      const region = parseRegion(addressForm.value.region);
      const payload = {
        addressId: addressForm.value.addressId,
        name: addressForm.value.name,
        phone: addressForm.value.phone.replace(/\s/g, ""),
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
          if (res && res.addressId) {
            addressForm.value.addressId = res.addressId;
          }
        }
        common_vendor.index.showToast({ title: "地址已保存", icon: "success" });
        setTimeout(() => {
          closeModule();
        }, 1500);
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/index/index.vue:3247", "save address fallback:", error);
        common_vendor.index.showToast({
          title: error.message || "保存地址失败，请重试",
          icon: "none"
        });
      }
    };
    const selectRegion = () => {
      common_vendor.index.showToast({
        title: "地区选择功能开发中",
        icon: "none"
      });
    };
    const resetAddressForm = () => {
      addressForm.value = {
        addressId: "",
        name: "",
        phone: "",
        region: "",
        detail: "",
        unit: "",
        def: false
      };
    };
    const handleDeleteAddress = async () => {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "删除后将无法恢复，确定要删除这个地址吗？",
        confirmText: "删除",
        confirmColor: "#EF4444",
        success: async (res) => {
          if (res.confirm) {
            try {
              await api_content.deleteAddress(addressForm.value.addressId);
              resetAddressForm();
              common_vendor.index.showToast({ title: "删除成功", icon: "success" });
              setTimeout(() => {
                closeModule();
              }, 1500);
            } catch (error) {
              common_vendor.index.__f__("warn", "at pages/index/index.vue:3290", "delete address fallback:", error);
              common_vendor.index.showToast({ title: "地址接口未开放", icon: "none" });
            }
          }
        }
      });
    };
    const submitFeedback = async () => {
      if (!feedbackText.value.trim() || !feedbackContactValue.value.trim()) {
        common_vendor.index.showToast({ title: "请填写反馈内容和联系方式", icon: "none" });
        return;
      }
      try {
        await api_content.addComplaint({
          type: feedbackType.value === "投诉" ? 0 : 1,
          content: feedbackText.value.trim(),
          contactType: feedbackContactKind.value,
          contact: feedbackContactValue.value.trim(),
          orderId: feedbackOrderId.value.trim()
        });
        const record = addLocalFeedbackRecord("submitted");
        common_vendor.index.showModal({
          title: "提交成功",
          content: `反馈单号：${record.ticketNo}。客服回复和处理状态会在“我的反馈单”中展示。`,
          showCancel: false,
          confirmText: "知道了"
        });
        feedbackText.value = "";
        feedbackContactValue.value = "";
        feedbackOrderId.value = "";
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/index/index.vue:3323", "submit feedback fallback:", error);
        const record = addLocalFeedbackRecord("submitted");
        common_vendor.index.showModal({
          title: "已生成反馈单",
          content: `反馈单号：${record.ticketNo}。当前投诉建议接口未开放，前端已先保留记录；后台上线后可同步客服回复与处理状态。`,
          showCancel: false,
          confirmText: "知道了"
        });
        feedbackText.value = "";
        feedbackContactValue.value = "";
        feedbackOrderId.value = "";
      }
    };
    const onGetPhoneNumberLogin = async (event) => {
      if (event.detail.errMsg !== "getPhoneNumber:ok") {
        if (event.detail.errMsg && event.detail.errMsg.includes("cancel"))
          return;
        common_vendor.index.showToast({ title: "授权失败，请重试", icon: "none" });
        return;
      }
      if (!event.detail.code) {
        common_vendor.index.showToast({ title: "获取手机号授权失败", icon: "none" });
        return;
      }
      try {
        const res = await api_content.wechatLogin({ code: event.detail.code });
        if (!res || !res.token) {
          common_vendor.index.showToast({ title: "登录响应缺少 token", icon: "none" });
          return;
        }
        common_vendor.index.setStorageSync("token", res.token);
        common_vendor.index.setStorageSync("userInfo", res.userInfo || {});
        common_vendor.index.setStorageSync("isLoggedIn", true);
        currentUser.value = res.userInfo || {};
        logged.value = true;
        activeModule.value = "";
        activeTab.value = "mine";
        common_vendor.index.showToast({ title: "登录成功", icon: "success" });
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/index/index.vue:3365", "wechat phone login failed:", error);
        common_vendor.index.showToast({ title: error.message || "登录接口暂未开放", icon: "none" });
      }
    };
    const logoutLocal = () => {
      common_vendor.index.removeStorageSync("token");
      common_vendor.index.removeStorageSync("userInfo");
      common_vendor.index.removeStorageSync("isLoggedIn");
      currentUser.value = {};
      logged.value = false;
    };
    const go = (id, type) => {
      if (tabRoutes[id]) {
        activeTab.value = id;
        activeModule.value = "";
        previousModule.value = "";
        return;
      }
      if (id === "address") {
        openAddressPage();
        return;
      }
      if (moduleMap[id]) {
        openModule(id, type);
        return;
      }
      common_vendor.index.showToast({ title: "功能已接入当前页面", icon: "none" });
    };
    const openAddressPage = () => {
      common_vendor.index.navigateTo({
        url: "/pages/address/index",
        fail: () => common_vendor.index.showToast({ title: "收货地址页面暂不可用", icon: "none" })
      });
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
          common_vendor.index.__f__("warn", "at pages/index/index.vue:3415", "make phone call failed:", error);
          common_vendor.index.showToast({ title: "拨打电话失败", icon: "none" });
        }
      });
    };
    const callPhone = (phoneNumber) => {
      common_vendor.index.makePhoneCall({
        phoneNumber: phoneNumber.replace(/\s/g, ""),
        success: () => {
        },
        fail: (error) => {
          common_vendor.index.__f__("warn", "at pages/index/index.vue:3426", "make phone call failed:", error);
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
    common_vendor.onLoad((options = {}) => {
      const type = Number(options.type);
      const routeType = Number.isInteger(type) ? type : void 0;
      if (options.module && moduleMap[options.module]) {
        openModule(options.module, routeType);
        return;
      }
      if (routeType !== void 0) {
        openModule("orders", routeType);
      }
    });
    const loadRemoteContent = async () => {
      const tasks = [
        api_content.getWarrantyPolicy().then((doc) => updateDoc("warranty", doc)).catch((error) => common_vendor.index.__f__("warn", "at pages/index/index.vue:3468", "warranty fallback:", error)),
        api_content.getFeePolicy().then((doc) => updateDoc("fees", doc)).catch((error) => common_vendor.index.__f__("warn", "at pages/index/index.vue:3471", "fee fallback:", error)),
        api_content.getGuide("quick").then((doc) => updateDoc("guide-quick", doc)).catch((error) => common_vendor.index.__f__("warn", "at pages/index/index.vue:3474", "quick guide fallback:", error)),
        api_content.getGuide("repair").then((doc) => updateDoc("guide-repair", doc)).catch((error) => common_vendor.index.__f__("warn", "at pages/index/index.vue:3477", "repair guide fallback:", error)),
        api_content.getGuide("query").then((doc) => updateDoc("guide-query", doc)).catch((error) => common_vendor.index.__f__("warn", "at pages/index/index.vue:3480", "query guide fallback:", error)),
        api_content.getGuide("invoice").then((doc) => updateDoc("guide-invoice", doc)).catch((error) => common_vendor.index.__f__("warn", "at pages/index/index.vue:3483", "invoice guide fallback:", error)),
        api_content.getContact().then((data) => applyContact(data)).catch((error) => common_vendor.index.__f__("warn", "at pages/index/index.vue:3486", "contact fallback:", error)),
        api_content.getCustomerService().then((data = {}) => {
          customerService.value = {
            ...customerService.value,
            ...data,
            qrcodeUrl: normalizeQrUrl(data.qrcodeUrl),
            wechat: data.wechat || data.wechatId || customerService.value.wechat
          };
        }).catch((error) => common_vendor.index.__f__("warn", "at pages/index/index.vue:3496", "customer service fallback:", error)),
        api_content.getWechat().then((data = {}) => {
          wechatInfo.value = {
            ...wechatInfo.value,
            ...data,
            qrcodeUrl: normalizeQrUrl(data.qrcodeUrl)
          };
        }).catch((error) => common_vendor.index.__f__("warn", "at pages/index/index.vue:3505", "wechat fallback:", error)),
        api_content.getFaultTypes().then((list) => applyFaultTypes(list)).catch((error) => common_vendor.index.__f__("warn", "at pages/index/index.vue:3508", "fault types fallback:", error)),
        api_content.getProductList({ page: 1, size: 50 }).then((data = {}) => {
          const list = Array.isArray(data) ? data : data.list;
          productList.value = Array.isArray(list) ? list.map(normalizeProduct).filter((item) => item.sn || item.title) : [];
        }).catch((error) => common_vendor.index.__f__("warn", "at pages/index/index.vue:3514", "product list failed:", error)),
        api_content.getRepairList({ page: 1, size: 30 }).then((data = {}) => {
          const list = Array.isArray(data) ? data : data.list;
          if (!Array.isArray(list))
            return;
          orderLocalPatches.value = readStorage(localOrderPatchKey, orderLocalPatches.value || {});
          const normalized = list.map(normalizeOrder).filter((item) => item.id);
          orderList.value = normalized;
          trackOrders.value = normalized;
        }).catch((error) => common_vendor.index.__f__("warn", "at pages/index/index.vue:3524", "repair list failed:", error))
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
        restoreLocalBusinessState();
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
        c: common_vendor.o(closeModule, "73"),
        d: common_vendor.t(moduleInfo.value.title),
        e: common_vendor.t(moduleInfo.value.subtitle),
        f: common_vendor.s(moduleHeadStyle.value)
      } : {}, {
        g: activeModule.value === "repair"
      }, activeModule.value === "repair" ? common_vendor.e({
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
            f: product.serial,
            g: common_vendor.o(($event) => product.serial = $event.detail.value, product.id),
            h: common_vendor.t(product.buyDate || "请选择日期"),
            i: !product.buyDate ? 1 : "",
            j: product.buyDate,
            k: common_vendor.o((e) => onDateChange(index, e), product.id),
            l: product.voucherList && product.voucherList.length
          }, product.voucherList && product.voucherList.length ? {
            m: common_vendor.t(product.voucherList.length)
          } : {}, {
            n: common_vendor.o(($event) => openVoucherPicker(index), product.id),
            o: product.voucherList && product.voucherList.length
          }, product.voucherList && product.voucherList.length ? {
            p: common_vendor.f(product.voucherList, (voucher, vIndex, i1) => {
              return {
                a: voucher.url || voucher.path,
                b: common_vendor.o(($event) => removeVoucher(index, vIndex), voucher.id),
                c: voucher.id,
                d: common_vendor.o(($event) => previewVoucher(index, vIndex), voucher.id)
              };
            })
          } : {}, {
            q: product.faultDesc,
            r: common_vendor.o(($event) => product.faultDesc = $event.detail.value, product.id),
            s: common_vendor.t(product.media.length),
            t: common_vendor.f(product.media, (media, k1, i1) => {
              return common_vendor.e({
                a: media.type === "image"
              }, media.type === "image" ? {
                b: media.url || media.path
              } : {}, {
                c: common_vendor.o(($event) => removeRepairMedia(index, media.id), media.id),
                d: media.id
              });
            }),
            v: product.media.length < 3
          }, product.media.length < 3 ? {
            w: common_vendor.o(($event) => addRepairMedia(index), product.id)
          } : {}, {
            x: product.id
          });
        }),
        j: repairProducts.value.length > 1,
        k: common_vendor.o(addRepairProduct, "a3"),
        l: common_vendor.t(repairForm.value.logisticsCompany || "请选择物流公司"),
        m: common_vendor.o(($event) => showLogisticsPicker.value = true, "7a"),
        n: repairForm.value.trackingNo,
        o: common_vendor.o(($event) => repairForm.value.trackingNo = $event.detail.value, "06"),
        p: common_vendor.o(scanTrackingNo, "d5"),
        q: repairForm.value.receiverName,
        r: common_vendor.o(($event) => repairForm.value.receiverName = $event.detail.value, "3f"),
        s: repairForm.value.receiverPhone,
        t: common_vendor.o(($event) => repairForm.value.receiverPhone = $event.detail.value, "ae"),
        v: repairForm.value.receiverAddress,
        w: common_vendor.o(($event) => repairForm.value.receiverAddress = $event.detail.value, "bd"),
        x: repairForm.value.receiverUnit,
        y: common_vendor.o(($event) => repairForm.value.receiverUnit = $event.detail.value, "5d"),
        z: common_vendor.o(($event) => callPhone("13929945417"), "c5"),
        A: common_vendor.o(($event) => callPhone("13929924257"), "29"),
        B: common_vendor.o(($event) => callPhone("13927263445"), "ab"),
        C: common_vendor.o(($event) => callPhone("13927700164"), "41"),
        D: common_vendor.o(($event) => callPhone("+8613929924346"), "8b"),
        E: common_vendor.o(($event) => showRepairTools.value = true, "a8"),
        F: common_vendor.t(repairSubmitting.value ? "提交中..." : "立即提交报修"),
        G: repairSubmitting.value ? 1 : "",
        H: common_vendor.o(submitRepair, "9e"),
        I: showLogisticsPicker.value
      }, showLogisticsPicker.value ? {
        J: common_vendor.o(($event) => showLogisticsPicker.value = false, "7e")
      } : {}, {
        K: showLogisticsPicker.value
      }, showLogisticsPicker.value ? {
        L: common_vendor.o(($event) => showLogisticsPicker.value = false, "98"),
        M: common_vendor.f(logisticsList, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.label),
            b: repairForm.value.logisticsCompany === item.value
          }, repairForm.value.logisticsCompany === item.value ? {} : {}, {
            c: item.value,
            d: common_vendor.o(($event) => selectLogistics(item), item.value)
          });
        })
      } : {}) : activeModule.value === "repair-success" ? {
        O: common_vendor.o(($event) => copyOne(submittedOrderId.value, "工单号"), "75"),
        P: common_vendor.t(submittedOrderId.value || "工单号待后台返回"),
        Q: common_vendor.o(closeModule, "92"),
        R: common_vendor.o(($event) => go("track"), "59")
      } : activeModule.value === "track" ? common_vendor.e({
        T: trackSearchKeyword.value,
        U: common_vendor.o(common_vendor.m(($event) => trackSearchKeyword.value = $event.detail.value, {
          trim: true
        }), "f8"),
        V: common_vendor.f(progressTabs, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: activeTrackTab.value === item ? 1 : "",
            d: common_vendor.o(($event) => activeTrackTab.value = item, item)
          };
        }),
        W: common_vendor.f(filteredTrackOrders.value, (order, k0, i0) => {
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
        X: !filteredTrackOrders.value.length
      }, !filteredTrackOrders.value.length ? {} : {}) : activeModule.value === "package-query" ? common_vendor.e({
        Z: common_vendor.o(queryPackage, "a9"),
        aa: packageQuery.value.trackingNo,
        ab: common_vendor.o(($event) => packageQuery.value.trackingNo = $event.detail.value, "86"),
        ac: common_vendor.o(scanPackageCode, "5f"),
        ad: common_vendor.o(pastePackageCode, "bb"),
        ae: common_vendor.o(queryPackage, "00"),
        af: packageQuery.value.phoneLast4,
        ag: common_vendor.o(($event) => packageQuery.value.phoneLast4 = $event.detail.value, "68"),
        ah: common_vendor.t(packageQueryLoading.value ? "查询中..." : "立即查询"),
        ai: packageQueryLoading.value ? 1 : "",
        aj: common_vendor.o(queryPackage, "4d"),
        ak: packageQueryResult.value
      }, packageQueryResult.value ? {
        al: common_vendor.t(packageQueryResult.value.trackingNo),
        am: common_vendor.t(packageQueryResult.value.status),
        an: common_vendor.n("tag-" + packageQueryResult.value.tone),
        ao: common_vendor.t(packageQueryResult.value.company || "待录入"),
        ap: common_vendor.t(packageQueryResult.value.orderId || "待关联"),
        aq: common_vendor.f(packageFlow, (step, index, i0) => {
          return {
            a: common_vendor.t(step),
            b: step,
            c: index <= packageQueryResult.value.reached ? 1 : ""
          };
        }),
        ar: common_vendor.f(packageQueryResult.value.timeline, (item, index, i0) => {
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
        as: packageQuerySearched.value
      }) : activeModule.value === "invoices" ? common_vendor.e({
        av: common_vendor.f(invoiceFlow, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.desc),
            c: item.title
          };
        }),
        aw: !activeInvoiceOrderId.value
      }, !activeInvoiceOrderId.value ? {
        ax: common_vendor.f(invoiceTabs.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: item.startsWith(activeInvoiceTab.value) ? 1 : "",
            d: common_vendor.o(($event) => activeInvoiceTab.value = item.split(" ")[0], item)
          };
        })
      } : {}, {
        ay: activeInvoiceOrderId.value
      }, activeInvoiceOrderId.value ? common_vendor.e({
        az: common_vendor.t(activeInvoiceOrder.value.id),
        aA: common_vendor.t(activeInvoiceOrder.value.price),
        aB: common_vendor.o(cancelInvoiceApply, "e1"),
        aC: common_vendor.t(invoiceForm.value.invoiceType),
        aD: common_vendor.f(invoiceTitleTypes, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: common_vendor.t(item.desc),
            c: item.value,
            d: invoiceForm.value.titleType === item.value ? 1 : "",
            e: common_vendor.o(($event) => invoiceForm.value.titleType = item.value, item.value)
          };
        }),
        aE: invoiceForm.value.title,
        aF: common_vendor.o(($event) => invoiceForm.value.title = $event.detail.value, "e0"),
        aG: invoiceForm.value.titleType === "company"
      }, invoiceForm.value.titleType === "company" ? {
        aH: invoiceForm.value.taxNo,
        aI: common_vendor.o(($event) => invoiceForm.value.taxNo = $event.detail.value, "22")
      } : {}, {
        aJ: invoiceForm.value.email,
        aK: common_vendor.o(($event) => invoiceForm.value.email = $event.detail.value, "6f"),
        aL: invoiceForm.value.remark,
        aM: common_vendor.o(($event) => invoiceForm.value.remark = $event.detail.value, "89"),
        aN: common_vendor.t(invoiceSubmitting.value ? "提交中..." : "确认提交"),
        aO: invoiceSubmitting.value ? 1 : "",
        aP: common_vendor.o(submitInvoiceApply, "e0")
      }) : activeInvoiceTab.value === "待开票" ? common_vendor.e({
        aR: common_vendor.f(invoiceFlow, (item, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: common_vendor.t(item.title),
            c: item.title
          };
        }),
        aS: common_vendor.f(invoiceTodoOrders.value, (order, k0, i0) => {
          return {
            a: common_vendor.t(order.id),
            b: common_vendor.t(order.model),
            c: common_vendor.t(getInvoiceMeta(order).label),
            d: common_vendor.n("tag-" + getInvoiceMeta(order).tone),
            e: common_vendor.t(order.price),
            f: common_vendor.t(order.date),
            g: common_vendor.t(getInvoiceMeta(order).stage),
            h: common_vendor.t(order.invoiceUrl ? "已生成" : "待开具"),
            i: common_vendor.o(($event) => openOrderDetail(order), order.id),
            j: common_vendor.t(getInvoiceStatusKey(order) === "available" ? "申请开票" : getInvoiceMeta(order).label),
            k: getInvoiceStatusKey(order) !== "available" ? 1 : "",
            l: common_vendor.o(($event) => startInvoiceApply(order), order.id),
            m: order.id
          };
        }),
        aT: !invoiceTodoOrders.value.length
      }, !invoiceTodoOrders.value.length ? {} : {}) : common_vendor.e({
        aU: common_vendor.f(invoiceIssuedOrders.value, (order, k0, i0) => {
          return {
            a: common_vendor.t(order.invoiceTitle || "发票抬头待同步"),
            b: common_vendor.t(order.id),
            c: common_vendor.t(order.price),
            d: common_vendor.t(order.invoiceNo || "待同步"),
            e: common_vendor.t(order.invoiceDate || "待同步"),
            f: common_vendor.t(getInvoiceMeta(order).stage),
            g: common_vendor.t(order.invoiceUrl ? "已生成" : "待同步"),
            h: common_vendor.o(($event) => openOrderDetail(order), order.id),
            i: common_vendor.o(($event) => copyInvoiceLink(order), order.id),
            j: order.id
          };
        }),
        aV: !invoiceIssuedOrders.value.length
      }, !invoiceIssuedOrders.value.length ? {} : {}), {
        aQ: activeInvoiceTab.value === "待开票"
      }) : activeModule.value === "order-detail" ? common_vendor.e({
        aX: common_vendor.t(detailOrder.value.status),
        aY: common_vendor.t(detailOrder.value.id),
        aZ: common_vendor.t(detailOrder.value.model),
        ba: common_vendor.t(detailOrder.value.doneTime),
        bb: common_vendor.f(detailTimeline.value, (item, index, i0) => {
          return common_vendor.e({
            a: index < detailTimeline.value.length - 1
          }, index < detailTimeline.value.length - 1 ? {} : {}, {
            b: item.pending ? 1 : "",
            c: common_vendor.t(item.title),
            d: item.pending ? 1 : "",
            e: common_vendor.t(item.time),
            f: common_vendor.t(item.desc),
            g: item.title + index
          });
        }),
        bc: common_vendor.t(getQuoteMeta(detailOrder.value).desc),
        bd: common_vendor.t(getQuoteMeta(detailOrder.value).label),
        be: common_vendor.n("tag-" + getQuoteMeta(detailOrder.value).tone),
        bf: detailQuoteItems.value.length
      }, detailQuoteItems.value.length ? {
        bg: common_vendor.f(detailQuoteItems.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.desc || item.partName || "按检测结果维修"),
            c: common_vendor.t(formatMoney(item.partsFee)),
            d: common_vendor.t(formatMoney(item.laborFee)),
            e: item.name + index
          };
        })
      } : {}, {
        bh: detailQuoteItems.value.length
      }, detailQuoteItems.value.length ? {
        bi: common_vendor.t(formatMoney(detailOrder.value.partsFee)),
        bj: common_vendor.t(formatMoney(detailOrder.value.laborFee)),
        bk: common_vendor.t(formatMoney(getQuoteTotal(detailOrder.value)))
      } : {}, {
        bl: common_vendor.t(getAuthorizationMeta(detailOrder.value).desc),
        bm: common_vendor.t(getAuthorizationMeta(detailOrder.value).label),
        bn: common_vendor.n("tag-" + getAuthorizationMeta(detailOrder.value).tone),
        bo: canConfirmRepair(detailOrder.value)
      }, canConfirmRepair(detailOrder.value) ? {
        bp: common_vendor.o(($event) => confirmRepairAuthorization(detailOrder.value), "48")
      } : {}, {
        bq: common_vendor.t(getPaymentMeta(detailOrder.value).desc),
        br: common_vendor.t(getPaymentMeta(detailOrder.value).label),
        bs: common_vendor.n("tag-" + getPaymentMeta(detailOrder.value).tone),
        bt: common_vendor.t(detailQuoteItems.value.length ? formatMoney(getQuoteTotal(detailOrder.value)) : "待报价"),
        bv: detailPaymentProofs.value.length
      }, detailPaymentProofs.value.length ? {
        bw: common_vendor.f(detailPaymentProofs.value, (proof, index, i0) => {
          return {
            a: proof.url || proof.path,
            b: common_vendor.t(proof.time || "已上传"),
            c: proof.id || proof.url || index,
            d: common_vendor.o(($event) => previewPaymentProof(index), proof.id || proof.url || index)
          };
        })
      } : {}, {
        bx: canUploadPaymentProof(detailOrder.value)
      }, canUploadPaymentProof(detailOrder.value) ? {
        by: common_vendor.t(paymentProofUploading.value ? "上传中..." : "上传转账/支付凭证"),
        bz: paymentProofUploading.value ? 1 : "",
        bA: common_vendor.o(($event) => uploadPaymentProof(detailOrder.value), "79")
      } : {}, {
        bB: common_vendor.t(detailInvoiceOrder.value.invoiceType || "电子普通发票"),
        bC: common_vendor.t(getInvoiceMeta(detailInvoiceOrder.value).desc),
        bD: common_vendor.t(getInvoiceMeta(detailInvoiceOrder.value).label),
        bE: common_vendor.n("tag-" + getInvoiceMeta(detailInvoiceOrder.value).tone),
        bF: getInvoiceStatusKey(detailInvoiceOrder.value) === "available"
      }, getInvoiceStatusKey(detailInvoiceOrder.value) === "available" ? {
        bG: common_vendor.o(($event) => handleInvoiceAction(detailInvoiceOrder.value), "ab")
      } : getInvoiceStatusKey(detailInvoiceOrder.value) === "issued" ? {
        bI: common_vendor.o(($event) => handleInvoiceAction(detailInvoiceOrder.value), "e6")
      } : {}, {
        bH: getInvoiceStatusKey(detailInvoiceOrder.value) === "issued"
      }) : activeModule.value === "survey" ? {
        bK: common_vendor.o(closeModule, "bc"),
        bL: common_vendor.unref(surveyPosterUrl),
        bM: common_vendor.o(previewSurveyPoster, "83"),
        bN: common_vendor.o(closeModule, "af")
      } : activeModule.value === "diag" ? common_vendor.e({
        bP: common_vendor.t(diagProductLabel.value || "请选择产品类型"),
        bQ: !diagProductLabel.value ? 1 : "",
        bR: common_vendor.o(($event) => diagOpen.value = "product", "c1"),
        bS: common_vendor.t(diagFault.value || "请选择故障类型"),
        bT: !diagFault.value ? 1 : "",
        bU: common_vendor.o(openFaultSheet, "e1"),
        bV: diagConfirmVisible.value
      }, diagConfirmVisible.value ? {
        bW: common_vendor.f(diagConfirmSections.value, (section, k0, i0) => {
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
        bX: common_vendor.o(resetDiag, "e1"),
        bY: common_vendor.o(($event) => go("repair"), "39")
      } : {}, {
        bZ: diagOpen.value
      }, diagOpen.value ? {
        ca: common_vendor.o(($event) => diagOpen.value = "", "00")
      } : {}, {
        cb: diagOpen.value
      }, diagOpen.value ? {
        cc: common_vendor.o(($event) => diagOpen.value = "", "30"),
        cd: common_vendor.t(diagOpen.value === "product" ? "选择产品类型" : "选择故障类型"),
        ce: common_vendor.f(diagSheetOptions.value, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.title),
            b: item.active
          }, item.active ? {} : {}, {
            c: item.id,
            d: common_vendor.o(($event) => selectDiagOption(item), item.id)
          });
        })
      } : {}) : activeModule.value === "warranty" ? common_vendor.e({
        cg: common_vendor.t(warrantyDoc.value.title || "三重保修承诺"),
        ch: common_vendor.t(warrantyDoc.value.lead || "原厂配件 · 工艺质保 · 终身咨询"),
        ci: warrantyDoc.value.content
      }, warrantyDoc.value.content ? {
        cj: warrantyDoc.value.content
      } : {}, {
        ck: common_vendor.f(warrantyDurations, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.duration),
            c: item.name
          };
        }),
        cl: common_vendor.f(warrantyRanges, (item, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: common_vendor.t(item),
            c: item
          };
        }),
        cm: common_vendor.f(warrantyServices, (item, k0, i0) => {
          return {
            a: common_vendor.n("glyph-" + item.icon),
            b: common_vendor.t(item.title),
            c: common_vendor.t(item.desc),
            d: item.title
          };
        }),
        cn: !warrantyDoc.value.content
      }, !warrantyDoc.value.content ? {
        co: common_vendor.f(warrantyTerms, (section, k0, i0) => {
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
        cq: activeModule.value === "fees"
      }, activeModule.value === "fees" ? {} : {
        cr: common_vendor.n("glyph-" + activeDoc.value.icon),
        cs: common_vendor.t(activeDoc.value.title),
        ct: common_vendor.t(activeDoc.value.lead)
      }, {
        cv: activeDoc.value.content
      }, activeDoc.value.content ? {
        cw: activeDoc.value.content
      } : {
        cx: common_vendor.t(activeDoc.value.paperTitle),
        cy: common_vendor.f(activeDoc.value.sections, (section, k0, i0) => {
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
        cz: activeDoc.value.steps
      }, activeDoc.value.steps ? {
        cA: common_vendor.f(activeDoc.value.steps, (step, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: common_vendor.t(step.title),
            c: common_vendor.t(step.desc),
            d: step.title
          };
        })
      } : {}, {
        cB: activeModule.value !== "fees"
      }, activeModule.value !== "fees" ? {
        cC: common_vendor.o(($event) => go("contact"), "17"),
        cD: common_vendor.o(($event) => go("repair"), "7b")
      } : {}) : activeModule.value === "contact" ? {
        cF: common_vendor.t(customerService.value.title || "在线客服"),
        cG: common_vendor.t(customerService.value.description || "7×24 小时 · 即时响应"),
        cH: common_vendor.f(contactHotlines.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.number),
            c: common_vendor.t(item.time),
            d: item.title
          };
        }),
        cI: common_vendor.t(contactInfo.value.companyName),
        cJ: common_vendor.f(receiver.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: common_vendor.t(item.value),
            c: item.label
          };
        }),
        cK: common_vendor.o(copyAll, "c5"),
        cL: common_vendor.f(workTimes.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.day),
            b: common_vendor.t(item.time),
            c: item.day
          };
        })
      } : activeModule.value === "orders" ? common_vendor.e({
        cN: common_vendor.f(orderTabs.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: common_vendor.t(item.count),
            c: item.key,
            d: item.key === activeOrdersTab.value ? 1 : "",
            e: common_vendor.o(($event) => activeOrdersTab.value = item.key, item.key)
          };
        }),
        cO: common_vendor.f(filteredOrderList.value, (order, k0, i0) => {
          return {
            a: common_vendor.t(order.id),
            b: common_vendor.t(order.model),
            c: common_vendor.t(order.date),
            d: common_vendor.t(order.status),
            e: common_vendor.n("tag-" + getOrderStatusTone(order)),
            f: common_vendor.t(formatOrderListPrice(order)),
            g: order.id,
            h: common_vendor.o(($event) => openOrderDetail(order), order.id)
          };
        }),
        cP: !filteredOrderList.value.length
      }, !filteredOrderList.value.length ? {} : {}) : activeModule.value === "products" ? common_vendor.e({
        cR: common_vendor.f(productList.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.sn),
            c: common_vendor.t(item.date),
            d: common_vendor.t(item.warranty),
            e: common_vendor.n(item.expired ? "tag-muted" : "tag-ok"),
            f: common_vendor.o(($event) => go("repair"), item.sn),
            g: item.sn
          };
        }),
        cS: !productList.value.length
      }, !productList.value.length ? {} : {}) : activeModule.value === "address" ? common_vendor.e({
        cU: common_vendor.o(closeModule, "1f"),
        cV: common_vendor.t(addressForm.value.addressId ? "编辑收货地址" : "新增收货地址"),
        cW: addressForm.value.name,
        cX: common_vendor.o(($event) => addressForm.value.name = $event.detail.value, "c8"),
        cY: addressForm.value.phone,
        cZ: common_vendor.o(($event) => addressForm.value.phone = $event.detail.value, "9f"),
        da: addressForm.value.region,
        db: common_vendor.o(($event) => addressForm.value.region = $event.detail.value, "47"),
        dc: common_vendor.o(selectRegion, "48"),
        dd: addressForm.value.detail,
        de: common_vendor.o(($event) => addressForm.value.detail = $event.detail.value, "bd"),
        df: addressForm.value.unit,
        dg: common_vendor.o(($event) => addressForm.value.unit = $event.detail.value, "1b"),
        dh: addressForm.value.def ? 1 : "",
        di: common_vendor.o(($event) => addressForm.value.def = !addressForm.value.def, "2e"),
        dj: addressForm.value.addressId
      }, addressForm.value.addressId ? {
        dk: common_vendor.o(handleDeleteAddress, "dd")
      } : {}, {
        dl: common_vendor.o(saveAddress, "59")
      }) : activeModule.value === "feedback" ? common_vendor.e({
        dn: common_vendor.f(feedbackTypes, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: feedbackType.value === item ? 1 : "",
            d: common_vendor.o(($event) => feedbackType.value = item, item)
          };
        }),
        dp: common_vendor.t(feedbackType.value === "投诉" ? "收到投诉后，主管会在 24 小时内主动联系您" : "欢迎提出您宝贵的建议，采纳后可获赠小礼品"),
        dq: feedbackType.value === "投诉" ? "请描述问题发生的时间、经过以及您的诉求……" : "请描述您的建议与期望，我们会认真评估……",
        dr: feedbackText.value,
        ds: common_vendor.o(($event) => feedbackText.value = $event.detail.value, "29"),
        dt: common_vendor.t(feedbackText.value.length),
        dv: common_vendor.f(feedbackContacts, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: item.id,
            c: feedbackContactKind.value === item.id ? 1 : "",
            d: common_vendor.o(($event) => feedbackContactKind.value = item.id, item.id)
          };
        }),
        dw: common_vendor.t(feedbackContact.value.label),
        dx: feedbackContact.value.placeholder,
        dy: feedbackContactValue.value,
        dz: common_vendor.o(($event) => feedbackContactValue.value = $event.detail.value, "1d"),
        dA: feedbackOrderId.value,
        dB: common_vendor.o(($event) => feedbackOrderId.value = $event.detail.value, "6b"),
        dC: common_vendor.t(feedbackType.value),
        dD: common_vendor.o(submitFeedback, "9f"),
        dE: feedbackRecords.value.length
      }, feedbackRecords.value.length ? {
        dF: common_vendor.f(feedbackRecords.value, (record, k0, i0) => {
          return {
            a: common_vendor.t(record.ticketNo),
            b: common_vendor.t(record.type),
            c: common_vendor.t(record.time),
            d: common_vendor.t(getFeedbackMeta(record).label),
            e: common_vendor.n("tag-" + getFeedbackMeta(record).tone),
            f: common_vendor.t(record.orderId || "未关联"),
            g: common_vendor.t(record.contact),
            h: common_vendor.t(record.content),
            i: common_vendor.t(record.reply || "已收到反馈，客服处理后会在这里同步回复。"),
            j: record.ticketNo
          };
        })
      } : {}) : activeModule.value === "login" ? {
        dH: common_vendor.o(onGetPhoneNumberLogin, "17")
      } : {}, {
        N: activeModule.value === "repair-success",
        S: activeModule.value === "track",
        Y: activeModule.value === "package-query",
        at: activeModule.value === "invoices",
        aW: activeModule.value === "order-detail",
        bJ: activeModule.value === "survey",
        bO: activeModule.value === "diag",
        cf: activeModule.value === "warranty",
        cp: isDocModule.value,
        cE: activeModule.value === "contact",
        cM: activeModule.value === "orders",
        cQ: activeModule.value === "products",
        cT: activeModule.value === "address",
        dm: activeModule.value === "feedback",
        dG: activeModule.value === "login",
        dI: activeModule.value === "survey" ? 1 : ""
      }) : pageBootReady.value ? common_vendor.e({
        dK: activeTab.value === "home"
      }, activeTab.value === "home" ? {
        dL: common_assets._imports_0,
        dM: common_vendor.o(handleSearch, "c9"),
        dN: searchKeyword.value,
        dO: common_vendor.o(($event) => searchKeyword.value = $event.detail.value, "11"),
        dP: common_vendor.o(handleSearch, "ce"),
        dQ: common_assets._imports_1,
        dR: common_vendor.o(($event) => showQr.value = true, "ec"),
        dS: common_vendor.unref(config_cicadaAssets.cicadaAssets).photoFactory,
        dT: common_vendor.f(basics, (item, k0, i0) => {
          return {
            a: common_vendor.n("glyph-" + item.icon),
            b: item.bg,
            c: item.color,
            d: common_vendor.t(item.title),
            e: item.id,
            f: common_vendor.o(($event) => go(item.id), item.id)
          };
        }),
        dU: common_vendor.f(queries, (item, k0, i0) => {
          return {
            a: common_vendor.n("glyph-" + item.icon),
            b: item.bg,
            c: item.color,
            d: common_vendor.t(item.title),
            e: item.id,
            f: common_vendor.o(($event) => go(item.id), item.id)
          };
        }),
        dV: common_vendor.f(guides, (item, k0, i0) => {
          return {
            a: common_vendor.n("glyph-" + item.icon),
            b: common_vendor.t(item.title),
            c: item.id,
            d: common_vendor.o(($event) => go(item.id), item.id)
          };
        }),
        dW: common_vendor.o(openCustomerService, "97"),
        dX: common_vendor.o(makePhoneCall, "2d"),
        dY: common_vendor.f(receiver.value, (item, index, i0) => {
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
        dZ: common_vendor.t(copied.value === "all" ? "已复制" : "一键复制以上收件信息"),
        ea: common_vendor.o(copyAll, "e2"),
        eb: common_vendor.o(($event) => go("contact"), "07")
      } : activeTab.value === "company" ? {
        ed: common_vendor.unref(config_cicadaAssets.cicadaAssets).logoNew,
        ee: common_vendor.unref(config_cicadaAssets.cicadaAssets).photoFactory,
        ef: common_vendor.unref(config_cicadaAssets.cicadaAssets).logoNew,
        eg: common_vendor.f(companyStats, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.value),
            b: common_vendor.t(item.label),
            c: common_vendor.t(item.desc),
            d: item.label
          };
        }),
        eh: common_vendor.f(companyIntro, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item
          };
        }),
        ei: common_vendor.f(companyProductLines, (item, index, i0) => {
          return {
            a: common_vendor.n("device-" + index % 3),
            b: item.gradient,
            c: common_vendor.t(item.title),
            d: common_vendor.t(item.desc),
            e: item.title
          };
        }),
        ej: common_vendor.f(companyAdvantages, (item, k0, i0) => {
          return {
            a: common_vendor.n("adv-" + item.icon),
            b: common_vendor.t(item.title),
            c: common_vendor.t(item.desc),
            d: item.title
          };
        }),
        ek: common_vendor.f(companyServiceTags, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item
          };
        }),
        el: wechatInfo.value.qrcodeUrl
      } : common_vendor.e({
        em: common_vendor.t(logged.value ? userAvatarText.value : ""),
        en: common_vendor.t(logged.value ? userDisplayName.value : "未登录"),
        eo: logged.value
      }, logged.value ? {
        ep: common_vendor.t(userDisplayUnit.value),
        eq: common_vendor.o(logoutLocal, "b4")
      } : {
        er: common_vendor.o(($event) => go("login"), "54")
      }, {
        es: common_vendor.o(($event) => go("orders"), "85"),
        et: common_vendor.f(statusItems.value, (item, k0, i0) => {
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
        ev: common_vendor.f(menus, (item, index, i0) => {
          return {
            a: common_vendor.n("glyph-" + item.icon),
            b: common_vendor.t(item.title),
            c: common_vendor.t(item.desc),
            d: item.title,
            e: index === menus.length - 1 ? 1 : "",
            f: common_vendor.o(($event) => go(item.go), item.title)
          };
        }),
        ew: common_vendor.unref(config_cicadaAssets.cicadaAssets).logoNew
      }), {
        ec: activeTab.value === "company"
      }) : {
        ex: common_vendor.unref(config_cicadaAssets.cicadaAssets).logoMark
      }, {
        dJ: pageBootReady.value,
        ey: !activeModule.value && activeTab.value === "home"
      }, !activeModule.value && activeTab.value === "home" ? {
        ez: common_vendor.o(($event) => showOfficial.value = true, "6d")
      } : {}, {
        eA: showBottomTabbar.value
      }, showBottomTabbar.value ? {
        eB: common_vendor.o(go, "4c"),
        eC: common_vendor.p({
          tabs,
          ["active-id"]: activeTab.value
        })
      } : {}, {
        eD: showOfficial.value
      }, showOfficial.value ? {
        eE: common_vendor.o(($event) => showOfficial.value = false, "5f"),
        eF: common_vendor.o(($event) => showOfficial.value = false, "03"),
        eG: common_vendor.o(goOfficial, "fb"),
        eH: common_vendor.o(() => {
        }, "57"),
        eI: common_vendor.o(($event) => showOfficial.value = false, "e2")
      } : {}, {
        eJ: showQr.value
      }, showQr.value ? {
        eK: common_vendor.o(($event) => showQr.value = false, "d2"),
        eL: common_vendor.unref(config_cicadaAssets.cicadaAssets).logoNew,
        eM: wechatInfo.value.qrcodeUrl,
        eN: common_vendor.o(() => {
        }, "1d"),
        eO: common_vendor.o(($event) => showQr.value = false, "dd")
      } : {}, {
        eP: showRepairTools.value
      }, showRepairTools.value ? {
        eQ: common_vendor.o(($event) => showRepairTools.value = false, "06")
      } : {}, {
        eR: showRepairTools.value
      }, showRepairTools.value ? {
        eS: common_vendor.o(saveRepairDraft, "28"),
        eT: common_vendor.o(confirmClearRepair, "13"),
        eU: common_vendor.o(($event) => showRepairTools.value = false, "56")
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
