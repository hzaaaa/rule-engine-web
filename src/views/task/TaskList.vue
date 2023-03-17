<template>
  <div>
    <el-table :data="tableData" class="table">
      <el-table-column label="ID" prop="id" min-width="80"></el-table-column>
      <el-table-column label="baseId" prop="baseId" min-width="80"></el-table-column>
      <el-table-column label="创建人" prop="createUsername" min-width="80"></el-table-column>
      <el-table-column label="创建时间" prop="createAt" min-width="150"></el-table-column>
      <el-table-column label="文件名" prop="fileName" min-width="200"></el-table-column>
      <el-table-column label="操作" min-width="100">
        <template #default="scope">
          <el-button link type="primary" @click="downLoad(scope.row)">下载</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" min-width="400">
      <template #default="scope">
        <el-button link type="primary" @click="openEditDialog('edit', scope.row)">编辑</el-button>
        <el-button link type="primary" @click="jumpToConfDetail(scope.row)">查看详情</el-button>
        <el-button link type="primary" @click="backup(scope.row)">备份</el-button>
        <el-button link type="primary" @click="peekBackup(scope.row)">备份历史</el-button>
        <el-button link type="primary" @click="exportJson(scope.row)">导出</el-button>
      </template>
    </el-table-column> -->
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="pageParams.pageNum"
      :page-size="pageParams.pageSize"
      :total="pageParams.total"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script setup lang="ts">
import { getExportTaskResultFileApi, postTaskHistoryListApi } from "@/api/task/task";
import { reactive, ref } from "vue";

/**
 * 分页组件
 */
const pageParams = reactive({
  pageNum: 1,
  pageSize: 20,
  total: 20,
});
const handleCurrentChange = (pageNum: number) => {
  pageParams.pageNum = pageNum;
  refreshTableData();
};
const handleSizeChange = (pageSize: number) => {
  pageParams.pageNum = 1;
  pageParams.pageSize = pageSize;
  refreshTableData();
};

/**
 * 表格区
 */
const tableData = ref<any[]>([]);
const refreshTableData = () => {
  let params = <any>{
    userId: null,
    pageNum: pageParams.pageNum,
    pageSize: pageParams.pageSize,
  };
  postTaskHistoryListApi(params).then((res) => {
    tableData.value = res.data.list;
    const { pageNum, pageSize, total } = res.data;
    Object.assign(pageParams, { pageNum, pageSize, total });
  });
};
refreshTableData();
const downLoad = (row: any) => {
  getExportTaskResultFileApi({ taskId: row.taskId }).then((res) => {
    // @ts-ignore
    let fileName = res.headers.get("content-disposition").split("filename=")[1];
    downloadByBlob(fileName, res.data);
  });
};
// **工具方法** 通用下载
const downloadByBlob = (filename: string, content: any) => {
  let a = document.createElement("a");
  //解决微软系产品 bom 头引起的中文乱码问题
  // a.href = URL.createObjectURL(new Blob(["\ufeff", content]));
  a.href = URL.createObjectURL(
    new Blob([content], { type: "application/octet-stream;charset=UTF-8" })
    // new Blob([content], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" })
  );
  // a.href = URL.createObjectURL(new Blob(["\ufeff", content], { type: "application/octet-stream;charset=utf-8" }));
  // a.href = window.URL.createObjectURL(new Blob([content], { type: "application/octet-stream;charset=UTF-8" }));
  // a.href = URL.createObjectURL(new Blob([content]));
  a.download = filename;
  a.click();
  a.remove();
  window.URL.revokeObjectURL(a.href);
};
</script>

<style scoped lang="scss"></style>
