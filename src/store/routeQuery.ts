import { defineStore } from "pinia";
import { ObjToKeyValArray, RouteQueryStore } from "./interface/model";

/**
 * v3 版本用于记录路由跳转参数，不使用 query 参数避免面包屑跳转时参数丢失
 */
export const useRouteQueryStore = defineStore({
  id: "RouteQueryStore",
  state: (): RouteQueryStore => ({
    appId: null, // appId
    modelId: null, // 模型id
    modelName: "", // 模型名称
    modelInfoId: null, // 模型详情id
    modelVersion: "", // 模型详情版本
  }),
  getters: {},
  actions: {
    setRouteQueryState(...args: ObjToKeyValArray<RouteQueryStore>) {
      this.$patch({ [args[0]]: args[1] });
    },
  },
  persist: { key: "RouteQueryStore", storage: window.localStorage },
});
