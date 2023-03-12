import qs from "qs";
import http from "@/api";
import { PORTAuth } from "../config/servicePort";

/**
 * @name 获取角色列表 list
 */
export const getRoleListApi = (params?: any) => {
  // console.warn("获取角色列表");
  return http.get<any>(PORTAuth + `/role/list?${qs.stringify(params)}`);
};

/**
 * @name 获取角色信息 info
 */
export const getRoleInfoApi = (params?: any) => {
  // console.warn("获取角色信息");
  return http.get<any>(PORTAuth + `/role/info?${qs.stringify(params)}`);
};

/**
 * @name 角色添加 add
 */
export const postRoleAddApi = (params: any) => {
  return http.post(PORTAuth + `/role/add`, params);
  // return http.post(PORTAuth + `/role/add`);
  // return http.post<Login.ResLogin>(PORT1 + `/role/add`, params, { headers: { noLoading: true } }); // 正常 post json 请求  ==>  application/json
  // return http.post<Login.ResLogin>(PORT1 + `/role/add`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
  // return http.post<Login.ResLogin>(PORT1 + `/role/add`, qs.stringify(params)); // post 请求携带表单参数  ==>  application/x-www-form-urlencoded
  // return http.get<Login.ResLogin>(PORT1 + `/role/add?${qs.stringify(params, { arrayFormat: "repeat" })}`); // 如果是 get 请求可以携带数组等复杂参数
};

/**
 * @name 角色修改 update
 */
export const postRoleUpdateApi = (params: any) => {
  return http.post(PORTAuth + `/role/update`, params);
};

/**
 * @name 角色删除 delete
 */
export const postRoleDeleteApi = (params: any) => {
  return http.post(PORTAuth + `/role/delete`, params);
};
