<template>
  <el-tooltip class="block" effect="light" placement="top-start">
    <!-- 多行 -->
    <div slot="content">
      <!-- 提示信息 -->
      <slot name="info" />
    </div>
    <!-- 文本 -->
    <slot name="btn" />
  </el-tooltip>
</template>