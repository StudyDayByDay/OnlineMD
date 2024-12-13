<script setup lang="ts">
import Panel from '@/components/Panel/index.vue';
import MDView from '@/components/MDView/index.vue';
import {reactive, ref, createVNode} from 'vue';
import {UploadOutlined, QuestionCircleOutlined, EyeOutlined, CloseCircleOutlined, InfoCircleFilled} from '@ant-design/icons-vue';
import {message, Modal} from 'ant-design-vue';
import info from './info.ts';

const handleUploadFile = () => {
  invisibleInputRef.value?.click();
};
const handleFile = (e: Event) => {
  console.log((e.target as HTMLInputElement).files);
  const file = (e.target as HTMLInputElement).files?.[0];
  Modal.confirm({
    title: '检测到有文件导入，是否覆盖当前内容？',
    icon: createVNode(InfoCircleFilled),
    content: createVNode('div', {style: 'color:red;'}, '请注意：点击确定会覆盖编辑区内容'),
    okText: '确认',
    cancelText: '取消',
    onOk() {
      file?.text().then((res) => {
        fileCode.value = res;
        panelRef.value?.setEditorValue(res);
        message.success('文件导入成功');
      });
    },
    onCancel() {
      message.info('已取消');
    },
  });
};
const handleQuestion = () => {
  grammarTip.value = true;
};
const handleClose = () => {
  if (fileCode.value) {
    fileCode.value = '';
    panelRef.value?.setEditorValue('');
    message.success('面板清除成功');
  } else {
    message.warning('编辑区无内容，无需清除');
  }
};
const handlePreview = () => {
  if (fileCode.value) {
    previewModal.value = true;
  } else {
    message.warning('编辑区无内容！');
  }
};
const handleExportPDF = () => {
  if (fileCode.value) {
    pdfLoading.value = true;
    mdViewRef.value?.exportPDF().then(() => {
      pdfLoading.value = false;
    });
  } else {
    message.warning('编辑区无内容！');
  }
  // message.info('功能开发中，敬请期待');
};
const handleExportMD = () => {
  if (fileCode.value) {
    imgLoading.value = true;
    mdViewRef.value?.handleExportMD();
    imgLoading.value = false;
  } else {
    message.warning('编辑区无内容！');
  }
};

const images = [
  {
    image: QuestionCircleOutlined,
    handleFunc: handleQuestion,
    tip: '写法提示',
  },
  {
    image: UploadOutlined,
    handleFunc: handleUploadFile,
    tip: '导入 Markdown 文件',
  },
  {
    image: CloseCircleOutlined,
    handleFunc: handleClose,
    tip: '清空编辑区',
  },
  {
    image: EyeOutlined,
    handleFunc: handlePreview,
    tip: '预览和导出',
  },
];

const frontImages = reactive(images.slice(0, 3));
const backImage = reactive(images[3]);

const grammarTip = ref(false);
const previewModal = ref(false);
const invisibleInputRef = ref<HTMLInputElement | null>(null);

