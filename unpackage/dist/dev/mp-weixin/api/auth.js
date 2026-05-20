"use strict";
require("../common/vendor.js");
const utils_cloud = require("../utils/cloud.js");
const sendSmsCode = (phone) => {
  {
    return utils_cloud.callCloudFunction("sendSmsCode", { phone });
  }
};
const loginWithCode = (phone, code) => {
  {
    return utils_cloud.callCloudFunction("login", { phone, code });
  }
};
exports.loginWithCode = loginWithCode;
exports.sendSmsCode = sendSmsCode;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/auth.js.map
