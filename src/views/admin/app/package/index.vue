<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button v-auth="[curdAuth.add]" type="primary" @click="handleCreate"> 新增包 </a-button>
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
    <PackageDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup name="PackageManagement">
  import { BasicTable, useTable, TableAction, FormSchema } from '/@/components/Table';
  import { packageIndex, packageDel } from '/@/api/admin/app';
  import { useDrawer } from '/@/components/Drawer';
  import PackageDrawer from './PackageDrawer.vue';
  import { curdAuth, columns } from './package.data';
  import { useUserStore } from '/@/store/modules/user';
  import { computed } from 'vue';

  const gameOptions = computed(() => useUserStore().getGameListOptions);
  const gameKeyValue = computed(() => useUserStore().gameKeyValue);
  const searchFormSchema: FormSchema[] = [
    {
      field: 'gameid',
      label: '所属游戏',
      component: 'Select',
      componentProps: {
        options: gameOptions.value,
      },
      colProps: { span: 8 },
    },
    {
      field: 'name',
      label: '包名或包id',
      helpMessage: '支持模糊搜索',
      component: 'Input',
      colProps: { span: 8 },
    },
  ];

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { reload }] = useTable({
    title: '包管理列表',
    api: packageIndex,
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    afterFetch(items) {
      // id替换为name
      items = items.map((item: any) => {
        if (typeof gameKeyValue.value[item.gameid] !== 'undefined') {
          item.gameid = gameKeyValue.value[item.gameid];
        }
        return item;
      });
      return items;
    },
    actionColumn: {
      width: 120,
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
    packageDel(record.id).finally(handleSuccess);
  }

  function handleSuccess() {
    reload();
  }
</script>
