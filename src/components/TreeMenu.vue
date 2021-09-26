<template>
  <template v-for="menu in menuList">
    <el-submenu
      v-if="
        menu.children &&
        menu.children.length > 0 &&
        menu.children[0].menuType == 1
      "
      :index="menu.path"
      :key="menu._id"
    >
      <template #title>
        <i :class="menu.icon"></i>
        <span>{{ menu.menuName }}</span>
      </template>
      <tree-menu :menuList="menu.children" />
    </el-submenu>
    <el-menu-item
      v-else-if="menu.menuType == 1"
      :index="menu.path"
      :key="menu._id"
      >{{ menu.menuName }}</el-menu-item
    >
  </template>
</template>
<script>
export default {
  name: "TreeMenu",
  props: {
    menuList: {
      type: Array,
      // ？函数
      default() {
        return [];
      },
    },
  },
};
</script>
