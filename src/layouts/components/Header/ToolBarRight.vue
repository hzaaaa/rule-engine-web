<template>
  <div class="tool-bar-ri">
    <!-- <span class="username">{{ globalStore.username }}({{ globalStore.role }})</span> -->
    <Avatar />
  </div>
</template>

<script setup lang="ts">
// import { useGlobalStore } from "@/store";
import Avatar from "./components/Avatar.vue";
// const globalStore = useGlobalStore();
</script>

<style scoped lang="scss">
.tool-bar-ri {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 30px;
  .username {
    margin: 0 20px 0 0;
    font-size: 15px;
  }
}
</style>
