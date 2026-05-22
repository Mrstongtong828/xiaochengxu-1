"use strict";
const common_vendor = require("../common/vendor.js");
var define_import_meta_env_default = { VITE_CJS_IGNORE_WARNING: "true", VITE_ROOT_DIR: "E:/小程序开发/牙医仪器检修-用户端", VITE_USER_NODE_ENV: "development", BASE_URL: "/", MODE: "development", DEV: true, PROD: false, SSR: false };
const envBaseURL = define_import_meta_env_default && define_import_meta_env_default.VITE_API_BASE_URL;
const baseURL = envBaseURL || "https://api.cisco-d.com/api/v1";
const isAbsoluteUrl = (url = "") => /^https?:\/\//i.test(url);
function request(options = {}) {
  const { url = "", method = "GET", data = {}, header = {}, timeout = 8e3 } = options;
  const token = common_vendor.index.getStorageSync("token");
  const requestHeader = { ...header };
  if (token) {
    requestHeader.Authorization = `Bearer ${token}`;
  }
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: isAbsoluteUrl(url) ? url : `${baseURL}${url}`,
      method: String(method).toUpperCase(),
      data,
      header: requestHeader,
      timeout,
      success: (res) => {
        const body = res.data || {};
        const ok = res.statusCode >= 200 && res.statusCode < 300;
        if (ok && (body.code === 0 || body.code === void 0)) {
          resolve(body.code === void 0 ? body : body.data);
          return;
        }
        if (res.statusCode === 401 || [401, 1004, 100401].includes(Number(body.code))) {
          common_vendor.index.removeStorageSync("token");
          common_vendor.index.removeStorageSync("userInfo");
          common_vendor.index.removeStorageSync("isLoggedIn");
        }
        reject(body.message ? body : { message: "请求失败", data: body });
      },
      fail: reject
    });
  });
}
exports.baseURL = baseURL;
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
