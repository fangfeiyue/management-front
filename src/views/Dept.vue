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
        <el-form
          ref="dialogForm"
          :rules="rules"
          :model="deptForm"
          label-width="100px"
        >
          <el-form-item label="上级部门" prop="parentId">
            <el-cascader
              placeholder="请选择父级部门"
              v-model="deptForm.parentId"
              :options="deptList"
              :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
              clearable
              :show-all-levels="true"
            />
          </el-form-item>
          <el-form-item label="部门名称" prop="deptName">
            <el-input
              v-model="deptForm.deptName"
              placeholder="请输入部门名称"
            />
          </el-form-item>
          <el-form-item label="负责人" prop="user">
            <el-select
              placeholder="请选择部门负责人"
              v-model="deptForm.user"
              @change="selectUser"
            >
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.userName"
                :value="`${item.userId}/${item.userName}/${item.userEmail}`"
              />˛
            </el-select>
          </el-form-item>
          <el-form-item label="负责人邮箱" prop="userEmail">
            <el-input
              placeholder="请输入负责人邮箱"
              v-model="deptForm.userEmail"
              disabled
            ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleClose">取消</el-button>
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
      userList: [],
      deptForm: {
        user: "",
        deptName: "",
        parentId: [null],
        userEmail: "",
      },
      rules: {
        deptName: [
          {
            required: true,
            message: "请输入部门名称",
            trigger: "blur",
          },
        ],
        parentId: [
          {
            required: true,
            message: "请选择上级部门",
            trigger: "blur",
          },
        ],
        user: [
          {
            required: true,
            message: "请选择负责人",
            trigger: "blur",
          },
        ],
      },
      action: "",
      showModel: false,
    };
  },
  mounted() {
    this.getDeptList();
    this.getAllUserList();
  },
  methods: {
    async getAllUserList() {
      this.userList = await this.$api.getAllUserList();
    },
    async getDeptList() {
      try {
        this.deptList = await this.$api.getDeptList(this.queryForm);
      } catch (err) {
        console.log("获取部门列表失败", err);
      }
    },
    selectUser(val) {
      this.deptForm.userEmail = val.split("/")[2] || "";
    },
    handleCreate() {
      this.action = "create";
      this.showModel = true;
    },
    async handleDel({ _id }) {
      this.action = "delete";
      await this.$api.deptOperate({ _id, action: this.action });
      this.getDeptList();
    },
    handleEdit(row) {
      this.action = "edit";
      this.showModel = true;
      this.$nextTick(() => {
        Object.assign(this.deptForm, row, {
          // user: `${row.userId}/${row.userName}/${row.userEmail}`,
          user: row.userName,
        });
      });
    },
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    handleClose() {
      this.showModel = false;
      this.handleReset("dialogForm");
    },
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          const {
            deptForm: { deptName, parentId, userEmail },
            action,
          } = this;
          await this.$api.deptOperate({
            action,
            deptName,
            parentId,
            userEmail,
          });
          this.$message.success("操作成功");
          this.handleClose();
          this.getDeptList();
        }
      });
    },
  },
};
</script>