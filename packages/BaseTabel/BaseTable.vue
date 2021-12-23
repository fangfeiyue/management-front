<template>
  <div class="base-table">
    <div class="action">
      <slot name="action"></slot>
    </div>
    <el-table v-bind="$attrs">
      <template v-for="item in columns" :key="item.prop">
        <el-table-column
          v-if="item.type === 'selection'"
          type="selection"
          width="55"
          key="selection"
        />
        <el-table-column v-else-if="!item.type" v-bind="item" />
        <el-table-column v-else-if="item.type === 'action'" v-bind="item">
          <template #default="scope">
            <template v-for="(item1, index) in item.list" :key="item1.label">
              <el-button
                :type="item1.type"
                @click="handleAction(index, scope.row)"
                >{{ item1.text }}</el-button
              >
            </template>
          </template>
        </el-table-column>
      </template>
      <!-- <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button
            @click="handleEdit(scope.row)"
            size="mini"
            v-has:edit="'user-edit'"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="handleDel(scope.row)"
            v-has:edit="'user-delete'"
            >删除</el-button
          >
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination
      class="pagination"
      @current-change="handleCurrentChange"
      background
      layout="prev, pager, next"
      :total="pager.total"
      :page-size="pager.pageSize"
    />
  </div>
</template>
<script>
export default {
  name: "BaseTable",
  props: ["columns", "pager"],
  setup(props, context) {
    const handleAction = (index, row) => {
      context.emit("handleAction", { index, row: { ...row } });
    };
    const handleCurrentChange = (pageNum) => {
      context.emit("handleCurrentChange", pageNum);
    };
    return {
      handleAction,
      handleCurrentChange,
    };
  },
};
</script>
