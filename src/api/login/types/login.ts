export interface LoginRequestData {
  /** admin 或 editor */
  username: "admin" | "editor"
  /** 密码 */
  password: string
}

export type LoginCodeResponseData = string

export type LoginResponseData = { access_token: string }

export interface Article {
  _id: string
  abstract: string
  author: string
  createdAt: number
  title: string
  tags: Tag[]
}

export interface ArticleDetail extends Article {
  content: string
  tags: Tag[]
}
export interface Tag {
  _id: string
  tagName: string
}
export interface Demo {
  link: string
  poster: string
  desc: string
  _id: string
}
export interface EditDemoParams extends Omit<Demo, "_id"> {
  id: string
}
