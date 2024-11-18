<script setup lang="ts"></script>
<template>
  <div class="md-header">
    <div class="left">左侧</div>
    <div class="flex-item-1"></div>
    <div class="right">右侧</div>
  </div>
</template>

<style lang="scss" scoped>
.md-header {
  height: 100%;
  display: flex;
  align-items: center;
  .left {
  }
  .flex-item-1 {
    flex: 1;
  }

  .right {
  }
}
</style>
