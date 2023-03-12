<template>
  <div class="dept">
    <el-button @click="add" type="primary">新增</el-button>
    <!--表格渲染-->
    <el-table :data="tableData" row-key="id" :tree-props="{ children: 'childrenList' }" style="font-size: 12px">
      <el-table-column prop="title" label="菜单标题"></el-table-column>
      <el-table-column prop="icon" label="图标" width="100px"></el-table-column>
      <el-table-column prop="sort" label="排序" width="60px"></el-table-column>
      <el-table-column prop="permission" label="权限标识"></el-table-column>
      <el-table-column prop="component" label="组件路径"></el-table-column>
      <el-table-column prop="hidden" label="可见" width="60px"></el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="150px"></el-table-column>
      <el-table-column label="操作" width="120px">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">
            <el-icon><EditPen /></el-icon>
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 表单组件 -->
    <el-dialog title="新增菜单" v-model="dialogVisible">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="菜单标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择菜单类型">
            <el-option label="一级菜单" :value="1"></el-option>
            <el-option label="二级菜单" :value="2"></el-option>
            <el-option label="三级菜单" :value="3"></el-option>
            <el-option label="四级菜单" :value="4"></el-option>
            <el-option label="五级菜单" :value="5"></el-option>
            <el-option label="按钮权限" :value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父菜单id" prop="pid">
          <el-input-number v-model.number="form.pid" :min="0" :max="999"></el-input-number>
        </el-form-item>
        <el-form-item label="同级排序" prop="sort">
          <el-input-number v-model.number="form.sort" :min="0" :max="999"></el-input-number>
        </el-form-item>
        <el-form-item label="路由组件" prop="component">
          <el-input v-model="form.component"></el-input>
        </el-form-item>
        <el-form-item label="接口权限" prop="permission">
          <el-input v-model="form.permission"></el-input>
        </el-form-item>
        <el-form-item label="icon图标" prop="icon">
          <el-input v-model="form2.icon"></el-input>
        </el-form-item>
        <el-form-item label="是否隐藏" prop="hidden">
          <el-radio-group v-model="form.hidden">
            <el-radio-button :label="0">否</el-radio-button>
            <el-radio-button :label="1">是</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否固定" prop="affix">
          <el-radio-group v-model="form.affix">
            <el-radio-button :label="0">否</el-radio-button>
            <el-radio-button :label="1">是</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否缓存" prop="keepAlive">
          <el-radio-group v-model="form.keepAlive">
            <el-radio-button :label="0">否</el-radio-button>
            <el-radio-button :label="1">是</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm(formRef)">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑部门 -->
    <el-dialog title="编辑菜单" v-model="dialogVisible2">
      <el-form ref="formRef2" :model="form2" :rules="rules" label-width="80px">
        <el-form-item label="菜单标题" prop="title">
          <el-input v-model="form2.title"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-select v-model="form2.type" placeholder="请选择菜单类型">
            <el-option label="一级菜单" :value="1"></el-option>
            <el-option label="二级菜单" :value="2"></el-option>
            <el-option label="三级菜单" :value="3"></el-option>
            <el-option label="四级菜单" :value="4"></el-option>
            <el-option label="五级菜单" :value="5"></el-option>
            <el-option label="按钮权限" :value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父菜单id" prop="pid">
          <el-input-number v-model.number="form2.pid" :min="0" :max="999"></el-input-number>
        </el-form-item>
        <el-form-item label="同级排序" prop="sort">
          <el-input-number v-model.number="form2.sort" :min="0" :max="999"></el-input-number>
        </el-form-item>
        <el-form-item label="路由组件" prop="component">
          <el-input v-model="form2.component"></el-input>
        </el-form-item>
        <el-form-item label="接口权限" prop="permission">
          <el-input v-model="form2.permission"></el-input>
        </el-form-item>
        <el-form-item label="icon图标" prop="icon">
          <el-input v-model="form2.icon"></el-input>
        </el-form-item>
        <el-form-item label="是否隐藏" prop="hidden">
          <el-radio-group v-model="form2.hidden">
            <el-radio-button :label="0">否</el-radio-button>
            <el-radio-button :label="1">是</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否固定" prop="affix">
          <el-radio-group v-model="form2.affix">
            <el-radio-button :label="0">否</el-radio-button>
            <el-radio-button :label="1">是</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否缓存" prop="keepAlive">
          <el-radio-group v-model="form2.keepAlive">
            <el-radio-button :label="0">否</el-radio-button>
            <el-radio-button :label="1">是</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取消</el-button>
          <el-button type="primary" @click="submitForm2(formRef2)">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { getMenuUserTreeApi, postMenuAddApi, postMenuDeleteApi, postMenuUpdateApi } from "@/api/system/menu";
