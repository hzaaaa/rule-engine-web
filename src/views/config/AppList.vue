<template>
  <div class="app">
    <el-button class="app-btn" @click="add">新增</el-button>
    <div class="app-list">
      <div class="app-item" v-for="item in tableData" :key="item.id" @click="jumpToBaseList(item.id)">
        <p>{{ item.name }}</p>
        <p>app: {{ item.id }}</p>
        <p>{{ item.info }}</p>
      </div>
    </div>

    <!-- 创建/编辑 app 弹窗 -->
    <el-dialog v-model="dialogFormVisible" title="新增" @closed="onDialogClosed">
      <el-form :model="form">
        <el-form-item label="名称：" :label-width="formLabelWidth">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="描述：" :label-width="formLabelWidth">
          <el-input v-model="form.info"></el-input>
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
import { getAppListApi, postAppAddApi } from "@/api/engine/engine";

const router = useRouter();

/**
 * 操作区
 */
const add = () => {
  dialogFormVisible.value = true;
};

/**
 * 表格区
 */
const tableData = ref<any[]>([]);
getAppListApi().then((res) => {
  tableData.value = res.data.list;
});
const jumpToBaseList = (appId: number) => {
  router.push(`/base/list?appId=${appId}`);
};

/**
 * 创建/编辑 app 弹窗
 */
const dialogFormVisible = ref(false);
const form = reactive({ name: "", info: "" });
const formLabelWidth = "100px";
const submit = () => {
  if (!form.name) {
    ElMessage.warning("请输入名称");
    return;
  }
  dialogFormVisible.value = false;
  let params = <any>{
    name: form.name,
  };
  if (form.info) params.info = form.info;
  postAppAddApi(params).then((res) => {
    if (res.code === 200) {
      ElMessage.success("success");
      getAppListApi().then((res) => {
        tableData.value = res.data.list;
      });
    }
  });
};
const cancle = () => {
  dialogFormVisible.value = false;
};
const onDialogClosed = () => {
  form.name = "";
  form.info = "";
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
    box-sizing: border-box;
    margin: 12px;
    padding: 20px 10px;
    border-radius: 10px;
    width: 200px;
    height: 120px;
    background-color: #f2ffff;
    cursor: pointer;
    text-align: center;
    font-size: 12px;
    color: #333333;
    p {
      margin-bottom: 1em;
    }
    &:hover {
      box-shadow: 0 26px 40px -24px rgb(0 36 100 / 50%);
      transform: translateY(-4px);
    }
  }
}
</style>
