<script lang="ts" setup>
import { ref } from "vue"
import { type FormInstance, ElMessage, ElMessageBox, FormRules } from "element-plus"
import { CirclePlus, Delete } from "@element-plus/icons-vue"

import { getTags, deleteTag, editTag, addTag, deleteUnusedTags } from "../../../api/login/index"
import { Tag } from "../../../api/login/types/login"

const loading = ref<boolean>(false)

const dialogVisible = ref(false)
const currentEditId = ref("")
const formRef = ref<FormInstance | null>(null)
const form = ref({
  tagName: ""
})
const formRules: FormRules = {
  tagName: { required: true, message: "请输入标签名称", trigger: "blur" }
}
//#region 删
const handleDelete = (row: Tag) => {
  ElMessageBox.confirm(`正在删除标签：${row.tagName}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteTag({ id: row._id }).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
async function clearUnusedTags() {
  await deleteUnusedTags()

  ElMessage.success("操作成功")
  getTableData()
}

function handleEdit(row: Tag) {
  currentEditId.value = row._id
  form.value.tagName = row.tagName
  dialogVisible.value = true
}
function resetForm() {
  formRef.value?.resetFields()
}
//#region 改
async function submit() {
  if (currentEditId.value) {
    await editTag({ ...form.value, id: currentEditId.value })
  } else {
    await addTag({ ...form.value })
  }

  formRef.value?.resetFields()
  getTableData()
  dialogVisible.value = false
  ElMessage.success("操作成功")
}
//#endregion

//#region 查
const tableData = ref<Tag[]>([])
const getTableData = () => {
  loading.value = true
  getTags()
    .then((res) => {
      tableData.value = res.data
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
//#endregion
getTableData()
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增</el-button>
          <el-button type="danger" :icon="Delete" @click="clearUnusedTags">删除未使用标签</el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="tags" label="标签">
            <template #default="scope">
              <el-tag type="success" effect="plain">{{ scope.row.tagName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleEdit(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentEditId === '' ? '新增标签' : '修改标签'"
      @close="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="tagName" label="标签名">
          <el-input v-model="form.tagName" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
