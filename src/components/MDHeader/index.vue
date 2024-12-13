<script setup lang="ts">
import markdown from '@/assets/images/markdown.svg';
import github from '@/assets/images/github.svg';
</script>
<template>
  <div class="md-header">
    <div class="left" href="#">
      <img :src="markdown" alt="在线Markdown编辑器" />
      <strong>onlineMD - 在线 Markdown 编辑器</strong>
    </div>
    <div class="flex-item-1"></div>
    <div class="right">
      <a-tooltip placement="bottom">
        <template #title>
          <span>前往项目github</span>
        </template>
        <a href="https://github.com/StudyDayByDay/OnlineMD" target="_blank">
          <img :src="github" alt="github" />
        </a>
      </a-tooltip>
    </div>
  </div>
</template>

<style lang="less" scoped>
.md-header {
  height: 100%;
  display: flex;
  align-items: center;
  .left {
    display: flex;
    align-items: center;
    gap: 20px;
    font-size: 18px;
    img {
      width: 60px;
    }
  }
  .flex-item-1 {
    flex: 1;
  }

  .right {
    img {
      width: 22px;
    }
  }
}
</style>
