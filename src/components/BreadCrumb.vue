<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item v-for="(item, index) in breadList" :key="item.path">
      <router-link to="/home/welcome" v-if="index === 0">{{item.meta.title}}</router-link>
      <span v-else>{{item.meta.title}}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script>
export default {
  computed: {
    breadList() {
      return this.$route.matched;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>