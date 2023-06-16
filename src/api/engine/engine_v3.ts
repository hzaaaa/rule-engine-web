import http from "@/api";
import { PORTApp_v3 } from "../config/servicePort";

/**
 * @name 新增app
 * @param id number
 * @param name 必须. app名称
 * @param info app描述
 * @param enable 是否启用 0禁用 1启用
 */
export const postAppAddApi = (params: any) => {
  return http.post<any>(PORTApp_v3 + `/app/add`, params);
  // return http.post<Login.ResLogin>(PORT1 + `/dept/add`, params, { headers: { noLoading: true } }); // 正常 post json 请求  ==>  application/json
  // return http.post<Login.ResLogin>(PORT1 + `/dept/add`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
  // return http.post<Login.ResLogin>(PORT1 + `/dept/add`, qs.stringify(params)); // post 请求携带表单参数  ==>  application/x-www-form-urlencoded
  // return http.get<Login.ResLogin>(PORT1 + `/dept/add?${qs.stringify(params, { arrayFormat: "repeat" })}`); // 如果是 get 请求可以携带数组等复杂参数
};

/**
 * @name 修改app
 * @param id 必须. number
 * @param name app名称
 * @param info app描述
 * @param enable 是否启用 0禁用 1启用
 */
export const postAppUpdateApi = (params: any) => {
  return http.post<any>(PORTApp_v3 + `/app/update`, params);
};

/**
 * @name 删除app
 * @param id 必须. number
 * @param name app名称
 * @param info app描述
 * @param enable 是否启用 0禁用 1启用
 */
export const postAppDeleteApi = (params: any) => {
  return http.post<any>(PORTApp_v3 + `/app/delete`, params);
};

/**
 * @name 获取app列表
 * @param nameLike appName模糊查询
 * @param enable 是否启用 0禁用 1启用, number
 * @param sorts 排序
 * @param current 页码, number
 * @param size 分页大小，默认10, number
 */
export const getAppListPageApi = (params?: any) => {
  return http.get<any>(PORTApp_v3 + `/app/list/page`, params);
};

/**
 * @name 获取app详情
 * @param appId 必须. number
 */
export const getAppInfoApi = (params: any) => {
  return http.get<any>(PORTApp_v3 + `/app/info`, params);
};

/**
 * @name 模型添加
 * @param id 模型主键id, number
 * @param name 必须，模型名
 * @param appId 必须, number
 * @param enable 是否启用,禁用后下属生效版本也被禁用
 * @param description 模型描述
 */
export const postModelAddApi = (params: any) => {
  return http.post<any>(PORTApp_v3 + `/model/add`, params);
};

/**
 * @name 模型修改
 * @param id 必须, 模型主键id, number
 * @param name 模型名
 * @param appId number
 * @param enable 是否启用,禁用后下属生效版本也被禁用
 * @param description 模型描述
 */
export const postModelUpdateApi = (params: any) => {
  return http.post<any>(PORTApp_v3 + `/model/update`, params);
};

/**
 * @name 模型删除
 * @param id 必须, 模型主键id, number
 * @param name 模型名
 * @param appId number
 * @param enable 是否启用,禁用后下属生效版本也被禁用
 * @param description 模型描述
 */
export const postModelDeleteApi = (params: any) => {
  return http.post<any>(PORTApp_v3 + `/model/delete`, params);
};

/**
 * @name 获取模型列表
 * @param appId number
 * @param nameLike name模糊查询
 * @param enable 是否启用 0禁用 1启用, number
 * @param sorts 排序
 * @param current 页码, number
 * @param size 分页大小，默认10, number
 */
export const getModelListPageApi = (params?: any) => {
  return http.get<any>(PORTApp_v3 + `/model/list/page`, params);
};

/**
 * @name 模型详情
 * @param modelId: 必须, model主键id, number
 */
export const getModelInfoApi = (params: any) => {
  return http.get<any>(PORTApp_v3 + `/model/info`, params);
};

