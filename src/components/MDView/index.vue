<script setup lang="ts">
import {computed, ref} from 'vue';
import {Marked} from 'marked';
import {markedHighlight} from 'marked-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-light.css';
import html2canvas from 'html2canvas';
import {jsPDF} from 'jspdf';

const props = defineProps({
  code: {
    type: String,
    default: '',
    required: true,
  },
});

const preViewRef = ref(null);

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

const exportPDF = async () => {
  // 使用 html2canvas 转换为 Canvas
  const canvas = await html2canvas(preViewRef.value!, {
    scale: 2, // 提高清晰度
    useCORS: true, // 允许跨域图片
    allowTaint: false, // 防止污染画布
  });

  const imgData = canvas.toDataURL('image/png'); // 转换为图片数据
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save('example.pdf');
};

const exportPNG = () => {};

defineExpose({
  exportPDF,
  exportPNG,
});
</script>
<template>
  <div class="md-view" ref="preViewRef" v-html="renderedMarkdown"></div>
</template>

<style lang="less" scoped>
.md-view {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 6px 4px rgba(0, 0, 0, 0.1);
  padding: 1px 20px 10px 20px;
}
</style>
