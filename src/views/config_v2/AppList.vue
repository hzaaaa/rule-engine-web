<template>
  <div class="app">
    <el-button class="app-btn" @click="openDrawer('新增')">新增</el-button>
    <div class="app-list">
      <div class="app-item" v-for="item in tableData" :key="item.id" @click="jumpToBaseList(item.id)">
        <p class="app-btn">
          <el-button size="small" :icon="Edit" circle @click.stop="openDrawer('编辑', item)" />
          <el-button type="danger" size="small" :icon="Delete" plain circle @click.stop="deleteApp(item.id)" />
        </p>
        <p>{{ item.name }}</p>
        <p>app: {{ item.id }}</p>
        <p>{{ item.info }}</p>
      </div>
    </div>

    <!-- 创建/编辑 app 弹窗 -->
    <el-dialog v-model="dialogFormVisible" :title="dialogProps.title">
      <el-form :model="dialogProps.row">
        <el-form-item label="名称：" :label-width="formLabelWidth">
          <el-input v-model="dialogProps.row.name"></el-input>
        </el-form-item>
        <el-form-item label="描述：" :label-width="formLabelWidth">
          <el-input v-model="dialogProps.row.info"></el-input>
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
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { getAppListApi, postAppAddApi, postAppUpdateApi, postAppDeleteApi } from "@/api/engine/engine_v2";
import { Edit, Delete } from "@element-plus/icons-vue";

const router = useRouter();

/**
 * 操作区
 */
const openDrawer = (title: string, row: any = {}) => {
  Object.assign(dialogProps, {
    title,
    row: { ...row },
    api: title === "新增" ? postAppAddApi : title === "编辑" ? postAppUpdateApi : undefined,
  });
  dialogFormVisible.value = true;
};
const deleteApp = (id: number) => {
  ElMessageBox.confirm(`确认删除 <App ${id}> 吗？`, "", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(async () => {
      await postAppDeleteApi({ id });
      ElMessage.success("删除成功");
      refreshTableData();
    })
    .catch(() => {});
};

/**
 * 表格区
 */
const tableData = ref<any[]>([]);
getAppListApi().then((res) => {
  tableData.value = res.data.list;
});
const jumpToBaseList = (appId: number) => {
  router.push(`/base/list_v2?appId=${appId}`);
};
const refreshTableData = () => {
  getAppListApi().then((res) => {
    tableData.value = res.data.list;
  });
};

/**
 * 创建/编辑 app 弹窗
 */
interface DialogProps {
  title: string;
  row: any;
  api?: (params?: any) => Promise<any>;
}
const dialogFormVisible = ref(false);
const dialogProps = reactive<DialogProps>({
  title: "",
  row: {},
});
// const form = reactive({ name: "", info: "" });
const formLabelWidth = "100px";
const submit = async () => {
  if (!dialogProps.row!.name) {
    ElMessage.warning("请输入名称");
    return;
  }
  const params: any = { name: dialogProps.row.name };
  if (dialogProps.row.id) params.id = dialogProps.row.id;
  if (dialogProps.row.info) params.info = dialogProps.row.info;
  console.log("p", params, dialogProps.api);
  try {
    await dialogProps.api!(params);
    ElMessage.success(`${dialogProps.title}成功`);
    refreshTableData();
    dialogFormVisible.value = false;
  } catch (error) {
    console.error(error);
  }
};
const cancle = () => {
  dialogFormVisible.value = false;
};
</script>

<style scoped lang="scss">
.app {
  &-list {
    display: flex;
    flex-wrap: wrap;
    font-size: 12px;
  }
  &-item {
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    box-sizing: border-box;
    margin: 12px;
    padding: 10px 10px 20px;
    border-radius: 10px;
    width: 200px;
    height: 140px;
    background-color: #f2ffff;
    cursor: pointer;
    text-align: center;
    font-size: 12px;
    color: #333333;
    p {
      margin-bottom: 1em;
    }
    p.app-btn {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 10px;
    }
    &:hover {
      box-shadow: 0 26px 40px -24px rgb(0 36 100 / 50%);
      transform: translateY(-4px);
    }
  }
}
</style>
