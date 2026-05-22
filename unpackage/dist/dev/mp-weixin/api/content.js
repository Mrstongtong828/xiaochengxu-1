"use strict";
const common_vendor = require("../common/vendor.js");
const utils_request = require("../utils/request.js");
const uploadFile = (url, filePath) => {
  const token = common_vendor.index.getStorageSync("token");
  return new Promise((resolve, reject) => {
    common_vendor.index.uploadFile({
      url: `${utils_request.baseURL}${url}`,
      filePath,
      name: "file",
      header: token ? { Authorization: `Bearer ${token}` } : {},
      success: (res) => {
        let body = res.data;
        try {
          body = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
        } catch (error) {
          reject({ message: "上传响应格式错误", data: res.data });
          return;
        }
        if (res.statusCode >= 200 && res.statusCode < 300 && (body.code === 0 || body.code === void 0)) {
          resolve(body.code === void 0 ? body : body.data);
          return;
        }
        reject(body.message ? body : { message: "上传失败", data: body });
      },
      fail: reject
    });
  });
};
const wechatLogin = (data) => utils_request.request({ url: "/auth/wechat-login", method: "POST", data });
const submitRepairOrder = (data) => utils_request.request({ url: "/repair/submit", method: "POST", data });
const uploadImage = (filePath) => uploadFile("/upload/image", filePath);
const uploadVideo = (filePath) => uploadFile("/upload/video", filePath);
const getWarrantyPolicy = () => utils_request.request({ url: "/policy/warranty" });
const getFeePolicy = () => utils_request.request({ url: "/policy/fee" });
const getGuide = (type) => utils_request.request({ url: `/guide/${type}` });
const getContact = () => utils_request.request({ url: "/common/contact" });
const getCustomerService = () => utils_request.request({ url: "/common/customer-service" });
const getWechat = () => utils_request.request({ url: "/common/wechat" });
const getFaultTypes = () => utils_request.request({ url: "/fault/types" });
const searchFault = (data) => utils_request.request({ url: "/fault/search", data });
const getRepairList = (data = {}) => utils_request.request({ url: "/repair/list", data });
const queryPackageStatus = (data = {}) => utils_request.request({ url: "/package/query", data });
const applyInvoice = (data) => utils_request.request({ url: "/invoice/apply", method: "POST", data });
const getProductList = (data = {}) => utils_request.request({ url: "/product/list", data });
const addAddress = (data) => utils_request.request({ url: "/address/add", method: "POST", data });
const updateAddress = (data) => utils_request.request({ url: "/address/update", method: "PUT", data });
const deleteAddress = (addressId) => utils_request.request({ url: "/address/delete", method: "DELETE", data: { addressId } });
const addComplaint = (data) => utils_request.request({ url: "/complaint/add", method: "POST", data });
exports.addAddress = addAddress;
exports.addComplaint = addComplaint;
exports.applyInvoice = applyInvoice;
exports.deleteAddress = deleteAddress;
exports.getContact = getContact;
exports.getCustomerService = getCustomerService;
exports.getFaultTypes = getFaultTypes;
exports.getFeePolicy = getFeePolicy;
exports.getGuide = getGuide;
exports.getProductList = getProductList;
exports.getRepairList = getRepairList;
exports.getWarrantyPolicy = getWarrantyPolicy;
exports.getWechat = getWechat;
exports.queryPackageStatus = queryPackageStatus;
exports.searchFault = searchFault;
exports.submitRepairOrder = submitRepairOrder;
exports.updateAddress = updateAddress;
exports.uploadImage = uploadImage;
exports.uploadVideo = uploadVideo;
exports.wechatLogin = wechatLogin;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/content.js.map
