<template>
  <div class="avatar">
    <img src="@/assets/images/avatar.png" alt="avatar" />
  </div>
  <!-- <el-dropdown trigger="click">
    <div class="avatar">
      <img src="@/assets/images/avatar.png" alt="avatar" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item disabled>xx@weiyankeji.cn</el-dropdown-item>
        <el-dropdown-item divided @click="openDialog('infoRef')">
          <el-icon><User /></el-icon>个人信息
        </el-dropdown-item>
        <el-dropdown-item @click="logout">
          <el-icon><SwitchButton /></el-icon>退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown> -->
  <!-- infoDialog -->
  <InfoDialog ref="infoRef"></InfoDialog>
  <!-- passwordDialog -->
  <PasswordDialog ref="passwordRef"></PasswordDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
// import { useGlobalStore } from "@/store";
// import { logoutApi } from "@/api/login/login";
// import { useRoute, useRouter } from "vue-router";
import InfoDialog from "./InfoDialog.vue";
import PasswordDialog from "./PasswordDialog.vue";
// import { User, SwitchButton } from "@element-plus/icons-vue";

// const route = useRoute();
// const router = useRouter();
// const globalStore = useGlobalStore();

// 退出登录
// const logout = () => {
//   ElMessageBox.confirm("确认退出吗?", "提示", {
//     confirmButtonText: "确定",
//     cancelButtonText: "取消",
//   })
//     .then(async () => {
//       // 1. 调用退出登录接口
//       await logoutApi();
//       // 2. 清除 token 等缓存
//       globalStore.setToken("");
//       localStorage.clear();
//       // document.cookie = "";
//       // 3. 重定向到登录页,并携带当前页面地址和参数
//       const path = `/login?redirect=${route.path}&params=${JSON.stringify(route.query ? route.query : route.params)}`;
//       router.replace(path);
//       ElMessage.success("退出登录成功！");
//     })
//     .catch(() => {});
// };

interface DialogExpose {
  openDialog: () => void;
}
const infoRef = ref<null | DialogExpose>(null);
const passwordRef = ref<null | DialogExpose>(null);
// 打开修改密码和个人信息弹窗
// const openDialog = (refName: string) => {
//   if (refName == "infoRef") infoRef.value?.openDialog();
//   else passwordRef.value?.openDialog();
// };
</script>

<style scoped lang="scss">
.avatar {
  overflow: hidden;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  // cursor: pointer;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
