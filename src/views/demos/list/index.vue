<script lang="ts" setup>
import { computed, ref } from "vue"
import { type FormInstance, ElMessage, ElMessageBox, FormRules, UploadProps } from "element-plus"
import { CirclePlus } from "@element-plus/icons-vue"

import { editDemo, addDemo, getDemos } from "../../../api/login/index"
import { Demo } from "../../../api/login/types/login"
import { deleteDemo } from "../../../api/login/index"
import { getToken } from "../../../utils/cache/cookies"

const loading = ref<boolean>(false)

const dialogVisible = ref(false)
const currentEditId = ref("")
const formRef = ref<FormInstance | null>(null)
const form = ref({
  link: "",
  poster: "",
  desc: ""
})
const formRules: FormRules = {
  link: { required: true, message: "请输入链接", trigger: "blur" },
  poster: { required: true, message: "请上传封面", trigger: "blur" },
  desc: { required: true, message: "请输入描述", trigger: "blur" }
}
//#region 删
const handleDelete = (row: Demo) => {
  ElMessageBox.confirm(`正在删除Demo：${row.desc}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteDemo({ id: row._id }).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}

function handleEdit(row: Demo) {
  currentEditId.value = row._id
  form.value.link = row.link
  form.value.desc = row.desc
  form.value.poster = row.poster
  dialogVisible.value = true
}
function resetForm() {
  formRef.value?.resetFields()
}

//#region 查
const tableData = ref<Demo[]>([])
const getTableData = () => {
  loading.value = true
  getDemos()
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
const imageUrl = ref("")

const handleAvatarSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  form.value.poster = response.data.imagePath
}

const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("最大不能超过 2MB!")
    return false
  }
  return true
}

const uploadHeaders = computed(() => {
  return { Authorization: "Bearer " + getToken() }
})
//#region 改
async function submit() {
  if (currentEditId.value) {
    await editDemo({ ...form.value, id: currentEditId.value })
  } else {
    await addDemo({ ...form.value })
  }

  formRef.value?.resetFields()
  imageUrl.value = ""
  currentEditId.value = ""

  getTableData()
  dialogVisible.value = false
  ElMessage.success("操作成功")
}
//#endregion
//#endregion
getTableData()
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增</el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="desc" label="描述" />
          <el-table-column prop="link" label="链接" />
          <el-table-column label="封面">
            <template #default="scope">
              <el-image :src="scope.row.poster" style="width: 50px" />
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
      :title="currentEditId === '' ? '新增Demo' : '修改Demo'"
      v-if="dialogVisible"
      @close="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="link" label="链接">
          <el-input v-model="form.link" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="desc" label="描述">
          <el-input v-model="form.desc" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="poster" label="封面">
          <el-upload
            class="avatar-uploader"
            action="/api/articles/upload"
            :headers="uploadHeaders"
            :show-file-list="false"
            name="file[]"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl || form.poster" :src="imageUrl || form.poster" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
<style lang="scss" scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
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
