<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="user">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="user.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate">新增</el-button>
        <el-button type="danger" @click="handlePatchDel">批量删除</el-button>
      </div>
      <el-table :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button @click="handleClick(scope.row)" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" @click="handleDel(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
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
    <el-dialog title="用户新增" v-model="showModal">
      <!-- ref 名字和 model 的名字不能相同 -->
      <el-form
        ref="dialogForm"
        :rules="rules"
        :model="userForm"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="userForm.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入用户邮箱">
            <!-- input 插槽的使用 -->
            <template #append> @163.com </template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入用户手机号" />
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userForm.job" placeholder="请输入岗位" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select
            v-model="userForm.roleList"
            placeholder="请选择用户系统角色"
          >
            <el-option></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader
            v-model="userForm.deptId"
            placeholder="请选择所属部门"
            :options="options"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { reactive, onMounted, ref, getCurrentInstance } from "vue";
export default {
  name: "user",
  setup() {
    const { ctx, proxy } = getCurrentInstance();
    const internalInstance = getCurrentInstance();
    const $api = internalInstance.appContext.config.globalProperties.$api;
    const $message = internalInstance.appContext.config.globalProperties.$message;

    // 设置默认值
    const user = reactive({
      state: 3,
    });
    const rules = reactive({
      userName: [
        {
          required: true,
          message: "请输入用户名称",
          trigger: "blur",
        },
      ],
      email: [
        {
          required: true,
          message: "请输入用户邮箱",
          trigger: "blur",
        },
      ],
      mobile: [
        {
          pattern: /1\d{10}/,
          message: "请输入正确的手机号格式",
          trigger: "blur",
        }
      ],
      deptId: [
        {
          required: true,
          message: "请输入用户邮箱",
          trigger: "blur",
        },
      ],
    });
    const userForm = reactive({
      state: 1,
      job: "",
      email: "",
      mobile: "",
      deptId: "",
      roleList: [],
      userName: "",
    });
    const userList = ref([]);
    const showModal = ref(false);
    const pager = reactive({
      total: 10,
      pageNum: 1,
      pageSize: 10,
    });
    let checkedUserIds = reactive([]);
    const columns = reactive([
      {
        label: "用户ID",
        prop: "userId",
      },
      {
        label: "用户名称",
        prop: "userName",
      },
      {
        label: "用户邮箱",
        prop: "userEmail",
      },
      {
        label: "用户角色",
        prop: "role",
        formatter(row, column, value, index) {
          console.log(row, column, value, index);
          return {
            0: "管理员",
            1: "普通用户",
          }[value];
        },
      },
      {
        label: "用户状态",
        prop: "state",
        formatter(row, column, value) {
          return {
            1: "在职",
            2: "离职",
            3: "试用期",
          }[value];
        },
      },
      {
        label: "注册时间",
        prop: "createTime",
      },
      {
        label: "最后登录时间",
        prop: "lastLoginTime",
      },
    ]);
    onMounted(() => {
      getUserList();
    });
    const getUserList = async () => {
      const params = { ...user, ...pager };
      try {
        const { list, page } = await $api.getUserList(params);
        userList.value = list;
        pager.total = page.total;
      } catch (err) {
        console.log(err);
      }
    };
    const handleQuery = () => {};
    const handleReset = () => {
      ctx.$refs.form.resetFields();
    };
    const handleCurrentChange = (currentPage) => {
      pager.pageNum = currentPage;
      getUserList();
    };
    const handleDel = async (row) => {
      try {
        await $api.userDel({
          userIds: [row.userId],
        });
        $message.success("删除成功");
        getUserList();
      } catch (err) {
        console.log(err);
      }
    };
    const handlePatchDel = async () => {
      if (checkedUserIds.length == 0) {
        $message.error("请选择要删除的用户");
        return;
      }
      try {
        const res = await $api.userDel({
          userIds: checkedUserIds,
        });
        if (res.nModified > 0) {
          $message.success("删除成功");
          getUserList();
        } else {
          $message.success("删除失败");
        }
      } catch (err) {
        console.log(err);
      }
    };
    const handleSelectionChange = (list) => {
      checkedUserIds = list.map((item) => item.userId);
    };
    const handleCreate = () => {
      console.log("111");
      showModal.value = true;
    };
    return {
      user,
      rules,
      pager,
      columns,
      userList,
      userForm,
      showModal,
      checkedUserIds,

      handleDel,
      handleQuery,
      handleReset,
      handleCreate,
      handlePatchDel,
      handleCurrentChange,
      handleSelectionChange,
    };
  },
};
</script>
