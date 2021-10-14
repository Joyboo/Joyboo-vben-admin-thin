<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button v-auth="[curdAuth.add]" type="primary" @click="handleCreate"> 新增 </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              auth: curdAuth.edit,
              icon: 'clarity:note-edit-line',
              tooltip: '编辑',
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
    <WhitelistDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup name="Whitelist">
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { whitelistIndex, whitelistDel } from '/@/api/admin/app';
  import { useDrawer } from '/@/components/Drawer';
  import WhitelistDrawer from './WhitelistDrawer.vue';
  import { columns, searchFormSchema, curdAuth } from './whitelist.data';

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { reload }] = useTable({
    title: '设备白名单',
    api: whitelistIndex,
    columns,
    formConfig: {
      labelWidth: 10,
      schemas: searchFormSchema,
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
    whitelistDel(record.id).finally(handleSuccess);
  }

  function handleSuccess() {
    reload();
  }
</script>
