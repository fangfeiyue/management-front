<template>
  <div class="query-form">
    <el-form ref="form" :model="queryForm" inline>
      <el-form-item label="审批状态">
        <el-select v-model="queryForm.applyState">
          <el-option value="" label="全部"></el-option>
          <el-option :value="1" label="待审批"></el-option>
          <el-option :value="2" label="审批中"></el-option>
          <el-option :value="3" label="审批拒绝"></el-option>
          <el-option :value="4" label="审批通过"></el-option>
          <el-option :value="5" label="作废"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="handleReset('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="base-table">
    <div class="action"></div>
    <el-table :data="approveList">
      <el-table-column
        v-for="item in columns"
        :label="item.label"
        :key="item.label"
        :prop="item.prop"
        :formatter="item.formatter"
      />
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button
            size="small"
            :disabled="
              scope.row.curAuditUserName != userInfo.userName ||
              scope.row.applyState > 2
            "
            @click="handleAudit(scope.row)"
            >审核</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      background
      layout="prev, pager, next"
      :total="pager.total"
      @current-change="handleChangePagination"
    >
    </el-pagination>
    <el-dialog v-model="showDialog" title="审核" width="50%">
      <el-form
        ref="dialogForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        label-suffix="："
      >
        <el-form-item label="申请人">{{ applyDetail.applyUser }}</el-form-item>
        <el-form-item label="休假类型">{{
          applyDetail.applyTypeName
        }}</el-form-item>
        <el-form-item label="休假时间">{{ applyDetail.time }}</el-form-item>
        <el-form-item label="休假时长">{{
          applyDetail.leaveTime
        }}</el-form-item>
        <el-form-item label="休假原因">{{ applyDetail.reasons }}</el-form-item>
        <el-form-item label="审批状态">{{
          applyDetail.applyStateName
        }}</el-form-item>
        <el-form-item label="审批人">{{
          applyDetail.curAuditUserName
        }}</el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="ruleForm.remark"
            placeholder="请输审批入备注"
            type="textarea"
            rows="3"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleApprove('refuse')">拒绝</el-button>
          <el-button type="primary" @click="handleApprove('pass')"
            >审批通过</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { reactive, ref } from "@vue/reactivity";
import { getCurrentInstance, onMounted } from "@vue/runtime-core";
import utils from "../utils/utils";
export default {
  setup() {
    const { appContext, ctx } = getCurrentInstance();
    const { $api, $message, $store } = appContext.config.globalProperties;

    const columns = reactive([
      {
        prop: "orderNo",
        label: "单号",
      },
      {
        prop: "applyUser",
        label: "申请人",
        formatter(row, col, val) {
          return row.applyUser.userName;
        },
      },
      {
        prop: "startTime",
        label: "休假时间",
        formatter(row, column, val, index) {
          return utils.formateDate(val);
        },
      },
      {
        prop: "leaveTime",
        label: "休假时长",
      },
      {
        prop: "applyType",
        label: "休假类型",
        formatter(row, column, val, index) {
          return {
            1: "事假",
            2: "调休",
            3: "年假",
          }[val];
        },
      },
      {
        prop: "reasons",
        label: "休假原因",
      },
      {
        prop: "createTime",
        label: "申请时间",
        formatter(row, col, val) {
          return utils.formateDate(val);
        },
      },
      {
        prop: "auditUsers",
        label: "审批人",
      },
      {
        prop: "curAuditUserName",
        label: "当前审批人",
      },
      {
        prop: "applyState",
        label: "审批状态",
        formatter(row, column, val, index) {
          return {
            1: "待审批",
            2: "审批中",
            3: "审批拒绝",
            4: "审批通过",
            5: "作废",
          }[val];
        },
      },
    ]);
    const queryForm = reactive({
      applyState: 1,
    });
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 0,
    });
    const ruleForm = reactive({
      remark: "",
    });
    const userInfo = $store.state.userInfo;
    const rules = reactive({
      remark: [
        {
          type: "string",
          required: true,
          message: "请输入备注",
          trigger: "blur",
        },
      ],
    });
    const approveList = ref([]);
    onMounted(() => {
      getApproveList();
    });
    const showDialog = ref(false);
    const getApproveList = async () => {
      const params = { ...queryForm, ...pager, type: "approve" };
      const { list, page } = await $api.getApplyList(params);
      approveList.value = list;
      pager.total = page.total;
    };
    const handleReset = (form) => {
      ctx.$refs[form].resetFields();
    };
    const handleQuery = () => {
      getApproveList();
    };
    const handleChangePagination = (val) => {
      pager.pageNum = val;
      getApproveList();
    };
    const handleClose = (form) => {
      handleReset(form);
      showDialog.value = false;
    };
    const applyDetail = ref({});
    const handleApprove = (action) => {
      ctx.$refs["dialogForm"].validate(async (valid) => {
        if (valid) {
          const params = {
            action,
            remark: ruleForm.remark,
            _id: applyDetail.value._id,
          };
          try {
            await $api.leaveApprove(params);
            $message.success("操作成功");
            handleClose("dialogForm");
            $store.commit("saveNoticeCount", $store.state.noticeCount - 1);
            getApproveList();
          } catch (err) {
            console.log(err);
          }
        } else {
          console.log("提交失败");
          return false;
        }
      });
    };
    const handleAudit = (row) => {
      const {
        _id,
        reasons,
        applyState,
        applyType,
        curAuditUserName,
        leaveTime,
        endTime,
        startTime,
        applyUser,
      } = row;
      const applyStateName = {
        1: "待审批",
        2: "审批中",
        3: "审批拒绝",
        4: "审批通过",
        5: "作废",
      }[applyState];
      const applyTypeName = {
        1: "事假",
        2: "调休",
        3: "年假",
      }[applyType];
      let time =
        utils.formateDate(startTime, "yyyy-MM-dd") +
        "-" +
        utils.formateDate(endTime, "yyyy-MM-dd");

      applyDetail.value = {
        _id,
        time,
        applyUser: applyUser.userName,
        reasons,
        leaveTime,
        applyStateName,
        applyTypeName,
        curAuditUserName,
      };
      showDialog.value = true;
    };
    return {
      pager,
      rules,
      columns,
      ruleForm,
      userInfo,
      queryForm,
      showDialog,
      applyDetail,
      approveList,
      handleAudit,
      handleReset,
      handleQuery,
      handleApprove,
      handleChangePagination,
    };
  },
};
</script>