<template>
  <div class="list">
    <div class="list-btn">
      <el-button @click="openEditDialog('add')">新增</el-button>
      <el-button @click="openImportDialog">导入</el-button>
    </div>
    <!-- 搜索区 -->
    <div class="list-search">
      <el-row>
        <div class="filter-label">名称：</div>
        <el-input v-model="searchForm.name" class="filter-input" clearable></el-input>
        <div class="filter-label">场景：</div>
        <el-input v-model="searchForm.scene" class="filter-input" clearable></el-input>
        <div class="filter-label">ID：</div>
        <el-input v-model="searchForm.id" class="filter-input" type="number"></el-input>
        <el-button type="primary" @click="refreshTableData">查询</el-button>
        <el-button @click="clear">重置</el-button>
      </el-row>
    </div>
    <div class="list-table">
      <el-table :data="tableData" class="table">
        <el-table-column label="ID" prop="id" min-width="100"></el-table-column>
        <el-table-column label="名称" prop="name" min-width="100"></el-table-column>
        <el-table-column label="场景" prop="scenes"></el-table-column>
        <el-table-column label="配置ID" prop="confId"></el-table-column>
        <el-table-column label="Debug" prop="debug"></el-table-column>
        <el-table-column label="操作" min-width="400">
          <template #default="scope">
            <el-button link type="primary" @click="openEditDialog('edit', scope.row)">编辑</el-button>
            <el-button link type="primary" @click="jumpToConfDetail(scope.row)">查看详情</el-button>
            <el-button link type="primary" @click="backup(scope.row)">备份</el-button>
            <el-button link type="primary" @click="peekBackup(scope.row)">备份历史</el-button>
            <el-button link type="primary" @click="exportJson(scope.row)">导出</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

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

    <!-- 创建/编辑 base 弹窗 -->
    <el-dialog v-model="dialogFormVisible" :title="dialogType === 'add' ? '新增' : '编辑'" @closed="onDialogClosed" width="600">
      <el-form :model="form">
        <el-form-item label="名称：" :label-width="formLabelWidth">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="场景(逗号分隔)：" :label-width="formLabelWidth">
          <el-input v-model="form.scenes"></el-input>
        </el-form-item>
        <el-form-item label="debug：" :label-width="formLabelWidth">
          <el-input v-model="form.debug" type="number"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancle">取消</el-button>
        <el-button @click="submit" type="primary">确定</el-button>
      </template>
    </el-dialog>

    <!-- 备份 弹窗 -->
    <el-dialog v-model="pushVisible" title="备份" @closed="onPushDialogClosed" width="600">
      <el-form :model="pushForm">
        <el-form-item label="备注：" :label-width="formLabelWidth">
          <el-input v-model="pushForm.reason" clearable></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="pushVisible = false">取消</el-button>
        <el-button @click="pushConfirm" type="primary">确定</el-button>
      </template>
    </el-dialog>

    <!-- 备份历史 弹窗 -->
    <el-dialog v-model="showHistoryVisible" title="备份历史" @closed="onShowHistoryClosed" width="800">
      <el-table :data="showHistoryTableData" class="table">
        <el-table-column label="ID" prop="id" min-width="100"></el-table-column>
        <el-table-column label="操作人" prop="operator" min-width="100"></el-table-column>
        <el-table-column label="时间" prop="createAt" min-width="200"></el-table-column>
        <el-table-column label="备注" prop="reason" min-width="100"></el-table-column>
        <el-table-column label="操作" min-width="200">
          <template #default="scope">
            <el-button link type="primary" @click="rollbackBackup(scope.row)">回滚</el-button>
            <el-button link type="primary" @click="exportBackup(scope.row)">导出</el-button>
            <el-button link type="primary" @click="deleteBackup(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :current-page="showHistoryPageParams.pageNum"
        :page-size="showHistoryPageParams.pageSize"
        :total="showHistoryPageParams.total"
        :background="true"
        @current-change="handleShowHistoryCurrentChange"
      ></el-pagination>
    </el-dialog>

    <!-- 导入 弹窗 -->
    <el-dialog v-model="importVisible" title="导入" @closed="onImportClosed" width="600">
      <el-form :model="importForm">
        <el-form-item label="配置：" label-width="60px">
          <el-input v-model="importForm.json" type="textarea" :autosize="{ minRows: 5, maxRows: 20 }"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="importVisible = false">取消</el-button>
        <el-button @click="importConfirm" type="primary">确定</el-button>
      </template>
    </el-dialog>

    <!-- 导出 弹窗 -->
    <el-dialog v-model="exportVisible" title="导出" @closed="onExportClosed" width="800">
      <div class="exportData">{{ exportData }}</div>
      <div class="btn-group">
        <el-button @click="onCopy(exportData)">复制配置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  getBaseBackupApi,
  getBaseBackupHistoryApi,
  getBaseListApi,
  postBaseAddApi,
  postBaseUpdateApi,
  getBaseBackupDeleteApi,
  getBaseRollbackApi,
  getBaseExportApi,
  postBaseImportApi,
} from "@/api/engine/engine";
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { copyTextToClipboard } from "@/utils/util";

