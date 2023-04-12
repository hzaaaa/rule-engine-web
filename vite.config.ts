// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { wrapperEnv } from "./src/utils/getEnv";
import viteCompression from "vite-plugin-compression";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 各个 .env 文件中自定义的环境参数合并后的对象
  const env = loadEnv(mode, process.cwd());
  // viteEnv 为处理后的环境对象
  const viteEnv = wrapperEnv(env);

  return {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      // 服务器主机名，如果允许外部访问，可设置为 "0.0.0.0"
      host: "0.0.0.0",
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN,
      proxy: {
        "/api/rule-engine-server/v2": {
          target: "http://172.16.1.44:8123",
          rewrite: (path) => path.replace(/\/api/, ""),
        },
        "/api/rule-engine-server": {
          target: "http://172.16.1.44:8122",
          rewrite: (path) => {
            console.log("path3", path);
            path = path.replace(/\/api/, "");
            console.log("path4", path);
            return path;
          },
        },
        "/api/rule-engine-client": {
          target: "http://172.16.1.44:900",
          rewrite: (path) => {
            console.log("path5", path);
            path = path.replace(/\/api/, "");
            console.log("path6", path);
            return path;
          },
        },
        "/api": {
          target: "http://172.16.1.44:8122",
          rewrite: (path) => {
            console.log("path1", path);
            path = path.replace(/\/api/, "");
            console.log("path2", path);
            return path;
          },
        },
      },
    },
    plugins: [
      vue(),
      // gzip压缩 生产环境生成 .gz 文件
      viteEnv.VITE_BUILD_GZIP &&
        viteCompression({
          verbose: true,
          disable: false,
          threshold: 10240,
          algorithm: "gzip",
          ext: ".gz",
        }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    // 生产环境去除 console 和 debugger
    esbuild: {
      drop: viteEnv.VITE_DROP_CONSOLE ? ["console", "debugger"] : [],
    },
  };
});
