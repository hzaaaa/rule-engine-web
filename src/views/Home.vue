<template>
  <div>
    <div>home</div>
    <el-button @click="addRoute">添加动态路由</el-button>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth";
import { initDynamicRouter } from "@/router/dynamicRouter";
// import Layout from "@/layouts/Layout.vue";
const authStore = useAuthStore();
/*
const res = {
  path: "/config",
  component: Layout,
  children: [
    {
      path: "",
      name: "Config",
      component: () => import("@/views/config/AppList.vue"),
      meta: {
        icon: "MessageBox",
        title: "系统管理",
        activeMenu: "/proTable/useProTable",
        isLink: "",
        isHide: false,
        isFull: false,
        isAffix: false,
        isKeepAlive: true,
      },
    },
    {
      path: "list/:appId",
      name: "List",
      component: () => import("@/views/config/BaseList.vue"),
    },
    {
      path: "detail/:appId/:baseId/:confId",
      name: "Detail",
      component: () => import("@/views/config/ConfDetail.vue"),
    },
  ], // 注意这里要带上 文件后缀.vue
};
*/
const addRoute = async () => {
  console.log("addRoute");
  authStore.setOriginAuthMenuList(menuVoList);

  // 3. 获取按钮权限
  authStore.getAuthButtonList();

  // 4. 添加动态路由
  await initDynamicRouter();
};

