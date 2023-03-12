<template>
  <div class="detail">
    <!-- 按钮区 -->
    <div class="btn">
      <el-button type="primary">发布</el-button>
      <el-button type="danger">清除</el-button>
      <el-button>导入</el-button>
      <el-button>导出</el-button>
    </div>
    <div id="AntVContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { Graph } from "@antv/x6";

const route = useRoute();
console.log("route", route.path, route.params);

/**
 * 画布区
 */
const data = {
  // 节点
  nodes: [
    {
      id: "node1", // String，可选，节点的唯一标识
      x: 40, // Number，必选，节点位置的 x 值
      y: 40, // Number，必选，节点位置的 y 值
      width: 80, // Number，可选，节点大小的 width 值
      height: 40, // Number，可选，节点大小的 height 值
      label: "hello", // String，节点标签
    },
    {
      id: "node2", // String，节点的唯一标识
      x: 160, // Number，必选，节点位置的 x 值
      y: 180, // Number，必选，节点位置的 y 值
      width: 80, // Number，可选，节点大小的 width 值
      height: 40, // Number，可选，节点大小的 height 值
      label: "world", // String，节点标签
    },
  ],
  // 边
  edges: [
    {
      source: "node1", // String，必须，起始节点 id
      target: "node2", // String，必须，目标节点 id
      connector: { name: "smooth" },
    },
  ],
};
onMounted(() => {
  const graph = new Graph({
    container: document.getElementById("AntVContainer")!,
    width: 1000,
    height: 800,
  });
  graph.fromJSON(data);
});
</script>

<style scoped lang="scss"></style>
