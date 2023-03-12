<template>
  <div class="dept">
    <el-button @click="add" type="primary">新增</el-button>
    <!--表格渲染-->
    <el-table :data="tableData" row-key="id" :tree-props="{ children: 'childrenList' }" style="font-size: 12px">
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="nickName" label="昵称"></el-table-column>
      <el-table-column label="性别" width="80px">
        <template #default="scope">
          {{ scope.row.gender === 1 ? "男" : "女" }}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="deptId" label="部门" width="80px"></el-table-column>
      <el-table-column prop="enabled" label="状态" width="80px">
        <template #default="scope">
          <el-switch
            v-model="scope.row.enabled"
            :active-value="1"
            :inactive-value="0"
            @change="changeEnabled(scope.row, scope.row.enabled)"
          ></el-switch>
        </template>
      </el-table-column>
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
    <el-dialog title="新增用户" v-model="dialogVisible">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="form.nickName"></el-input>
        </el-form-item>
        <el-form-item label="部门ID" prop="deptId">
          <el-input v-model.number="form.deptId"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input type="number" v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="用户头像" prop="avatarUrl">
          <el-input v-model="form.avatarUrl"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="roleIdList">
          <el-input v-model="form.roleIdList" placeholder="若输入多个角色，用"></el-input>
        </el-form-item>
        <el-form-item label="用户性别">
          <el-radio-group v-model="form.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户状态">
          <el-radio-group v-model="form.enabled">
            <el-radio :label="1">激活</el-radio>
            <el-radio :label="0">禁用</el-radio>
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
    <el-dialog title="编辑部门" v-model="dialogVisible2">
      <el-form ref="formRef2" :model="form2" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form2.username"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="form2.nickName"></el-input>
        </el-form-item>
        <el-form-item label="部门ID" prop="deptId">
          <el-input v-model.number="form2.deptId"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input type="number" v-model="form2.phone"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="form2.email"></el-input>
        </el-form-item>
        <el-form-item label="用户头像" prop="avatarUrl">
          <el-input v-model="form2.avatarUrl"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="roleIdList">
          <el-input v-model="form2.roleIdList"></el-input>
        </el-form-item>
        <el-form-item label="用户性别">
          <el-radio-group v-model="form2.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户状态">
          <el-radio-group v-model="form2.enabled">
            <el-radio :label="1">激活</el-radio>
            <el-radio :label="0">禁用</el-radio>
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
import { getUserListApi, postUserAddApi, postUserDeleteApi, postUserUpdateApi, getUserInfoApi } from "@/api/system/user";
import { Delete, EditPen } from "@element-plus/icons-vue";
import { FormInstance, FormRules } from "element-plus";
import { onMounted, reactive, ref } from "vue";

const add = () => {
  console.log("add");
  dialogVisible.value = true;
};

const tableData = ref<any>([]);
onMounted(() => {
  getUserListApi().then((res) => {
    // console.log("getDeptInfoApi 无参数", res.data);
    if (res.data.list) tableData.value = res.data.list;
  }); // 通过，tree 比 info 多包一层数组
});

const changeEnabled = (data: any, val: any) => {
  ElMessageBox.confirm(`此操作将${data.enabled === 0 ? "禁用" : "激活"} ${data.username}，是否继续`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      console.log("changeEnabled", data);
      console.log("change val", val);
      let params = <any>{
        id: data.id,
        enabled: data.enabled,
      };
      postUserUpdateApi({ ...params }).then((res) => {
        console.log("postDeptAddApi 带参数", res.data);
        getUserListApi().then((res) => {
          // console.log("getDeptInfoApi 无参数", res.data);
          if (res.data.list) tableData.value = res.data.list;
        }); // 通过，tree 比 info 多包一层数组
      });
    })
    .catch(() => {
      // console.log("cancle", data.enabled);
      if (data.enabled === 0) {
        data.enabled = 1;
      } else {
        data.enabled = 0;
      }
    });
};

