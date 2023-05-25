<script setup lang="ts">
import Vditor from "vditor"
import { ref, onMounted, computed } from "vue"
import { FormInstance, FormRules, ElMessage } from "element-plus"
import { Tag } from "@/api/login/types/login"
import { getTags } from "@/api/login"
import { useRoute } from "vue-router"
import { editArticle, addArticle, getArticleDetail } from "../../../api/login/index"
import { getToken } from "../../../utils/cache/cookies"

const form = ref({
  content: "",
  title: "",
  tags: [] as string[]
})
const rules: FormRules = {
  content: { required: true, message: "请输入文章内容", trigger: ["blur", "change"] },
  title: { required: true, message: "请输入标题", trigger: ["blur", "change"] }
}
const editor = ref<Vditor | null>(null)
const contentRef = ref<HTMLElement | null>(null)

const tags = ref<Tag[]>([])
async function getAllTag() {
  const res = await getTags()
  tags.value = res.data
}

getAllTag()

onMounted(() => {
  editor.value = new Vditor(contentRef.value!, {
    height: 480,
    input(str) {
      form.value.content = str
      console.log("input", form)
    },
    blur(str) {
      form.value.content = str
      console.log("blur", form)
    },
    cache: {
      enable: true,
      id: "postArticle"
    },
    upload: {
      url: "/api/articles/upload",
      multiple: false,
      headers: {
        Authorization: "Bearer " + getToken()
      },
      format(files, response) {
        const res = JSON.parse(response)
        return JSON.stringify({
          msg: res.msg,
          code: res.code,
          data: {
            errFiles: [],
            succMap: {
              [files[0].name]: res.data.imagePath
            }
          }
        })
      }
    }
  })
})
const postRef = ref<FormInstance | null>(null)
const route = useRoute()
const isEdit = computed(() => {
  return !!route.params.id
})
async function getDetail() {
  if (isEdit.value) {
    const res = await getArticleDetail({ id: route.params.id as string })
    if (res.code === 0) {
      form.value.content = res.data.content
      form.value.title = res.data.title
      form.value.tags = res.data.tags.map((item) => item._id)
      editor.value?.setValue(res.data.content)
    }
  }
}
onMounted(() => {
  getDetail()
})

function submit() {
  postRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value) {
          await editArticle({
            id: route.params.id as string,
            ...form.value
          })
        } else {
          await addArticle(form.value)
        }

        ElMessage.success("提交成功")
        postRef.value?.resetFields()
        editor.value?.setValue("")
      } catch (error) {
        return
      }
    }
  })
}
</script>

<template>
  <div>
    <el-form :model="form" :rules="rules" ref="postRef">
      <el-form-item prop="title" label="文章标题">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item prop="tags" label="文章标签">
        <el-checkbox-group v-model="form.tags">
          <el-checkbox v-for="item in tags" :key="item._id" :label="item._id"> {{ item.tagName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item prop="content" label="文章内容">
        <div ref="contentRef" class="h-120" />
      </el-form-item>
      <el-button @click="submit"> 提交 </el-button>
    </el-form>
  </div>
</template>
