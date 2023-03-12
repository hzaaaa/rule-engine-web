import { defineStore, createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { ThemeConfigProps } from "./interface";

// defineStore 调用后返回一个函数，调用该函数获得 Store 实体
export const useGlobalStore = defineStore({
  // id: 必须，在所有 Store 中唯一
  id: "GlobalState",
  state: () => ({
    // token
    token: "",
    // 用户名
    username: "",
    // 角色
    role: "",
    // 所属部门
    dept: "",
    // 主题配置
    themeConfig: {
      // 折叠菜单
      isCollapse: false,
      // 面包屑导航
      breadcrumb: false,
      // 面包屑导航图标
      breadcrumbIcon: true,
    },
  }),
  getters: {
    tokenLength: (state) => state.token.length,
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setUsername(username: string) {
      this.username = username;
    },
    setRole(role: string) {
      this.role = role;
    },
    setDept(dept: string) {
      this.dept = dept;
    },
    // setThemeConfig
    setThemeConfig(themeConfig: ThemeConfigProps) {
      this.themeConfig = themeConfig;
    },
  },
  persist: { key: "GlobalState", storage: window.localStorage },
});

// piniaPersist(持久化)
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;
