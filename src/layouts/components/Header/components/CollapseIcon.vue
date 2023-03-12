<template>
  <el-icon class="collapse-icon" @click="collapse">
    <component :is="themeConfig.isCollapse ? Expand : Fold"></component>
  </el-icon>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useGlobalStore } from "@/store";
import { Expand, Fold } from "@element-plus/icons-vue";

const globalStore = useGlobalStore();
const themeConfig = computed(() => globalStore.themeConfig);

const collapse = () => {
  globalStore.setThemeConfig({ ...themeConfig.value, isCollapse: !themeConfig.value.isCollapse });
};
</script>

<style scoped lang="scss">
.collapse-icon {
  margin-right: 20px;
  cursor: pointer;
  font-size: 22px;
}
</style>
