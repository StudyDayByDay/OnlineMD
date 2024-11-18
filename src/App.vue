<script setup lang="ts">
import MDHeader from '@/components/MDHeader/index.vue';
import MDEditor from '@/components/MDEditor/index.vue';
</script>

<template>
  <div class="online-md">
    <div class="online-md_header">
      <div class="head">
        <MDHeader />
      </div>
    </div>
    <div class="online-md_content">
      <MDEditor />
    </div>
  </div>
</template>

<style scoped lang="scss">
.online-md {
  height: 100%;
  width: 100%;
  &_header {
    height: 60px;
    width: 100%;
    box-shadow: 0 0 6px 3px rgba(0, 0, 0, 0.1);
    .head {
      height: 100%;
      width: 80%;
      margin: auto;
      min-width: 1000px;
    }
  }
  &_content {
    height: calc(100% - 60px);
    width: 80%;
    margin: auto;
  }
}
</style>
