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

const emit = defineEmits(['update:code']);

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
};

// 销毁编辑器实例
const destroyEditor = () => {
  editorInstance?.dispose();
};

onMounted(() => {
  initEditor();
});

onBeforeUnmount(() => {
  destroyEditor();
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
