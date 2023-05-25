import { request } from "@/utils/service"
import type * as Login from "./types/login"

/** 登录并返回 Token */
export function loginApi(data: Login.LoginRequestData) {
  return request<Login.LoginResponseData>({
    url: "/login",
    method: "post",
    data
  })
}
interface PaginationData<T> {
  list: T[]
  total: number
}
interface GetArticlesParams {
  pageNo: number
  pageSize: number
  tagId?: string
}
export function getArticles(params: GetArticlesParams) {
  return request<PaginationData<Login.Article>>({
    url: "/articles/list",
    method: "get",
    params
  })
}

export function getTags() {
  return request<Login.Tag[]>({
    url: "/tags/list",
    method: "get"
  })
}

export function addArticle(data: Pick<Login.ArticleDetail, "content" | "title"> & { tags: string[] }) {
  return request({
    url: "/articles/add",
    method: "post",
    data
  })
}

export function editArticle(data: Pick<Login.ArticleDetail, "content" | "title"> & { id: string; tags: string[] }) {
  return request({
    url: "/articles/update",
    method: "post",
    data
  })
}

export function deleteArticle(params: { id: string }) {
  return request({
    url: "/articles/delete",
    method: "get",
    params
  })
}

export function getArticleDetail(params: { id: string }) {
  return request<Login.ArticleDetail>({
    url: "/articles/detail",
    method: "get",
    params
  })
}

export function addTag(data: Pick<Login.Tag, "tagName">) {
  return request({
    url: "/tags/add",
    method: "post",
    data
  })
}

export function editTag(data: Pick<Login.Tag, "tagName"> & { id: string }) {
  return request({
    url: "/tags/update",
    method: "post",
    data
  })
}

export function deleteTag(params: { id: string }) {
  return request({
    url: "/tags/delete",
    method: "get",
    params
  })
}

export function deleteUnusedTags() {
  return request({
    url: "/tags/clearUnusedTags",
    method: "get"
  })
}
