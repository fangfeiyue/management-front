<template>
  <div>
    <p>这里是首页</p>
    <button @click="login">登录</button>
    <div>
      <router-link to="/home/recommend">推荐</router-link>
      <router-link to="/home/hot">热搜</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>
<script setup>
//   import { onMounted } from '@vue/runtime-core';
//   import { useRouter } from 'vue-router'

//   // 返回 router 实例。相当于在模板中使用 $router。必须在 setup() 中调用。
//   const router = useRouter();

//   const login = () => {
//     router.push('/login')
//   }
</script>
<script>
export default {
  mounted() {
    // this.$request({
    //   method: 'get',
    //   url: '/login',
    //   data: {
    //     name: 'f'
    //   }
    // }).then(res => {
    //   console.log(res)
    // }).catch(err => {
    //   console.log(err)
    // });

    this.$request.get("/login", { name: "jack" }).catch(err => {
      console.log(err)
    });
  },
};
</script>
<style lang="scss" scoped>
</style>
