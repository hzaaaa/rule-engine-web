<template>
  <div class="tool-bar-lf">
    <CollapseIcon id="collapseIcon" />
    <Breadcrumb id="breadcrumb" v-if="themeConfig.breadcrumb" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useGlobalStore } from "@/store";
import CollapseIcon from "./components/CollapseIcon.vue";
import Breadcrumb from "./components/Breadcrumb.vue";

const globalStore = useGlobalStore();
const themeConfig = computed(() => globalStore.themeConfig);
</script>

<style scoped lang="scss">
.tool-bar-lf {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