import { Delete, EditPen } from "@element-plus/icons-vue";
import { FormInstance, FormRules } from "element-plus";
import { onMounted, reactive, ref } from "vue";

const add = () => {
  console.log("add");
  dialogVisible.value = true;
};

const tableData = ref<any>([]);
onMounted(() => {
  getMenuUserTreeApi().then((res) => {
    // console.log("getDeptInfoApi 无参数", res.data);
    tableData.value = res.data;
  }); // 通过，tree 比 info 多包一层数组
});

const handleEdit = (row: any) => {
  console.log("edit", row);
  form2.id = row.id;
  form2.title = row.title;
  form2.type = row.type;
  form2.pid = row.pid;
  if (row.sort) form2.sort = row.sort;
  if (row.component) form2.component = row.component;
  if (row.permission) form2.permission = row.permission;
  if (row.icon) form2.icon = row.icon;
  if (row.hidden) form2.hidden = row.hidden;
  if (row.affix) form2.affix = row.affix;
  if (row.keepAlive) form2.keepAlive = row.keepAlive;
  dialogVisible2.value = true;
};
const handleDelete = (row: any) => {
  console.log("delete", row);
  postMenuDeleteApi({ id: row.id }).then((res) => {
    console.log("postDeptDeleteApi 带参数", res.data);
    getMenuUserTreeApi().then((res) => {
      // console.log("getDeptInfoApi 无参数", res.data);
      tableData.value = res.data;
    }); // 通过，tree 比 info 多包一层数组
  }); // **未通过，insufficient permissions
};

const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const form = reactive({
  title: "",
  type: 1,
  pid: 0,
  sort: null,
  component: "",
  permission: "",
  icon: "",
  hidden: 0,
  affix: null,
  keepAlive: null,
});
const rules = reactive<FormRules>({
  title: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  type: [{ required: true, message: "请选择菜单类型", trigger: "blur" }],
  pid: [{ required: true, message: "请输入父菜单id", trigger: "blur" }],
});
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      dialogVisible.value = false;
      let params = <any>{
        title: form.title,
        type: form.type,
        pid: form.pid,
      };
      if (form.sort) params.sort = form.sort;
      if (form.component) params.component = form.component;
      if (form.permission) params.permission = form.permission;
      if (form.icon) params.icon = form.icon;
      if (form.hidden) params.hidden = form.hidden;
      if (form.affix) params.affix = form.affix;
      if (form.keepAlive) params.keepAlive = form.keepAlive;
      postMenuAddApi({ ...params }).then((res) => {
        console.log("postMenuAddApi 带参数", res.data);
        getMenuUserTreeApi().then((res) => {
          // console.log("getDeptInfoApi 无参数", res.data);
          tableData.value = res.data;
        }); // 通过，tree 比 info 多包一层数组
      });
    } else {
      console.log("error submit");
      return false;
    }
  });
};

const dialogVisible2 = ref(false);
const formRef2 = ref<FormInstance>();
const form2 = reactive({
  id: null,
  title: "",
  type: 1,
  pid: 0,
  sort: null,
  component: "",
  permission: "",
  icon: "",
  hidden: 0,
  affix: null,
  keepAlive: null,
});
const submitForm2 = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      dialogVisible2.value = false;
      let params = <any>{
        id: form2.id,
      };
      if (form2.title) params.title = form2.title;
      if (form2.type) params.type = form2.type;
      if (form2.pid) params.pid = form2.pid;
      if (form2.sort) params.sort = form2.sort;
      if (form2.component) params.component = form2.component;
      if (form2.permission) params.permission = form2.permission;
      if (form2.icon) params.icon = form2.icon;
      if (form2.hidden) params.hidden = form2.hidden;
      if (form2.affix) params.affix = form2.affix;
      if (form2.keepAlive) params.keepAlive = form2.keepAlive;
      postMenuUpdateApi({ ...params }).then((res) => {
        console.log("postDeptAddApi 带参数", res.data);
        getMenuUserTreeApi().then((res) => {
          // console.log("getDeptInfoApi 无参数", res.data);
          tableData.value = res.data;
        }); // 通过，tree 比 info 多包一层数组
      });
    } else {
      console.log("error submit");
      return false;
    }
  });
};
</script>

<style scoped lang="scss"></style>
