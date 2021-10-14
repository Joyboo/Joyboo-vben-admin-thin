<template>
  <div>
    <DetailModal :info="rowInfo" @register="registerModal" />
    <BasicTable @register="registerTable">
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

<script lang="ts" setup name="Log">
  import { Tag, Avatar } from 'ant-design-vue';
  import { h, computed, ref } from 'vue';
  import { BasicTable, useTable, FormSchema, BasicColumn, TableAction } from '/@/components/Table';
  import { logIndex } from '/@/api/admin/logs';
  import { formatDaysAgo, timePikerExtra } from '/@/utils/dateUtil';
  import HeaderImg from '/@/assets/images/header.jpg';
  import { useUserStore } from '/@/store/modules/user';
  import { useModal } from '/@/components/Modal';
  import DetailModal from './DetailModal.vue';

  const rowInfo = ref();
  const [registerModal, { openModal }] = useModal();
  const userStore = useUserStore();
  const domain = computed(() => userStore.getUserInfo.config.imageDomain);

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
    {
      field: 'admid',
      label: ' ',
      component: 'Input',
      componentProps: {
        placeholder: 'UID',
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
            if (!Reflect.has(record.relation, 'avatar')) {
              return h('span');
            }
            const avatar = record.relation.avatar ?? '';
            return h(Avatar, {
              src: avatar ? domain.value + avatar : HeaderImg,
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
      title: '操作信息',
      children: [
        {
          title: 'SQL',
          dataIndex: 'content',
        },
        {
          title: '操作时间',
          dataIndex: 'itime',
        },
        {
          title: 'IP',
          dataIndex: 'ip',
        },
      ],
    },
  ];

  const [registerTable] = useTable({
    title: '操作日志',
    api: logIndex,
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
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: 'right',
    },
  });

  function handleDetail(row) {
    rowInfo.value = row;
    openModal(true);
  }
</script>

<style lang="less" scoped></style>
