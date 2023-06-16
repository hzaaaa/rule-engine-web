import { ModelItem, ModelTreeItem } from "@/store/interface/model";

/**
 * @description 判断数据类型
 * @param {Any} val 需要判断类型的数据
 * @return string
 */
export function isType(val: any) {
  if (val === null) return "null";
  if (typeof val !== "object") return typeof val;
  else return Object.prototype.toString.call(val).slice(8, -1).toLocaleLowerCase();
}

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
 * @description GeekerAdmin 扁平化数组对象(主要用来处理路由菜单)
 * @param {Array} menuList 所有菜单列表
 * @return array
 */
export function getFlatArr(menuList: Menu.MenuOptions[]) {
  let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
  return newMenuList.reduce((pre: Menu.MenuOptions[], current: Menu.MenuOptions) => {
    let flatArr = [...pre, current];
    if (current.children) flatArr = [...flatArr, ...getFlatArr(current.children)];
    return flatArr;
  }, []);
}

/**
 * @description GeekerAdmin 递归找出所有面包屑存储到 pinia/vuex 中
 * @param {Array} menuList 所有菜单列表
 * @param {Object} result 输出的结果
 * @param {Array} parent 父级菜单
 * @returns object
 */
export const getAllBreadcrumbList = (menuList: Menu.MenuOptions[], result: { [key: string]: any } = {}, parent = []) => {
  for (const item of menuList) {
    result[item.path] = [...parent, item];
    if (item.children) getAllBreadcrumbList(item.children, result, result[item.path]);
  }
  return result;
};

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

/**
 * @description 列表转树, 使用哈希降低时间复杂度
 */
export function listToTreeHash(list: ModelItem[]): ModelTreeItem[] {
  const copyList = JSON.parse(JSON.stringify(list)) as ModelItem[];

  // 使用哈希
  const obj: any = {};
  copyList.forEach((item) => (obj[item.id] = item));

  const res: ModelTreeItem[] = [];
  copyList.forEach((item) => {
    const parent = obj[item.pid];
    if (parent) {
      parent.children = parent.children || [];
      parent.children.push(item);
    } else {
      res.push(item);
    }
  });

  return res;
}

/**
 * @description 树转列表, bfs
 */
export function treeToList(tree: ModelTreeItem[]) {
  const copyTree = JSON.parse(JSON.stringify(tree)) as ModelTreeItem[];
  const queue = copyTree;
  const res: ModelItem[] = [];

  function loop(treeArr: ModelTreeItem[]) {
    while (treeArr && treeArr.length) {
      const item = treeArr.shift();
      if (item?.children && item.children.length) {
        queue.push(...item.children);
      }
      delete item?.children;
      res.push(item!);
    }
    return res;
  }

  return loop(queue);
}

/**
 * @description 根据 id 找到树的节点, bfs。返回的是新对象，在其上添加、修改不会改变原对象
 */
export function getNodeByIdBFS(tree: any, id: any) {
  const queue = JSON.parse(JSON.stringify(tree));

  function loop(treeArr: any) {
    while (treeArr && treeArr.length) {
      const item = treeArr.shift();
      if (id === item.id) return item;
      if (item.children && item.children.length) {
        treeArr.push(...item.children);
      }
    }
    return null;
  }

  return loop(queue);
}

/**
 * @description 根据 id 找到树的节点, 递归。返回的是引用，在其上添加、修改会改变原对象
 */
export function getNodeByIdRecursive(tree: any[], id: any): any {
  for (let i = 0; i < tree.length; i++) {
    const item = tree[i];
    if (id === item.id) return item;
    if (item.children && item.children.length) {
      const res = getNodeByIdRecursive(item.children, id);
      if (res) return res;
    }
  }
  return null;
}

/**
 * @description 数组两个元素换位置, 会改变原数组
 */
export function swapIndex(arr: any[], index1: number, index2: number) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
}

/**
 * @description 给树状对象计算添加 pid 和 index
 */
export function addPidAndIndex(treeObj: any) {
  function loop(treeArr: any[], pid: any) {
    for (let i = 0; i < treeArr.length; i++) {
      const item = treeArr[i];
      item.index = i;
      item.pid = pid;
      if (item.children && item.children.length) {
        item.children = loop(item.children, item.id);
      }
    }
    return treeArr;
  }
  return loop([treeObj], "0")[0];
}

/**
 * @description 给树状对象删除 pid 和 index 属性
 */
export function deletePidAndIndex(treeObj: any) {
  function loop(treeArr: any[]) {
    for (let i = 0; i < treeArr.length; i++) {
      const item = treeArr[i];
      delete item.index;
      delete item.pid;
      if (item.children && item.children.length) {
        item.children = loop(item.children);
      }
    }
    return treeArr;
  }
  return loop([treeObj])[0];
}
