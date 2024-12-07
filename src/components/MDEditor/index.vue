<script setup lang="ts">
import SplitPanel from '@/components/SplitPanel/index.vue';
import {reactive, ref, computed, onMounted, onBeforeUnmount, nextTick} from 'vue';
import {UploadOutlined, QuestionCircleOutlined, EyeOutlined, CloseCircleOutlined, VerticalAlignBottomOutlined} from '@ant-design/icons-vue';
import * as monaco from 'monaco-editor';
import {Marked} from 'marked';
import {markedHighlight} from 'marked-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-light.css';

const handleUploadFile = () => {
  invisibleInputRef.value?.click();
};
const handleFile = (e: Event) => {
  console.log((e.target as HTMLInputElement).files);
};
const handleQuestion = () => {
  grammarTip.value = true;
};
const handleClose = () => {};
const handlePreview = () => {
  previewModal.value = true;
};
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

const frontImages = reactive(images.slice(0, 4));
const backImages = reactive(images[4]);

const grammarTip = ref(false);
const previewModal = ref(false);
const invisibleInputRef = ref<HTMLInputElement | null>(null);

const fileCode = ref('');
</script>
<template>
  <div class="md-editor">
    <div class="tool-box">
      <!-- 文件上传、写法提示、检测到图片复制、清空、预览 -->
      <a-tooltip v-for="item in frontImages" :key="item.image" :title="item.tip" placement="top">
        <component :is="item.image" @click="item.handleFunc" class="icon" />
      </a-tooltip>
      <div class="line"></div>
      <a-dropdown placement="bottom" :arrow="{pointAtCenter: true}">
        <component :is="backImages.image" class="icon" />
        <template #overlay>
          <a-menu>
            <a-menu-item> 导出为PDF </a-menu-item>
            <a-menu-item> 导出为图片 </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <split-panel class="editor-panel" v-model:file-code="fileCode"> </split-panel>
    <a-drawer title="Markdown语法规则" placement="right" :closable="false" :open="grammarTip" @close="grammarTip = false">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-drawer>
    <a-modal v-model:open="previewModal" title="Markdown预览" width="800px" ok-text="确认" cancel-text="取消" @ok="previewModal = false">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>
    <input ref="invisibleInputRef" type="file" style="display: none" accept=".md" @change="handleFile" />
  </div>
</template>

<style lang="less" scoped>
@import 'github-markdown-css';
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
    width: 100%;
    height: calc(100% - 40px);
    display: flex;
    overflow: hidden;
  }
}

.markdown-body {
  background-color: #ffffff !important; /* 强制固定为白色背景 */
  color: #000000; /* 确保文字颜色适配白色背景 */
}
</style>
