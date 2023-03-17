import http from "@/api";
import { PORTAuth } from "../config/servicePort";
import DynamicRouter from "@/assets/json/dynamicRouter.json";

// * 登录模块 interface
export namespace Login {
  export interface ReqLoginForm {
    username: string;
    password: string;
    type: number;
    captchaId?: string;
    code?: string;
  }
  export interface ResLogin {
    token: string;
    [key: string]: any;
  }
  export interface ResCaptcha {
    captchaId: string;
    img: string;
  }
}

/**
 * @name 登录模块
 */
export const loginApi = (params: Login.ReqLoginForm) => {
  // console.warn("调用 login 接口");
  return http.post<Login.ResLogin>(PORTAuth + `/auth/login`, params);
  return http.post<Login.ResLogin>(PORTAuth + `/auth/login`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
};
/**
 * @name 获取验证码图片
 */
export const captcha = () => {
  return http.get<Login.ResCaptcha>(PORTAuth + `/auth/captcha`);
};
/**
 * @name 获取按钮权限列表
 */
export const getAuthButtonListApi = () => {
  // console.warn("调用获取按钮权限接口");
  return http.get<string[]>(PORTAuth + `/menu/user/permission`);
};
/**
 * @name 退出登录
 */
export const logoutApi = () => {
  return http.post(PORTAuth + `/auth/logout`);
};

// * 获取菜单列表
export const getMockDynamicRouterApi = () => {
  // return http.get<Menu.MenuOptions[]>(PORTAuth + `/menu/list`, {}, { headers: { noLoading: true } });
  // 如果想让菜单变为本地数据，注释上一行代码，并引入本地 dynamicRouter.json 数据
  return DynamicRouter;
};
