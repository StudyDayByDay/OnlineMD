<script setup lang="ts">
import SplitPanel from '@/components/SplitPanel/index.vue';
import CodePanel from '@/components/CodePanel/index.vue';
import ViewPanel from '@/components/ViewPanel/index.vue';
import {reactive} from 'vue';
import {UploadOutlined, QuestionCircleOutlined, EyeOutlined, CloseCircleOutlined, VerticalAlignBottomOutlined} from '@ant-design/icons-vue';

const handleUploadFile = () => {};
const handleQuestion = () => {};
const handleClose = () => {};
const handlePreview = () => {};
const handleExport = () => {};

const images = [
  {
    image: UploadOutlined,
    handleFunc: handleUploadFile,
    tip: '上传 Markdown 文件',
  },
  {
    image: QuestionCircleOutlined,
    handleFunc: handleQuestion,
    tip: '查看 Markdown 写法提示',
  },
  {
    image: CloseCircleOutlined,
    handleFunc: handleClose,
    tip: '清空 Markdown 编辑区',
  },
  {
    image: EyeOutlined,
    handleFunc: handlePreview,
    tip: '预览 Markdown 文件',
  },
  {
    image: VerticalAlignBottomOutlined,
    handleFunc: handleExport,
    tip: '导出文件',
  },
];

const frontImages = reactive(images.slice(0, 3));
const backImages = reactive(images.slice(3));
</script>
<template>
  <div class="md-editor">
    <div class="tool-box">
      <!-- 文件上传、写法提示、检测到图片复制、清空、预览 -->
      <a-tooltip v-for="item in frontImages" :key="item.image" :title="item.tip" placement="top">
        <component :is="item.image" @click="item.handleFunc" class="icon" />
      </a-tooltip>
      <div class="line"></div>
      <a-tooltip v-for="item in backImages" :key="item.image" :title="item.tip" placement="top">
        <component :is="item.image" @click="item.handleFunc" class="icon" />
      </a-tooltip>
    </div>
    <split-panel class="editor-panel">
      <template #left>
        <code-panel />
      </template>
      <template #right>
        <view-panel />
      </template>
    </split-panel>
  </div>
</template>

<style lang="less" scoped>
.md-editor {
  height: 100%;
  width: 100%;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
  .tool-box {
    height: 40px;
    padding-left: 10px;
    display: flex;
    align-items: center;
    gap: 15px;
    border-bottom: 1px solid #dcdcdc;
    background-color: #f3f3f3;
    .icon {
      font-size: 20px;
      cursor: pointer;
      color: #586069;
      &:hover {
        color: #0f65f0;
      }
    }
    .line {
      width: 1px;
      height: 20px;
      background-color: #dcdcdc;
    }
  }
  .editor-panel {
    height: calc(100% - 40px);
  }
}
</style>
