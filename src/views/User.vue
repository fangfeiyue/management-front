<template>
  <div class="user-manage">
    <div class="query-form">
      <query-form :form="form" v-model="user" @handleQuery="handleQuery" />
      <!-- <el-form ref="form" :inline="true" :model="user">
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
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form> -->
    </div>
    <base-table
      :columns="columns"
      :data="userList"
      :pager="pager"
      @handleAction="handleAction"
      @handleCurrentChange="handleCurrentChange"
      @selection-change="handleSelectionChange"
    >
      <template v-slot:action>
        <el-button
          type="primary"
          @click="handleCreate"
          v-has:add="'user-create'"
          >新增</el-button
        >
        <el-button
          type="danger"
          @click="handlePatchDel"
          v-has:path-del="'user-patch-delete'"
          >批量删除</el-button
        >
      </template>
    </base-table>
    <!-- <div class="base-table">
      <div class="action">
        <el-button
          type="primary"
          @click="handleCreate"
          v-has:add="'user-create'"
          >新增</el-button
        >
        <el-button
          type="danger"
          @click="handlePatchDel"
          v-has:path-del="'user-patch-delete'"
          >批量删除</el-button
        >
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
    </div> -->
    <el-dialog
      :title="action == 'add' ? '用户新增' : '用户编辑'"
      v-model="showModal"
    >
      <!-- ref 名字和 model 的名字不能相同 -->
      <el-form
        ref="dialogForm"
        :rules="rules"
        :model="userForm"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="userForm.userName"
            placeholder="请输入用户名"
            :disabled="action === 'edit'"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input
            v-model="userForm.userEmail"
            placeholder="请输入用户邮箱"
            :disabled="action === 'edit'"
          >
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
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="role in roleList"
              :key="role._id"
              :label="role.roleName"
              :value="role._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader
            v-model="userForm.deptId"
            placeholder="请选择所属部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { reactive, onMounted, ref, getCurrentInstance, toRaw } from "vue";
import utils from "../utils/utils";
export default {
  name: "user",
  setup() {
    const { ctx, proxy } = getCurrentInstance();
    const internalInstance = getCurrentInstance();
    const $api = internalInstance.appContext.config.globalProperties.$api;
    const $message =
      internalInstance.appContext.config.globalProperties.$message;

    // 设置默认值
    // const user = reactive({
    //   state: 1,
    // });
    const user = ref({
      state: 1,
      userId: "",
      userName: "",
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
          pattern: /1[3-9]\d{9}/,
          message: "请输入正确的手机号格式",
          trigger: "blur",
        },
      ],
      deptId: [
        {
          required: true,
          message: "请选择用户所在部门",
          trigger: "blur",
        },
      ],
    });
    const userForm = reactive({
      state: 1,
      job: "",
      userEmail: "2",
      mobile: "130123456789",
      deptId: [],
      roleList: [],
      userName: "f",
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
        type: "selection",
      },
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
        width: "180",
        formatter(row, column, value) {
          return utils.formateDate(new Date());
        },
      },
      {
        label: "最后登录时间",
        prop: "lastLoginTime",
        width: "180",
        formatter(row, column, value) {
          return utils.formateDate(new Date());
        },
      },
      {
        type: "action",
        label: "操作",
        width: "150px",
        list: [
          {
            type: "primary",
            text: "编辑",
            visible: true,
          },
          {
            type: "danger",
            text: "删除",
            visible: true,
          },
        ],
      },
    ]);
    const roleList = ref([]);
    const deptList = ref([]);
    const action = ref("add");
    onMounted(() => {
      getUserList();
      getDeptList();
      getRoleAllList();
    });
    const getUserList = async () => {
      const params = { ...user.value, ...pager };
      try {
        const { list, page } = await $api.getUserList(params);
        userList.value = list;
        pager.total = page.total;
      } catch (err) {
        console.log(err);
      }
    };
    const handleQuery = (val) => {
      getUserList();
    };
    const handleReset = (form) => {
      ctx.$refs[form].resetFields();
    };
    const handleCurrentChange = (currentPage) => {
      pager.pageNum = currentPage;
      getUserList();
    };
    const handleAction = ({ index, row }) => {
      if (index == 0) {
        handleEdit(row);
      } else if (index == 1) {
        handleDel(row);
      }
    };
    const handleEdit = (row) => {
      action.value = "edit";
      showModal.value = true;
      // 问题 点击编辑后再点击新增，新增窗口显示的是编辑自动填充的内容
      ctx.$nextTick(() => {
        Object.assign(userForm, row);
      });
      // Object.assign(userForm, row);
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
      action.value = "add";
      showModal.value = true;
    };
    const getDeptList = async () => {
      try {
        deptList.value = await $api.getDeptList();
      } catch (err) {
        console.log("获取部门列表出错", err);
      }
    };
    const getRoleAllList = async () => {
      try {
        roleList.value = await $api.getRoleAllList();
      } catch (err) {
        console.log("获取角色列表出错", err);
      }
    };
    const handleSubmit = () => {
      ctx.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          const params = toRaw(userForm);
          const email = params.userEmail + "@163.com";
          console.log(params.userEmail);
          params.action = action.value;
          const res = await $api.userSubmit({ ...params, userEmail: email });

          if (res) {
            $message.success(
              `用户${action.value === "edit" ? "编辑" : "创建"}成功`
            );
            handleReset("dialogForm");
            showModal.value = false;
            getUserList();
          }
        }
      });
    };
    const handleClose = () => {
      showModal.value = false;
      handleReset("dialogForm");
    };
    const form = [
      {
        type: "input",
        label: "用户ID",
        model: "userId",
        placeholder: "请输入用户ID",
      },
      {
        type: "input",
        label: "用户名称",
        model: "userName",
        placeholder: "请输入用户名称",
      },
      {
        type: "select",
        label: "状态",
        model: "state",
        placeholder: "请选择状态",
        options: [
          {
            label: "所有",
            value: 0,
          },
          {
            label: "在职",
            value: 1,
          },
          {
            label: "离职",
            value: 2,
          },
          {
            label: "试用期",
            value: 3,
          },
        ],
      },
    ];
    return {
      form,
      user,
      rules,
      pager,
      action,
      columns,
      userList,
      userForm,
      roleList,
      deptList,
      showModal,
      checkedUserIds,

      handleAction,
      handleQuery,
      getDeptList,
      handleReset,
      handleClose,
      handleSubmit,
      handleCreate,
      getRoleAllList,
      handlePatchDel,
      handleCurrentChange,
      handleSelectionChange,
    };
  },
};
</script>
