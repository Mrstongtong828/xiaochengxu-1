"use strict";
const common_vendor = require("../../common/vendor.js");
const api_auth = require("../../api/auth.js");
const config_cicadaAssets = require("../../config/cicada-assets.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const phone = common_vendor.ref("");
    const code = common_vendor.ref("");
    const agreed = common_vendor.ref(false);
    const counting = common_vendor.ref(false);
    const countdown = common_vendor.ref(60);
    const loading = common_vendor.ref(false);
    const canSubmit = common_vendor.computed(() => {
      return phone.value.length === 11 && code.value.length === 6 && agreed.value;
    });
    const validatePhone = () => {
      const reg = /^1[3-9]\d{9}$/;
      return reg.test(phone.value);
    };
    const clearPhone = () => {
      phone.value = "";
    };
    let timer = null;
    const sendCode = async () => {
      if (counting.value)
        return;
      if (!validatePhone()) {
        common_vendor.index.showToast({ title: "请输入正确的手机号", icon: "none" });
        return;
      }
      try {
        common_vendor.index.showLoading({ title: "发送中..." });
        await api_auth.sendSmsCode(phone.value);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "验证码已发送", icon: "success" });
        counting.value = true;
        countdown.value = 60;
        timer = setInterval(() => {
          countdown.value--;
          if (countdown.value <= 0) {
            counting.value = false;
            clearInterval(timer);
          }
        }, 1e3);
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: error.message || "发送失败", icon: "none" });
      }
    };
    const handleLogin = async () => {
      if (!canSubmit.value)
        return;
      loading.value = true;
      try {
        const result = await api_auth.loginWithCode(phone.value, code.value);
        loading.value = false;
        common_vendor.index.setStorageSync("token", result.token);
        common_vendor.index.setStorageSync("userInfo", result.userInfo);
        common_vendor.index.showToast({ title: "登录成功", icon: "success" });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
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
      return common_vendor.e({
        a: common_vendor.o(goBack, "2a"),
        b: common_vendor.unref(config_cicadaAssets.cicadaAssets).brandToothBlue,
        c: common_vendor.o([($event) => phone.value = $event.detail.value, validatePhone], "66"),
        d: phone.value,
        e: phone.value
      }, phone.value ? {
        f: common_vendor.o(clearPhone, "10")
      } : {}, {
        g: code.value,
        h: common_vendor.o(($event) => code.value = $event.detail.value, "c3"),
        i: common_vendor.t(counting.value ? countdown.value + "s" : "获取验证码"),
        j: counting.value ? 1 : "",
        k: common_vendor.o(sendCode, "49"),
        l: common_vendor.t(loading.value ? "登录中..." : "登录"),
        m: !canSubmit.value ? 1 : "",
        n: loading.value ? 1 : "",
        o: common_vendor.o(handleLogin, "ed"),
        p: agreed.value,
        q: common_vendor.o(onAgreeChange, "f3")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d08ef7d4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/index.js.map
