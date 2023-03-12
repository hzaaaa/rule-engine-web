<template>
  <el-container class="layout">
    <el-aside>
      <div class="menu" :style="{ width: isCollapse ? '65px' : '210px' }">
        <div class="logo flx-center">
          <img src="@/assets/images/logo.svg" alt="logo" />
          <span v-show="!isCollapse">RuleEngine</span>
        </div>
        <el-scrollbar>
          <el-menu
            :default-active="activeMenu"
            :router="false"
            :collapse="isCollapse"
            :collapse-transition="false"
            :unique-opened="true"
            background-color="#191a20"
            text-color="#bdbdc0"
            active-text-color="#ffffff"
          >
            <SubMenu :menuList="menuList" />
          </el-menu>
        </el-scrollbar>
      </div>
    </el-aside>
    <el-container>
      <el-header>
        <ToolBarLeft />
        <ToolBarRight />
      </el-header>
      <Main />
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useGlobalStore } from "@/store";
import Main from "@/layouts/components/Main/Main.vue";
import ToolBarLeft from "@/layouts/components/Header/ToolBarLeft.vue";
import ToolBarRight from "@/layouts/components/Header/ToolBarRight.vue";
import SubMenu from "@/layouts/components/Menu/SubMenu.vue";

const route = useRoute();
const globalStore = useGlobalStore();
const isCollapse = computed(() => globalStore.themeConfig.isCollapse);
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path));
const menuList = [
  {
    path: "/config",
    name: "config",
    meta: {
      icon: "Operation",
      title: "配置",
      isLink: "",
      isHide: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: true,
    },
  },
  {
    path: "/system",
    name: "system",
    redirect: "/system/dept",
    meta: {
      icon: "MessageBox",
      title: "系统管理",
      isLink: "",
      isHide: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: true,
    },
    children: [
      {
        path: "/system/dept",
        name: "Dept",
        component: "/system/Dept",
        meta: {
          icon: "Menu",
          title: "部门管理",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true,
        },
      },
      {
        path: "/system/menu",
        name: "Menu",
        component: "/system/Menu",
        meta: {
          icon: "Menu",
          title: "菜单管理",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true,
        },
      },
      {
        path: "/system/role",
        name: "Role",
        component: "/system/Role",
        meta: {
          icon: "Menu",
          title: "角色管理",
          isLink: "",
          isHide: true,
          isFull: false,
          isAffix: false,
          isKeepAlive: true,
        },
      },
      {
        path: "/system/user",
        name: "User",
        component: "/system/User",
        meta: {
          icon: "Menu",
          title: "用户管理",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true,
        },
      },
    ],
  },
];
</script>

<style scoped lang="scss">
.el-container {
  width: 100%;
  height: 100%;
  .el-aside {
    overflow: inherit;
    border-right: 1px solid #191a20;
    width: auto;
    background-color: #191a20;
    .menu {
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: all 0.3s ease;
      .el-scrollbar {
        height: calc(100% - 55px);
        .el-menu {
          overflow-x: hidden;
          border-right: none;
        }
      }
      .logo {
        box-sizing: border-box;
        border-bottom: 1px solid #282a35;
        height: 55px;
        span {
          font-weight: bold;
          font-size: 21.5px;
          color: #dadada;
          white-space: nowrap;
        }
        img {
          margin-right: 6px;
          width: 28px;
          object-fit: contain;
        }
      }
    }
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 15px;
    border-bottom: 1px solid #f1f1f1;
    height: 55px;
    background-color: #ffffff;
    :deep(.tool-bar-ri) {
      .toolBar-icon,
      .username {
        color: var(--el-text-color-primary);
      }
    }
  }
}
</style>
