<template>
  <div class="login-container">
    <div class="modal">
      <el-form ref="loginForm" :model="user" status-icon :rules="rules">
        <div class="title">火星</div>
        <el-form-item prop="userName">
          <el-input
            type="text"
            v-model="user.userName"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="user.password"
            prefix-icon="el-icon-view"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="login" type="primary" class="btn-login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
      <span class="nav-item">你好</span>
    </div>
  </div>
</template>
<script>
import utils from "../utils/utils";
import storage from "../utils/storage";
export default {
  name: "login",
  data() {
    return {
      user: {
        userName: "f",
        password: "123456",
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async login() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          this.$api.login(this.user).then(async (res) => {
            this.$store.commit("saveUserInfo", res);
            await this.loadAsyncRoutes();
            this.$router.replace("/home/welcome");
          });
        } else {
          return false;
        }
      });
    },
    async loadAsyncRoutes() {
      let userInfo = storage.getItem("userInfo") || {};
      if (userInfo.token) {
        try {
          const { list } = await this.$api.getPermissionList();
          let routes = utils.generateRoute(list);
          routes.map((route) => {
            route.component = () => import(`../views/${route.name}.vue`);
            this.$router.addRoute("home", route);
          });
        } catch (error) {}
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fcff;
  .title {
    font-size: 50px;
    line-height: 1.5;
    text-align: center;
    margin-bottom: 30px;
  }
  .modal {
    width: 500px;
    padding: 50px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 10px 3px #c7c9cb4d;
    .btn-login {
      width: 100%;
    }
    .nav-item {
      position: relative;
    }
    .nav-item::before {
      position: absolute;
      border-bottom: 2px solid #f48024;
      content: "";
      display: block;
      bottom: 0;
      width: 100%;
    }
  }
}
</style>