const menuVoList = [
  {
    childrenList: [
      {
        childrenList: [
          { hidden: 0, id: 3, path: "_1_2_", permission: "menu:add", pid: 2, title: "菜单新增", type: 6 },
          { hidden: 0, id: 4, path: "_1_2_", permission: "meun:tree", pid: 2, title: "菜单树", type: 6 },
          { hidden: 0, id: 5, path: "_1_2_", permission: "menu:list", pid: 2, title: "菜单列表", type: 6 },
          { hidden: 0, id: 6, path: "_1_2_", permission: "menu:info", pid: 2, title: "菜单详情", type: 6 },
          { hidden: 0, id: 7, path: "_1_2_", permission: "menu:update", pid: 2, title: "菜单更新", type: 6 },
          { hidden: 0, id: 8, path: "_1_2_", permission: "menu:delete", pid: 2, title: "菜单删除", type: 6 },
        ],
        hidden: 0,
        id: 2,
        path: "_1_",
        pid: 1,
        title: "菜单设置",
        type: 1,
      },
      {
        childrenList: [
          { hidden: 0, id: 32, path: "_1_21_", permission: "user:password:rest", pid: 21, title: "密码重置", type: 6 },
          { hidden: 0, id: 31, path: "_1_21_", permission: "user:password:update", pid: 21, title: "密码更新", type: 6 },
          { hidden: 0, id: 30, path: "_1_21_", permission: "user:delete", pid: 21, title: "用户删除", type: 6 },
          { hidden: 0, id: 29, path: "_1_21_", permission: "user:list", pid: 21, title: "用户列表", type: 6 },
          { hidden: 0, id: 23, path: "_1_21_", permission: "user:update", pid: 21, title: "用户更新", type: 6 },
          { hidden: 0, id: 22, path: "_1_21_", permission: "user:add", pid: 21, title: "用户添加", type: 6 },
          {
            component: "/user/info",
            createBy: "liyu",
            createTime: "2023-01-06 10:27:34",
            hidden: 0,
            id: 28,
            path: "_1_21_",
            permission: "user:info",
            pid: 21,
            sort: 1,
            title: "用户详情",
            type: 6,
            updateBy: "liyu",
            updateTime: "2023-01-06 14:55:32",
          },
        ],
        hidden: 0,
        id: 21,
        path: "_1_",
        pid: 1,
        title: "用户设置",
        type: 1,
      },
      {
        childrenList: [
          { hidden: 0, id: 20, path: "_1_15_", permission: "dept:delete", pid: 15, title: "部门删除", type: 6 },
          { hidden: 0, id: 19, path: "_1_15_", permission: "dept:update", pid: 15, title: "部门更新", type: 6 },
          { hidden: 0, id: 18, path: "_1_15_", permission: "dept:list", pid: 15, title: "部门列表", type: 6 },
          { hidden: 0, id: 17, path: "_1_15_", permission: "dept:info", pid: 15, title: "部门信息", type: 6 },
          { hidden: 0, id: 16, path: "_1_15_", permission: "dept:add", pid: 15, title: "部门新增", type: 6 },
        ],
        hidden: 0,
        id: 15,
        path: "_1_",
        pid: 1,
        title: "部门设置",
        type: 1,
      },
      {
        childrenList: [
          { hidden: 0, id: 13, path: "_1_9_", permission: "role:update", pid: 9, title: "角色更新", type: 6 },
          { hidden: 0, id: 14, path: "_1_9_", permission: "role:delete", pid: 9, title: "角色删除", type: 6 },
          { hidden: 0, id: 10, path: "_1_9_", permission: "role:add", pid: 9, title: "角色新增", type: 6 },
          { hidden: 0, id: 11, path: "_1_9_", permission: "role:info", pid: 9, title: "角色信息", type: 6 },
          { hidden: 0, id: 12, path: "_1_9_", permission: "role:list", pid: 9, title: "角色列表", type: 6 },
        ],
        hidden: 0,
        id: 9,
        path: "_1_",
        pid: 1,
        title: "角色设置",
        type: 1,
      },
      {
        childrenList: [
          {
            childrenList: [
              {
                hidden: 1,
                id: 60,
                path: "_1_33_59_",
                permission: "library:project:view",
                pid: 59,
                sort: 1,
                title: "项目查看",
                type: 6,
              },
              {
                hidden: 0,
                id: 35,
                path: "_1_33_59_",
                permission: "library:project:edit",
                pid: 59,
                sort: 2,
                title: "项目编辑",
                type: 6,
              },
            ],
            hidden: 0,
            id: 59,
            path: "_1_33_",
            pid: 33,
            sort: 1,
            title: "素材分类",
            type: 2,
          },
          {
            childrenList: [
              {
                component: "/library/LibraryHome",
                hidden: 1,
                id: 34,
                path: "_1_33_61_",
                permission: "library:material:view",
                pid: 61,
                router: "library",
                sort: 1,
                title: "素材查看",
                type: 6,
              },
              {
                hidden: 0,
                id: 36,
                path: "_1_33_59_",
                permission: "library:material:edit",
                pid: 61,
                sort: 2,
                title: "素材编辑",
                type: 6,
              },
            ],
            hidden: 0,
            id: 61,
            path: "_1_33_",
            pid: 33,
            sort: 2,
            title: "素材操作",
            type: 2,
          },
        ],
        component: "Layout",
        hidden: 0,
        id: 33,
        path: "_1_",
        pid: 1,
        redirect: "/library",
        sort: 100,
        title: "素材库",
        type: 1,
      },
      {
        childrenList: [
          {
            childrenList: [
              {
                component: "/report/ReportHome",
                hidden: 0,
                id: 38,
                path: "_1_37_62_",
                permission: "report:view",
                pid: 62,
                router: "report",
                sort: 1,
                title: "报表查看",
                type: 6,
              },
              {
                hidden: 0,
                id: 39,
                path: "_1_37_62_",
                permission: "report:export",
                pid: 62,
                sort: 2,
                title: "报表导出",
                type: 6,
              },
            ],
            hidden: 0,
            id: 62,
            path: "_1_37_",
            pid: 37,
            sort: 1,
            title: "素材报表",
            type: 2,
          },
        ],
        component: "Layout",
        hidden: 0,
        id: 37,
        path: "_1_",
        pid: 1,
        redirect: "/report",
        sort: 200,
        title: "报表",
        type: 1,
      },
      {
        childrenList: [
          {
            childrenList: [
              {
                childrenList: [
                  {
                    component: "/account/MediaAdd",
                    hidden: 0,
                    id: 43,
                    path: "_1_40_41_42_",
                    permission: "media:toutiao:add",
                    pid: 42,
                    redirect: "/account/toutiao_add",
                    router: "toutiao_add",
                    sort: 1,
                    title: "头条添加账户",
                    type: 6,
                  },
                ],
                component: "/account/MediaHome",
                hidden: 0,
                id: 42,
                path: "_1_40_41_",
                pid: 41,
                redirect: "/account/toutiao",
                router: "toutiao",
                sort: 1,
                title: "头条",
                type: 3,
              },
              {
                childrenList: [
                  {
                    component: "/account/MediaAdd",
                    hidden: 0,
                    id: 45,
                    path: "_1_40_41_44_",
                    permission: "media:kuaishou:add",
                    pid: 44,
                    redirect: "/account/kuaishou_add",
                    router: "kuaishou_add",
                    sort: 1,
                    title: "快手添加账户",
                    type: 6,
                  },
                ],
                component: "/account/MediaHome",
                hidden: 0,
                id: 44,
                path: "_1_40_41_",
                pid: 41,
                redirect: "/account/kuaishou",
                router: "kuaishou",
                sort: 3,
                title: "快手",
                type: 3,
              },
            ],
            component: "subLayout",
            hidden: 0,
            icon: "VideoCamera",
            id: 41,
            path: "_1_40_",
            pid: 40,
            sort: 310,
            title: "媒体投放账户",
            type: 2,
          },
          {
            childrenList: [
              {
                childrenList: [
                  {
                    component: "/account/UserModify",
                    hidden: 0,
                    id: 48,
                    path: "_1_40_46_47_",
                    permission: "user:edit",
                    pid: 47,
                    redirect: "/account/user_modify",
                    router: "user_modify",
                    sort: 1,
                    title: "人员编辑",
                    type: 6,
                  },
                  {
                    component: "/account/UserPeek",
                    hidden: 0,
                    id: 50,
                    path: "_1_40_46_47_",
                    permission: "media:view",
                    pid: 47,
                    redirect: "/account/user_peek",
                    router: "user_peek",
                    sort: 2,
                    title: "媒体账号查看",
                    type: 6,
                  },
                  {
                    component: "/account/UserAssign",
                    hidden: 0,
                    id: 49,
                    path: "_1_40_46_47_",
                    permission: "media:edit",
                    pid: 47,
                    redirect: "/account/user_assign",
                    router: "user_assign",
                    sort: 3,
                    title: "媒体账号分配",
                    type: 6,
                  },
                ],
                component: "/account/UserHome",
                hidden: 0,
                id: 47,
                path: "_1_40_46_",
                pid: 46,
                redirect: "/account/user",
                router: "user",
                sort: 1,
                title: "人员管理",
                type: 3,
              },
              {
                childrenList: [
                  {
                    component: "/account/RoleModify",
                    hidden: 0,
                    id: 52,
                    path: "_1_40_46_51_",
                    permission: "role:edit",
                    pid: 51,
                    redirect: "/account/role_modify",
                    router: "role_modify",
                    sort: 1,
                    title: "角色编辑",
                    type: 6,
                  },
                ],
                component: "/account/RoleHome",
                hidden: 0,
                id: 51,
                path: "_1_40_46_",
                pid: 46,
                redirect: "/account/role",
                router: "role",
                sort: 2,
                title: "角色管理",
                type: 3,
              },
            ],
            component: "subLayout",
            hidden: 0,
            icon: "Avatar",
            id: 46,
            path: "_1_40_",
            pid: 40,
            sort: 320,
            title: "后台账号",
            type: 2,
          },
        ],
        component: "Layout",
        hidden: 0,
        id: 40,
        path: "_1_",
        pid: 1,
        redirect: "/account",
        sort: 300,
        title: "账户",
        type: 1,
      },
    ],
    hidden: 0,
    id: 1,
    pid: 0,
    title: "系统设置",
    type: 0,
  },
];
</script>

<style scoped lang="scss"></style>
