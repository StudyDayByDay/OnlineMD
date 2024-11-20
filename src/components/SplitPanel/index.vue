<template>
  <div class="split-container" ref="splitContainer">
    <!-- 左侧面板 -->
    <div class="panel left-panel" :style="{width: leftPanelWidth + 'px'}">
      <slot name="left" />
    </div>

    <!-- 拖拽条 -->
    <div class="resizer" :class="{active: isResizing, hover: isHovering}" @mousedown="startResizing" @mouseenter="isHovering = true" @mouseleave="isHovering = false"></div>

    <!-- 右侧面板 -->
    <div class="panel right-panel" :style="{width: `calc(100% - ${leftPanelWidth}px)`}">
      <slot name="right" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted} from 'vue';

const props = defineProps({
  minWidth: {
    type: Number,
    default: 200,
  },
});

const splitContainer = ref<HTMLDivElement | null>(null); // 分屏容器的引用
const leftPanelWidth = ref<number>(0); // 左侧面板的宽度
const isResizing = ref<boolean>(false); // 是否正在拖拽
const isHovering = ref<boolean>(false); // 鼠标是否悬停在拖拽条上
let containerLeft = 0; // 容器左侧的偏移量

/**
 * 初始化面板宽度
 */
const initializeWidths = (): void => {
  const containerWidth = splitContainer.value?.offsetWidth || 0;
  leftPanelWidth.value = containerWidth / 2; // 设置为容器宽度的一半
};

/**
 * 开始拖拽事件
 * @param event - 鼠标事件对象
 */
const startResizing = (event: MouseEvent): void => {
  isResizing.value = true;
  containerLeft = splitContainer.value?.getBoundingClientRect().left || 0;

  // 添加全局事件监听器
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
};

/**
 * 鼠标移动事件处理
 * @param e - 鼠标事件对象
 */
const onMouseMove = (e: MouseEvent): void => {
  if (isResizing.value) {
    const newWidth = Math.max(e.clientX - containerLeft, props.minWidth); // 最小宽度为 100px
    const containerWidth = splitContainer.value?.offsetWidth || 0; // 父容器宽度
    leftPanelWidth.value = Math.min(newWidth, containerWidth - props.minWidth); // 最大宽度限制
  }
};

/**
 * 鼠标释放事件处理
 */
const onMouseUp = (): void => {
  isResizing.value = false;
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
};

// 在组件挂载时初始化宽度
onMounted(() => {
  initializeWidths();
});
</script>

<style scoped>
/* 分屏容器 */
.split-container {
  display: flex;
  width: 100%;
  height: 100%; /* 占满整个视口高度 */
  overflow: hidden;
  user-select: none; /* 禁止选中文字 */
}

/* 面板样式 */
.panel {
  overflow: auto;
  padding: 20px;
  box-sizing: border-box;
}

/* 拖拽条基础样式 */
.resizer {
  width: 2px;
  background-color: #ccc;
  cursor: col-resize; /* 鼠标指针变为左右拖拽 */
  position: relative;
  z-index: 1;
  transition: background-color 0.2s, width 0.2s;
}

/* 鼠标悬停时样式 */
.resizer.hover {
  background-color: #296bd3;
  width: 5px;
}

/* 拖拽时样式 */
.resizer.active {
  background-color: #296bd3;
  width: 5px; /* 宽度保持一致 */
}
</style>
