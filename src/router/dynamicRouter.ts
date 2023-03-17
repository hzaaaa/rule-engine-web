import router from "@/router/index";
import { useAuthStore } from "@/store/auth";
import Layout from "@/layouts/Layout.vue";
import subLayout from "@/layouts/subLayout.vue";
import { isType } from "@/utils/util";

// 引入 views 文件夹下所有 vue 文件
const modules = import.meta.glob("@/views/**/*.vue");

/**
 * 初始化动态路由
 */
export const initDynamicRouter = async () => {
  /*
  // 1. 获取筛选过的动态路由菜单列表，通过 filterAsyncRouter 处理成路由
  const authStore = useAuthStore();
  let dynamicRouter = filterAsyncRouter(JSON.parse(JSON.stringify(authStore.routerMenuListGet)));

  // 2. 添加动态路由
  console.log("dynamicRouter", dynamicRouter);

  authStore.setAuthMenuList(dynamicRouter);
  dynamicRouter.forEach((item: any) => {
    router.addRoute(item);
  });
  */

  const authStore = useAuthStore();
  await authStore.getMockDynamicRouter();
  // dynamicRoutes.forEach((item: any) => {
  //   router.addRoute(item);
  // });
  console.log("mockDynamicMenuList", authStore.mockDynamicMenuList);
  console.log("flatMenuListGet", authStore.flatMenuListGet);

  authStore.flatMenuListGet.forEach((item: any) => {
    item.children && delete item.children;
    if (item.component && isType(item.component) == "string") {
      item.component = modules["/src/views" + item.component + ".vue"];
    }
    if (item.meta && item.meta.isFull === false) {
      router.addRoute("layout", item);
    } else {
      router.addRoute(item);
    }
  });
  console.log("router", router.getRoutes());

  // 3. 添加404页面路由，捕获所有未知路由
  router.addRoute({ path: "/:catchAll(.*)", redirect: "/404" });
};

/**
 * 处理后端返回菜单列表，生成可被 addRoute 添加的动态路由
 * @param menus 已经筛选过的动态路由菜单列表，需要转为前端的路由对象
 * @returns 处理后的动态路由数组
 */
export const filterAsyncRouter = (menus: Menu.BackMenuOptions[]) => {
  let res: any = [];
  menus.forEach((menu: Menu.BackMenuOptions) => {
    let router: any = {};
    router.path = menu.redirect || "";
    if (menu.router) router.name = menu.router;
    if (menu.component) {
      if (menu.component === "Layout") {
        router.component = Layout;
      } else if (menu.component === "subLayout") {
        router.component = subLayout;
      } else {
        router.component = modules["/src/views" + menu.component + ".vue"];
      }
    }
    if (menu.childrenList && menu.childrenList.length) {
      router.children = filterAsyncRouter(menu.childrenList);
    }
    res.push(router);
  });
  return res;
};

