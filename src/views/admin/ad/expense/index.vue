<template>
  <BasicTable @register="registerTable" />
</template>

<script lang="ts" setup name="Expense">
  import { BasicTable, useTable, FormSchema, BasicColumn } from '/@/components/Table';
  import { expenseIndex, expenseChange } from '/@/api/admin/ad';
  import { formatDaysAgo, timePikerExtra } from '/@/utils/dateUtil';

  const searchFormSchema: FormSchema[] = [
    {
      field: 'time',
      label: ' ',
      component: 'RangePicker',
      defaultValue: [formatDaysAgo(-14), formatDaysAgo()],
      componentProps: {
        showTime: false,
        ranges: timePikerExtra(),
      },
      colProps: { xs: 24, sm: 24, md: 12, lg: 6, xl: 6, xxl: 4 },
    },
  ];

  const columns: BasicColumn[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      sorter: true,
      width: 80,
    },
    {
      dataIndex: 'etime',
      title: '日期',
      sorter: true,
      width: 120,
    },
    {
      dataIndex: 'cost',
      title: '成本',
      helpMessage: '美元',
      edit: true,
      editComponent: 'InputNumber',
      editComponentProps: {
        min: 0,
      },
    },
  ];

  const [registerTable, { setLoading }] = useTable({
    title: '广告消耗列表',
    api: expenseIndex,
    columns,
    formConfig: {
      compact: true,
      labelWidth: 10,
      schemas: searchFormSchema,
      autoAdvancedLine: 1,
      showAdvancedButton: true,
      fieldMapToTime: [['time', ['begintime', 'endtime'], 'YYYY-MM-DD']],
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    // 单元格编辑提交
    beforeEditSubmit: ({ record, value }) => {
      return new Promise((resolve, reject) => {
        setLoading(true);
        expenseChange(record.id, 'cost', value)
          .then(resolve)
          .catch(reject)
          .finally(() => setLoading(false));
      });
    },
  });
</script>

<style lang="less" scoped></style>
