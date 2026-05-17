# 牙医仪器检修小程序

## 项目简介

这是一个基于 `uni-app + Vue 3` 的微信小程序项目，面向牙医仪器维修场景，支持客户在线提交报修、查看维修进度、查询包裹签收状态，并获取寄修指引与客服信息。

## 当前功能

- `立即报修`：支持多产品报修、购买日期选择、购买凭证上传、故障图片/视频上传。
- `保存草稿`：报修表单支持本地草稿保存，避免用户中途退出后内容丢失。
- `维修进度`：可按工单查看维修流转状态。
- `包裹查询`：客户可输入快递单号，查询包裹是否已签收、是否已录入系统、当前处理状态。
- `收件信息复制`：支持逐项复制和一键复制寄修收件地址。
- `故障自诊 / 保修政策 / 收费标准 / 联系客服`：以首页模块形式展示。

## 当前页面结构

当前项目以首页单页承载主要业务模块：

- `pages/index/index.vue`：主入口页面，包含报修、进度、包裹查询、故障自诊、联系客服等模块。
- `pages/login/index.vue`：登录页。

下面两个页面文件目前存在，但 **没有在 `pages.json` 中注册**，默认不会作为独立路由打开：

- `pages/company/index.vue`
- `pages/mine/index.vue`

如果后续要启用这两个独立页面，需要同步更新 `pages.json`。

## 技术栈

- 前端：`uni-app`、`Vue 3`
- 运行端：微信小程序
- 请求层：`uni.request` + 自定义封装
- 后端对接方式：
  - 旧版云函数/混合模式：`api/auth.js`、`api/repair.js`
  - 当前首页主流程 HTTP 接口：`api/content.js`

## 目录结构

```text
├── api/
│   ├── auth.js                  # 旧版登录/云函数混合接口
│   ├── repair.js                # 旧版报修/云函数混合接口
│   ├── product.js               # 产品相关接口
│   └── content.js               # 当前首页主流程使用的 HTTP 接口
├── cloudfunctions/              # uniCloud 云函数
├── pages/
│   ├── index/index.vue          # 首页主入口
│   ├── login/index.vue          # 登录页
│   ├── company/index.vue        # 预留页面，未注册路由
│   └── mine/index.vue           # 预留页面，未注册路由
├── static/                      # 静态资源
├── store/                       # 状态管理
├── utils/
│   ├── cloud.js                 # 云函数调用封装
│   └── request.js               # HTTP 请求封装
├── unpackage/dist/dev/mp-weixin/ # 微信小程序编译输出
├── pages.json
├── manifest.json
└── 后端对接任务清单.md
```

## 接口对接说明

### 当前请求配置

- HTTP 基础地址配置在 [utils/request.js](./utils/request.js)
- 当前默认 `baseURL` 为：

```js
export const baseURL = 'https://api.cisco-d.com/api/v1'
```

### 重要说明

旧版文档里提到的 `USE_CLOUD` 开关 **只影响** `api/auth.js` 和 `api/repair.js` 这类旧接口文件，不影响当前首页主流程使用的 `api/content.js`。

也就是说，如果你现在对接的是首页这套 UI，后端重点需要实现的是 `api/content.js` 中的 HTTP 接口，而不只是切换 `USE_CLOUD`。

### 当前首页主流程重点接口

- `POST /auth/login`
- `POST /repair/submit`
- `GET /repair/list`
- `GET /repair/detail`
- `GET /package/query`
- `POST /upload/image`
- `POST /upload/video`
- `GET /common/contact`
- `GET /common/customer-service`
- `GET /policy/warranty`
- `GET /policy/fee`

详细接口与数据结构请参考 [后端对接任务清单.md](./后端对接任务清单.md)。

## 包裹查询说明

前端已经提供 `包裹查询` 入口，位于首页 `自助查询` 模块内。

当前交互规则：

- 客户输入 `快递单号` 进行查询。
- 可选输入 `手机号后四位` 用于身份核验。
- 只有后台签收并录入快递单号后，前端才能查询到对应包裹状态。

后端建议返回的信息至少包括：

- `trackingNo`
- `company`
- `status`
- `orderId`
- `timeline`

如果后端暂未开放该接口，前端会提示“包裹查询接口未开放”。

## 报修表单说明

当前报修表单已经按真实用户交互进行了调整：

- `购买日期` 为可点击的日期选择器。
- `购买凭证` 为真实上传入口，支持预览与删除。
- 提交报修时会携带 `voucherImages` 字段。
- `保存草稿` / `清空重填` 在底部 `工具` 面板中。
- 草稿默认保存在本地缓存键 `repairDraft`。

## 本地开发

1. 使用 `HBuilderX` 打开项目根目录。
2. 选择 `运行 -> 运行到小程序模拟器 -> 微信开发者工具`。
3. 编译输出目录为：

```text
unpackage/dist/dev/mp-weixin
```

## 给客户预览

如果项目还没有正式发布，但需要让客户先看效果，建议按下面方式操作：

1. 在微信公众平台把客户微信号加入 `体验成员`。
2. 在微信开发者工具中生成预览二维码，发给客户扫码查看。

客户侧通常需要你提供：

- 客户的微信号
- 预览二维码

### 费用说明

- 开发版/体验版预览本身一般 **不额外收费**。
- 如果要正式发布给所有客户使用，通常需要按微信公众平台当期规则完成小程序主体认证、审核和发布。
- 如果后端使用对象存储、短信验证码、第三方物流查询、图片/视频上传服务，则这些服务可能产生额外费用，需按实际供应商计费规则评估。

## 提交前检查

- 确认 `utils/request.js` 中的 `baseURL` 指向正确环境。
- 确认 `api/content.js` 中用到的接口后端已全部提供。
- 确认微信开发者工具中可以正常编译和预览。
- 如启用了包裹查询，确认后台已支持快递单号录入与状态维护。

## 相关文档

- [后端对接任务清单.md](./后端对接任务清单.md)
