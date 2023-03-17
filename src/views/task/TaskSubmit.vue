<template>
  <div>
    <el-upload
      ref="uploadRef"
      class="upload-demo"
      drag
      action="#"
      :limit="1"
      :auto-upload="false"
      v-model:file-list="fileList"
      :on-preview="handlePreview"
      :before-remove="beforeRemove"
      :on-exceed="handleExceed"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <!-- <template #tip>
        <div class="el-upload__tip">上传文件体积不应超过5MB</div>
      </template> -->
    </el-upload>
    <el-row class="input-row">
      <div class="label">app：</div>
      <el-select v-model="appId" style="margin-right: 12px; width: 300px" @click="getAppList" @change="onAppChange">
        <el-option v-for="app in appList" :key="app.id" :value="app.id" :label="`${app.id}-${app.name}`"></el-option>
      </el-select>
      <div class="label">base：</div>
      <el-select v-model="baseId" style="margin-right: 12px; width: 300px" @visible-change="getBaseList" :disabled="appId === ''">
        <el-option v-for="base in baseList" :key="base.id" :value="base.id" :label="`${base.id}-${base.name}`"></el-option>
      </el-select>
    </el-row>
    <el-row class="input-row">
      <div class="label">执行方式：</div>
      <el-radio-group v-model="taskMode">
        <el-radio label="sync">同步执行</el-radio>
        <el-radio label="async">异步执行</el-radio>
      </el-radio-group>
    </el-row>
    <el-button type="primary" @click="submitUpload" size="large">提交</el-button>
  </div>
</template>

<script setup lang="ts">
import { getAppListApi, getBaseListApi } from "@/api/engine/engine";
import { postTaskStartApi } from "@/api/task/task";
import { UploadFilled } from "@element-plus/icons-vue";
import { UploadInstance, UploadProps, UploadUserFile } from "element-plus";
import { ref } from "vue";

const fileList = ref<UploadUserFile[]>([]);
const uploadRef = ref<UploadInstance>();
const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
  console.log("handlePreview", uploadFile);
};
const beforeRemove: UploadProps["beforeRemove"] = (uploadFile) => {
  return ElMessageBox.confirm(`取消上传文件 ${uploadFile.name} 吗?`).then(
    () => true,
    () => false
  );
};
const handleExceed: UploadProps["onExceed"] = () => {
  ElNotification({
    title: "温馨提示",
    message: "最多只能上传一个文件！",
    type: "warning",
  });
};

const appId = ref("");
const appList = ref<any[]>([]);
const getAppList = () => {
  if (!appList.value.length) {
    getAppListApi().then((res) => {
      appList.value = res.data.list;
    });
  }
};
getAppList();
const onAppChange = () => {
  baseId.value = "";
  baseList.value = [];
};
const baseId = ref("");
const baseList = ref<any[]>([]);
const getBaseList = () => {
  getBaseListApi({ appId: appId.value }).then((res) => {
    baseList.value = res.data.list;
  });
};
const taskMode = ref("sync");

const submitUpload = () => {
  // console.log("submitUpload", fileList.value);
  // console.log("submitUpload", uploadRef.value?.fileList);
  let formData = new FormData();
  if (!fileList.value[0]) {
    ElMessage.warning("请选择文件");
    return;
  }
  if (!baseId.value) {
    ElMessage.warning("请选择 app 和 base");
    return;
  }
  formData.append("file", fileList.value[0].raw!);
  formData.append("params", `{"baseId": ${baseId.value},"taskMode":"${taskMode.value}"}`);
  console.log("formData", formData);
  postTaskStartApi(formData).then((res) => {
    if (res.code === 200) ElMessage.success("执行成功，可到任务列表查看");
    fileList.value = [];
    appId.value = "";
    baseId.value = "";
    baseList.value = [];
  });
};
</script>

<style scoped lang="scss">
.input-row {
  align-items: center;
  margin: 12px 0;
  .label {
    margin-right: 8px;
  }
}
</style>
