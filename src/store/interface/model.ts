// ModelStore
export interface ModelItem {
  id: string;
  nodeType: number;
  name: string;
  className?: string; // 算子类型，例如："com.weiyankeji.rule.engine.core.node.operator.AddOperator"
  classInfo?: string; // 算子信息，json字符串，例如："{\"returnName\":\"sum\"}"
  [key: string]: any;
}

export interface ModelTreeItem extends ModelItem {
  children?: ModelItem[];
}

export interface ModelStore {
  model: {
    [key: string]: ModelItem[];
  };
}

export interface RouteQueryStore {
  appId: number | null; // appId
  modelId: number | null; // 模型id
  modelName: string; // 模型名称
  modelInfoId: number | null; // 模型详情id
  modelVersion: string; // 模型详情版本
}

export type ObjToKeyValArray<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T];
