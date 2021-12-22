<template>
  <!-- <el-form-item :label="item.label" :prop="item.model">
    <el-input
      v-if="item.type === 'input'"
      :placeholder="item.placeholder"
    ></el-input>
    <el-select v-if="item.type === 'select'" v-model="item.state">
      <el-option
        v-for="option in item.options"
        :key="option.label"
        v-bind="option"
      ></el-option>
    </el-select>
  </el-form-item> -->

  <el-form-item :prop="item.model">
    <el-input v-if="item.type === 'input'" v-bind="$attrs"></el-input>
    <el-select
      v-if="item.type === 'select'"
      v-model="item.model"
      v-bind="$attrs"
    >
      <el-option
        v-for="option in item.options"
        :key="option.value"
        v-bind="option"
      ></el-option>
    </el-select>
  </el-form-item>
</template>
<script>
export default {
  name: "FormItem",
  // 没有使用到 modelValue 的时候不要写它，有可能会出现问题，导致表单无法输入
  // props: ["item", "modelValue"],
  props: ["item"],
};
</script>