export const dynamicRoutes: any[] = [
  {
    path: "/system",
    component: Layout,
    children: [
      {
        path: "/system/dept",
        name: "Dept",
        component: () => import("@/views/system/Dept.vue"),
      },
      {
        path: "/system/menu",
        name: "Menu",
        component: () => import("@/views/system/Menu.vue"),
      },
      {
        path: "/system/role",
        name: "Role",
        component: () => import("@/views/system/Role.vue"),
      },
      {
        path: "/system/user",
        name: "User",
        component: () => import("@/views/system/User.vue"),
      },
    ], // 注意这里要带上 文件后缀.vue
  },
  // /*
  {
    path: "/app",
    name: "App",
    redirect: "/app/list",
    meta: {
      icon: "MessageBox",
      title: "规则配置",
      isLink: "",
      isHide: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: true,
    },
    children: [
      {
        path: "/app/list",
        name: "AppList",
        component: "/config/AppList.vue",
        meta: {
          icon: "MessageBox",
          title: "App列表",
          activeMenu: "/app",
          isLink: "",
          isHide: true,
          isFull: false,
          isAffix: false,
          isKeepAlive: true,
        },
        children: [
          {
            path: "/base/list",
            name: "BaseList",
            component: "/config/BaseList.vue",
            meta: {
              icon: "MessageBox",
              title: "Base列表",
              activeMenu: "/app",
              isLink: "",
              isHide: true,
              isFull: false,
              isAffix: false,
              isKeepAlive: true,
            },
            children: [
              {
                path: "/conf/detail",
                name: "ConfDetail",
                component: "/config/ConfDetail.vue",
                meta: {
                  icon: "MessageBox",
                  title: "Conf详情",
                  activeMenu: "/app",
                  isLink: "",
                  isHide: true,
                  isFull: false,
                  isAffix: false,
                  isKeepAlive: true,
                },
              },
            ],
          },
        ],
      },
    ], // 注意这里要带上 文件后缀.vue
  },
  {
    path: "/task",
    name: "Task",
    redirect: "/task/list",
    meta: {
      icon: "MessageBox",
      title: "任务管理",
      isLink: "",
      isHide: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: true,
    },
    children: [
      {
        path: "/task/list",
        name: "TaskList",
        component: "/task/TaskList.vue",
        meta: {
          icon: "Menu",
          title: "任务列表",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true,
        },
      },
      {
        path: "/task/submit",
        name: "TaskSubmit",
        component: "/task/TaskSubmit.vue",
        meta: {
          icon: "Menu",
          title: "任务提交",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true,
        },
      },
    ], // 注意这里要带上 文件后缀.vue
  },
  // */

  // {
  //   path: "/:catchAll(.*)",
  //   component: () => import("@/components/ErrorMessage/404.vue"),
  // },
];

/*
export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: "/system",
    component: Layout,
    children: [
      {
        path: "/system/dept",
        name: "Dept",
        component: () => import("@/views/system/Dept.vue"),
      },
      {
        path: "/system/menu",
        name: "Menu",
        component: () => import("@/views/system/Menu.vue"),
      },
      {
        path: "/system/role",
        name: "Role",
        component: () => import("@/views/system/Role.vue"),
      },
      {
        path: "/system/user",
        name: "User",
        component: () => import("@/views/system/User.vue"),
      },
    ], // 注意这里要带上 文件后缀.vue
  },

  {
    path: "/app",
    name: "App",
    component: Layout,
    redirect: "/app/list",
    meta: {
      icon: "MessageBox",
      title: "规则配置",
      isLink: "",
      isHide: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: true,
    },
    children: [
      {
        path: "/app/list",
        name: "AppList",
        component: () => import("@/views/config/AppList.vue"),
        meta: {
          icon: "MessageBox",
          title: "App列表",
          activeMenu: "/app",
          isLink: "",
          isHide: true,
          isFull: false,
          isAffix: false,
          isKeepAlive: true,
        },
        children: [
          {
            path: "/base/list",
            name: "BaseList",
            component: () => import("@/views/config/BaseList.vue"),
            meta: {
              icon: "MessageBox",
              title: "Base列表",
              activeMenu: "/app",
              isLink: "",
              isHide: true,
              isFull: false,
              isAffix: false,
              isKeepAlive: true,
            },
            children: [
              {
                path: "/conf/detail",
                name: "ConfDetail",
                component: () => import("@/views/config/ConfDetail.vue"),
                meta: {
                  icon: "MessageBox",
                  title: "Conf详情",
                  activeMenu: "/app",
                  isLink: "",
                  isHide: true,
                  isFull: false,
                  isAffix: false,
                  isKeepAlive: true,
                },
              },
            ],
          },
        ],
      },
    ], // 注意这里要带上 文件后缀.vue
  },
  {
    path: "/task",
    name: "Task",
    component: Layout,
    redirect: "/task/list",
    meta: {
      icon: "MessageBox",
      title: "任务管理",
      isLink: "",
      isHide: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: true,
    },
    children: [
      {
        path: "/task/list",
        name: "TaskList",
        component: () => import("@/views/task/TaskList.vue"),
        meta: {
          icon: "Menu",
          title: "任务列表",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true,
        },
      },
      {
        path: "/task/submit",
        name: "TaskSubmit",
        component: () => import("@/views/task/TaskSubmit.vue"),
        meta: {
          icon: "Menu",
          title: "任务提交",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true,
        },
      },
    ], // 注意这里要带上 文件后缀.vue
  },

// {
//   path: "/:catchAll(.*)",
//   component: () => import("@/components/ErrorMessage/404.vue"),
// },
];
*/
