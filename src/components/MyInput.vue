<template>
  <el-input :modelValue="userName" @update:modelValue="handleInput" />
  <button @click="handleSubmit">点击测试</button>
</template>
<script>
import { ref } from "@vue/reactivity";
export default {
  name: "VInput",
  props: {
    title: String,
    modelValue: String,
  },
  setup(props, context) {
    const userName = ref(props.modelValue);
    const handleInput = (val) => {
      console.log(val);
      userName.value = val;
      context.emit("update:modelValue", val);
    };
    const handleSubmit = () => {
      context.emit("handleSubmit", userName);
    };
    return {
      userName,
      handleInput,
      handleSubmit,
    };
  },
};
</script>