<script setup lang="ts">
import {ref, watch} from 'vue';
import 'highlight.js/styles/atom-one-light.css';
import rehypeFormat from 'rehype-format';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';
import remarkDirective from 'remark-directive';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import {unified} from 'unified';
import html2pdf from 'html2pdf.js';

const props = defineProps({
  code: {
    type: String,
    default: '',
    required: true,
  },
});

const preViewRef = ref<HTMLDivElement | null>(null);

const processor = unified()
  .use(remarkParse)
  .use(remarkDirective)
  .use(remarkFrontmatter)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype, {allowDangerousHtml: true})
  .use(rehypeRaw)
  .use(rehypeFormat)
  .use(rehypeSanitize)
  .use(rehypeStringify)
  .use(rehypeHighlight);

watch(
  () => props.code,
  async (val) => {
    const file = await processor.process(val);
    if (preViewRef.value) {
      preViewRef.value.innerHTML = String(file.value);
    }
  },
  {immediate: true}
);

const exportPDF = async () => {
  const options = {
    margin: [10, 10, 10, 10], // 设置边距，顺序为 [上, 左, 下, 右]，单位为 mm
    filename: 'document.pdf', // 导出的文件名
    image: {type: 'jpeg', quality: 1.0}, // 图片格式和质量
    html2canvas: {
      scale: 3, // 提高导出清晰度（默认 1）
      useCORS: true, // 允许跨域加载图片
    },
    jsPDF: {
      unit: 'mm', // 单位（'pt', 'mm', 'cm', 'in'）
      format: 'a4', // 页面格式（如 'a3', 'a4', 'letter'）
      orientation: 'portrait', // 页面方向：'portrait'（竖版）或 'landscape'（横版）
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'], // 避免跨页
        before: '.page-break', // 在这些元素之前分页
        after: '.page-break', // 在这些元素之后分页
        avoid: 'p, h1, h2, h3, h4, h5, h6, table, pre, code, li', // 避免这些元素被分割
      },
    },
  };
  return html2pdf().from(preViewRef.value).set(options).save();
};

const exportPNG = () => {};

defineExpose({
  exportPDF,
  exportPNG,
});
</script>
<template>
  <div class="md-view" ref="preViewRef"></div>
</template>

<style lang="less" scoped>
.md-view {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 6px 4px rgba(0, 0, 0, 0.1);
  padding: 1px 20px 10px 20px;
}
</style>