const route = useRoute();
const router = useRouter();
const { appId } = route.query;
console.log("route", route.params, route.query);

/**
 * 操作区
 */
const openEditDialog = (type: "add" | "edit", row?: any) => {
  dialogFormVisible.value = true;
  dialogType.value = type;
  if (type === "edit") {
    const { name, scenes, debug, id } = row;
    Object.assign(form, { name, scenes, debug });
    Object.assign(selectedBase.value, { baseId: id });
  }
};
const openImportDialog = () => {
  importVisible.value = true;
};

/**
 * 搜索区
 */
const searchForm = reactive({
  name: "",
  scene: "",
  id: "",
});
const clear = () => {
  Object.assign(searchForm, { name: "", scene: "", id: "" });
};

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
    appId,
    pageId: pageParams.pageNum,
    pageSize: pageParams.pageSize,
  };
  if (searchForm.name !== "") params.name = searchForm.name;
  if (searchForm.scene !== "") params.scene = searchForm.scene;
  if (searchForm.id !== "") params.id = searchForm.id;
  getBaseListApi(params).then((res) => {
    tableData.value = res.data.list;
    const { pageNum, pageSize, total } = res.data;
    Object.assign(pageParams, { pageNum, pageSize, total });
  });
};
refreshTableData();
const jumpToConfDetail = (row: any) => {
  router.push(`/conf/detail?appId=${appId}&baseId=${row.id}&address=server`);
};
const backup = (row: any) => {
  const { id } = row;
  Object.assign(selectedBase.value, { baseId: id });
  pushVisible.value = true;
};
const peekBackup = (row: any) => {
  console.log("peekBackup", row);
  Object.assign(selectedBase.value, { baseId: row.id, name: row.name });
  showHistoryVisible.value = true;
  getBaseBackupHistoryApi({
    appId,
    baseId: selectedBase.value.baseId,
    pageNum: showHistoryPageParams.pageNum,
    pageSize: 10,
  }).then((res) => {
    showHistoryTableData.value = res.data.list;
    const { pageNum, total } = res.data;
    Object.assign(showHistoryPageParams, { pageNum, total });
  });
};
const exportJson = (row: any) => {
  getBaseExportApi({ baseId: row.id }).then((res) => {
    exportData.value = res.data.data;
  });
  exportVisible.value = true;
  showHistoryVisible.value = false;
};

/**
 * 创建/编辑 base 弹窗
 */
const dialogFormVisible = ref(false);
const dialogType = ref("add");
const form = reactive({ name: "", scenes: "", debug: "" });
const formLabelWidth = "140px";
const submit = () => {
  dialogFormVisible.value = false;
  let params = <any>{
    appId,
  };
  if (form.name) params.name = form.name;
  if (form.scenes) params.scenes = form.scenes;
  if (form.debug) params.debug = form.debug;
  if (dialogType.value === "add") {
    postBaseAddApi(params).then((res) => {
      if (res.code === 200) {
        ElMessage.success("success");
        refreshTableData();
      }
    });
  } else if (dialogType.value === "edit") {
    params.id = selectedBase.value.baseId;
    postBaseUpdateApi(params).then((res) => {
      if (res.code === 200) {
        ElMessage.success("success");
        refreshTableData();
      }
    });
  }
};
const cancle = () => {
  dialogFormVisible.value = false;
};
const onDialogClosed = () => {
  Object.assign(form, { name: "", scenes: "", debug: "" });
  selectedBase.value = {};
};

