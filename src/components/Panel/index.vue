<script lang="ts" setup>
import {ref, computed, onMounted, onBeforeUnmount} from 'vue';
import * as monaco from 'monaco-editor';
import {Marked} from 'marked';
import {markedHighlight} from 'marked-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-light.css';

const props = defineProps({
  fileCode: {
    type: String,
    default: '',
    required: true,
  },
});

const emit = defineEmits(['update:fileCode']);

// 同步滚动标志，防止循环触发
let isSyncing = false;

const codeRef = ref<HTMLDivElement | null>(null);
let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null;
// 初始化编辑器
const initEditor = () => {
  if (!codeRef.value) return;

  editorInstance = monaco.editor.create(codeRef.value, {
    value: props.fileCode,
    language: 'markdown',
    theme: 'vs',
  });

  // 监听代码变化事件
  editorInstance.onDidChangeModelContent(() => {
    const value = editorInstance?.getValue() || '';
    emit('update:fileCode', value);
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

const setEditorValue = (value: string) => {
  editorInstance?.setValue(value);
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
  return marked.parse(props.fileCode);
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

// 在组件挂载时初始化宽度
onMounted(() => {
  initEditor();
  viewRef.value?.addEventListener('scroll', onScroll);
});

onBeforeUnmount(() => {
  destroyEditor();
  viewRef.value?.removeEventListener('scroll', onScroll);
});

defineExpose({
  setEditorValue,
});
</script>

<template>
  <div class="split-container">
    <!-- 左侧面板 -->
    <div class="panel left-panel" ref="codeRef"></div>

    <!-- 拖拽条 -->
    <div class="resizer"></div>

    <!-- 右侧面板 -->
    <div class="panel right-panel" ref="viewRef" v-html="renderedMarkdown"></div>
  </div>
</template>

<style scoped>
/* 分屏容器 */
.split-container {
  display: flex;
  width: 100%;
  height: 100%; /* 占满整个视口高度 */
  overflow: hidden;
}

/* 面板样式 */
.panel {
  box-sizing: border-box;
  width: 50%;
  height: 100%;
  overflow: auto;
}
.right-panel {
  padding: 20px;
}

/* 拖拽条基础样式 */
.resizer {
  width: 1px;
  background-color: #dcdcdc;
  position: relative;
  z-index: 1;
  transition: background-color 0.2s, width 0.2s;
}
</style>
