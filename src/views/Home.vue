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
  import { useRouter } from 'vue-router'
  
  // 返回 router 实例。相当于在模板中使用 $router。必须在 setup() 中调用。
  const router = useRouter();

  const login = () => {
    router.push('/login')
  }
</script>
<style lang="scss" scoped>
</style>
