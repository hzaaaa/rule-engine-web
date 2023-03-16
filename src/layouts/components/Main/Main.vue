<template>
  <el-main>
    <router-view v-slot="{ Component, route }">
      <transition appear name="fade-transform" mode="out-in">
        <!-- <keep-alive :include="authStore.keepAliveRouterGet" v-if="isRouterRefresh">
            <component :is="Component" :key="route.path" />
          </keep-alive> -->
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </el-main>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { useGlobalStore } from "@/store";

const globalStore = useGlobalStore();
const themeConfig = computed(() => globalStore.themeConfig);
const isCollapse = computed(() => globalStore.themeConfig.isCollapse);

// 监听窗口大小变化，折叠侧边栏
const screenWidth = ref<number>(0);
const listeningWindow = () => {
  screenWidth.value = document.body.clientWidth;
  if (!isCollapse.value && screenWidth.value < 1200) globalStore.setThemeConfig({ ...themeConfig.value, isCollapse: true });
  if (isCollapse.value && screenWidth.value > 1200) globalStore.setThemeConfig({ ...themeConfig.value, isCollapse: false });
};
window.addEventListener("resize", listeningWindow);
onBeforeUnmount(() => {
  window.removeEventListener("resize", listeningWindow);
});
</script>

<style scoped lang="scss">
.el-main {
  overflow-x: hidden;
  position: relative;
  box-sizing: border-box;
  padding: 10px 12px;
  background-color: #f0f2f5;
  &::-webkit-scrollbar {
    background-color: #f0f2f5;
  }
}
.el-footer {
  padding: 0;
  height: auto;
}
</style>
