<script setup lang="ts">
import SplitPanel from '@/components/SplitPanel/index.vue';
</script>
<template>
  <div class="md-editor">
    <split-panel>
      <template #left> 左边 </template>
      <template #right> 右边 </template>
    </split-panel>
  </div>
</template>

<style lang="less" scoped>
.md-editor {
  height: 100%;
  width: 100%;
  border: 2px solid #ccc;
  border-radius: 5px;
}
</style>
