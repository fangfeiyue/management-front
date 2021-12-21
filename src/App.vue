<template>
  <!-- <router-view></router-view> -->
  <my-input
    v-model="userName"
    v-model:title="pageTitle"
    @handleSubmit="handleSubmit"
  />
</template>
<script>
import MyInput from "./components/MyInput.vue";
export default {
  components: { MyInput },
  data() {
    return {
      userName: "f",
      pageTitle: "home",
    };
  },
  methods: {
    handleSubmit(val) {
      console.log(val);
      console.log(this.userName);
    },
  },
};
</script>