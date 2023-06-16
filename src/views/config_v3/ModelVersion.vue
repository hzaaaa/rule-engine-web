<template>
  <div class="list">
    <div class="list-btn">
      <el-button @click="router.back()">返回</el-button>
      <el-button @click="openEditDialog('add')" type="primary">新增</el-button>
    </div>
    <!-- 搜索区 -->
    <div class="list-search">
      <el-row>
        <div>发布状态：</div>
        <el-select v-model="searchForm.publish" style="width: 200px" placeholder="全部" clearable>
          <el-option :value="true" label="启用" />
          <el-option :value="false" label="禁用" />
        </el-select>
        <div>启用状态：</div>
        <el-select v-model="searchForm.enable" style="width: 200px" placeholder="全部" clearable>
          <el-option :value="true" label="启用" />
          <el-option :value="false" label="禁用" />
        </el-select>
        <div>版本名称：</div>
        <el-input v-model="searchForm.versionLike" class="filter-input" clearable style="width: 200px"></el-input>
        <el-button type="primary" @click="refreshTableData" style="margin-left: 20px">查询</el-button>
        <el-button @click="reset" style="margin-left: 20px">重置</el-button>
      </el-row>
    </div>
    <div class="list-table">
      <el-table :data="tableData">
        <el-table-column label="ID" prop="id" min-width="100"></el-table-column>
        <el-table-column label="版本" prop="version" min-width="200">
          <template #default="scope">
            <el-button link type="primary" @click="jumpToModelInfo(scope.row)">{{ scope.row.version }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="版本描述" prop="versionDescription" min-width="200"></el-table-column>
        <el-table-column label="发布状态" prop="publish" min-width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.publish"
              :active-value="true"
              :inactive-value="false"
              @change="changePublish(scope.row)"
              inline-prompt
              active-text="已发布"
              inactive-text="未发布"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="启用状态" prop="enable" min-width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.enable"
              :active-value="true"
              :inactive-value="false"
              @change="changeEnable(scope.row)"
              inline-prompt
              active-text="启用"
              inactive-text="禁用"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="createAt" min-width="200"></el-table-column>
        <el-table-column label="操作" min-width="200">
          <template #default="scope">
            <el-button link type="primary" @click="openEditDialog('edit', scope.row)">编辑</el-button>
            <el-button link type="danger" @click="deleteBase(scope.row)">删除</el-button>
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

    <!-- 创建/编辑版本 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="dialogType === 'add' ? '新增' : '编辑'"
      @closed="onDialogClosed"
      width="600"
      destroy-on-close
      @keyup.enter="submit"
    >
      <el-form :model="form" @submit.prevent>
        <el-form-item label="版本描述：" prop="versionDescription" :label-width="formLabelWidth">
          <el-input v-model="form.versionDescription" @keyup.enter="submit"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancle">取消</el-button>
        <el-button @click="submit" type="primary">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  getModelInfoEnableApi,
  getModelInfoListPageApi,
  getModelInfoPublishApi,
  postModelInfoAddApi,
  postModelInfoDeleteApi,
  postModelInfoUpdateApi,
} from "@/api/engine/engine_v3";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useDebounceFn } from "@/hooks/useDebounceFn";
import { useRouteQueryStore } from "@/store/routeQuery";
import { ElMessageBox } from "element-plus";

const router = useRouter();
const routeQueryStore = useRouteQueryStore();
const { modelId } = routeQueryStore;

/**
 * 操作区
 */
const openEditDialog = (type: "add" | "edit", row?: any) => {
  dialogFormVisible.value = true;
  dialogType.value = type;
  if (type === "edit") {
    const { id, versionDescription } = row;
    Object.assign(form, { id, versionDescription });
  }
};

/**
 * 搜索区
 */
const searchForm = ref({
  publish: "", // 发布状态
  enable: "", // 启用状态
  versionLike: "", // 版本模糊搜索
});
const searchFormOrigin = {
  publish: "", // 发布状态
  enable: "", // 启用状态
  versionLike: "", // 版本模糊搜索
};
const reset = () => {
  pageParams.current = 1;
  searchForm.value = Object.assign({}, searchFormOrigin);
};

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
  let params: any = {
    modelId,
    current: pageParams.current,
    size: pageParams.size,
  };
  if (searchForm.value.publish !== "") params.publish = searchForm.value.publish;
  if (searchForm.value.enable !== "") params.enable = searchForm.value.enable;
  if (searchForm.value.versionLike !== "") params.versionLike = searchForm.value.versionLike;
  getModelInfoListPageApi(params).then((res) => {
    tableData.value = res.data.records;
    const { current, size, total } = res.data;
    Object.assign(pageParams, { current, size, total });
  });
};
refreshTableData();
const jumpToModelInfo = (row: any) => {
  routeQueryStore.setRouteQueryState("modelInfoId", row.id);
  routeQueryStore.setRouteQueryState("modelVersion", row.version);
  router.push(`/model/info_v3`);
};
const deleteBase = (row: any) => {
  ElMessageBox.confirm(`确认删除模型版本 ${row.id} <${row.version}> 吗？`, "", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(async () => {
      await postModelInfoDeleteApi({ id: row.id });
      ElMessage.success("删除成功");
      refreshTableData();
    })
    .catch(() => {});
};
const changePublish = (row: any) => {
  ElMessageBox.confirm(`是否确认${row.publish === true ? "发布" : "取消发布"} ${row.version}`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let params = {
        modelInfoId: row.id,
        publish: row.publish,
      };
      await getModelInfoPublishApi(params);
      ElMessage.success(`${row.publish ? "已发布" : "已取消发布"}`);
    })
    .catch(() => {
      if (row.publish === true) {
        row.publish = false;
      } else {
        row.publish = true;
      }
    });
};
const changeEnable = (row: any) => {
  ElMessageBox.confirm(`是否确认${row.enable === true ? "启用" : "禁用"} ${row.version}`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let params = {
        modelInfoId: row.id,
        enable: row.enable,
      };
      await getModelInfoEnableApi(params);
      ElMessage.success(`${row.enable ? "已启用" : "已禁用"}`);
    })
    .catch(() => {
      if (row.enable === true) {
        row.enable = false;
      } else {
        row.enable = true;
      }
    });
};

/**
 * 创建/编辑 base 弹窗
 */
const dialogFormVisible = ref(false);
const dialogType = ref("add");
const formOrigin = { versionDescription: "" };
const form = reactive({ id: null, versionDescription: "" });
const formLabelWidth = "100px";
const submit = useDebounceFn(() => {
  dialogFormVisible.value = false;
  let params: any = { modelId };
  if (form.versionDescription) params.versionDescription = form.versionDescription;
  if (dialogType.value === "add") {
    postModelInfoAddApi(params).then((res) => {
      if (res.code === 200) {
        ElMessage.success("success");
        refreshTableData();
      }
    });
  } else if (dialogType.value === "edit") {
    params.id = form.id;
    postModelInfoUpdateApi(params).then((res) => {
      if (res.code === 200) {
        ElMessage.success("success");
        refreshTableData();
      }
    });
  }
});
const cancle = () => {
  dialogFormVisible.value = false;
};
const onDialogClosed = () => {
  Object.assign(form, formOrigin);
};
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
