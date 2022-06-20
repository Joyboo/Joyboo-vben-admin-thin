<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <a-button v-auth="[curdAuth.add]" type="primary" @click="handleCreate"> 新增菜单 </a-button>
      </template>
      <template #tableTitle>
        <Button type="primary" @click="expandAll()" preIcon="ant-design:column-height-outlined">
          展开全部
        </Button>

        <Button
          class="ml-2"
          type="primary"
          @click="collapseAll()"
          preIcon="ant-design:vertical-align-middle-outlined"
        >
          收起全部
        </Button>
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
              onClick: handleDelete.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
    <DelModalVue @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup name="MenuManagement">
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { getMenuList } from '/@/api/admin/system';
  import { useDrawer } from '/@/components/Drawer';
  import MenuDrawer from './MenuDrawer.vue';
  import DelModalVue from './DelModal.vue';
  import { columns, curdAuth, searchFormSchema } from './menu.data';
  import { Button } from '/@/components/Button';
  import { useModal } from '/@/components/Modal';

  const [registerModal, { openModal }] = useModal();
  const [registerDrawer, { openDrawer }] = useDrawer();

  const [registerTable, { reload, expandAll, collapseAll }] = useTable({
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
    openModal(true, { ...record });
  }

  function handleSuccess() {
    reload();
  }

  function onFetchSuccess() {
    // 演示默认展开所有表项
    // nextTick(expandAll);
  }
</script>