/**
 * @name 模型详情添加
 * @param id 模型详情主键, number
 * @param modelId 必须, 模型id, number
 * @param modelInfo 模型信息
 * @param enable 启用状态 0禁用 1启用，同一个版本只能有一个启用
 * @param publish 发布状态 0未发布 1发布 模型编写前处于未发布 完成为发布 发布状态才能启用
 * @param version 版本号 自动生成 yyyyMMddHHmmss
 * @param versionDescription 版本描述
 */
export const postModelInfoAddApi = (params: any) => {
  return http.post<any>(PORTApp_v3 + `/modelInfo/add`, params);
};

/**
 * @name 启用模型详情
 * @param modelInfoId 必须, 模型详情id, number
 * @param enable 必须, 启用状态 0禁用 1启用，同一个版本只能有一个启用
 */
export const getModelInfoEnableApi = (params: any) => {
  return http.get<any>(PORTApp_v3 + `/modelInfo/enable`, params);
};

/**
 * @name 发布模型详情
 * @param modelInfoId 必须, 模型详情id, number
 * @param publish 必须, 发布状态 0未发布 1发布 模型编写前处于未发布 完成为发布 发布状态才能启用
 */
export const getModelInfoPublishApi = (params: any) => {
  return http.get<any>(PORTApp_v3 + `/modelInfo/publish`, params);
};

/**
 * @name 模型详情修改
 * @param id 必须, 模型详情主键, number
 * @param modelId 模型id, number
 * @param modelInfo 模型信息
 * @param enable 启用状态 0禁用 1启用，同一个版本只能有一个启用
 * @param publish 发布状态 0未发布 1发布 模型编写前处于未发布 完成为发布 发布状态才能启用
 * @param version 版本号 自动生成 yyyyMMddHHmmss
 * @param versionDescription 版本描述
 */
export const postModelInfoUpdateApi = (params: any) => {
  return http.post<any>(PORTApp_v3 + `/modelInfo/update`, params);
};

/**
 * @name 模型详情修改
 * @param id 必须, 模型详情主键, number
 * @param modelId 模型id, number
 * @param modelInfo 模型信息
 * @param enable 启用状态 0禁用 1启用，同一个版本只能有一个启用
 * @param publish 发布状态 0未发布 1发布 模型编写前处于未发布 完成为发布 发布状态才能启用
 * @param version 版本号 自动生成 yyyyMMddHHmmss
 * @param versionDescription 版本描述
 */
export const postModelInfoDeleteApi = (params: any) => {
  return http.post<any>(PORTApp_v3 + `/modelInfo/delete`, params);
};

/**
 * @name 获取模型详情列表
 * @param modelId 必须, 模型id, number
 * @param publish 发布状态 0未发布 1发布 模型编写前处于未发布 完成为发布 发布状态才能启用
 * @param enable 启用状态 0禁用 1启用，同一个版本只能有一个启用, number
 * @param versionLike 版本模糊搜索
 * @param sorts 排序
 * @param current 页码, number
 * @param size 分页大小，默认10, number
 */
export const getModelInfoListPageApi = (params: any) => {
  return http.get<any>(PORTApp_v3 + `/modelInfo/list/page`, params);
};

/**
 * @name 模型详情
 * @param modelId 必须, modelInfo主键id, number
 */
export const getModelInfoInfoApi = (params: any) => {
  return http.get<any>(PORTApp_v3 + `/modelInfo/info`, params);
};

/**
 * @name 导出模型信息
 * @param modelId 必须, modelInfo主键id, number
 */
export const postModelInfoExportApi = (params: any) => {
  return http.post<any>(PORTApp_v3 + `/modelInfo/export`, params);
};

/**
 * @name 获取可用节点信息
 * @param type 必须, 节点类型, number
 */
export const getNodeClassInfoApi = (params: any) => {
  return http.get<any>(PORTApp_v3 + `/node/class/info`, params);
};
