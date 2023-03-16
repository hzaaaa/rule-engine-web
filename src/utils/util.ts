/**
 * @description 递归过滤出需要渲染在左侧菜单的列表（剔除 hidden == 1 及 type>5 的权限菜单项）
 * @param {Array} menuList 所有菜单列表
 * @return array
 */
export function getShowMenuList(menuList: Menu.BackMenuOptions[]) {
  let newMenuList: Menu.BackMenuOptions[] = JSON.parse(JSON.stringify(menuList));
  return newMenuList.filter((item) => {
    item.childrenList?.length && (item.childrenList = getShowMenuList(item.childrenList));
    return item.hidden == 0 && item.type <= 5;
  });
}

/**
 * @description 递归过滤出用于生成动态路由的列表（剔除 type>5 的权限菜单项）
 * @param {Array} menuList 所有菜单列表
 * @return array
 */
export function getRouterMenuList(menuList: Menu.BackMenuOptions[]) {
  let newMenuList: Menu.BackMenuOptions[] = JSON.parse(JSON.stringify(menuList));
  return newMenuList.filter((item) => {
    item.childrenList?.length && (item.childrenList = getRouterMenuList(item.childrenList));
    return item.type <= 5;
  });
}

// /**
//  * @description 扁平化数组对象(主要用来处理路由菜单)
//  * @param {Array} menuList 所有菜单列表
//  * @return array
//  */
// export function getFlatArr(menuList: Menu.BackMenuOptions[]) {
//   let newMenuList: Menu.BackMenuOptions[] = JSON.parse(JSON.stringify(menuList));
//   return newMenuList.reduce((pre: Menu.BackMenuOptions[], current: Menu.BackMenuOptions) => {
//     let flatArr = [...pre, current];
//     if (current.childrenList) flatArr = [...flatArr, ...getFlatArr(current.childrenList)];
//     return flatArr;
//   }, []);
// }

/**
 * @description 从路由列表中，找到第一个路由作为初始默认路由
 */
export function getFisrtRoute(routes: any): any {
  for (let route of routes) {
    if (route.children) return getFisrtRoute(route.children);
    if (route.name) return { name: route.name };
    if (route.path) return { path: route.path };
  }
  return null;
}

/**
 * @description GeekerAdmin 使用递归，过滤出需要渲染在左侧菜单的列表（剔除 isHide == true 的菜单）
 * @param {Array} menuList 所有菜单列表
 * @return array
 * */
export function getGeekerAdminShowMenuList(menuList: Menu.MenuOptions[]) {
  let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
  return newMenuList.filter((item) => {
    item.children?.length && (item.children = getGeekerAdminShowMenuList(item.children));
    return !item.meta?.isHide;
  });
}

/**
 * @description 格式化时间
 * @param date 时间格式
 * @param format 字符串格式，默认值 "yyyy-MM-dd HH:mm:ss"
 * @return 格式化后的字符串
 * */
export function dateToStr(date: Date, format = "yyyy-MM-dd HH:mm:ss") {
  if (!(date instanceof Date)) {
    console.warn("dateToStr 工具方法报错：请输入 Date 格式的日期");
    return;
  }
  let year = String(date.getFullYear());
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let day = String(date.getDate()).padStart(2, "0");
  let hour = String(date.getHours()).padStart(2, "0");
  let min = String(date.getMinutes()).padStart(2, "0");
  let sec = String(date.getSeconds()).padStart(2, "0");
  return format
    .replace("yyyy", year)
    .replace("MM", month)
    .replace("dd", day)
    .replace("HH", hour)
    .replace("mm", min)
    .replace("ss", sec);
}

/**
 * @description 复制文本内容到剪贴板
 * @param copyContent 需要复制的文本内容
 * */
export function copyTextToClipboard(copyContent: string) {
  if (navigator.clipboard) {
    // 新api，安全限制较多，https 或 localhost 才可用
    navigator.clipboard.writeText(copyContent);
  } else {
    // 传统api，随时可能会废弃
    const tempInput = document.createElement("input");
    tempInput.setAttribute("value", copyContent);
    document.body.append(tempInput);
    tempInput.select();
    document.execCommand("copy");
    tempInput.remove();
  }
}
