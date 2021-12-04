<template>
  <div class="leave-manager">
    <div class="query-form">
      <el-form ref="form" inline :model="queryForm">
        <el-form-item label="审批状态" prop="applyState">
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
          <el-button @click="handleReset('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleApply">申请休假</el-button>
      </div>
      <el-table :data="leaveList">
        <el-table-column
          v-for="item in columns"
          :key="item.label"
          :label="item.label"
          :prop="item.prop"
          :formatter="item.formatter"
        ></el-table-column>
        <el-table-column label="操作" width="150px">
          <template #default="scope">
            <el-button size="mini" @click="handleDetail(scope.row)"
              >查看</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDel(scope.row)"
              :disabled="scope.row.applyState > 2"
              >作废</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"
        @current-change="handleCurChange"
      >
      </el-pagination>
      <el-dialog v-model="showDialog" title="申请休假">
        <!-- Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 form-Item 的 prop 属性设置为需 form 绑定值对应的字段名即可。 -->
        <el-form
          ref="dialogForm"
          :model="ruleForm"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="事假类型" prop="applyType" required>
            <el-select v-model="ruleForm.applyType">
              <el-option label="事假" :value="1"></el-option>
              <el-option label="调休" :value="2"></el-option>
              <el-option label="年假" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="休假时间" required>
            <el-row>
              <el-col :span="8">
                <el-form-item prop="startTime" required>
                  <el-date-picker
                    v-model="ruleForm.startTime"
                    type="date"
                    placeholder="选择开始日期"
                    @change="(val) => handleDateChange('startTime', val)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="1">-</el-col>
              <el-col :span="8">
                <el-form-item prop="endTime" required>
                  <el-date-picker
                    v-model="ruleForm.endTime"
                    type="date"
                    placeholder="选择结束日期"
                    @change="(val) => handleDateChange('endTime', val)"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="休假时长">
            {{ ruleForm.leaveTime }}
          </el-form-item>
          <el-form-item label="休假原因" prop="reasons">
            <el-input
              v-model="ruleForm.reasons"
              type="textarea"
              rows="3"
              placeholder="请输入休假原因"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleClose('dialogForm')">取消</el-button>
            <el-button type="primary" @click="handleSubmit('dialogForm')"
              >确定</el-button
            >
          </span>
        </template>
      </el-dialog>
      <el-dialog v-model="viewDialog" title="申请休假" destroy-on-close>
        <el-steps
          :active="detail.applyState > 3 ? 3 : detail.applyState"
          align-center
        >
          <el-step title="待审批"></el-step>
          <el-step title="审批中"></el-step>
          <el-step title="审批通过/拒绝"></el-step>
        </el-steps>
        <el-form label-width="120px" label-suffix="：">
          <el-form-item label="休假类型">{{
            detail.applyStateName
          }}</el-form-item>
          <el-form-item label="休假时间">{{ detail.time }}</el-form-item>
          <el-form-item label="休假时长">{{ detail.leaveTime }}</el-form-item>
          <el-form-item label="休假原因">{{ detail.reasons }}</el-form-item>
          <el-form-item label="审批状态">{{
            detail.applyStateName
          }}</el-form-item>
          <el-form-item label="审批人">{{
            detail.curAuditUserName
          }}</el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="viewDialog = false">关闭</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import utils from "../utils/utils";
