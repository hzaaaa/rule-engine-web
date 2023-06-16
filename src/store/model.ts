import { defineStore } from "pinia";
import { ModelItem, ModelStore } from "./interface/model";

/**
 * v3 版本用于前端保存模型信息
 */
export const useModelStore = defineStore({
  id: "ModelStore",
  state: (): ModelStore => ({
    // 模型列表信息
    model: {},
  }),
  getters: {},
  actions: {
    setModel(key: string, model: ModelItem[]) {
      this.model[key] = model;
    },
    deleteModel(key: string) {
      delete this.model[key];
    },
  },
  persist: { key: "ModelStore", storage: window.localStorage },
});
