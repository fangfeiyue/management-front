<template>
  <div class="role-manage">
    <div class="query-form">
      <!-- 设置 inline 属性可以让表单域变为行内的表单域 -->
      <el-form :inline="true" :model="roleForm">
        <el-form-item label="角色名称">
          <el-input placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoleList">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate">创建</el-button>
      </div>
      <el-table :data="roleList" style="width: 100%">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
        ></el-table-column>
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="handlePermission(scope.row)"
              >设置权限</el-button
            >
            <el-button size="mini" type="danger" @click="handleDel"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"
        :page-size="pager.pageSize"
      >
      </el-pagination>
    </div>
    <el-dialog
      v-model="isShowDialog"
      :title="`${action === 'create' ? '创建' : '编辑'}角色`"
      @close="handleClose"
    >
      <el-form
        :rules="rules"
        :model="roleForm"
        ref="dialogForm"
        label-width="120px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="请输入角色名称" v-model="roleForm.roleName" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="roleForm.remark"
            type="textarea"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="isShowPermission" title="权限设置">
      <el-form>
        <el-form-item label="角色名称：">{{ curRole }}</el-form-item>
        <el-form-item label="选择权限：">
          <el-tree
            ref="tree"
            :data="menuList"
            node-key="_id"
            default-expand-all
            :props="{ label: 'menuName' }"
            show-checkbox
          ></el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isShowPermission = false">取消</el-button>
          <el-button type="primary" @click="permissionSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import utils from "../utils/utils";
export default {
  data() {
    return {
      action: "",
      roleList: [],
      // 当前要设置权限的角色
      curRole: "",
      curRoleId: "",
      isShowPermission: false,
      isShowDialog: false,
      roleForm: {
        roleName: "",
        remark: "",
      },
      columns: [
        {
          label: "角色名称",
          prop: "roleName",
        },
        {
          label: "备注",
          prop: "remark",
        },
        {
          label: "权限列表",
          prop: "permissionList",
          formatter: (row, column, cellValue, index) => {
            const actionMap = this.getActionMap();
            const list = cellValue.halfCheckedKeys || [];
            const res = [];
            list.forEach((item) => {
              if (actionMap[item]) res.push(actionMap[item]);
            });
            return res.join(",");
          },
        },
        {
          label: "创建时间",
          prop: "createTime",
          formatter(row, column, cellValue, index) {
            return utils.formateDate(cellValue);
          },
        },
      ],
      pager: {
        total: 0,
        pageSize: 10,
      },
      ruleForm: {
        roleName: "",
      },
      // 这是一个对象
      rules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur",
          },
        ],
      },
      menuList: [],
    };
  },
  mounted() {
    this.getRoleList();
    this.getMenuList();
  },
  methods: {
    async getRoleList() {
      try {
        const { list, page } = await this.$api.getRoleList();
        this.pager = page;
        this.roleList = list;
      } catch (err) {
        console.log("角色列表请求失败", err);
      }
    },
    async getMenuList() {
      try {
        this.menuList = await this.$api.getMenuList();
      } catch (err) {
        throw err;
      }
    },
    getActionMap() {
      const actionMap = {};
      function deep(list) {
        list.forEach((item) => {
          if (item.children && item.action) {
            actionMap[item._id] = item.menuName;
          } else if (item.children && !item.action) {
            deep(item.children);
          }
        });
      }
      deep(this.menuList);
      return actionMap;
    },
    handleCreate() {
      this.action = "create";
      this.isShowDialog = true;
    },
    async handleDel(_id) {
      try {
        await this.$api.roleOperate({ _id, action: "delete" });
        this.getRoleList();
      } catch (err) {
        console.log("删除失败");
      }
    },
    handleEdit(row) {
      this.action = "edit";
      // 一定要先弹出弹窗
      this.isShowDialog = true;
      this.$nextTick(() => {
        // 和之前一样，不能直接赋值给 roleForm，要不在编辑的时候点击关闭会导致类表中的数据被清除
        // this.roleForm = row;
        Object.assign(this.roleForm, row);
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    handleClose() {
      this.isShowDialog = false;
      this.handleReset("dialogForm");
    },
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          const { roleForm, action } = this;
          try {
            await this.$api.roleOperate({ ...roleForm, action });
            this.handleClose();
            this.$message.success("提交成功");
          } catch (err) {
            console.log(err);
          }
        } else {
          console.log("提交失败");
        }
      });
    },
    handlePermission(row) {
      this.curRoleId = row._id;
      this.curRole = row.roleName;
      this.isShowPermission = true;
      const { checkedKeys } = row.permissionList;
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(checkedKeys);
      });
    },
    async permissionSubmit() {
      const checkedNodes = this.$refs.tree.getCheckedNodes();
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
      const checkedKeys = [],
        parentKeys = [];

      checkedNodes.forEach((node) => {
        if (!node.children) {
          checkedKeys.push(node._id);
        } else {
          parentKeys.push(node._id);
        }
      });

      const params = {
        _id: this.curRoleId,
        permissionList: {
          checkedKeys,
          halfCheckedKeys: [...parentKeys, ...halfCheckedKeys],
        },
      };
      await this.$api.updatePermission(params);
      this.isShowPermission = false;
    },
  },
};
</script>