export default {
  setup() {
    const { appContext, ctx } = getCurrentInstance();
    const { $api, $message } = appContext.config.globalProperties;

    const queryForm = reactive({
      applyState: 1,
    });
    const columns = reactive([
      {
        label: "单号",
        prop: "orderNo",
      },
      {
        label: "休假时间",
        prop: "startTime",
        formatter(row, column, value, index) {
          return (
            utils.formateDate(row.startTime, "yy-MM-dd") +
            "到" +
            utils.formateDate(row.endTime, "yy-MM-dd")
          );
        },
      },
      {
        label: "休假时长",
        prop: "leaveTime",
      },
      {
        label: "休假类型",
        prop: "applyType",
        // formatter 属性，它用于格式化指定列的值， 接受一个 Function，会传入两个参数：row 和 column， 可以根据自己的需求进行处理
        formatter(row, column, val, index) {
          return {
            1: "事假",
            2: "调休",
            3: "年假",
          }[val];
        },
      },
      {
        label: "休假原因",
        prop: "reasons",
      },
      {
        label: "申请时间",
        prop: "createTime",
        formatter(row, column, val, index) {
          return utils.formateDate(val);
        },
      },
      {
        label: "审批人",
        prop: "auditUsers",
      },
      {
        label: "当前审批人",
        prop: "curAuditUserName",
      },
      {
        label: "审批状态",
        prop: "applyState",
        formatter(row, col, val, index) {
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

    onMounted(() => {
      getApplyList();
    });

    const leaveList = ref([]);
    const pager = reactive({
      total: 100,
      pageNum: 1,
      pageSize: 10,
    });
    const getApplyList = async () => {
      const params = { ...queryForm, ...pager };
      const { list, page } = await $api.getApplyList(params);
      leaveList.value = list;
      // page.value = page;
      pager.total = page.total;
    };

    const selectOptions = reactive([
      {
        val: 1,
        label: "待审批",
      },
      {
        val: 2,
        label: "审批中",
      },
      {
        val: 3,
        label: "审批拒绝",
      },
      {
        val: 4,
        label: "审批通过",
      },
      {
        val: 5,
        label: "作废",
      },
    ]);
    const handleReset = (form) => {
      ctx.$refs[form].resetFields();
    };
    const ruleForm = reactive({
      applyType: 1,
      startTime: "",
      endTime: "",
      leaveTime: "0天",
      reasons: "",
    });
    const validateApplyTime = () => {
      if (ruleForm.endTime && ruleForm.startTime > ruleForm.endTime) {
        $message.error("开始时间不能大于结束时间");
        ruleForm.leaveTime = "0天";
        return false;
      }
      return true;
    };
    const handleDateChange = (key, val) => {
      ruleForm[key] = val;

      if (validateApplyTime()) {
        ruleForm.leaveTime =
          (ruleForm.endTime - ruleForm.startTime) / (24 * 60 * 60 * 1000) +
          1 +
          "天";
      }
    };
    const showDialog = ref(false);
    const handleApply = () => {
      showDialog.value = true;
    };
    const handleQuery = () => {
      getApplyList();
    };
    // 默认校验是英文的，中文需添加自定义规则
    const rules = reactive({
      startTime: [
        {
          type: "date",
          required: true,
          message: "请输入开始时间",
          trigger: "change",
        },
      ],
      endTime: [
        {
          type: "date",
          required: true,
          message: "请输入结束时间",
          trigger: "change",
        },
      ],
      reasons: [
        {
          required: true,
          message: "请输入请假原因",
          trigger: ["change", "blur"],
        },
      ],
    });
    const handleClose = (form) => {
      showDialog.value = false;
      handleReset(form);
    };
    const handleSubmit = (form) => {
      ctx.$refs[form].validate(async (valid) => {
        if (valid && validateApplyTime()) {
          let res = await $api.leaveOperate({ ...ruleForm, action: "create" });
          $message.success("创建成功");
          handleClose(form);
          getApplyList();
        }
      });
    };
    const handleDel = async ({ _id }) => {
      try {
        await $api.leaveOperate({ _id, action: "delete" });
        $message.success("删除成功");
        getApplyList();
      } catch (err) {}
    };

    const detail = ref({});
    const viewDialog = ref(false);
    const handleDetail = (row) => {
      viewDialog.value = true;
      let {
        applyState,
        curAuditUserName,
        endTime,
        startTime,
        applyType,
        leaveTime,
        reasons,
      } = row;
      applyType = {
        1: "事假",
        2: "调休",
        3: "年假",
      }[applyType];
      const applyStateName = {
        1: "待审批",
        2: "审批中",
        3: "审批拒绝",
        4: "审批通过",
        5: "作废",
      }[applyState];
      const time =
        utils.formateDate(startTime, "yy-MM-dd") +
        " 到 " +
        utils.formateDate(endTime, "yy-MM-dd");
      detail.value = {
        applyState,
        applyType,
        leaveTime,
        reasons,
        time,
        applyStateName,
        curAuditUserName,
      };
    };
    const handleCurChange = (val) => {
      pager.pageNum = val;
      getApplyList();
    };
    return {
      columns,
      rules,
      detail,
      leaveList,
      queryForm,
      pager,
      ruleForm,
      viewDialog,
      showDialog,
      selectOptions,
      handleReset,
      handleApply,
      handleQuery,
      handleClose,
      handleDel,
      handleSubmit,
      handleDetail,
      handleDateChange,
      handleCurChange,
    };
  },
};
</script>