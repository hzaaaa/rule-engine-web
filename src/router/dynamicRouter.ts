import router from "@/router/index";
import { useAuthStore } from "@/store/auth";
import Layout from "@/layouts/Layout.vue";
import subLayout from "@/layouts/subLayout.vue";

// 引入 views 文件夹下所有 vue 文件
const modules = import.meta.glob("@/views/**/*.vue");

/**
 * 初始化动态路由
 */
export const initDynamicRouter = async () => {
  // 1. 获取筛选过的动态路由菜单列表，通过 filterAsyncRouter 处理成路由
  const authStore = useAuthStore();
  let dynamicRouter = filterAsyncRouter(JSON.parse(JSON.stringify(authStore.routerMenuListGet)));

  // 2. 添加动态路由
  console.log("dynamicRouter", dynamicRouter);

  authStore.setAuthMenuList(dynamicRouter);
  dynamicRouter.forEach((item: any) => {
    router.addRoute(item);
  });

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
