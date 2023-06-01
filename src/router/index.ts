import { type RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from "vue-router"

const Layout = () => import("@/layout/index.vue")

/** 常驻路由 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: {
      hidden: true
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: "首页",
          svgIcon: "dashboard",
          affix: true
        }
      }
    ]
  },
  {
    path: "/article",
    component: Layout,
    redirect: "/article/list",
    name: "Table",
    meta: {
      title: "文章管理",
      elIcon: "Grid"
    },
    children: [
      {
        path: "/article/list",
        component: () => import("@/views/table/list/index.vue"),
        name: "ArticleList",
        meta: {
          title: "文章列表",
          keepAlive: true
        }
      },
      {
        path: "/article/post",
        component: () => import("@/views/table/post/index.vue"),
        name: "AddArticle",
        meta: {
          title: "添加文章",
          keepAlive: true
        }
      },
      {
        path: "/article/post/:id",
        component: () => import("@/views/table/post/index.vue"),
        name: "EditArticle",
        meta: {
          title: "编辑文章",
          keepAlive: true,
          alwaysShow: false
        }
      }
    ]
  },
  {
    path: "/tags",
    component: Layout,
    redirect: "/tags/list",
    name: "Tags",
    meta: {
      title: "标签管理",
      elIcon: "Grid"
    },
    children: [
      {
        path: "/tags/list",
        component: () => import("@/views/tags/list/index.vue"),
        name: "TagsList",
        meta: {
          title: "标签列表",
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/demos",
    component: Layout,
    redirect: "/demos/list",
    name: "Demos",
    meta: {
      title: "Demo管理",
      elIcon: "Grid"
    },
    children: [
      {
        path: "/demos/list",
        component: () => import("@/views/demos/list/index.vue"),
        name: "DemosList",
        meta: {
          title: "Demo列表",
          keepAlive: true
        }
      }
    ]
  }
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: "/:pathMatch(.*)*", // Must put the 'ErrorPage' route at the end, 必须将 'ErrorPage' 路由放在最后
    redirect: "/404",
    name: "ErrorPage",
    meta: {
      hidden: true
    }
  }
]

const router = createRouter({
  history:
    import.meta.env.VITE_ROUTER_HISTORY === "hash"
      ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
      : createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch (error) {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
