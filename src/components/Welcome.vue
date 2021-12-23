<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">欢迎体验</div>
      <div class="title">科创通用后台管理系统</div>
      <div class="desc">- 打造超好用的后台管理系统</div>
    </div>
    <div class="img"></div>
  </div>
</template>
<style lang="scss" scoped>
.welcome {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #fff;
  .content {
    position: relative;
    bottom: 40px;
    .sub-title {
      font-size: 30px;
      line-height: 42px;
      color: #333;
    }
    .title {
      font-size: 40px;
      line-height: 62px;
      color: #409eff;
    }
    .desc {
      text-align: right;
      font-size: 14px;
      color: #999;
    }
  }
  .img {
    width: 371px;
    height: 438px;
    margin-left: 105px;
    background-image: url("./../assets/images/welcome.png");
  }
}
</style>