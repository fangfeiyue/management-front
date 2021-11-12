<template>
  <div class="dept-container">
    <div class="query-form">
      <el-form ref="queryForm" inline :model="queryForm">
        <el-form-item label="部门名称">
          <el-input
            placeholder="请输入部门名称"
            v-model="queryForm.deptName"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDeptList">查询</el-button>
          <el-button @click="handleReset('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate">创建</el-button>
      </div>
      <el-table
        :data="deptList"
        row-key="_id"
        :tree-props="{ children }"
        stripe
      >
        <el-table-column
          v-for="item in columns"
          :key="item.label"
          v-bind="item"
        />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button type="danger" size="small" @click="handleDel(scope.row)"
              >移除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog v-model="showModel" title="创建部门">
        <el-form>
          <el-form-item label="上级部门"> </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="showModel = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">创建</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import utils from "../utils/utils";
export default {
  name: "dept",
  data() {
    return {
      queryForm: {
        deptName: "",
      },
      columns: [
        {
          label: "部门名称",
          prop: "deptName",
        },
        {
          label: "负责人",
          prop: "userName",
        },
        {
          label: "更新时间",
          prop: "updateTime",
          formatter(row, column, val, index) {
            return utils.formateDate(val);
          },
        },
        {
          label: "创建时间",
          prop: "createTime",
          formatter(row, column, val, index) {
            return utils.formateDate(val);
          },
        },
      ],
      deptList: [],
      pager: {
        pageNum: 1,
        pageSize: 10,
      },
      showModel: true,
    };
  },
  mounted() {
    this.getDeptList();
  },
  methods: {
    async getDeptList() {
      try {
        this.deptList = await this.$api.getDeptList({
          ...this.queryForm,
          ...this.pager,
        });
      } catch (err) {
        console.log("获取部门列表失败", err);
      }
    },
    handleCreate() {
      console.log("11111111");
      this.showModel = true;
    },
    handleDel(row) {},
    handleEdit(row) {},
    handleReset(form) {
      this.$ref[form].resetFileds();
    },
    handleSubmit() {},
  },
};
</script>