<template>
  <div class="list">
    <div class="list-btn">
      <el-button>新增</el-button>
      <el-button>导入</el-button>
    </div>
    <!-- 搜索区 -->
    <div class="list-search">
      <el-row>
        <div class="filter-label">名称：</div>
        <el-input v-model="searchForm.name" class="filter-input" clearable style="width: 200px"></el-input>
        <div class="filter-label">场景：</div>
        <el-input v-model="searchForm.scene" class="filter-input" clearable style="width: 200px"></el-input>
        <div class="filter-label">ID：</div>
        <el-input v-model="searchForm.id" class="filter-input" type="number" style="width: 200px"></el-input>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="clear">重置</el-button>
      </el-row>
    </div>
    <div class="list-table">
      <el-table :data="tempTableList" class="table">
        <el-table-column label="ID" prop="id" min-width="120"></el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="场景" prop="scenes"></el-table-column>
        <el-table-column label="配置ID" prop="confId"></el-table-column>
        <el-table-column label="Debug" prop="debug"></el-table-column>
        <el-table-column label="操作" min-width="400">
          <template #default="scope">
            <el-button link type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-button link type="primary" @click="jumpToDetail(scope.row)">查看详情</el-button>
            <el-button link type="primary" @click="backup(scope.row)">备份</el-button>
            <el-button link type="primary" @click="peekBackup(scope.row)">备份历史</el-button>
            <el-button link type="primary" @click="exportJson(scope.row)">导出</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
console.log("route", route.path, route.params);

/**
 * 搜索区
 */
const searchForm = reactive({
  name: "",
  scene: "",
  id: "",
});
const search = () => {
  console.log("search", searchForm);
};
const clear = () => {
  console.log("clear");
};

/**
 * 表格区
 */
const tempTableList = ref([
  {
    id: 100000003660,
    name: "11",
    app: 1,
    scenes: "1",
    status: 1,
    confId: 7170,
    timeType: 1,
    debug: 1,
    priority: 1,
    createAt: "2023-03-11T01:47:23.000+00:00",
    updateAt: "2023-03-11T01:47:23.446+00:00",
  },
  {
    id: 100000003657,
    name: "jjj",
    app: 1,
    scenes: "-",
    status: 1,
    confId: 7164,
    timeType: 1,
    debug: 1,
    priority: 1,
    createAt: "2023-03-10T10:36:45.000+00:00",
    updateAt: "2023-03-10T18:38:30.865+00:00",
  },
  {
    id: 100000003656,
    name: "树形",
    app: 1,
    scenes: "",
    status: 1,
    confId: 7160,
    timeType: 1,
    debug: 1,
    priority: 1,
    createAt: "2023-03-10T10:05:57.000+00:00",
    updateAt: "2023-03-10T10:05:57.564+00:00",
  },
]);
const edit = (row: any) => {
  console.log("edit", row);
};
const jumpToDetail = (row: any) => {
  console.log("jumpToDetail", row);
  router.push(`/config/detail/${row.app}/${row.id}`);
};
const backup = (row: any) => {
  console.log("backup", row);
};
const peekBackup = (row: any) => {
  console.log("peekBackup", row);
};
const exportJson = (row: any) => {
  console.log("exportJson", row);
};
</script>

<style scoped lang="scss"></style>
