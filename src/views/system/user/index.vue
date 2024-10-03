<!-- 用户管理 -->
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 用户列表 -->
      <el-col :lg="20" :xs="24">
        <div class="search-container">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="关键字" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                placeholder="用户名/昵称/手机号"
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery()"
              />
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="全部"
                clearable
                class="!w-[100px]"
              >
                <el-option label="正常" :value="1" />
                <el-option label="禁用" :value="0" />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleQuery">
                <i-ep-search />
                搜索
              </el-button>
              <el-button @click="handleResetQuery">
                <i-ep-refresh />
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="never" class="table-container">
          <template #header>
            <div class="flex-x-between">
              <div>
                <el-button type="success" @click="handleOpenDialog()">
                  <i-ep-plus />
                  新增
                </el-button>
                <el-button
                  type="danger"
                  :disabled="removeIds.length === 0"
                  @click="handleDelete()"
                >
                  <i-ep-delete />
                  删除
                </el-button>
              </div>
              <div>
                <el-button class="ml-3" @click="handleOpenImportDialog">
                  <template #icon><i-ep-upload /></template>
                  导入
                </el-button>

                <el-button class="ml-3" @click="handleExport">
                  <template #icon><i-ep-download /></template>
                  导出
                </el-button>
              </div>
            </div>
          </template>

          <el-table
            v-loading="loading"
            :data="pageData"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column
              key="id"
              label="编号"
              align="center"
              prop="id"
              width="80"
            />
            <el-table-column
              key="username"
              label="用户名"
              align="center"
              prop="userName"
            />
            <el-table-column label="用户姓名" align="center" prop="name" />

            <el-table-column label="性别" width="100" align="center" prop="sex">
              <template #default="scope">
                {{ scope.row.sex === 1 ? "男" : "女" }}
              </template>
            </el-table-column>
            <el-table-column
              label="手机号码"
              align="center"
              prop="phone"
              width="120"
            />

            <el-table-column
              label="状态"
              align="center"
              prop="status"
              width="100"
            >
              <template #default="scope">
                <el-tag :type="scope.row.status == 1 ? 'success' : 'info'">
                  {{ scope.row.status == 1 ? "正常" : "禁用" }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              align="center"
              prop="createTime"
              width="180"
            />
            <el-table-column label="操作" fixed="right" width="220">
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  link
                  @click="hancleResetPassword(scope.row)"
                >
                  <i-ep-refresh-left />
                  重置密码
                </el-button>
                <el-button
                  type="primary"
                  link
                  size="small"
                  @click="handleOpenDialog(scope.row.id)"
                >
                  <i-ep-edit />
                  编辑
                </el-button>
                <el-button
                  type="primary"
                  link
                  size="small"
                  @click="handleOpenRoleDialog(scope.row.id)"
                >
                  <i-ep-edit />
                  分配角色
                </el-button>
                <el-button
                  type="danger"
                  link
                  size="small"
                  @click="handleDelete(scope.row.id)"
                >
                  <i-ep-delete />
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-if="total > 0"
            v-model:total="total"
            v-model:page="queryParams.pageIndex"
            v-model:limit="queryParams.pageSize"
            @pagination="handleQuery"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 用户表单弹窗 -->
    <el-drawer
      v-model="dialog.visible"
      :title="dialog.title"
      append-to-body
      @close="handleCloseDialog"
    >
      <el-form
        ref="userFormRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="formData.userName" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="密码" prop="userPwd">
          <el-input
            v-model="formData.userPwd"
            placeholder="请输入密码"
            maxlength="11"
          />
        </el-form-item>

        <!-- <el-form-item label="所属部门" prop="deptId">
          <el-tree-select
            v-model="formData.deptId"
            placeholder="请选择所属部门"
            :data="deptOptions"
            filterable
            check-strictly
            :render-after-expand="false"
          />
        </el-form-item> -->

        <el-form-item label="性别" prop="sex">
          <el-select v-model="formData.sex" placeholder="请选择性别">
            <el-option :value="0" label="男" />
            <el-option :value="1" label="女" />
          </el-select>
        </el-form-item>

        <el-form-item label="手机号码" prop="phone">
          <el-input
            v-model="formData.phone"
            placeholder="请输入手机号码"
            maxlength="11"
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱"
            maxlength="50"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="formData.status"
            inline-prompt
            active-text="正常"
            inactive-text="禁用"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="handleCloseDialog">取 消</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 用户导入弹窗 -->
    <user-import
      v-model:visible="importDialogVisible"
      @import-success="handleOpenImportDialogSuccess"
    />
    <assign-role
      v-model:visible="setingRoleVisible"
      :personId="personId"
      @close-seting-role="handleCloseRoleDialog"
    />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "User",
  inheritAttrs: false,
});

