"use strict";
const common_vendor = require("../common/vendor.js");
const baseURL = "https://api.cisco-d.com/api/v1";
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
        if (body.code === 1004) {
          common_vendor.index.removeStorageSync("token");
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
