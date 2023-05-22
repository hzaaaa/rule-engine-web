import http from "@/api";
import { PORTApp_v2 } from "../config/servicePort";

/**
 * @name 获取app列表
 * @param appId: 非必须
 * @param name: 非必须
 * @param pageNum: 非必须
 * @param pageSize: 非必须
 */
export const getAppListApi = (params?: any) => {
  return http.get<any>(PORTApp_v2 + `/app/list`, params);
};

/**
 * @name 新增/编辑app (已废弃)
 * @param id: 非必须，新建不传，编辑必传
 * @param status: 非必须，默认为true，删除时只需填 id 和 status=false
 * @param name: 非必须，app名称
 * @param info: 非必须，app描述
 */
/*
export const postAppEditApi = (params?: any) => {
  return http.post<any>(PORTApp_v2 + `/app/edit`, params);
  // return http.post(PORTAuth + `/dept/add`);
  // return http.post<Login.ResLogin>(PORT1 + `/dept/add`, params, { headers: { noLoading: true } }); // 正常 post json 请求  ==>  application/json
  // return http.post<Login.ResLogin>(PORT1 + `/dept/add`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
  // return http.post<Login.ResLogin>(PORT1 + `/dept/add`, qs.stringify(params)); // post 请求携带表单参数  ==>  application/x-www-form-urlencoded
  // return http.get<Login.ResLogin>(PORT1 + `/dept/add?${qs.stringify(params, { arrayFormat: "repeat" })}`); // 如果是 get 请求可以携带数组等复杂参数
};
*/

/**
 * @name 新增app
 * @param id: 非必须，新建不传，编辑必传
 * @param status: 非必须，默认为true，删除时只需填 id 和 status=false
 * @param name: 必须，app名称
 * @param info: 非必须，app描述
 */
export const postAppAddApi = (params?: any) => {
  return http.post<any>(PORTApp_v2 + `/app/add`, params);
  // return http.post(PORTAuth + `/dept/add`);
  // return http.post<Login.ResLogin>(PORT1 + `/dept/add`, params, { headers: { noLoading: true } }); // 正常 post json 请求  ==>  application/json
  // return http.post<Login.ResLogin>(PORT1 + `/dept/add`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
  // return http.post<Login.ResLogin>(PORT1 + `/dept/add`, qs.stringify(params)); // post 请求携带表单参数  ==>  application/x-www-form-urlencoded
  // return http.get<Login.ResLogin>(PORT1 + `/dept/add?${qs.stringify(params, { arrayFormat: "repeat" })}`); // 如果是 get 请求可以携带数组等复杂参数
};

/**
 * @name 获取base列表
 * @param app: 必须
 * @param id: 非必须
 * @param name: 非必须
 * @param scene: 非必须
 * @param pageId: 非必须
 * @param pageSize: 非必须
 */
export const getBaseListApi = (params?: any) => {
  return http.get<any>(PORTApp_v2 + `/base/list`, params);
};

/**
 * @name 新增base
 * @param appId: 新建必须，编辑非必须
 * @param name: 非必须，base名称
 * @param scenes: 非必须，订阅场景
 * @param status: 非必须，0删除，不删除不必须，number
 * @param debug: 非必须，debug 类型修改, number
 * @param priority: 非必须，1，number
 */
export const postBaseAddApi = (params?: any) => {
  return http.post<any>(PORTApp_v2 + `/base/add`, params);
};

/**
 * @name 编辑base
 * @param appId: 新建必须，编辑非必须
 * @param id: 必须，baseId
 * @param name: 非必须，base名称
 * @param scenes: 非必须，订阅场景
 * @param status: 非必须，0删除，不删除不必须，number
 * @param debug: 非必须，debug 类型修改, number
 * @param priority: 非必须，1，number
 */
export const postBaseUpdateApi = (params?: any) => {
  return http.post<any>(PORTApp_v2 + `/base/update`, params);
};

/**
 * @name 编辑base（已废弃）
 * @param appId: 新建必须，编辑非必须
 * @param id: 新建不必须，编辑必须，number
 * @param name: 非必须，base名称
 * @param scenes: 非必须，订阅场景
 * @param status: 非必须，0删除，不删除不必须，number
 * @param confId: 非必须，配置ID修改，number
 * @param debug: 非必须，debug 类型修改, number
 */
/*
export const postBaseEditApi = (params?: any) => {
  return http.post<any>(PORTApp_v2+`/base/edit`, params);
};
*/

/**
 * @name 删除base
 * @param appId: 非必须
 * @param id: 必须，编辑必须，number
 * @param name: 非必须，base名称
 * @param scenes: 非必须，订阅场景
 * @param status: 非必须，0删除，不删除不必须，number
 * @param confId: 非必须，配置ID修改，number
 * @param debug: 非必须，debug 类型修改, number
 */