const handleEdit = (row: any) => {
  console.log("edit", row);
  getUserInfoApi({ userId: row.id }).then((res) => {
    // console.log("getDeptInfoApi 无参数", res.data);
    console.log("res", res.data);
    if (res.data?.sysUser) {
      let userInfo = res.data.sysUser;
      let roleInfo = res.data.sysRoleList;
      form2.id = row.id;
      if (userInfo.username) form2.username = userInfo.username;
      if (userInfo.nickName) form2.nickName = userInfo.nickName;
      if (userInfo.deptId) form2.deptId = userInfo.deptId;
      if (userInfo.phone) form2.phone = userInfo.phone;
      if (userInfo.email) form2.email = userInfo.email;
      if (userInfo.avatarUrl) form2.avatarUrl = userInfo.avatarUrl;
      if (userInfo.gender) form2.gender = userInfo.gender;
      if (userInfo.enabled) form2.enabled = userInfo.enabled;
      if (roleInfo.length) form2.roleIdList = roleInfo.map((role: any) => role.id).toString();
    }
  }); // 通过，tree 比 info 多包一层数组
  dialogVisible2.value = true;
};
const handleDelete = (row: any) => {
  console.log("delete", row);
  postUserDeleteApi({ id: row.id }).then((res) => {
    console.log("postDeptDeleteApi 带参数", res.data);
    getUserListApi().then((res) => {
      // console.log("getDeptInfoApi 无参数", res.data);
      if (res.data.list) tableData.value = res.data.list;
    }); // 通过，tree 比 info 多包一层数组
  }); // **未通过，insufficient permissions
};

const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const form = reactive({
  username: "",
  nickName: "",
  deptId: null,
  phone: "",
  email: "",
  avatarUrl: "",
  password: "123456",
  roleIdList: null,
  gender: null,
  enabled: null,
});
const rules = reactive<FormRules>({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入用户密码", trigger: "blur" }],
  phone: [{ required: true, message: "请输入用户手机号", trigger: "blur" }],
  deptId: [{ required: true, message: "请输入用户部门ID", trigger: "blur" }],
});
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      dialogVisible.value = false;
      let params = <any>{
        username: form.username,
        password: form.password,
        phone: form.phone,
        deptId: form.deptId,
      };
      if (form.nickName) params.nickName = form.nickName;
      if (form.email) params.email = form.email;
      if (form.avatarUrl) params.avatarUrl = form.avatarUrl;
      if (form.roleIdList) params.roleIdList = form.roleIdList;
      if (form.gender) params.gender = form.gender;
      if (form.enabled) params.enabled = form.enabled;
      postUserAddApi({ ...params }).then((res) => {
        console.log("postDeptAddApi 带参数", res.data);
        getUserListApi().then((res) => {
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

const dialogVisible2 = ref(false);
const formRef2 = ref<FormInstance>();
const form2 = reactive({
  id: null,
  username: "",
  nickName: "",
  deptId: null,
  phone: "",
  email: "",
  avatarUrl: "",
  password: "123456",
  roleIdList: null,
  gender: null,
  enabled: null,
});
const submitForm2 = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      dialogVisible2.value = false;
      let params = <any>{
        id: form2.id,
      };
      if (form2.username) params.username = form2.username;
      if (form2.nickName) params.nickName = form2.nickName;
      if (form2.deptId) params.deptId = form2.deptId;
      if (form2.phone) params.phone = form2.phone;
      if (form2.email) params.email = form2.email;
      if (form2.avatarUrl) params.avatarUrl = form2.avatarUrl;
      if (form2.roleIdList) params.roleIdList = form2.roleIdList;
      if (form2.gender) params.gender = form2.gender;
      if (form2.enabled) params.enabled = form2.enabled;
      postUserUpdateApi({ ...params }).then((res) => {
        console.log("postDeptAddApi 带参数", res.data);
        getUserListApi().then((res) => {
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
