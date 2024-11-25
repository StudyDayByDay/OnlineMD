<script setup lang="ts">
import {computed} from 'vue';
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
</script>

<template>
  <div class="view-panel markdown-body" v-html="renderedMarkdown"></div>
</template>
<style lang="less" scoped>
@import 'github-markdown-css';
.view-panel {
  width: 100%;
  height: 100%;
  padding: 0 20px;
}
</style>