export const postBaseDeleteApi = (params: any) => {
  return http.post<any>(PORTApp_v2 + `/base/delete`, params);
};

/**
 * @name base备份
 * @param baseId: 必须，备份baseId
 * @param reason: 非必须，备份原因
 */
export const getBaseBackupApi = (params: any) => {
  return http.get<any>(PORTApp_v2 + `/base/backup`, params);
};

/**
 * @name base备份历史
 * @param appId: 必须，appId
 * @param baseId: 必须，备份baseId
 * @param pageNum: 必须，页码
 * @param pageSize: 必须，页大小
 */
export const getBaseBackupHistoryApi = (params: any) => {
  return http.get<any>(PORTApp_v2 + `/base/backup/history`, params);
};

/**
 * @name base备份删除
 * @param pushId: 必须，pushId
 */
export const getBaseBackupDeleteApi = (params: any) => {
  return http.get<any>(PORTApp_v2 + `/base/backup/delete`, params);
};

/**
 * @name base导出
 * @param baseId: 必须，备份baseId
 * @param pushId: 非必须，pushId
 */
export const getBaseExportApi = (params: any) => {
  return http.get<any>(PORTApp_v2 + `/base/export`, params);
};

/**
 * @name base从发布历史中回滚
 * @param pushId: 必须，pushId
 */
export const getBaseRollbackApi = (params: any) => {
  return http.get<any>(PORTApp_v2 + `/base/rollback`, params);
};

/**
 * @name base导入
 * @param json: 必须
 */
export const postBaseImportApi = (params: any) => {
  return http.post<any>(PORTApp_v2 + `/base/import`, params);
};

/**
 * @name 查看conf详情
 * @param appId: 必须
 * @param baseId: 必须
 * @param confId: 非必须
 * @param address：必须，server
 */
export const getConfDetailApi = (params: { appId: number; baseId: number; confId?: number; address: string }) => {
  return http.get<any>(PORTApp_v2 + `/conf/detail`, params);
};

/**
 * @name 获取confLeafClass
 * @param appId: 必须
 * @param type: 必须
 */
export const getConfLeafApi = (params: any) => {
  return http.get<any>(PORTApp_v2 + `/conf/leaf/class`, params);
};

/**
 * @name 获取confLeafClassInfo 添加，修改节点时会根据返回的结果来动态展示输入框
 * @param appId: 必须
 * @param type: 必须
 */
export const getConfLeafInfoApi = (params: any) => {
  return http.get<any>(PORTApp_v2 + `/conf/leaf/class/info`, params);
};

/**
 * @name confName校验
 * @param appId: 必须
 * @param type: 必须
 * @param clazz: 必须
 */
export const getConfClassCheckApi = (params: any) => {
  return http.get<any>(PORTApp_v2 + `/conf/class/check`, params);
};

/**
 * @name 编辑节点
 * @param appId: 必须，number
 * @param editType: 必须，number
 * @param baseId: 必须，number
 * @param selectId: 非必须，操作的节点id，number
 * @param name: 非必须，名称
 * @param nodeType: 非必须，number
 * @param multiplexIds: 非必须，从已知节点ID添加(添加子节点/前置节点  添加多个子节点用","分隔)，number
 * @param inverse: 非必须，是否反转节点执行结果 默认0，number
 * @param confName: 非必须，叶子节点配置类名(叶子节点必传)
 * @param confField: 非必须，叶子节点配置详情json(不填默认空)
 * @param timeType: 非必须，时间类型 默认1，number
 * @param start: 非必须，开始时间 时间类型是5/7必填，形如：1638792185000，number
 * @param end: 非必须，开始时间 时间类型是5/7必填，形如：1638792185000，number
 * @param debug: 非必须，debug 默认1，number
 * @param parentId: 非必须，操作节点的父节点ID，number
 * @param index: 非必须，操作节点的位置，number
 * @param moveTo: 非必须，移动节点到同父节点下的另一位置，number
 * @param nextId: 非必须，操作节点的下一节点ID(一般指操作)，number
 * @param moveToParentId: 非必须，移动到的parentId，number
 * @param moveToNextId: 非必须，移动到的后置ID，number
 */
export const postConfEditApi = (params: any) => {
  return http.post<any>(PORTApp_v2 + `/conf/edit`, params);
};

/**
 * @name conf/发布
 * @param appId: 必须
 * @param baseId: 必须
 */
export const getConfReleaseApi = (params: any) => {
  return http.get<any>(PORTApp_v2 + `/conf/release`, params);
};

/**
 * @name conf/清除
 * @param appId: 必须
 * @param baseId: 必须
 */
export const getConfUpdateCleanApi = (params: any) => {
  return http.get<any>(PORTApp_v2 + `/conf/update_clean`, params);
};
