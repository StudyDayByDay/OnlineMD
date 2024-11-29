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

// 同步滚动标志，防止循环触发
let isSyncing = false;
const fileCode = ref('');

const codeRef = ref<HTMLDivElement | null>(null);
let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null;
// 初始化编辑器
const initEditor = () => {
  if (!codeRef.value) return;

  editorInstance = monaco.editor.create(codeRef.value, {
    value: fileCode.value,
    language: 'markdown',
    theme: 'vs',
    automaticLayout: true, // 自动布局
  });

  // 监听代码变化事件
  editorInstance.onDidChangeModelContent(() => {
    const value = editorInstance?.getValue() || '';
    fileCode.value = value;
  });

  // 监听滚动事件
  editorInstance.onDidScrollChange(() => {
    if (isSyncing) return;
    isSyncing = true;
    if (editorInstance && viewRef.value) {
      const scrollTop = editorInstance?.getScrollTop();
      const scrollHeight = editorInstance?.getScrollHeight();
      const clientHeight = editorInstance?.getDomNode()?.clientHeight || 1; // 可视区域高度
      const scrollPercentage = scrollTop / (scrollHeight - clientHeight); // 计算滚动百分比
      viewRef.value.scrollTop = scrollPercentage * (viewRef.value.scrollHeight - viewRef.value.clientHeight);
    }
    isSyncing = false;
  });
};

// 销毁编辑器实例
const destroyEditor = () => {
  editorInstance?.dispose();
};

const viewRef = ref<HTMLDivElement | null>(null);
const marked = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, {language}).value;
    },
  })
);

const renderedMarkdown = computed(() => {
  return marked.parse(fileCode.value);
});

const onScroll = () => {
  if (isSyncing) return;

  isSyncing = true; // 设置同步标志

  if (editorInstance && viewRef.value) {
    const scrollTop = viewRef.value.scrollTop;
    const scrollHeight = viewRef.value.scrollHeight;
    const clientHeight = viewRef.value.clientHeight;

    const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
    const editorScrollHeight = editorInstance.getScrollHeight();
    const editorClientHeight = editorInstance.getDomNode()?.clientHeight || 1;

    editorInstance.setScrollTop(scrollPercentage * (editorScrollHeight - editorClientHeight));
  }
  isSyncing = false; // 恢复同步标志
};

onMounted(() => {
  initEditor();
  viewRef.value?.addEventListener('scroll', onScroll);
});

onBeforeUnmount(() => {
  destroyEditor();
  viewRef.value?.removeEventListener('scroll', onScroll);
});
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
    <split-panel class="editor-panel">
      <template #left>
        <div class="code-panel" ref="codeRef"></div>
      </template>
      <template #right>
        <div class="view-panel markdown-body" ref="viewRef" v-html="renderedMarkdown"></div>
      </template>
    </split-panel>
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
    height: calc(100% - 40px);
  }
}

.markdown-body {
  background-color: #ffffff !important; /* 强制固定为白色背景 */
  color: #000000; /* 确保文字颜色适配白色背景 */
}

.code-panel {
  width: 100%;
  height: 100%;
  will-change: scroll-position;
}
.view-panel {
  width: 100%;
  height: 100%;
  padding: 20px;
  will-change: scroll-position;
  overflow: auto;
  transform: translateZ(10px);
}
</style>