import UserAPI, { UserForm, UserPageQuery, UserPageVO } from "@/api/user";
import assignRole from "./assignRole.vue";
import DeptAPI from "@/api/dept";
import RoleAPI from "@/api/role";
import { fileConvertBase64 } from "@/utils/util";
const queryFormRef = ref(ElForm);
const userFormRef = ref(ElForm);
const personId = ref();
const loading = ref(false);
const removeIds = ref([]);
const total = ref(0);
const pageData = ref<UserPageVO[]>();
/** 部门下拉选项 */
const deptOptions = ref<OptionType[]>();
/** 角色下拉选项 */
const roleOptions = ref<OptionType[]>();
/** 用户查询参数  */
const queryParams = reactive<UserPageQuery>({
  pageIndex: 1,
  pageSize: 10,
});
/** 导入弹窗显示状态 */
const setingRoleVisible = ref(false);
/**  用户弹窗对象  */
const dialog = reactive({
  visible: false,
  title: "",
});

/** 导入弹窗显示状态 */
const importDialogVisible = ref(false);

// 用户表单数据
const formData = reactive<UserForm>({});

/** 用户表单校验规则  */
const rules = reactive({
  userName: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
  email: [
    {
      pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      message: "请输入正确的邮箱地址",
      trigger: "blur",
    },
  ],
  mobile: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
});

/** 查询 */
function handleQuery() {
  loading.value = true;
  UserAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
      console.log(data);
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置查询 */
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageIndex = 1;
  queryParams.deptId = undefined;
  queryParams.createTime = undefined;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 重置密码 */
function hancleResetPassword(row: { [key: string]: any }) {
  ElMessageBox.prompt(
    "请输入用户「" + row.username + "」的新密码",
    "重置密码",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    }
  ).then(
    ({ value }) => {
      if (!value || value.length < 6) {
        // 检查密码是否为空或少于6位
        ElMessage.warning("密码至少需要6位字符，请重新输入");
        return false;
      }
      UserAPI.resetPassword(row.id, value).then(() => {
        ElMessage.success("密码重置成功，新密码是：" + value);
      });
    },
    () => {
      ElMessage.info("已取消重置密码");
    }
  );
}

/**
 * 打开弹窗
 *
 * @param id 用户ID
 */
async function handleOpenDialog(id?: number) {
  dialog.visible = true;
  // 加载角色下拉数据源
  // roleOptions.value = await RoleAPI.getOptions();
  // 加载部门下拉数据源
  // deptOptions.value = await DeptAPI.getOptions();

  if (id) {
    dialog.title = "修改用户";
    UserAPI.getFormData(id).then((data) => {
      Object.assign(formData, { ...data });
      console.log(formData);
    });
  } else {
    dialog.title = "新增用户";
  }
}
async function handleOpenRoleDialog(id?: number) {
  setingRoleVisible.value = true;
  personId.value = id;
}
/** 关闭弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  userFormRef.value.resetFields();
  userFormRef.value.clearValidate();

  formData.id = undefined;
  formData.status = 1;
}
/** 关闭分配角色弹窗 */
function handleCloseRoleDialog() {
  setingRoleVisible.value = false;
  personId.value = undefined;
}
/** 表单提交 */
const handleSubmit = useThrottleFn(() => {
  if (!userFormRef.value) {
    console.error("userFormRef is not initialized");
    return;
  }

  userFormRef.value.validate((valid: any) => {
    if (valid) {
      const userId = formData.id;
      loading.value = true;

      const request = userId ? UserAPI.update(formData) : UserAPI.add(formData);

      request
        .then(() => {
          ElMessage.success(userId ? "修改用户成功" : "新增用户成功");
          handleCloseDialog();
          handleResetQuery();
        })
        .catch((error) => {
          console.error("请求失败:", error.response);
          ElMessage.error(userId ? "修改用户失败" : "新增用户失败");
        })
        .finally(() => (loading.value = false));
    } else {
      console.error("表单验证失败");
      ElMessage.error("表单验证失败，请检查输入");
    }
  });
}, 3000);

/** 删除用户 */
function handleDelete(id?: number) {
  const userIds = [id || removeIds.value].join(",");
  if (!userIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除用户?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    function () {
      loading.value = true;
      UserAPI.deleteByIds(userIds)
        .then(() => {
          ElMessage.success("删除成功");
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    function () {
      ElMessage.info("已取消删除");
    }
  );
}
/** 打开导入弹窗 */
function handleOpenImportDialog() {
  importDialogVisible.value = true;
}

/** 导入用户成功 */
function handleOpenImportDialogSuccess() {
  handleQuery();
}

/** 导出用户 */
function handleExport() {
  UserAPI.export(queryParams).then((response: any) => {
    const fileData = response.data;
    const fileName = decodeURI(
      response.headers["content-disposition"].split(";")[1].split("=")[1]
    );
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8";

    const blob = new Blob([fileData], { type: fileType });
    const downloadUrl = window.URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = fileName;

    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);
    window.URL.revokeObjectURL(downloadUrl);
  });
}

onMounted(() => {
  handleQuery();
});
</script>
