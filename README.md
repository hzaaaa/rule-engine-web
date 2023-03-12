# rule-engine-web

## 一、前言

rule-engine-web，采用 Vue3 + Vite + Ts 架构

- Vite : 轻量快速的热重载，对 Ts 支持开箱即用
- Eslint : 语法检查，保证项目的质量
- Prettier : 风格检查，保证项目的统一风格
- Stylelint : css 语法风格检查，检查 css 语法错误与不合理的写法
- EditorConfig : 不同的编辑器和 IDE 之间定义和维护一致的编码样式
- Husky : git hooks 工具，代码提交前检查以保证质量

## 二、node 版本

- nvm 1.1.9
- node 16.18.1
- npm 8.19.2

## 三、安装使用步骤

- **Clone：**

```text
git clone ssh://git@172.16.110.183:10022/dmp/rule-engine/rule-engine-web.git
```

- **Install：**

```text
npm i

# npm install 安装失败，请升级 nodejs 到 16 以上，或尝试使用以下命令：
npm install --registry=http://registry.npmmirror.com/
```

- **Run：**

```text
npm run dev
```

- **Build：**

```text
# 生产环境打包（去除 console 并开启 Gzip）
npm run build:pro
```

- **Commit：**

```text
# 提交代码（提交前会自动执行 lint-staged 命令）
git add .
npm run commit
git push
```
