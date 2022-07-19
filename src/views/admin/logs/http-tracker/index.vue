<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess" class="p-4">
      <template #toolbar>
        <a-button @click="handleFilter" type="primary" preIcon="ant-design:filter-outlined">
          筛选条件
        </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              tooltip: '详情',
              icon: 'ant-design:eye-outlined',
              onClick: handleDetail.bind(null, record),
            },
            {
              tooltip: '复发',
              icon: 'ant-design:undo-outlined',
              disabled: !!record.depth,
              popConfirm: {
                placement: 'left',
                title: '是否确认复发',
                confirm: handleRepeated.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <HttpTrackerDrawerVue @register="registerDrawer" @repeat="handleRepeated" />
    <RepeatWhereDrawerVue @register="registerRepeatWhere" @submit="handleSearch" />
  </div>
</template>
<script lang="ts" setup name="HttpTracker">
  import { nextTick, h } from 'vue';
  import { Descriptions } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { httpTracker, httpTrackerRepeat } from '/@/api/admin/logs';
  import { useDrawer } from '/@/components/Drawer';
  import { useMessage } from '/@/hooks/web/useMessage';
  import HttpTrackerDrawerVue from './Drawer.vue';
  import RepeatWhereDrawerVue from './RepeatWhereDrawer.vue';
  import { columns } from './data';
  import { listToTree } from '/@/utils/helper/treeHelper';
  import { isArray } from '/@/utils/is';
  import { omit } from 'lodash-es';
  import { JsonPreview } from '/@/components/CodeEditor';

  const DescriptionsItem = Descriptions.Item;
  const { createConfirm } = useMessage();

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
  const [registerRepeatWhere, { openDrawer: openWhereDrawer }] = useDrawer();
  const [registerTable, { expandAll, reload }] = useTable({
    title: 'Api链路追踪',
    titleHelpMessage: '此页为先查询出数据，再用数据构造为树级结构',
    api: httpTracker,
    columns,
    afterFetch: (items) => {
      const data = listToTree(items, { id: 'point_id', pid: 'parent_id' });
      return checkEmptyChildren(data);
    },
    isTreeTable: true,
    striped: false,
    useSearchForm: false,
    showTableSetting: true,
    bordered: true,
    pagination: { pageSize: 100 },
    showIndexColumn: false,
    immediate: false,
    // scroll: { x: 1500 },
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: 'right',
    },
  });

  function handleDetail(record: Recordable) {
    openDrawer(true, { ...record });
  }

  function handleFilter() {
    openWhereDrawer(true);
  }

  function onFetchSuccess() {
    nextTick(expandAll);
  }

  async function handleRepeated(record: Recordable) {
    try {
      const result = await httpTrackerRepeat(record.point_id);
      createConfirm({
        width: '60%',
        iconType: 'info',
        title: () => '复发结果确认',
        content: () =>
          h(Descriptions, { bordered: true, column: 1, labelStyle: { width: '150px' } }, () => [
            h(
              DescriptionsItem,
              { label: '行参数' },
              () => h(JsonPreview, { data: record, deep: 0 }), // 默认收起
            ),
            h(DescriptionsItem, { label: '返回结果' }, () =>
              h(JsonPreview, { data: result, deep: 10 }),
            ),
          ]),
      });
      reload();
    } catch (e) {
      console.log(e);
    }
  }

  function handleSearch(where) {
    reload({ searchInfo: { where } });
  }
</script>
