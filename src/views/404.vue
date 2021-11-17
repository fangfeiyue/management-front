<template>
  <div>
    <div>404 Not Fund</div>
    <el-button @click="goHome">返回首页</el-button>
  </div>
</template>
<script>
export default {
  name: "404",
  methods: {
    goHome() {
      this.$router.replace("/");
    },
  },
};
</script>