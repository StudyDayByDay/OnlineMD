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
    required: true,
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

const renderedMarkdown = computed(() => {
  return marked.parse(props.code);
});
</script>
<template>
  <div class="md-view" v-html="renderedMarkdown"></div>
</template>

<style lang="less" scoped>
.md-view {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 6px 4px rgba(0, 0, 0, 0.1);
  padding: 1px 20px 10px 20px;
}
</style>
