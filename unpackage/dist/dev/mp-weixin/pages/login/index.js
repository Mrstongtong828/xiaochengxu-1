"use strict";
const common_vendor = require("../../common/vendor.js");
const config_cicadaAssets = require("../../config/cicada-assets.js");
const utils_cloud = require("../../utils/cloud.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const agreed = common_vendor.ref(false);
    const loading = common_vendor.ref(false);
    let userCloudObject = null;
    common_vendor.onMounted(() => {
      userCloudObject = utils_cloud.importCloudObject("cicada-client-user");
    });
    const onGetPhoneNumber = async (e) => {
      if (loading.value)
        return;
      if (!agreed.value) {
        common_vendor.index.showToast({ title: "请先阅读并同意用户协议", icon: "none" });
        return;
      }
      if (e.detail.errMsg !== "getPhoneNumber:ok") {
        if (e.detail.errMsg && e.detail.errMsg.includes("cancel")) {
          return;
        }
        common_vendor.index.showToast({ title: "授权失败，请重试", icon: "none" });
        return;
      }
      if (!e.detail.code) {
        common_vendor.index.showToast({ title: "获取手机号失败", icon: "none" });
        return;
      }
      loading.value = true;
      try {
        const result = await userCloudObject.loginWithWechat({ code: e.detail.code });
        loading.value = false;
        if (result.code === 0) {
          common_vendor.index.setStorageSync("token", result.data.token);
          common_vendor.index.setStorageSync("userInfo", result.data.userInfo);
          common_vendor.index.setStorageSync("isLoggedIn", true);
          common_vendor.index.showToast({ title: "登录成功", icon: "success" });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          common_vendor.index.showToast({ title: result.message || "登录失败", icon: "none" });
        }
      } catch (error) {
        loading.value = false;
        common_vendor.index.showToast({ title: error.message || "登录失败", icon: "none" });
      }
    };
    const onAgreeChange = (e) => {
      agreed.value = e.detail.value.includes("agree");
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goBack, "bd"),
        b: common_vendor.unref(config_cicadaAssets.cicadaAssets).brandToothBlue,
        c: common_vendor.t(loading.value ? "登录中..." : "微信手机号授权登录"),
        d: loading.value ? 1 : "",
        e: common_vendor.o(onGetPhoneNumber, "b9"),
        f: agreed.value,
        g: common_vendor.o(onAgreeChange, "60")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d08ef7d4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/index.js.map
