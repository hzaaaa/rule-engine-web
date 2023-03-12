<template>
  <div class="app">
    <el-button class="app-btn">新增</el-button>
    <div class="app-list">
      <div class="app-item" v-for="item in tempTableList" :key="item.id" @click="jumpToConfigList(item.id)">
        <p>{{ item.name }}</p>
        <p>app: {{ item.id }}</p>
        <p>{{ item.info }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
let tempTableList = ref([
  {
    createAt: "2021-12-06T08:44:22.000+00:00",
    id: 1,
    info: "测试(仅此有真实实例部署)",
    name: "Test",
    status: true,
    updateAt: "2022-10-18T02:29:23.000+00:00",
  },
  {
    createAt: "2021-12-06T08:44:22.000+00:00",
    id: 2,
    info: "flink+ice demo",
    name: "flink+ice",
    status: true,
    updateAt: "2022-10-18T02:29:23.000+00:00",
  },
  {
    createAt: "2021-12-06T08:44:22.000+00:00",
    id: 3,
    info: "描述",
    name: "test0827",
    status: true,
    updateAt: "2022-10-18T02:29:23.000+00:00",
  },
  {
    createAt: "2021-12-06T08:44:22.000+00:00",
    id: 4,
    info: "",
    name: "test333",
    status: true,
    updateAt: "2022-10-18T02:29:23.000+00:00",
  },
]);
const jumpToConfigList = (listId: number) => {
  router.push(`/config/list/${listId}?pageId=1&pageSize=20`);
};
</script>

<style scoped lang="scss">
.app {
  &-list {
    display: flex;
    flex-wrap: wrap;
    font-size: 12px;
  }
  &-item {
    box-sizing: border-box;
    margin: 12px;
    padding: 20px 10px;
    border-radius: 10px;
    width: 200px;
    height: 120px;
    background-color: #f2ffff;
    cursor: pointer;
    text-align: center;
    font-size: 12px;
    color: #333333;
    p {
      margin-bottom: 1em;
    }
    &:hover {
      box-shadow: 0 26px 40px -24px rgb(0 36 100 / 50%);
      transform: translateY(-4px);
    }
  }
}
</style>
