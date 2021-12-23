<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <div class="logo">
        <img src="../assets/logo.png" />
        <span v-show="!isCollapse">Manager</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        background-color="#001529"
        text-color="#fff"
        router
        :collapse="isCollapse"
        class="nav-menu"
      >
        <tree-menu :menuList="menuList" />
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold" @click="toggle">
            <i class="el-icon-s-fold"></i>
          </div>
          <div class="bread">
            <bread-crumb />
          </div>
        </div>
        <div class="user-info">
          <el-badge
            :is-dot="!!noticeCount"
            class="notice"
            type="danger"
            @click="$router.push('/audit/approve')"
          >
            <i class="el-icon-bell"></i>
          </el-badge>
          <el-dropdown @command="handleLogout">
            <span class="user-link">
              {{ userInfo.userName }}
              <i class="el-icon--right"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email"
                  >邮箱：{{ userInfo.userEmail }}</el-dropdown-item
                >
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <!-- <div class="main-page">
          <router-view></router-view>
        </div> -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import BreadCrumb from "../components/BreadCrumb.vue";
import TreeMenu from "../components/TreeMenu.vue";
export default {
  components: { TreeMenu, BreadCrumb },
  data() {
    return {
      isCollapse: false,
      menuList: [],
      activeMenu: location.hash.slice(1),
      userInfo: this.$store.state.userInfo,
    };
  },
  mounted() {
    this.getNoticeCount();
    this.getMenuList();
  },
  computed: {
    noticeCount() {
      return this.$store.state.noticeCount;
    },
  },
  methods: {
    toggle() {
      this.isCollapse = !this.isCollapse;
    },
    handleLogout(key) {
      if (key === "email") return;
      this.$store.commit("saveUserInfo", "");
      this.userInfo = {};
      this.$router.replace("/login");
    },
    async getNoticeCount() {
      try {
        const count = await this.$api.noticeCount();

        // this.noticeCount = count;
        this.$store.commit("saveNoticeCount", count);
      } catch (err) {
        console.error(err);
      }
    },
    async getMenuList() {
      try {
        const { list, actionList } = await this.$api.getPermissionList();
        this.menuList = list;
        this.$store.commit("saveActionList", actionList);
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    transition: width 0.5s;
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img {
        margin: 0 16px;
        width: 32px;
        height: 32px;
      }
    }
    .nav-menu {
      height: calc(100vh - 50px);
      border-right: none;
    }
    &.fold {
      width: 64px;
    }
    &.unfold {
      width: 200px;
    }
  }
  .content-right {
    margin-left: 200px;
    &.fold {
      margin-left: 64px;
    }
    &.unfold {
      margin-left: 200px;
    }
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
      .nav-left {
        display: flex;
        align-items: center;
        .menu-fold {
          margin-right: 15px;
          font-size: 18px;
        }
      }
      .user-info {
        .notice {
          line-height: 30px;
          margin-right: 15px;
          cursor: pointer;
        }
        .user-link {
          cursor: pointer;
          color: #409eff;
        }
      }
    }
    .wrapper {
      background-color: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      .main-page {
        height: 100%;
        background-color: #fff;
      }
    }
  }
}
</style>