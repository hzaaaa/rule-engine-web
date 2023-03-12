<template>
  <div class="login" :style="'background-image: url(' + Background + ')'">
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="login-form-title">RuleEngine</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="请输入账号" :prefix-icon="User"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" placeholder="请输入密码" type="password" :prefix-icon="Lock"></el-input>
      </el-form-item>
      <!-- 带验证码的登录 -->
      <!-- <el-form-item prop="code" v-if="loginForm.type === 2">
        <el-input v-model="loginForm.code" placeholder="验证码" :prefix-icon="Checked" class="login-form-code"></el-input>
        <img :src="codeUrl" @click="getCode" class="login-form-img" />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="submitLoginForm(loginFormRef)" class="login-form-button">登录</el-button>
      </el-form-item>
    </el-form>
    <span class="login-copyright">{{ loginPage.copyright }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { FormInstance } from "element-plus";
import Background from "@/assets/images/background.webp";
import { User, Lock } from "@element-plus/icons-vue";
// import { loginApi } from "@/api/login/login";
// import { User, Lock, Checked } from "@element-plus/icons-vue";
// import { captcha, loginApi } from "@/api/login/login";
// import { useGlobalStore } from "@/store/index";
// import { useAuthStore } from "@/store/auth";
// import { initDynamicRouter } from "@/router/dynamicRouter";
// import { getFisrtRoute } from "@/utils/util";
// import { JSEncrypt } from "jsencrypt";

const router = useRouter();
const route = useRoute();
// const globalStore = useGlobalStore();
// const authStore = useAuthStore();

/**
 * 验证码登录
 */
// const codeUrl = ref("");
// const getCode = () => {
//   captcha().then((res) => {
//     codeUrl.value = res.data.img;
//     loginForm.captchaId = res.data.captchaId;
//   });
// };
// getCode();

const loginFormRef = ref<FormInstance>();
const loginForm = reactive({
  username: "",
  password: "",
  type: 1,
  // captchaId: "",
  // code: "",
});
const validateUserName = (rule: any, value: string, callback: any) => {
  if (value.trim() === "") {
    return callback(new Error("请输入用户名"));
  } else {
    callback();
  }
};
const validatePassword = (rule: any, value: string, callback: any) => {
  if (value.trim() === "") {
    return callback(new Error("请输入密码"));
  } else {
    callback();
  }
};
const validateCode = (rule: any, value: string, callback: any) => {
  if (value.trim() === "") {
    return callback(new Error("验证码不能为空"));
  } else {
    callback();
  }
};
const loginRules = reactive({
  username: [{ validator: validateUserName, trigger: "blur" }],
  password: [{ validator: validatePassword, trigger: "blur" }],
  code: [{ validator: validateCode, trigger: "blur" }],
});
// const PUBLIC_KEY =
//   "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCMBIy512shlbiWQoj26KPTIH3Zovkmgmm7adsX5E5bKnyDFLgnd3ftEPdmrIaTnLpZHIcboowgojjHEIBosxqvMByWWKjGYTSTZplNlSgMghuD2wg3ZzI2f/Fkqpx0uyViI3XH3Dby8nWl/kBTLSffQ9Ch/I3s6X8ds4EsrSfj2QIDAQAB";
// const encryptor = new JSEncrypt();
// encryptor.setPublicKey(PUBLIC_KEY);
const submitLoginForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    /*
    if (valid) {
      // 1. 执行登录接口
      const loginParams = {
        username: loginForm.username,
        password: loginForm.password,
        // password: encryptor.encrypt(loginForm.password) as string,
        type: loginForm.type,
      };
      loginApi({ ...loginParams })
        .then(async (res) => {
          // 2. 存储用户信息
          globalStore.setToken(res.data.token);
          globalStore.setUsername(res.data.userInfoVo?.sysUser?.username);
          globalStore.setRole(res.data.userInfoVo?.sysRoleList[0]?.name);
          globalStore.setDept(res.data.userInfoVo?.deptTreeVoList[0]?.name);
          authStore.setOriginAuthMenuList(res.data.userInfoVo?.menuVoList);

          // 3. 获取按钮权限
          authStore.getAuthButtonList();

          // 4. 添加动态路由
          await initDynamicRouter();

          // 5.跳转页面，如果没有 redirect 跳转到默认页，如果有就携带参数跳转到 redirect
          if (!route.query?.redirect) router.push("/home");
          else router.push({ path: route.query?.redirect as string, query: JSON.parse(route.query?.params as string) });
        })
        .catch((err) => {
          console.log("loginApi 接口错误", err);
        });
    } else {
      return false;
    }
    */
    console.log("route.query.redirect", valid, route.query.redirect);
    console.log("route.query.params", route.query.params);
    console.log("route.query.JSON", JSON.parse(route.query?.params as string));

    if (!route.query?.redirect) router.push("/home");
    else router.push({ path: route.query?.redirect as string, query: JSON.parse(route.query?.params as string) });
  });
};
onMounted(() => {
  // 监听 enter 按键事件登录
  document.onkeydown = (e: any) => {
    e = window.event || e;
    if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
      submitLoginForm(loginFormRef.value);
    }
  };
});

const loginPage = reactive({
  copyright: "Copyright © 2023 Weiyankeji. All rights reserved.",
});
</script>

<style scoped lang="scss">
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-size: cover;
  &-form {
    box-sizing: border-box;
    padding: 25px 25px 5px;
    border-radius: 6px;
    width: 385px;
    background-color: #ffffff;
    &-title {
      margin: 0 auto 30px;
      text-align: center;
      color: #707070;
    }
    &-code {
      width: 63%;
    }
    &-img {
      position: absolute;
      right: 0;
      cursor: pointer;
    }
    &-button {
      margin-top: 10px;
      width: 100%;
      height: 38px;
    }
    .el-input {
      height: 38px;
      input {
        height: 38px;
      }
    }
  }
  &-copyright {
    position: fixed;
    bottom: 0;
    height: 40px;
    line-height: 40px;
    font-size: 12px;
    color: #ffffff;
  }
}
</style>