/**
 * 备份 弹窗
 */
const selectedBase = ref<any>({});
const pushForm = reactive({ reason: "" });
const pushVisible = ref(false);
const pushConfirm = () => {
  pushVisible.value = false;
  let params = <any>{
    baseId: selectedBase.value.baseId,
  };
  if (pushForm.reason) params.reason = pushForm.reason;
  getBaseBackupApi(params).then((res) => {
    if (res.code === 200) {
      ElMessage.success("success");
      refreshTableData();
    }
  });
};
const onPushDialogClosed = () => {
  Object.assign(pushForm, { reason: "" });
  selectedBase.value = {};
};

/**
 * 备份历史 弹窗
 */
const showHistoryVisible = ref(false);
const showHistoryTableData = ref<any[]>([]);
const onShowHistoryClosed = () => {
  showHistoryTableData.value = [];
};
/* 备份历史弹窗表格 分页组件 */
const showHistoryPageParams = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 10,
});
const handleShowHistoryCurrentChange = (pageNum: number) => {
  showHistoryPageParams.pageNum = pageNum;
  getBaseBackupHistoryApi({
    appId,
    baseId: selectedBase.value.baseId,
    pageNum: showHistoryPageParams.pageNum,
    pageSize: 10,
  }).then((res) => {
    showHistoryTableData.value = res.data.list;
    const { pageNum, total } = res.data;
    Object.assign(showHistoryPageParams, { pageNum, total });
  });
};
// 弹窗内部回滚
const rollbackBackup = (row: any) => {
  console.log("rollbackBackup", row);
  ElMessageBox.confirm(`确认将 <${selectedBase.value.name}> 回滚到 [${row.id}] 版本吗？`, "", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(async () => {
      await getBaseRollbackApi({
        pushId: row.id,
      });
      ElMessage.success("success");
      refreshTableData();
      showHistoryVisible.value = false;
    })
    .catch(() => {});
};
// 弹窗内部导出
const exportBackup = (row: any) => {
  getBaseExportApi({ baseId: selectedBase.value.baseId, pushId: row.id }).then((res) => {
    exportData.value = res.data.data;
  });
  showHistoryVisible.value = false;
  exportVisible.value = true;
};
// 弹窗内部删除
const deleteBackup = (row: any) => {
  ElMessageBox.confirm(`确认物理删除ID为<${row.id}> 的备份吗？`, "", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(async () => {
      await getBaseBackupDeleteApi({
        pushId: row.id,
      });
      ElMessage.success("success");
      showHistoryVisible.value = false;
    })
    .catch(() => {});
};
/**
 * 导入 弹窗
 */
const importVisible = ref(false);
const importForm = reactive({ json: "" });
const importConfirm = () => {
  console.log("importConfirm");
  postBaseImportApi({ json: importForm.json }).then(() => {
    importVisible.value = false;
    refreshTableData();
  });
};
const onImportClosed = () => {
  importForm.json = "";
};

/**
 * 导出 弹窗
 */
const exportVisible = ref(false);
const exportData = ref("");
const onCopy = (text: string) => {
  copyTextToClipboard(text);
  ElMessage.success("复制成功");
  exportVisible.value = false;
};
const onExportClosed = () => {
  exportData.value = "";
};
</script>

<style scoped lang="scss">
.list-search {
  margin: 16px 0;
  height: 32px;
  font-size: 14px;
  .el-input {
    margin-right: 16px;
    width: 180px;
  }
}
.exportData {
  word-wrap: break-word;
}
.exportData + .btn-group {
  margin-top: 16px;
  text-align: center;
}
.el-row {
  align-items: center;
}
.el-input {
  width: 80%;
}
.el-textarea {
  width: 90%;
}
</style>