const fileCode = ref(info);
const panelRef = ref<InstanceType<typeof Panel> | null>(null);
const mdViewRef = ref<InstanceType<typeof MDView> | null>(null);
const pdfLoading = ref(false);
const imgLoading = ref(false);
</script>
<template>
  <div class="md-editor">
    <div class="tool-box">
      <!-- 文件上传、写法提示、检测到图片复制、清空、预览 -->
      <a-tooltip v-for="item in frontImages" :key="item.image" :title="item.tip" placement="top">
        <component :is="item.image" @click="item.handleFunc" class="icon" />
      </a-tooltip>
      <div class="line"></div>
      <a-tooltip :title="backImage.tip" placement="top">
        <component :is="backImage.image" @click="backImage.handleFunc" class="icon" style="font-size: 25px" />
      </a-tooltip>
    </div>
    <Panel class="editor-panel" ref="panelRef" v-model:file-code="fileCode"> </Panel>
    <a-drawer title="Markdown常用语法规则" placement="right" size="large" :closable="false" :open="grammarTip" @close="grammarTip = false">
      <div class="markdown-guide">
        <!-- 标题 -->
        <div class="syntax-item">
          <h3>标题 (Headers)</h3>
          <div class="example">
            # 一级标题<br />
            ## 二级标题<br />
            ### 三级标题<br />
            #### 四级标题<br />
            ##### 五级标题<br />
            ###### 六级标题
          </div>
          <div class="description">使用 <code>#</code> 表示标题等级，一级到六级标题分别对应 <code>#</code> 到 <code>######</code>。</div>
        </div>

        <!-- 段落与换行 -->
        <div class="syntax-item">
          <h3>段落与换行 (Paragraphs & Line Breaks)</h3>
          <div class="example">
            段落之间空一行。<br /><br />
            换行请在行尾添加两个空格。 这是一段换行后的内容。
          </div>
          <div class="description">段落之间需要空一行，行内换行则在行尾添加两个空格。</div>
        </div>

        <!-- 强调 -->
        <div class="syntax-item">
          <h3>强调 (Emphasis)</h3>
          <div class="example">
            *斜体* 或 _斜体_<br />
            **加粗** 或 __加粗__<br />
            ***斜体加粗*** 或 ___斜体加粗___
          </div>
          <div class="description">使用 <code>*</code> 或 <code>_</code> 包裹文本表示斜体，加倍表示加粗，两者结合表示斜体加粗。</div>
        </div>

        <!-- 列表 -->
        <div class="syntax-item">
          <h3>列表 (Lists)</h3>
          <div class="example">
            无序列表：<br />
            - 项目 1<br />
            - 项目 2<br />
            - 项目 3<br /><br />
            有序列表：<br />
            1. 项目 1<br />
            2. 项目 2<br />
            3. 项目 3
          </div>
          <div class="description">无序列表使用 <code>-</code> 或 <code>*</code> 创建，有序列表使用数字+点 (如 <code>1.</code>) 创建。</div>
        </div>

        <!-- 链接 -->
        <div class="syntax-item">
          <h3>链接 (Links)</h3>
          <div class="example">
            [百度](https://www.baidu.com)<br />
            [Google](https://www.google.com "Google 搜索")
          </div>
          <div class="description">使用 <code>[显示文本](链接地址)</code> 创建链接。可在链接地址后添加鼠标悬停提示。</div>
        </div>

        <!-- 图片 -->
        <div class="syntax-item">
          <h3>图片 (Images)</h3>
          <div class="example">
            ![图片描述](https://example.com/image.jpg)<br />
            ![Markdown Logo](https://markdown-here.com/img/icon256.png)
          </div>
          <div class="description">使用 <code>![描述文本](图片地址)</code> 插入图片。</div>
        </div>

        <!-- 引用 -->
        <div class="syntax-item">
          <h3>引用 (Blockquotes)</h3>
          <div class="example">
            > 一级引用<br />
            >> 二级引用<br />
            >>> 三级引用
          </div>
          <div class="description">使用 <code>&gt;</code> 表示引用，可嵌套使用多个 <code>&gt;</code> 创建嵌套引用。</div>
        </div>

        <!-- 代码块 -->
        <div class="syntax-item">
          <h3>代码块 (Code Blocks)</h3>
          <div class="example">
            行内代码：<code>`代码`</code><br /><br />
            块代码：<br />
            ```<br />
            function hello() {<br />
            console.log('Hello, Markdown!');<br />
            }<br />
            ```
          </div>
          <div class="description">使用单个反引号 <code>`</code> 表示行内代码，使用三个反引号 <code>```</code> 表示代码块。</div>
        </div>

        <!-- 表格 -->
        <div class="syntax-item">
          <h3>表格 (Tables)</h3>
          <div class="example">
            | 标题 1 | 标题 2 |<br />
            | -------- | -------- |<br />
            | 内容 1 | 内容 2 |
          </div>
          <div class="description">使用 <code>|</code> 分隔内容，<code>-</code> 表示表头与内容的分割线。</div>
        </div>

        <!-- 注脚 -->
        <div class="syntax-item">
          <h3>注脚 (Footnotes)</h3>
          <div class="example">
            这是一个带注脚的句子[^1]。<br /><br />
            [^1]: 这是注脚内容。
          </div>
          <div class="description">使用 <code>[^标签]</code> 添加注脚，注脚内容需在文档末尾定义。</div>
        </div>

        <!-- 任务列表 -->
        <div class="syntax-item">
          <h3>任务列表 (Task Lists)</h3>
          <div class="example">
            - [x] 已完成的任务<br />
            - [ ] 待完成的任务
          </div>
          <div class="description">使用 <code>- [ ]</code> 创建待办项，使用 <code>- [x]</code> 表示已完成项。</div>
        </div>

        <!-- 分隔线 -->
        <div class="syntax-item">
          <h3>分隔线 (Horizontal Rules)</h3>
          <div class="example">
            ---<br />
            ***<br />
            ___
          </div>
          <div class="description">使用三个 <code>-</code>、<code>*</code> 或 <code>_</code> 创建分隔线。</div>
        </div>

        <!-- HTML 支持 -->
        <div class="syntax-item">
          <h3>HTML 支持 (HTML Support)</h3>
          <div class="example">
            <b>加粗</b><br />
            <i>斜体</i><br />
            <u>下划线</u>
          </div>
          <div class="description">Markdown 支持直接嵌入 HTML 标签。</div>
        </div>
      </div>
    </a-drawer>
    <a-modal v-model:open="previewModal" width="70%" ok-text="确认" cancel-text="取消" @ok="previewModal = false">
      <template #title>
        <div class="modal-title">
          <div>Markdown预览</div>
          <div>
            <a-button style="margin-right: 15px" type="primary" size="small" :loading="imgLoading" @click="handleExportMD">导出为MD文件</a-button>
            <a-button type="primary" size="small" :loading="pdfLoading" @click="handleExportPDF">导出为PDF</a-button>
          </div>
        </div>
      </template>
      <MDView ref="mdViewRef" :code="fileCode" />
    </a-modal>
    <input ref="invisibleInputRef" type="file" style="display: none" accept=".md" @change="handleFile" />
  </div>
</template>

<style lang="less" scoped>
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

.modal-title {
  width: 100%;
  padding-right: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.markdown-guide {
  max-width: 900px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
.syntax-item {
  margin-bottom: 40px;
}
.syntax-item h3 {
  color: #296bd3;
  margin: 0 0 10px;
  font-size: 20px;
}
.syntax-item .example {
  background-color: #f3f3f3;
  padding: 10px;
  border-radius: 4px;
  font-family: Consolas, monospace;
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
  white-space: pre-wrap; /* 保留换行格式 */
}
.syntax-item .description {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
}
</style>
