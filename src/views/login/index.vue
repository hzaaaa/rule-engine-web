<template>
  <div class="login-container flx-center">
    <div class="login-content">
      <div class="login-logo">
        <img
          srcset="
            @/assets/images/login/logo.png    1x,
            @/assets/images/login/logo.png    1.5x,
            @/assets/images/login/logo@2x.png 2x,
            @/assets/images/login/logo@2x.png 3x
          "
          src="@/assets/images/login/logo@2x.png"
        />
      </div>
      <div class="login-main">
        <div class="login-left">
          <!-- <img
						srcset="
							@/assets/images/login/login_img.png    1x,
							@/assets/images/login/login_img.png    1.5x,
							@/assets/images/login/login_img@2x.png 2x,
							@/assets/images/login/login_img@2x.png 3x
						"
						src="@/assets/images/login/login_img@2x.png"
						class="logo-left"
					/> -->
        </div>
        <div class="login-right">
          <div class="platform-name-img">
            <img
              srcset="@/assets/images/login/platform_name.png 1x, @/assets/images/login/platform_name.png 1.5x"
              src="@/assets/images/login/platform_name.png"
            />

            <!-- <div style="display: flex; justify-content: center">RuleEngine</div> -->
          </div>
          <div class="login-box">
            <div class="login-form">
              <LoginForm ref="LogoRef" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { onBeforeMount } from "vue";
import LoginForm from "./components/LoginForm.vue";
// import { GlobalStore } from "@/stores";
// import { ElMessage } from "element-plus";

// const globalStore = GlobalStore();

// onBeforeMount(() => {
// 	console.log(globalStore.manualLogout);
// 	if (globalStore.manualLogout) {
// 		ElMessage.success("退出登录成功！");
// 		globalStore.setManualLogout();
// 		console.log("重置" + globalStore.manualLogout);
// 	}
// });
</script>

<style lang="scss" scoped>
@import "./index";
</style>
