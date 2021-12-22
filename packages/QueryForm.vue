<template>
  <el-form ref="queryForm" :inline="true" :model="queryModel">
    <template v-for="(item, index) in form" :key="index">
      <form-item :item="item" v-bind="item" v-model="queryModel[item.model]" />
    </template>
    <el-form-item>
      <el-button type="primary" @click="handleQuery">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import FormItem from "./FormItem.vue";
import { getCurrentInstance, reactive } from "@vue/runtime-core";
export default {
  name: "QueryForm",
  props: ["form", "modelValue"],
  emits: ["update:modelValue", "handleQuery"],
  components: { FormItem },
  setup(props, context) {
    const { ctx } = getCurrentInstance();
    const form = props.form;
    const queryModel = reactive({
      ...props.modelValue,
    });
    const handleReset = () => {
      ctx.$refs["queryForm"].resetFields();
    };

    const handleQuery = () => {
      // 改变 v-model 绑定的值
      context.emit("update:modelValue", { ...queryModel });

      // 向外面的函数传递值
      context.emit("handleQuery", { ...queryModel });
    };

    console.log("queryModel", queryModel);
    return {
      form,
      queryModel,
      handleReset,
      handleQuery,
    };
  },
};
</script>