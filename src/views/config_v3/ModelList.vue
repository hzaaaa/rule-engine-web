<template>
  <div class="list">
    <div class="list-btn">
      <el-button @click="router.back()">返回</el-button>
      <el-button @click="openEditDialog('add')" type="primary">新增</el-button>
      <!-- <el-button @click="openImportDialog">导入</el-button> -->
    </div>
    <!-- 搜索区 -->
    <div class="list-search">
      <el-row>
        <div class="filter-label">名称：</div>
        <el-input v-model="searchForm.nameLike" class="filter-input" clearable style="width: 200px"></el-input>
        <div class="filter-label">状态：</div>
        <el-select v-model="searchForm.enable" style="width: 200px" placeholder="全部" clearable>
          <el-option :value="true" label="启用" />
          <el-option :value="false" label="禁用" />
        </el-select>
        <el-button type="primary" @click="refreshTableData">查询</el-button>
      </el-row>
    </div>
    <div class="list-table">
      <el-table :data="tableData" class="table">
        <el-table-column label="ID" prop="id" min-width="100"></el-table-column>
        <el-table-column label="名称" prop="name" min-width="200">
          <template #default="scope">
            <el-button link type="primary" @click="jumpToModelInfo(scope.row)">{{ scope.row.name }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description" min-width="200"></el-table-column>
        <el-table-column label="状态" prop="enable" min-width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.enable">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="createAt" min-width="200"></el-table-column>
        <el-table-column label="操作" min-width="200">
          <template #default="scope">
            <el-button link type="primary" @click="openEditDialog('edit', scope.row)">编辑</el-button>
            <el-button link type="danger" @click="deleteBase(scope.row)">删除</el-button>
            <!-- <el-button link type="primary" @click="backup(scope.row)">备份</el-button>
            <el-button link type="primary" @click="peekBackup(scope.row)">备份历史</el-button>
            <el-button link type="primary" @click="exportJson(scope.row)">导出</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页组件 -->
    <el-pagination
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="pageParams.current"
      :page-size="pageParams.size"
      :total="pageParams.total"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>

    <!-- 创建/编辑 base 弹窗 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="dialogType === 'add' ? '新增' : '编辑'"
      @closed="onDialogClosed"
      width="600"
      destroy-on-close
    >
      <el-form :model="form" :rules="rules">
        <el-form-item label="名称：" prop="name" :label-width="formLabelWidth" :required="isCreate">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="描述：" prop="description" :label-width="formLabelWidth">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="enable" :label-width="formLabelWidth" :required="isCreate">
          <el-radio-group v-model="form.enable">
            <el-radio :label="true">启用</el-radio>
            <el-radio :label="false">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancle">取消</el-button>
        <el-button @click="submit" type="primary">确定</el-button>
      </template>
    </el-dialog>

    <!-- 备份 弹窗 -->
    <!-- <el-dialog v-model="pushVisible" title="备份" @closed="onPushDialogClosed" width="600">
      <el-form :model="pushForm">
        <el-form-item label="备注：" :label-width="formLabelWidth">
          <el-input v-model="pushForm.reason" clearable></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="pushVisible = false">取消</el-button>
        <el-button @click="pushConfirm" type="primary">确定</el-button>
      </template>
    </el-dialog> -->

    <!-- 备份历史 弹窗 -->
    <!-- <el-dialog v-model="showHistoryVisible" title="备份历史" @closed="onShowHistoryClosed" width="800">
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
        :current-page="showHistoryPageParams.current"
        :page-size="showHistoryPageParams.size"
        :total="showHistoryPageParams.total"
        :background="true"
        @current-change="handleShowHistoryCurrentChange"
      ></el-pagination>
    </el-dialog> -->

    <!-- 导入 弹窗 -->
    <!-- <el-dialog v-model="importVisible" title="导入" @closed="onImportClosed" width="600">
      <el-form :model="importForm">
        <el-form-item label="配置：" label-width="60px">
          <el-input v-model="importForm.json" type="textarea" :autosize="{ minRows: 5, maxRows: 20 }"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="importVisible = false">取消</el-button>
        <el-button @click="importConfirm" type="primary">确定</el-button>
      </template>
    </el-dialog> -->

    <!-- 导出 弹窗 -->
    <!-- <el-dialog v-model="exportVisible" title="导出" @closed="onExportClosed" width="800">
      <div class="exportData">{{ exportData }}</div>
      <div class="btn-group">
        <el-button @click="onCopy(exportData)">复制配置</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script setup lang="ts">
import { getModelListPageApi, postModelAddApi, postModelUpdateApi, postModelDeleteApi } from "@/api/engine/engine_v3";
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessageBox, FormRules } from "element-plus";
import { useRouteQueryStore } from "@/store/routeQuery";

