<template>
  <el-container class="layout">
    <el-aside>
      <div class="menu" :style="{ width: isCollapse ? '65px' : '210px' }">
        <div class="logo flx-center">
          <img src="@/assets/icons/wykj-favicon.ico" alt="logo" />
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
            <SubMenu :menuList="mockMenuList" />
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
// import { getGeekerAdminShowMenuList } from "@/utils/util";
import { useAuthStore } from "@/store/auth";

const route = useRoute();
const authStore = useAuthStore();
const globalStore = useGlobalStore();
const isCollapse = computed(() => globalStore.themeConfig.isCollapse);
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path));
// const showMenuList = computed(() => getGeekerAdminShowMenuList(menuList));
const mockMenuList = computed(() => authStore.mockShowMenuListGet);

/*
const menuList = [
  {
    path: "/app",
    name: "App",
    redirect: "/app/list",
    meta: {
      icon: "MessageBox",
      title: "规则配置",
      isLink: "",
      isHide: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: true,
    },
    children: [
      {
        path: "/app/list",
        name: "AppList",
        component: () => import("@/views/config/AppList.vue"),
        meta: {
          icon: "MessageBox",
          title: "App列表",
          activeMenu: "/app",
          isLink: "",
          isHide: true,
          isFull: false,
          isAffix: false,
          isKeepAlive: true,
        },
      },
      {
        path: "/base/list",
        name: "BaseList",
        component: () => import("@/views/config/BaseList.vue"),
        meta: {
          icon: "MessageBox",
          title: "Base列表",
          activeMenu: "/app",
          isLink: "",
          isHide: true,
          isFull: false,
          isAffix: false,
          isKeepAlive: true,
        },
      },
      {
        path: "/conf/detail",
        name: "ConfDetail",
        component: () => import("@/views/config/ConfDetail.vue"),
        meta: {
          icon: "MessageBox",
          title: "Conf详情",
          activeMenu: "/app",
          isLink: "",
          isHide: true,
          isFull: false,
          isAffix: false,
          isKeepAlive: true,
        },
      },
    ], // 注意这里要带上 文件后缀.vue
  },
  {
    path: "/task",
    name: "Task",
    redirect: "/task/list",
    meta: {
      icon: "MessageBox",
      title: "任务管理",
      isLink: "",
      isHide: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: true,
    },
    children: [
      {
        path: "/task/list",
        name: "TaskList",
        component: () => import("@/views/task/TaskList.vue"),
        meta: {
          icon: "Menu",
          title: "任务列表",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true,
        },
      },
      {
        path: "/task/submit",
        name: "TaskSubmit",
        component: () => import("@/views/task/TaskSubmit.vue"),
        meta: {
          icon: "Menu",
          title: "任务提交",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true,
        },
      },
    ], // 注意这里要带上 文件后缀.vue
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
          isHide: false,
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
*/
</script>

<style scoped lang="scss">
.el-container {
  width: 100%;
  min-width: 992px;
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
          line-height: 32px;
          font-weight: bold;
          font-size: 22px;
          color: #dadada;
          white-space: nowrap;
        }
        img {
          margin-right: 8px;
          width: 32px;
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
