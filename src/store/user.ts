import { defineStore } from "pinia";

// defineStore 调用后返回一个函数，调用该函数获得 Store 实体
export const useUserStore = defineStore({
  // id: 必须，在所有 Stores 中唯一
  id: "UserStore",
  state: (): any => ({
    id: null,
    token: "",
    userInfo: {},
    roleInfo: null,
    deptInfo: null,
    companyInfo: null,
    companyId: null,
    username: "",
    // 用户操作
    behavior: "",
  }),
  getters: {
    behaviorGet: (state) => state.behavior,
    userInfoGet: (state) => state.userInfo?.sysUser ?? {},
  },
  actions: {
    setId(id: number) {
      this.id = id;
    },
    setToken(token: string) {
      this.token = token;
    },
    setUserInfo(userInfo: any) {
      this.userInfo = userInfo;
    },
    setUserName(userName: string) {
      this.username = userName;
    },
    setRoleInfo(roleInfo: any) {
      this.roleInfo = roleInfo;
    },
    setDeptInfo(deptInfo: any) {
      this.deptInfo = deptInfo;
    },
    setCompanyInfo(companyInfo: any) {
      this.companyInfo = companyInfo;
    },
    setUserCompanyId(companyId: null) {
      this.companyId = companyId;
    },
    setBehavior(behavior: "add" | "modify") {
      this.behavior = behavior;
    },
  },
  persist: { key: "UserStore", storage: localStorage },
});
export const useUserStoreSessionStorage = defineStore({
  // id: 必须，在所有 Stores 中唯一
  id: "UserStoreSession",
  state: (): any => ({
    // 用户操作
    behavior: "",
  }),
  getters: {
    behaviorGet: (state) => state.behavior,
  },
  actions: {
    setBehavior(behavior: "add" | "modify" | "view") {
      this.behavior = behavior;
    },
  },
  persist: { key: "UserStoreSession", storage: sessionStorage },
});
