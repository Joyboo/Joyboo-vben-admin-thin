<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              tooltip: '详情',
              label: '详情',
              icon: 'ant-design:eye-outlined',
              onClick: handleDetail.bind(null, record),
            },
            {
              tooltip: '复发请求',
              label: '复发',
              icon: 'ant-design:undo-outlined',
            },
          ]"
        />
      </template>
    </BasicTable>
    <HttpTrackerDrawerVue @register="registerDrawer" />
  </div>
</template>
<script lang="ts" setup name="HttpTracker">
  import { nextTick } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { httpTracker } from '/@/api/admin/logs';
  import { useDrawer } from '/@/components/Drawer';
  import HttpTrackerDrawerVue from './Drawer.vue';
  import { columns, searchFormSchema } from './data';
  import { listToTree } from '/@/utils/helper/treeHelper';
  import { isArray } from '/@/utils/is';
  import { omit } from 'lodash-es';

  const checkEmptyChildren = (data: Recordable[]) => {
    for (const i in data) {
      if (isArray(data[i].children) && data[i].children.length === 0) {
        data[i] = omit(data[i], 'children');
      } else {
        data[i].children = checkEmptyChildren(data[i].children);
      }
    }
    return data;
  };

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { expandAll }] = useTable({
    title: 'Api链路追踪',
    titleHelpMessage: '此页为先查询出数据，再用数据构造为树级结构',
    api: httpTracker,
    columns,
    formConfig: {
      labelWidth: 60,
      schemas: searchFormSchema,
      fieldMapToTime: [['time', ['begintime', 'endtime'], 'YYYY-MM-DD']],
    },
    afterFetch: (items) => {
      const data = listToTree(items, { id: 'point_id', pid: 'parent_id' });
      return checkEmptyChildren(data);
    },
    isTreeTable: true,
    striped: false,
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    pagination: { pageSize: 100 },
    showIndexColumn: false,
    // scroll: { x: 1500 },
    actionColumn: {
      width: 150,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: 'right',
    },
  });

  function handleDetail(record: Recordable) {
    openDrawer(true, { ...record });
  }

  function onFetchSuccess() {
    nextTick(expandAll);
  }
</script>
