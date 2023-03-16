// api/index.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import { useGlobalStore } from "@/store";
import router from "@/router";

// * 请求响应参数(不包含data)
export interface Result {
  code: number;
  msg: string;
}
// * 请求响应参数(包含data)
export interface ResultData<T> extends Result {
  data: T;
}
export enum ResultEnum {
  SUCCESS = 200,
  ERROR = 500,
  OVERDUE = 599,
  TIMEOUT = 10000,
  TYPE = "success",
}

const config = {
  // 默认地址请求地址，可在 .env 开头文件中修改
  baseURL: import.meta.env.VITE_API_URL,
  // 设置超时时间（10s）
  timeout: ResultEnum.TIMEOUT as number,
};

class RequestHttp {
  service: AxiosInstance;
  constructor(config: AxiosRequestConfig) {
    // 实例化 axios
    this.service = axios.create(config);

    /**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的token,存储到vuex/pinia/本地储存当中
     */
    this.service.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const globalStore = useGlobalStore();
        const token: string = globalStore.token;
        // 给每个请求添加 Authorization 请求头，将用户 token 传到后端
        if (token && config.headers && typeof config.headers.set === "function") {
          config.headers.set("Authorization", `Bearer ${token}`);
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data } = response;
        const globalStore = useGlobalStore();
        if (data.code == ResultEnum.OVERDUE) {
          globalStore.setToken("");
          router.replace("/");
          return Promise.reject(data);
        }
        if (data.code && data.code != ResultEnum.SUCCESS) {
          // console.error("[响应拦截]", data.msg);
          ElMessage.error(data.msg);
          return Promise.reject(data);
        }
        return data;
      },
      (error: AxiosError) => {
        const { response } = error;
        return Promise.reject(response);
      }
    );
  }

  // * 常用请求方法封装
  get<T>(url: string, params?: object, _config = {}): Promise<ResultData<T>> {
    return this.service.get(url, { params, ..._config });
  }
  post<T>(url: string, params?: object, _config = {}): Promise<ResultData<T>> {
    return this.service.post(url, params, _config);
  }
}

export default new RequestHttp(config);
