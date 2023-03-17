import http from "@/api";
import { PORTTask } from "../config/servicePort";

/**
 * @name 获取任务列表
 * @param userId: 必须，可为 null
 * @param pageNum: 必须，
 * @param pageSize: 必须，
 */
export const postTaskHistoryListApi = (params: { userId: any; pageNum: number; pageSize: number }) => {
  return http.post<any>(PORTTask + `/task/history/getTaskHistoryList`, params);
};

/**
 * @name 任务结果下载
 * @param taskId: 必须
 */
export const getExportTaskResultFileApi = (params: { taskId: string }) => {
  return http.get<any>(PORTTask + `/task/history/exportTaskResultFile`, params, { responseType: "blob" });
};

/**
 * @name 提交任务
 * @param file: 必须，新建不传，编辑必传
 * @param params: 必须，{"baseId": 17, "taskMode": "async"} 形式的字符串
 */
export const postTaskStartApi = (params: any) => {
  return http.post<any>(PORTTask + `/task/taskStart`, params);
};
