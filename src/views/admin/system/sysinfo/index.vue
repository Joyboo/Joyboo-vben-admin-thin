<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <PopConfirmButton
          title="强制刷新 or 非强制刷新"
          color="warning"
          ok-text="强制"
          cancel-text="非强制"
          @confirm="handleRefresh(1)"
          @cancel="handleRefresh(0)"
        >
          通知在线用户刷新
        </PopConfirmButton>
        <a-button @click="sysinfoShowSwooleTable">查看Swoole Table</a-button>
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
    <SysinfoDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup name="Sysinfo">
  import { PopConfirmButton } from '/@/components/Button';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { sysinfoIndex, sysinfoDel, sysinfoShowSwooleTable } from '/@/api/admin/system';
  import { useDrawer } from '/@/components/Drawer';
  import SysinfoDrawer from './SysinfoDrawer.vue';
  import { columns, searchFormSchema, curdAuth } from './sysinfo.data';
  import { setSend } from '/@/logics/mitt/websocket';

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { reload }] = useTable({
    title: '后台配置',
    api: sysinfoIndex,
    columns,
    formConfig: {
      labelWidth: 120,
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
    sysinfoDel(record.id).finally(handleSuccess);
  }

  function handleSuccess() {
    reload();
  }

  function handleRefresh(force: 0 | 1) {
    setSend({
      class: 'Admin\\Sysinfo',
      action: 'refresh',
      force,
    });
  }
</script>
