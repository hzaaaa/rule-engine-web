// main.ts
import { createApp, createVNode } from "vue";
import App from "./App.vue";
// global css
import "@/assets/styles/index.scss";
import router from "@/router/index";
import pinia from "@/store/index";
import directives from "@/directives/index";
import { Operation, MessageBox, Menu } from "@element-plus/icons-vue";
const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(directives);

app.mount("#app");

// 创建 vIcon 组件，为了动态使用 element-plus 的 icon
const Icons = { Operation, MessageBox, Menu };
const vIcon = (props: { icon: string }) => {
  const { icon } = props;
  return createVNode(Icons[icon as keyof typeof Icons]);
};
// 注册 vIcon 组件
app.component("vIcon", vIcon);
