<script setup lang="ts">
import {computed, ref, onMounted, onBeforeUnmount} from 'vue';
import {Marked} from 'marked';
import {markedHighlight} from 'marked-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-light.css';

const props = defineProps({
  code: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['scroll']);

const viewPanel = ref<HTMLDivElement>();
const isSyncing = ref(false); // 防止循环触发

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

// 使用 marked 将 Markdown 转为 HTML
const renderedMarkdown = computed(() => {
  return marked.parse(props.code);
});

// 获取滚动位置
const getScrollTop = () => {
  return viewPanel.value?.scrollTop || 0;
};

// 设置滚动位置
const setScrollTop = (scrollTop: number) => {
  if (viewPanel.value) {
    isSyncing.value = true; // 设置同步标志
    viewPanel.value.scrollTop = scrollTop;
    setTimeout(() => (isSyncing.value = false), 0); // 短时间后重置同步标志
  }
};

// 监听滚动事件
const onScroll = () => {
  if (isSyncing.value) return; // 如果是同步操作，跳过
  const scrollTop = getScrollTop();
  emit('scroll', scrollTop); // 向父组件传递滚动位置
};

onMounted(() => {
  console.log(viewPanel.value, 'scroll111');
  viewPanel.value?.addEventListener('scroll', onScroll);
});

onBeforeUnmount(() => {
  viewPanel.value?.removeEventListener('scroll', onScroll);
});

defineExpose({
  getScrollTop,
  setScrollTop,
});
</script>

<template>
  <div class="view-panel markdown-body" ref="viewPanel" v-html="renderedMarkdown"></div>
</template>
<style lang="less" scoped>
@import 'github-markdown-css';
.view-panel {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  overflow: auto;
}
</style>
