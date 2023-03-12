import qs from "qs";
import http from "@/api";
import { PORTAuth } from "../config/servicePort";

/**
 * @name 获取部门列表 list
 * @params nameL: 非必须，根据字符串对部门列表进行筛选
 */
export const getDeptListApi = (params?: any) => {
  // console.warn("获取部门列表");
  return http.get(PORTAuth + `/dept/list?${qs.stringify(params)}`);
};

/**
 * @name 获取部门信息 info
 * @params id: 非必须，根据 id 查询部门信息
 */
export const getDeptInfoApi = (params?: any) => {
  // console.warn("获取部门信息");
  return http.get(PORTAuth + `/dept/info?${qs.stringify(params)}`);
};

/**
 * @name 获取部门树 tree
 * @params id: 非必须，根据 id 查询部门树
 */
export const getDeptTreeApi = (params?: any) => {
  // console.warn("获取部门树");
  return http.get(PORTAuth + `/dept/tree?${qs.stringify(params)}`);
};

/**
 * @name 部门添加 add
 * @params name: 必须，部门名称
 * @params type: 必须，部门类型：1公司，2部门，3职位
 * @params pid: 必须，父部门 id, 没有则填 0
 * @params sort: 非必须，同级排序
 */
export const postDeptAddApi = (params: any) => {
  return http.post(PORTAuth + `/dept/add`, params);
  // return http.post(PORTAuth + `/dept/add`);
  // return http.post<Login.ResLogin>(PORT1 + `/dept/add`, params, { headers: { noLoading: true } }); // 正常 post json 请求  ==>  application/json
  // return http.post<Login.ResLogin>(PORT1 + `/dept/add`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
  // return http.post<Login.ResLogin>(PORT1 + `/dept/add`, qs.stringify(params)); // post 请求携带表单参数  ==>  application/x-www-form-urlencoded
  // return http.get<Login.ResLogin>(PORT1 + `/dept/add?${qs.stringify(params, { arrayFormat: "repeat" })}`); // 如果是 get 请求可以携带数组等复杂参数
};

/**
 * @name 部门修改 update
 * @params id: 必须，部门id
 * @params name: 非必须，部门名称
 * @params type: 非必须，部门类型：1公司，2部门，3职位
 * @params pid: 非必须，父部门 id, 没有则填 0
 * @params sort: 非必须，同级排序
 */
export const postDeptUpdateApi = (params: any) => {
  return http.post(PORTAuth + `/dept/update`, params);
};

/**
 * @name 部门删除 delete
 * @params id: 必须，部门id
 */
export const postDeptDeleteApi = (params: any) => {
  return http.post(PORTAuth + `/dept/delete`, params);
};
