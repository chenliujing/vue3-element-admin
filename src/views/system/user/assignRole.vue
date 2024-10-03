<template>
  <el-dialog v-model="dialogVisible" width="50%" :before-close="close">
    <div class="content">
      <el-table ref="roleTable" v-loading="loading" :data="pageData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="roleName" label="角色名称" />
        <!-- 其他列可以根据需要添加 -->
      </el-table>
      <div class="btn">
        <el-button type="primary" @click="handleSubmit">确定</el-button>
        <el-button @click="close()">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  ref,
  defineProps,
  defineEmits,
  onMounted,
  reactive,
  watch,
  nextTick,
  computed,
} from "vue";
import RoleAPI, { RolePageQuery, RolePageVO } from "@/api/role";
import UserAPI from "@/api/user";
import { ElMessage } from "element-plus";
import type { ElTable } from "element-plus";

const pageData = ref<RolePageVO[]>([]);
const RoleIds = ref<number[]>([]);
const roleTable = ref<InstanceType<typeof ElTable>>();
const total = ref(0);
const loading = ref(false);
const queryParams = reactive<RolePageQuery>({
  pageIndex: 1,
  pageSize: 10,
});
const props = defineProps<{
  visible: boolean;
  personId: number;
}>();
const emits = defineEmits(["closeSetingRole", "update:visible"]);

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => {
    emits("update:visible", val);
  },
});

/** 关闭弹窗 */
function close() {
  emits("closeSetingRole");
}

/** 查询角色 */
async function handleQuery() {
  loading.value = true;
  try {
    const data = await RoleAPI.getPage(queryParams);
    pageData.value = data.list;
    total.value = data.total;
    // 初始化选中状态
    await nextTick();
    initSelectedRoles();
  } finally {
    loading.value = false;
  }
}

/** 查询用户角色 */
async function handleQueryUserRoles() {
  loading.value = true;
  try {
    const data = await UserAPI.getRolesByUserId(props.personId);
    RoleIds.value = data as any; // 根据实际数据结构调整
    // 如果角色数据已经加载了，初始化选中状态
    if (pageData.value.length > 0) {
      await nextTick();
      initSelectedRoles();
    }
  } finally {
    loading.value = false;
  }
}

/** 初始化表格选中状态 */
function initSelectedRoles() {
  if (roleTable.value && RoleIds.value.length > 0) {
    RoleIds.value.forEach((roleId) => {
      const row = pageData.value.find((role) => role.id === roleId);
      if (row) {
        roleTable.value!.toggleRowSelection(row, true);
      }
    });
  }
}

/** 选中变化时更新 RoleIds */
function handleSelectionChange(selection: any) {
  RoleIds.value = selection.map((item: any) => item.id);
}

/** 表单提交 */
const handleSubmit = useThrottleFn(() => {
  const Ids = RoleIds.value.join(",");
  if (!Ids) {
    ElMessage.warning("请勾选删除项");
    return;
  }
  UserAPI.assignRole(Ids, props.personId).then(() => {
    ElMessage.success("分配角色成功");
    close();
  });
}, 3000);

onMounted(() => {
  handleQuery();
});

watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      handleQueryUserRoles();
    }
  }
);
</script>

<style scoped>
/* 样式可以根据需要调整 */
.btn {
  margin-top: 20px;
  text-align: right;
}
</style>
