<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <a-button v-auth="[curdAuth.add]" type="primary" @click="handleCreate"> 新增菜单 </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              tooltip: '编辑',
              auth: curdAuth.edit,
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
            },
            {
              tooltip: '删除',
              auth: curdAuth.del,
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                placement: 'leftBottom',
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup name="MenuManagement">
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getMenuList, menuDel } from '/@/api/admin/system';
  import { useDrawer } from '/@/components/Drawer';
  import MenuDrawer from './MenuDrawer.vue';
  import { columns, searchFormSchema, curdAuth } from './menu.data';

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { reload }] = useTable({
    title: '菜单列表',
    api: getMenuList,
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
    },
    isTreeTable: true,
    pagination: false,
    striped: false,
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    canResize: false,
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: undefined,
    },
  });

  function handleCreate() {
    openDrawer(true, {
      isUpdate: false,
    });
  }

  function handleEdit(record: Recordable) {
    openDrawer(true, {
      record,
      isUpdate: true,
    });
  }

  function handleDelete(record: Recordable) {
    menuDel(record.id).finally(handleSuccess);
  }

  function handleSuccess() {
    reload();
  }

  function onFetchSuccess() {
    // 演示默认展开所有表项
    // nextTick(expandAll);
  }
</script>
