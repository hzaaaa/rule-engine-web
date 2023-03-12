<template>
  <div class="dept">
    <el-button @click="add" type="primary">新增</el-button>
    <!--表格渲染-->
    <el-table :data="tableData" row-key="id" :tree-props="{ children: 'childrenList' }" style="font-size: 12px">
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column label="操作范围">
        <template #default="scope">
          {{ scope.row.dataScope === 1 ? "本级及下级" : "当前" }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期"></el-table-column>
      <el-table-column label="操作">
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
    <el-dialog title="新增角色" v-model="dialogVisible" @closed="resetForm">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="操作范围" prop="dataScope">
          <el-select v-model="form.dataScope" placeholder="请选择操作范围">
            <el-option label="本级及下级" :value="1"></el-option>
            <el-option label="当前" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="角色菜单" prop="menuIdList" @click="test">
          <el-tree
            ref="treeRef"
            :data="menus"
            :props="defaultProps"
            :default-checked-keys="form.menuIdList"
            node-key="id"
            show-checkbox
          ></el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm(formRef)">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑角色 -->
    <el-dialog title="编辑角色" v-model="dialogVisible2" @opened="setCheckedTree">
      <el-form ref="formRef2" :model="form2" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form2.name"></el-input>
        </el-form-item>
        <el-form-item label="操作范围" prop="dataScope">
          <el-select v-model="form2.dataScope" placeholder="请选择操作范围">
            <el-option label="本级及下级" :value="1"></el-option>
            <el-option label="当前" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form2.description"></el-input>
        </el-form-item>
        <el-form-item label="角色菜单" prop="menuIdList">
          <el-tree ref="treeRef2" :data="menus" :props="defaultProps" node-key="id" show-checkbox></el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="test3">测试</el-button>
          <el-button @click="dialogVisible2 = false">取消</el-button>
          <el-button type="primary" @click="submitForm2(formRef2)">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { getMenuTreeApi } from "@/api/system/menu";
import { getRoleInfoApi, getRoleListApi, postRoleAddApi, postRoleUpdateApi, postRoleDeleteApi } from "@/api/system/role";
import { Delete, EditPen } from "@element-plus/icons-vue";
import { ElTree, FormInstance, FormRules } from "element-plus";
import { onMounted, reactive, ref } from "vue";

const tableData = ref<any>([]);
onMounted(() => {
  getRoleListApi().then((res) => {
    // console.log("getDeptInfoApi 无参数", res.data);
    if (res.data.list) tableData.value = res.data.list;
  }); // 通过，tree 比 info 多包一层数组
});

const getIds = (targetArray: any, idList: any) => {
  targetArray.forEach((menu: any) => {
    if (menu.id) idList.push(menu.id);
    if (menu?.childrenList?.length) getIds(menu.childrenList, idList);
  });
};
const handleEdit = (row: any) => {
  // console.log("edit", row);
  getMenuTreeApi({ menuId: 1 }).then((res) => {
    menus.value = res.data;
  });
  let menuIdList = <any>[];
  getRoleInfoApi({ id: row.id }).then((res) => {
    // console.log("info", res.data);
    if (res.data?.simpleMenuVoList?.length) {
      getIds(res.data.simpleMenuVoList, menuIdList);
      // console.log("menuIdList", menuIdList);
    }

    form2.id = row.id;
    if (row.name) form2.name = row.name;
    if (row.dataScope) form2.dataScope = row.dataScope;
    if (row.description) form2.description = row.description;
    if (menuIdList.length) {
      form2.menuIdList = menuIdList;
      menuIdList.forEach((menu: any) => treeRef2.value?.setChecked(menu.id, true, false));
    }
    dialogVisible2.value = true;
  });
};
// const test2 = () => {
//   console.log("test2", form2);
//   form2.menuIdList.forEach((menuId: any) => treeRef2.value?.setChecked(menuId, true, false));
// };
const test3 = () => {
  let menuIdList = treeRef2.value?.getCheckedNodes(false, true).map((x) => x.id);
  console.log("choosen menuids", menuIdList);
};
const setCheckedTree = () => {
  // console.log("setCheckedTree");
  form2.menuIdList.forEach((menuId: any) => treeRef2.value?.setChecked(menuId, true, false));
};
const handleDelete = (row: any) => {
  console.log("delete", row);
  // getMenuTreeApi({ menuId: 1 }).then((res) => {
  //   console.log("postDeptDeleteApi 带参数", res.data);
  // }); // **未通过，insufficient permissions
  postRoleDeleteApi({ id: row.id }).then((res) => {
    console.log("postRoleDeleteApi 带参数", res.data);
    getRoleListApi().then((res) => {
      // console.log("getDeptInfoApi 无参数", res.data);
      if (res.data.list) tableData.value = res.data.list;
    }); // 通过，tree 比 info 多包一层数组
  }); // **未通过，insufficient permissions
};

const treeRef = ref<InstanceType<typeof ElTree>>();
const menus = ref(<any>[]);
const defaultProps = {
  children: "childrenList",
  label: "title",
};
const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const form = reactive({
  name: "",
  dataScope: 1,
  description: "",
  menuIdList: <any>[],
});
const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  dataScope: [{ required: true, message: "请选择操作范围", trigger: "blur" }],
  menuIdList: [{ required: true }],
});
const add = () => {
  console.log("add");
  dialogVisible.value = true;
  getMenuTreeApi({ menuId: 1 }).then((res) => {
    menus.value = res.data;
  });
};
const test = () => {
  console.log("menuids", form.menuIdList);
  let menuIdList = treeRef.value?.getCheckedNodes(false, true).map((x) => x.id);
  console.log("getkeys", menuIdList);
};
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      dialogVisible.value = false;
      let params = <any>{
        name: form.name,
        dataScope: form.dataScope,
      };
      if (form.description) params.description = form.description;
      params.menuIdList = treeRef.value?.getCheckedNodes(false, true).map((x) => x.id);
      postRoleAddApi({ ...params }).then((res) => {
        console.log("postDeptAddApi 带参数", res.data);
        getRoleListApi().then((res) => {
          // console.log("getDeptInfoApi 无参数", res.data);
          if (res.data.list) tableData.value = res.data.list;
        }); // 通过，tree 比 info 多包一层数组
      });
    } else {
      console.log("error submit");
      return false;
    }
  });
};
const resetForm = () => {
  formRef.value?.resetFields();
};

const treeRef2 = ref<InstanceType<typeof ElTree>>();
const dialogVisible2 = ref(false);
const formRef2 = ref<FormInstance>();
const form2 = reactive({
  id: null,
  name: "",
  dataScope: 1,
  description: "",
  menuIdList: <any>[],
});
const submitForm2 = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      dialogVisible2.value = false;
      let params = <any>{
        id: form2.id,
      };
      if (form2.name) params.name = form2.name;
      if (form2.dataScope) params.dataScope = form2.dataScope;
      if (form2.description) params.description = form2.description;
      params.menuIdList = treeRef2.value?.getCheckedNodes(false, true).map((x) => x.id);
      postRoleUpdateApi({ ...params }).then((res) => {
        console.log("postDeptAddApi 带参数", res.data);
        getRoleListApi().then((res) => {
          // console.log("getDeptInfoApi 无参数", res.data);
          if (res.data.list) tableData.value = res.data.list;
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
