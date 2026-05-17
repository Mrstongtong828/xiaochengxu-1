# 牙医仪器检修小程序

## 项目简介

牙医仪器检修小程序，用于在线提交仪器维修申请，跟踪维修进度。

## 技术栈

- 前端: uni-app + Vue 3
- 后端: 可选 uniCloud 或自定义 HTTP API

## 目录结构

```
├── api/                    # API 接口层
│   ├── auth.js            # 认证相关接口
│   ├── repair.js          # 维修订单接口
│   └── product.js         # 产品管理接口
├── pages/                 # 页面
│   ├── index/            # 首页（维修申请）
│   ├── login/            # 登录页
│   ├── mine/             # 个人中心
│   └── company/          # 公司介绍
├── cloudfunctions/        # 云函数（可选，使用uniCloud时）
│   ├── login/
│   ├── sendSmsCode/
│   ├── submitRepair/
│   └── getRepairList/
├── uniCloud-aliyun/      # uniCloud 数据库配置
│   └── database/
├── utils/                # 工具函数
│   ├── request.js        # HTTP 请求封装
│   └── cloud.js          # 云函数调用封装
└── static/               # 静态资源
```

## 后端对接

### 方式一：使用 uniCloud（推荐）

1. 开通 uniCloud 服务空间
2. 在 HBuilderX 中关联云服务空间
3. 上传 `cloudfunctions/` 中的云函数
4. 上传 `uniCloud-aliyun/database/` 中的数据库 schema
5. 设置 `api/` 文件中的 `USE_CLOUD = true`

### 方式二：使用自定义 HTTP API

#### 配置 API 地址

修改 `utils/request.js` 中的 `baseURL` 为你的后端地址。

#### 接口文档

详细接口文档请参考 [后端对接任务清单.md](./后端对接任务清单.md)

##### 核心接口

1. **发送验证码**
   ```
   POST /api/auth/sendCode
   { phone: "13800138000" }
   ```

2. **验证码登录**
   ```
   POST /api/auth/login
   { phone: "13800138000", code: "123456" }
   返回: { code: 0, data: { token, userInfo } }
   ```

3. **提交维修订单**
   ```
   POST /api/repair/submit
   Header: Authorization: Bearer {token}
   Body: { receiverName, receiverPhone, receiverAddress, products }
   返回: { code: 0, data: { id, orderNo } }
   ```

4. **获取订单列表**
   ```
   GET /api/repair/list?status=&page=1&pageSize=10
   Header: Authorization: Bearer {token}
   ```

#### 统一响应格式

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

- `code = 0` 表示成功
- `code != 0` 表示失败，`message` 包含错误信息

## 前端 API 切换

在 `api/` 目录的文件中，修改 `USE_CLOUD` 变量：

```javascript
const USE_CLOUD = true;  // 使用云函数
const USE_CLOUD = false; // 使用 HTTP API
```

## 开发指南

### 本地开发

1. 使用 HBuilderX 打开项目
2. 运行到微信开发者工具
3. 选择对接方式（uniCloud 或 自定义API）

### 提交代码

推送前确保：
- 删除了不必要的文件
- 配置了正确的 API 地址
- 更新了文档

## 相关文档

- [后端对接任务清单.md](./后端对接任务清单.md) - 详细的接口和数据库设计
