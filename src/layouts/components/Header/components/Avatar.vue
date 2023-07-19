<template>
  <el-dropdown trigger="click" class="avatar" popper-class="avatar-popper" placement="bottom">
    <!-- :src="userStore?.userInfo?.avatarUrl" -->
    <span
      ><el-avatar :icon="UserFilled" :size="29"></el-avatar><span class="username">{{ "xx@weiyankeji.cn" }}</span>

      <el-icon></el-icon>
      <!-- <ArrowDown /> -->
    </span>

    <template #dropdown>
      <el-dropdown-menu>
        <!-- <el-dropdown-item disabled>xx@weiyankeji.cn</el-dropdown-item> -->
        <el-dropdown-item @click="openDialog('infoRef')"> 个人信息 </el-dropdown-item>
        <!-- <el-icon><User /></el-icon> -->
        <el-dropdown-item @click="logout"> 退出登录 </el-dropdown-item>
        <!-- <el-icon><SwitchButton /></el-icon> -->
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <!-- infoDialog -->
  <InfoDialog ref="infoRef"></InfoDialog>
  <!-- passwordDialog -->
  <PasswordDialog ref="passwordRef"></PasswordDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { UserFilled, ArrowDown } from "@element-plus/icons-vue";
// import { useGlobalStore } from "@/store";
import { logoutApi } from "@/api/login/login";
// import { useRoute, useRouter } from "vue-router";
import InfoDialog from "./InfoDialog.vue";
import PasswordDialog from "./PasswordDialog.vue";
// import { User, SwitchButton } from "@element-plus/icons-vue";

// const route = useRoute();
// const router = useRouter();
// const globalStore = useGlobalStore();

// 退出登录;
const logout = () => {
  ElMessageBox.confirm("确认退出吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(async () => {
      // 1. 调用退出登录接口
      await logoutApi();
      // 2. 清除 token 等缓存
      // globalStore.setToken("");
      // localStorage.clear();
      // // document.cookie = "";
      // // 3. 重定向到登录页,并携带当前页面地址和参数
      // const path = `/login?redirect=${route.path}&params=${JSON.stringify(route.query ? route.query : route.params)}`;
      // router.replace(path);
      // ElMessage.success("退出登录成功！");
    })
    .catch(() => {});
};

interface DialogExpose {
  openDialog: () => void;
}
const infoRef = ref<null | DialogExpose>(null);
const passwordRef = ref<null | DialogExpose>(null);
// 打开修改密码和个人信息弹窗
const openDialog = (refName: string) => {
  if (refName == "infoRef") infoRef.value?.openDialog();
  else passwordRef.value?.openDialog();
};
</script>

<style scoped lang="scss">
.el-dropdown {
  align-items: center;
  cursor: pointer;
  :deep(.el-tooltip__trigger) {
    display: flex;
    align-items: center;
    .username {
      margin-left: 4px;
    }
    .el-icon--right {
      color: #fff;
    }
  }
}

// 头像下拉框popper样式
.el-popper.avatar-popper {
  transform: translateY(-8px);
  .el-dropdown-menu {
    padding: 15px 10px 14px;
    .el-dropdown-menu__item {
      border-radius: 4px;
    }
  }
  .el-popper__arrow {
    display: none;
  }
}
</style>
