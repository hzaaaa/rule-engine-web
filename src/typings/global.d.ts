// 菜单
declare namespace Menu {
  // 后端接口返回的菜单
  interface BackMenuOptions {
    title: string;
    type: number;
    hidden: number;
    component?: string;
    permission?: string;
    router?: string;
    icon?: string;
    redirect?: string;
    childrenList?: BackMenuOptions[];
  }

  // 前端菜单
  interface MenuOptions {
    path: string;
    name: string;
    component?: string | (() => Promise<any>);
    redirect?: string;
    meta: MetaProps;
    children?: MenuOptions[];
  }

  interface MetaProps {
    icon: string;
    title: string;
    activeMenu?: string;
    isLink?: string;
    isHide: boolean;
    isFull: boolean;
    isAffix: boolean;
    isKeepAlive: boolean;
  }
}
