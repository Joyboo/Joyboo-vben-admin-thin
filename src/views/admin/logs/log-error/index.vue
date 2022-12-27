<template>
  <div class="errorLogIndex">
    <DetailModal :info="rowInfo" @register="registerModal" />
    <BasicTable @register="registerTable">
      <!-- <template #form-range="{ model, field }">
        <RangePicker
          v-model:value="model[field]"
          :default-picker-value="[formatDaysAgo(14, dateFmt), formatDaysAgo(0, dateFmt)]"
        />
      </template> -->
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '详情',
              onClick: handleDetail.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
  </div>
</template>

<script lang="ts" setup name="LogError">
  import { ref } from 'vue';
  import type { ErrorLogInfo } from '/#/store';
  import { BasicTable, useTable, TableAction, FormSchema, BasicColumn } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import DetailModal from '/@/views/sys/error-log/DetailModal.vue';
  import { getColumns } from '/@/views/sys/error-log/data';
  import { errorLogIndex } from '/@/api/admin/logs';
  import { ErrorTypeEnum } from '/@/enums/exceptionEnum';
  import { dateRangeArray, timePikerExtra } from '/@/utils/dateUtil';

  const [registerModal, { openModal }] = useModal();
  const rowInfo = ref<ErrorLogInfo>();
  const searchColSpan = { xs: 24, sm: 24, md: 12, lg: 4, xl: 4, xxl: 3 };
  const dateFmt = 'YYYY-MM-DD';

  const typeOptions: OptionsItem[] = [];
  for (const em in ErrorTypeEnum) {
    const item = ErrorTypeEnum[em];
    typeOptions.push({ label: item, value: item });
  }

  const searchFormSchema: FormSchema[] = [
    {
      field: 'type',
      label: ' ',
      component: 'Select',
      componentProps: {
        options: typeOptions,
        placeholder: '日志类型',
      },
      colProps: searchColSpan,
    },
    {
      field: 'time',
      label: ' ',
      component: 'RangePicker',
      defaultValue: dateRangeArray(),
      componentProps: {
        showTime: false,
        ranges: timePikerExtra(),
      },
      colProps: { xs: 24, sm: 24, md: 12, lg: 6, xl: 6, xxl: 4 },
    },
  ];

  const idColumn: BasicColumn[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      sorter: true,
      width: 80,
    },
    {
      dataIndex: 'uid',
      title: '用户信息',
      format: (text: string, record: Recordable) => {
        return record.realname + '  (id: ' + text + ')';
      },
      width: 150,
    },
  ];

  const [registerTable] = useTable({
    title: '错误日志',
    api: errorLogIndex,
    columns: [...idColumn, ...getColumns()],
    formConfig: {
      compact: true,
      labelWidth: 10,
      schemas: searchFormSchema,
      autoAdvancedLine: 1,
      showAdvancedButton: true,
      fieldMapToTime: [['time', ['begintime', 'endtime'], dateFmt]],
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: undefined,
    },
  });

  // 查看详情
  function handleDetail(row: ErrorLogInfo) {
    rowInfo.value = row;
    openModal(true);
  }
</script>

<style lang="less" scoped></style>
