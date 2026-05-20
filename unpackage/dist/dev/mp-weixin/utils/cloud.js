"use strict";
const common_vendor = require("../common/vendor.js");
function callCloudFunction(name, data = {}) {
  return new Promise((resolve, reject) => {
    const token = common_vendor.index.getStorageSync("token");
    if (token) {
      data.token = token;
    }
    common_vendor._r.callFunction({
      name,
      data,
      success: (res) => {
        const result = res.result;
        if (result.code === 0) {
          resolve(result.data || result);
        } else {
          if (result.code === 401) {
            common_vendor.index.removeStorageSync("token");
          }
          reject(new Error(result.message || "请求失败"));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}
exports.callCloudFunction = callCloudFunction;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/cloud.js.map
