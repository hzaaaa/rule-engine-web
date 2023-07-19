<template>
  <el-form
    ref="loginFormRef"
    :model="loginForm"
    label-position="top"
    :rules="loginFormRules"
    :hide-required-asterisk="true"
    style="min-width: 260px"
    @keyup.enter="login(loginFormRef)"
  >
    <el-form-item label="账户" prop="username">
      <el-input v-model="loginForm.username" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="loginForm.password" placeholder="" type="password"></el-input>
    </el-form-item>
    <el-form-item label="验证码" prop="code" class="captcha" v-if="showCaptcha">
      <el-input v-model="loginForm.code" placeholder="请输入验证码">
        <template #append>
          <el-tooltip effect="dark" content="点击刷新验证码" placement="right" transition="fade-in-linear"
            ><img class="login-captcha" :src="captcha.img" @click="getCaptcha()" />
          </el-tooltip>
        </template>
      </el-input>
    </el-form-item>
  </el-form>
  <div class="login-btn">
    <el-button @click="login(loginFormRef)" type="primary">登录</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from "vue";

import { loginApi, getCaptchaApi } from "@/api/login/login";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import { useRouter } from "vue-router";
// import { initDynamicRouter } from "@/routers/login/dynamicRouter";

import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
// import { Base64 } from "js-base64";

const authStore = useAuthStore();
const router = useRouter();
const userStore = useUserStore();
const showCaptcha = ref(false);
const loginFormRef = ref<FormInstance>();
const loginForm = reactive<any>({
  username: "",
  password: "",
  type: showCaptcha.value ? 2 : 1,
  captchaId: "",
  code: "",
});

const loginFormRules = reactive<FormRules>({
  username: [{ required: true, message: "请输入用户名！", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码！", trigger: "blur" }],
  code: showCaptcha.value ? [{ required: true, message: "请输入验证码", trigger: "blur" }] : [],
});

interface CaptchaProps {
  captchaId: string;
  img: string;
}

let captcha = reactive<CaptchaProps>({
  captchaId: "",
  img: "",
});

const getCaptcha = async () => {
  const { data } = await getCaptchaApi();
  loginForm.captchaId = captcha.captchaId = data.captchaId;
  captcha.img = data.img;
};

const login = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return;

    try {
      const { data } = await loginApi(loginForm);
      console.log(data);
      // userStore.setToken(Base64.encode(data.token));
      userStore.setToken(data.token);
      userStore.setUserInfo(data.userInfoVo);
      userStore.setId(data.userInfoVo.sysUser.id);
      userStore.setUserName(data.userInfoVo.sysUser.username);
      // authStore.setAuthOriginMenuList(data.userInfoVo.menuVoList);

      // 检查ip
      // await initDynamicRouter();
      // await authStore.getAuthButtonList();
      router.push({ path: "/" });
    } catch (err) {
      console.warn(err);
    }
  });
};

onBeforeMount(() => {
  if (showCaptcha.value) {
    getCaptcha();
  }
});
</script>

<style lang="scss" scoped>
@import "../index";
</style>
