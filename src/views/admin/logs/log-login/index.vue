<template>
  <BasicTable @register="registerTable" />
</template>

<script lang="ts" setup name="LogLogin">
  import { Tag, Avatar } from 'ant-design-vue';
  import { h } from 'vue';
  import { BasicTable, useTable, FormSchema, BasicColumn } from '/@/components/Table';
  import { adminLogIndex } from '/@/api/admin/logs';
  import HeaderImg from '/@/assets/images/header.jpg';
  import { dateRangeArray, fmtFullTime, timePikerExtra } from '/@/utils/dateUtil';

  const searchFormSchema: FormSchema[] = [
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
    {
      field: 'uid',
      label: ' ',
      component: 'Input',
      componentProps: {
        placeholder: 'UID | 姓名',
      },
      colProps: { xs: 24, sm: 24, md: 12, lg: 4, xl: 4, xxl: 3 },
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
      title: '用户信息',
      children: [
        {
          title: '头像',
          dataIndex: 'relation.avatar',
          customRender: ({ record }) => {
            const avatar = record.relation.avatar ?? '';
            return h(Avatar, {
              src: avatar ? avatar : HeaderImg,
            });
          },
        },
        {
          title: '姓名',
          dataIndex: 'relation.realname',
        },
        {
          title: 'UID',
          dataIndex: 'uid',
        },
        {
          title: '账号',
          dataIndex: 'relation.username',
        },
        {
          title: '用户状态',
          dataIndex: 'relation.status',
          customRender: ({ record }) => {
            const status = record.relation.status ?? 2;
            const color = { 0: 'red', 1: 'green', 2: 'orange' };
            const t = { 0: '锁定', 1: '正常', 2: '未知' };
            return h(Tag, { color: color[status] }, () => t[status]);
          },
        },
      ],
    },
    {
      title: '登录信息',
      children: [
        {
          title: '登入时间',
          dataIndex: 'instime',
          customRender: ({ text }) => fmtFullTime(text),
        },
        {
          title: '最后更新时间',
          dataIndex: 'updtime',
          customRender: ({ text }) => fmtFullTime(text),
        },
        {
          title: 'IP',
          dataIndex: 'ip',
        },
      ],
    },
  ];

  const [registerTable] = useTable({
    title: '登录日志',
    api: adminLogIndex,
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
  });
</script>

<style lang="less" scoped></style>
