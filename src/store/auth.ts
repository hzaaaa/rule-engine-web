import { defineStore } from "pinia";
import { getShowMenuList, getRouterMenuList, getAllBreadcrumbList, getFlatArr, getGeekerAdminShowMenuList } from "@/utils/util";
import { getAuthButtonListApi, getMockDynamicRouterApi } from "@/api/login/login";

// AuthStore 菜单、权限相关存储
export const useAuthStore = defineStore({
  id: "AuthState",
  state: () => ({
    // 原始菜单列表 后端返回
    authOriginMenuList: <Menu.BackMenuOptions[]>[],
    // 处理后的动态路由，不做持久化存储
    authMenuList: <any[]>[],
    // 按钮权限列表
    authButtonList: <string[]>[],
    // 模拟数据：动态路由
    mockDynamicMenuList: <any[]>[],
  }),
  getters: {
    // 后端返回的原始菜单列表
    authOriginMenuListGet: (state) => state.authOriginMenuList,
    // 后端返回的菜单列表 => 左侧菜单栏渲染，去除 hidden == 1 和 type > 5
    showMenuListGet: (state) => getShowMenuList(state.authOriginMenuList),
    // 后端返回的菜单列表 => 生成处理前的动态路由，去除 type > 5
    routerMenuListGet: (state) => getRouterMenuList(state.authOriginMenuList),
    // 处理后的动态路由
    authMenuListGet: (state) => state.authMenuList,
    // 按钮权限列表
    authButtonListGet: (state) => state.authButtonList,
    // 模拟数据：扁平化之后的一维数组路由，主要用来添加动态路由
    flatMenuListGet: (state) => getFlatArr(state.mockDynamicMenuList),
    // 模拟数据：所有面包屑导航列表
    breadcrumbListGet: (state) => getAllBreadcrumbList(state.mockDynamicMenuList),
    // 模拟数据：所有面包屑导航列表 ==> 左侧菜单栏渲染，需要去除 isHide == true
    mockShowMenuListGet: (state) => getGeekerAdminShowMenuList(state.mockDynamicMenuList),
  },
  actions: {
    // 获取按钮权限列表
    async getAuthButtonList() {
      // console.log("store,auth.ts 里获取按钮的 actions");
      const { data } = await getAuthButtonListApi();
      this.authButtonList = data;
    },
    // 设置菜单列表
    async setOriginAuthMenuList(menuList: Menu.BackMenuOptions[]) {
      this.authOriginMenuList = menuList;
    },
    // 设置动态路由
    async setAuthMenuList(menuList: any) {
      this.authMenuList = menuList;
    },
    // 模拟数据：获取模拟动态路由
    async getMockDynamicRouter() {
      const { data } = await getMockDynamicRouterApi();
      this.mockDynamicMenuList = data;
    },
  },
  persist: { key: "AuthState", storage: window.localStorage, paths: ["authOriginMenuList", "authButtonList"] },
});
