import qs from "qs";
import http from "@/api";
import { PORTAuth } from "../config/servicePort";

/**
 * @name 获取菜单列表 list
 */
export const getMenuListApi = (params?: any) => {
  // console.warn("获取菜单列表");
  return http.get(PORTAuth + `/menu/list?${qs.stringify(params)}`);
};

/**
 * @name 获取菜单信息 info
 */
export const getMenuInfoApi = (params?: any) => {
  // console.warn("获取菜单信息");
  return http.get(PORTAuth + `/menu/info?${qs.stringify(params)}`);
};

/**
 * @name 获取菜单树 tree
 */
export const getMenuTreeApi = (params?: any) => {
  // console.warn("获取菜单树");
  return http.get(PORTAuth + `/menu/tree?${qs.stringify(params)}`);
};

/**
 * @name 获取用户菜单树 usertree
 */
export const getMenuUserTreeApi = () => {
  return http.get(PORTAuth + `/menu/user/tree`);
};

/**
 * @name 菜单添加 add
 */
export const postMenuAddApi = (params: any) => {
  return http.post(PORTAuth + `/menu/add`, params);
  // return http.post(PORTAuth + `/menu/add`);
  // return http.post<Login.ResLogin>(PORT1 + `/menu/add`, params, { headers: { noLoading: true } }); // 正常 post json 请求  ==>  application/json
  // return http.post<Login.ResLogin>(PORT1 + `/menu/add`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
  // return http.post<Login.ResLogin>(PORT1 + `/menu/add`, qs.stringify(params)); // post 请求携带表单参数  ==>  application/x-www-form-urlencoded
  // return http.get<Login.ResLogin>(PORT1 + `/menu/add?${qs.stringify(params, { arrayFormat: "repeat" })}`); // 如果是 get 请求可以携带数组等复杂参数
};

/**
 * @name 菜单修改 update
 */
export const postMenuUpdateApi = (params: any) => {
  return http.post(PORTAuth + `/menu/update`, params);
};

/**
 * @name 菜单删除 delete
 */
export const postMenuDeleteApi = (params: any) => {
  return http.post(PORTAuth + `/menu/delete`, params);
};
