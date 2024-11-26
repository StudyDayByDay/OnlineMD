<script setup lang="ts">
import {onMounted, onBeforeUnmount, ref} from 'vue';
import * as monaco from 'monaco-editor';

const props = defineProps({
  // 代码内容
  code: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:code', 'scroll']);

const isSyncing = ref(false); // 防止循环触发

const editorContainer = ref<HTMLDivElement | null>(null);
let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null;

// 初始化编辑器
const initEditor = () => {
  if (!editorContainer.value) return;

  editorInstance = monaco.editor.create(editorContainer.value, {
    value: props.code,
    language: 'markdown',
    theme: 'vs', // 黑色主题
    automaticLayout: true, // 自动布局
  });

  // 监听代码变化事件
  editorInstance.onDidChangeModelContent(() => {
    const value = editorInstance?.getValue() || '';
    emit('update:code', value); // 将变化同步到父组件
  });

  // 监听滚动事件
  editorInstance.onDidScrollChange(() => {
    if (isSyncing.value) return; // 如果是同步操作，跳过
    const scrollTop = editorInstance?.getScrollTop();
    emit('scroll', scrollTop); // 向父组件传递滚动位置
  });
};

// 销毁编辑器实例
const destroyEditor = () => {
  editorInstance?.dispose();
};

// 暴露方法：获取当前滚动位置
const getScrollTop = () => {
  return editorInstance?.getScrollTop() || 0;
};

// 暴露方法：设置滚动位置
const setScrollTop = (scrollTop: number) => {
  if (editorInstance) {
    isSyncing.value = true; // 设置同步标志
    editorInstance.setScrollTop(scrollTop);
    setTimeout(() => (isSyncing.value = false), 0); // 短时间后重置同步标志
  }
};

onMounted(() => {
  initEditor();
});

onBeforeUnmount(() => {
  destroyEditor();
});

defineExpose({
  getScrollTop,
  setScrollTop,
});
</script>

<template>
  <div class="code-panel" ref="editorContainer"></div>
</template>
<style lang="less" scoped>
.code-panel {
  width: 100%;
  height: 100%;
}
</style>