const router = useRouter();
const routeQueryStore = useRouteQueryStore();
const { appId } = routeQueryStore;

/**
 * 操作区
 */
const openEditDialog = (type: "add" | "edit", row?: any) => {
  dialogFormVisible.value = true;
  dialogType.value = type;
  if (type === "edit") {
    const { id, name, description, enable } = row;
    Object.assign(form, { id, name, description, enable });
  }
};
// const openImportDialog = () => {
//   importVisible.value = true;
// };

/**
 * 搜索区
 */
const searchForm = reactive({
  nameLike: "",
  enable: "",
});

/**
 * 分页组件
 */
const pageParams = reactive({
  current: 1,
  size: 20,
  total: 20,
});
const handleCurrentChange = (current: number) => {
  pageParams.current = current;
  refreshTableData();
};
const handleSizeChange = (size: number) => {
  pageParams.current = 1;
  pageParams.size = size;
  refreshTableData();
};

/**
 * 表格区
 */
const tableData = ref<any[]>([]);
const refreshTableData = () => {
  let params = <any>{
    appId,
    current: pageParams.current,
    size: pageParams.size,
  };
  if (searchForm.nameLike !== "") params.nameLike = searchForm.nameLike;
  if (searchForm.enable !== "") params.enable = searchForm.enable;
  getModelListPageApi(params).then((res) => {
    tableData.value = res.data.records;
    const { current, size, total } = res.data;
    Object.assign(pageParams, { current, size, total });
  });
};
refreshTableData();
const jumpToModelInfo = (row: any) => {
  routeQueryStore.setRouteQueryState("modelId", row.id);
  routeQueryStore.setRouteQueryState("modelName", row.name);
  router.push(`/model/version_v3`);
};
const deleteBase = (row: any) => {
  ElMessageBox.confirm(`确认删除模型 ${row.id} <${row.name}> 吗？`, "", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(async () => {
      await postModelDeleteApi({ id: row.id });
      ElMessage.success("删除成功");
      refreshTableData();
    })
    .catch(() => {});
};
/*
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
    current: showHistoryPageParams.current,
    size: 10,
  }).then((res) => {
    showHistoryTableData.value = res.data.list;
    const { current, total } = res.data;
    Object.assign(showHistoryPageParams, { current, total });
  });
};
const exportJson = (row: any) => {
  getBaseExportApi({ baseId: row.id }).then((res) => {
    exportData.value = res.data.data;
  });
  exportVisible.value = true;
  showHistoryVisible.value = false;
};
*/

/**
 * 创建/编辑 base 弹窗
 */
// 当前是否是'添加'操作; '添加'时名称为必填, 否则名称可选
const isCreate = computed(() => dialogType.value === "add");

// 校验的规则
const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入模型名称" }],
  enable: [{ required: true, message: "请选择模型状态" }],
});

