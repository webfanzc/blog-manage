<script lang="ts" setup>
import { ref, watch } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { usePagination } from "@/hooks/usePagination"
import { getArticles, deleteArticle } from "../../../api/login/index"
import { Article } from "../../../api/login/types/login"
import dayjs from "dayjs"
import { useRouter } from "vue-router"

defineOptions({
  name: "ElementPlus"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 删
const handleDelete = (row: Article) => {
  ElMessageBox.confirm(`正在删除文章：${row.title}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteArticle({ id: row._id }).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion
const router = useRouter()
//#region 改
const handleUpdate = (row: Article) => {
  router.push("/article/post/" + row._id)
}
//#endregion

//#region 查
const tableData = ref<Article[]>([])
const getTableData = () => {
  loading.value = true
  getArticles({
    pageNo: paginationData.currentPage,
    pageSize: paginationData.pageSize
  })
    .then((res) => {
      paginationData.total = res.data.total
      tableData.value = res.data.list
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="title" label="标题" align="center" />
          <el-table-column prop="createdAt" label="创建时间" align="center">
            <template #default="scope">
              {{ dayjs(scope.row.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column prop="tags" label="标签" align="center">
            <template #default="scope">
              <el-tag v-for="item in scope.row.tags" :key="item._id" type="success" effect="plain">{{
                item.tagName
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
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
