<template>
  <div class="dept">
    <el-button @click="add" type="primary">新增</el-button>
    <!--表格渲染-->
    <el-table :data="tableData" row-key="id" :tree-props="{ children: 'childrenList' }" style="font-size: 12px">
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="sort" label="排序"></el-table-column>
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
    <el-dialog title="新增部门" v-model="dialogVisible">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="部门类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择部门类型">
            <el-option label="公司" :value="1"></el-option>
            <el-option label="部门" :value="2"></el-option>
            <el-option label="职位" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父部门id" prop="pid">
          <el-input-number v-model.number="form.pid" :min="0" :max="999"></el-input-number>
        </el-form-item>
        <el-form-item label="同级排序" prop="sort">
          <el-input-number v-model.number="form.sort" :min="0" :max="999"></el-input-number>
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
    <el-dialog title="编辑部门" v-model="dialogVisible2">
      <el-form ref="formRef2" :model="form2" :rules="rules" label-width="80px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form2.name"></el-input>
        </el-form-item>
        <el-form-item label="部门类型" prop="type">
          <el-select v-model="form2.type" placeholder="请选择部门类型">
            <el-option label="公司" :value="1"></el-option>
            <el-option label="部门" :value="2"></el-option>
            <el-option label="职位" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父部门id" prop="pid">
          <el-input-number v-model.number="form2.pid" :min="0" :max="999"></el-input-number>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model.number="form2.sort" :min="0" :max="999"></el-input-number>
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
import { getDeptTreeApi, postDeptAddApi, postDeptDeleteApi, postDeptUpdateApi } from "@/api/system/dept";
import { Delete, EditPen } from "@element-plus/icons-vue";
import { FormInstance, FormRules } from "element-plus";
import { onMounted, reactive, ref } from "vue";
// const test = () => {
//   console.log("测试接口");
//   // getDeptListApi().then((res) => {
//   //   console.log("getDeptListApi 无参数", res.data);
//   // }); // 通过
//   // getDeptListApi({ nameL: "测试" }).then((res) => {
//   //   console.log("getDeptListApi 带参数", res.data);
//   // }); // 通过
//   // getDeptInfoApi().then((res) => {
//   //   console.log("getDeptInfoApi 无参数", res.data);
//   // }); // 通过，需要新建超管角色
//   // getDeptInfoApi({ id: 8 }).then((res) => {
//   //   console.log("getDeptInfoApi 带参数", res.data);
//   // }); // 通过
//   // getDeptTreeApi().then((res) => {
//   //   console.log("getDeptInfoApi 无参数", res.data);
//   // }); // 通过，tree 比 info 多包一层数组
//   // getDeptTreeApi({ id: 8 }).then((res) => {
//   //   console.log("getDeptInfoApi 带参数", res.data);
//   // }); // 通过，tree 比 info 多包一层数组
//   // postDeptAddApi({ name: "测试创建公司", type: 1, pid: 0, sort: 6 }).then((res) => {
//   //   console.log("postDeptAddApi 带参数", res.data);
//   // }); // **未通过，pid 为 0 时报错，dept not found
//   // postDeptAddApi({ name: "测试创建部门", type: 2, pid: 8, sort: 66 }).then((res) => {
//   //   console.log("postDeptAddApi 带参数", res.data);
//   // }); // 通过
//   // postDeptAddApi({ name: "测试创建部门", type: 2, pid: 8, sort: 66 }).then((res) => {
//   //   console.log("postDeptAddApi 带参数", res.data);
//   // }); // 通过
//   // postDeptUpdateApi({ id: 13, name: "测试修改部门2", type: 2, pid: 8, sort: 65 }).then((res) => {
//   //   console.log("postDeptUpdateApi 带参数", res.data);
//   // }); // 通过
//   // postDeptDeleteApi({ id: 13 }).then((res) => {
//   //   console.log("postDeptDeleteApi 带参数", res.data);
//   // }); // **未通过，insufficient permissions
// };

const add = () => {
  console.log("add");
  dialogVisible.value = true;
};

const tableData = ref<any>([]);
onMounted(() => {
  getDeptTreeApi().then((res) => {
    // console.log("getDeptInfoApi 无参数", res.data);
    tableData.value = res.data;
  }); // 通过，tree 比 info 多包一层数组
});

const handleEdit = (row: any) => {
  console.log("edit", row);
  form2.id = row.id;
  form2.name = row.name;
  form2.type = row.type;
  form2.pid = row.pid;
  if (row.sort) form2.sort = row.sort;
  dialogVisible2.value = true;
};
const handleDelete = (row: any) => {
  console.log("delete", row);
  postDeptDeleteApi({ id: row.id }).then((res) => {
    console.log("postDeptDeleteApi 带参数", res.data);
    getDeptTreeApi().then((res) => {
      // console.log("getDeptInfoApi 无参数", res.data);
      tableData.value = res.data;
    }); // 通过，tree 比 info 多包一层数组
  }); // **未通过，insufficient permissions
};

const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const form = reactive({
  name: "",
  type: null,
  pid: 0,
  sort: null,
});
const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
  type: [{ required: true, message: "请选择部门类型", trigger: "blur" }],
  pid: [{ required: true, message: "请输入父部门id", trigger: "blur" }],
});
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      dialogVisible.value = false;
      let params = <any>{
        name: form.name,
        type: form.type,
        pid: form.pid,
      };
      if (form.sort) {
        params.sort = form.sort;
      }
      postDeptAddApi({ ...params }).then((res) => {
        console.log("postDeptAddApi 带参数", res.data);
        getDeptTreeApi().then((res) => {
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
  name: "",
  type: null,
  pid: 0,
  sort: null,
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
      if (form2.type) params.type = form2.type;
      if (form2.pid) params.pid = form2.pid;
      if (form2.sort) params.sort = form2.sort;
      postDeptUpdateApi({ ...params }).then((res) => {
        console.log("postDeptAddApi 带参数", res.data);
        getDeptTreeApi().then((res) => {
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