const dialogFormVisible = ref(false);
const dialogType = ref("add");
const formOrigin = { name: "", description: "", enable: true };
const form = reactive({ id: null, name: "", description: "", enable: true });
const formLabelWidth = "100px";
const submit = () => {
  dialogFormVisible.value = false;
  let params = <any>{
    appId,
    enable: form.enable,
  };
  if (form.name) params.name = form.name;
  if (form.description) params.description = form.description;
  if (dialogType.value === "add") {
    postModelAddApi(params).then((res) => {
      if (res.code === 200) {
        ElMessage.success("success");
        refreshTableData();
      }
    });
  } else if (dialogType.value === "edit") {
    params.id = form.id;
    postModelUpdateApi(params).then((res) => {
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
  Object.assign(form, formOrigin);
};

// /**
//  * 备份 弹窗
//  */
// const selectedBase = ref<any>({});
// const pushForm = reactive({ reason: "" });
// const pushVisible = ref(false);
// const pushConfirm = () => {
//   pushVisible.value = false;
//   let params = <any>{
//     baseId: selectedBase.value.baseId,
//   };
//   if (pushForm.reason) params.reason = pushForm.reason;
//   getBaseBackupApi(params).then((res) => {
//     if (res.code === 200) {
//       ElMessage.success("success");
//       refreshTableData();
//     }
//   });
// };
// const onPushDialogClosed = () => {
//   Object.assign(pushForm, { reason: "" });
//   selectedBase.value = {};
// };

// /**
//  * 备份历史 弹窗
//  */
// const showHistoryVisible = ref(false);
// const showHistoryTableData = ref<any[]>([]);
// const onShowHistoryClosed = () => {
//   showHistoryTableData.value = [];
// };
// /* 备份历史弹窗表格 分页组件 */
// const showHistoryPageParams = reactive({
//   current: 1,
//   size: 10,
//   total: 10,
// });
// const handleShowHistoryCurrentChange = (current: number) => {
//   showHistoryPageParams.current = current;
//   getBaseBackupHistoryApi({
//     appId,
//     baseId: selectedBase.value.baseId,
//     current: showHistoryPageParams.current,
//     size: 10,
//   }).then((res) => {
//     showHistoryTableData.value = res.data.list;
//     const { current, total } = res.data;
//     Object.assign(showHistoryPageParams, { current, total });
//   });
// };
// // 弹窗内部回滚
// const rollbackBackup = (row: any) => {
//   console.log("rollbackBackup", row);
//   ElMessageBox.confirm(`确认将 <${selectedBase.value.name}> 回滚到 [${row.id}] 版本吗？`, "", {
//     confirmButtonText: "确定",
//     cancelButtonText: "取消",
//   })
//     .then(async () => {
//       await getBaseRollbackApi({
//         pushId: row.id,
//       });
//       ElMessage.success("success");
//       refreshTableData();
//       showHistoryVisible.value = false;
//     })
//     .catch(() => {});
// };
// // 弹窗内部导出
// const exportBackup = (row: any) => {
//   getBaseExportApi({ baseId: selectedBase.value.baseId, pushId: row.id }).then((res) => {
//     exportData.value = res.data.data;
//   });
//   showHistoryVisible.value = false;
//   exportVisible.value = true;
// };
// // 弹窗内部删除
// const deleteBackup = (row: any) => {
//   ElMessageBox.confirm(`确认物理删除ID为<${row.id}> 的备份吗？`, "", {
//     confirmButtonText: "确定",
//     cancelButtonText: "取消",
//   })
//     .then(async () => {
//       await getBaseBackupDeleteApi({
//         pushId: row.id,
//       });
//       ElMessage.success("success");
//       showHistoryVisible.value = false;
//     })
//     .catch(() => {});
// };
// /**
//  * 导入 弹窗
//  */
// const importVisible = ref(false);
// const importForm = reactive({ json: "" });
// const importConfirm = () => {
//   console.log("importConfirm");
//   postBaseImportApi({ json: importForm.json }).then(() => {
//     importVisible.value = false;
//     refreshTableData();
//   });
// };
// const onImportClosed = () => {
//   importForm.json = "";
// };

// /**
//  * 导出 弹窗
//  */
// const exportVisible = ref(false);
// const exportData = ref("");
// const onCopy = (text: string) => {
//   copyTextToClipboard(text);
//   ElMessage.success("复制成功");
//   exportVisible.value = false;
// };
// const onExportClosed = () => {
//   exportData.value = "";
// };
</script>

<style scoped lang="scss">
.list {
  display: flex;
  overflow: hidden;
  flex-direction: column;
  height: 100%;
  .list-table {
    overflow: hidden;
    flex-shrink: 1;
    .el-table {
      height: 100%;
    }
  }
}
.list-search {
  margin: 16px 0;
  height: 32px;
  font-size: 14px;
  .el-input {
    margin-right: 16px;
  }
  .el-select {
    margin-right: 16px;
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
  width: 90%;
}
.el-textarea {
  width: 90%;
}
</style>
