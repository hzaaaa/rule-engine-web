import qs from "qs";
import http from "@/api";
import { PORTAuth } from "../config/servicePort";

/**
 * @name 获取用户列表 list
 */
export const getUserListApi = (params?: any) => {
  // console.warn("获取用户列表");
  return http.get<any>(PORTAuth + `/user/list?${qs.stringify(params)}`);
};

/**
 * @name 获取用户信息 info
 */
export const getUserInfoApi = (params?: any) => {
  // console.warn("获取用户信息");
  return http.get<any>(PORTAuth + `/user/info?${qs.stringify(params)}`);
};

/**
 * @name 用户添加 add
 */
export const postUserAddApi = (params: any) => {
  return http.post(PORTAuth + `/user/add`, params);
  // return http.post(PORTAuth + `/user/add`);
  // return http.post<Login.ResLogin>(PORT1 + `/user/add`, params, { headers: { noLoading: true } }); // 正常 post json 请求  ==>  application/json
  // return http.post<Login.ResLogin>(PORT1 + `/user/add`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
  // return http.post<Login.ResLogin>(PORT1 + `/user/add`, qs.stringify(params)); // post 请求携带表单参数  ==>  application/x-www-form-urlencoded
  // return http.get<Login.ResLogin>(PORT1 + `/user/add?${qs.stringify(params, { arrayFormat: "repeat" })}`); // 如果是 get 请求可以携带数组等复杂参数
};

/**
 * @name 用户修改 update
 */
export const postUserUpdateApi = (params: any) => {
  return http.post(PORTAuth + `/user/update`, params);
};

/**
 * @name 用户删除 delete
 */
export const postUserDeleteApi = (params: any) => {
  return http.post(PORTAuth + `/user/delete`, params);
};

/**
 * @name 用户修改密码 password update
 */
export const postUserPasswordUpdateApi = (params: any) => {
  return http.post(PORTAuth + `/user/password/update`, params);
};

/**
 * @name 用户修改重置 reset
 */
export const postUserPasswordResetApi = (params: any) => {
  return http.post(PORTAuth + `/user/password/reset`, params);
};
