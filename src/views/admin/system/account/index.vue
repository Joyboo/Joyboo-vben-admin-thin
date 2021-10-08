<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <RoleTree class="w-1/4 xl:w-1/5" v-model:treeData="treeData" @select="handleSelect" />
    <BasicTable @register="registerTable" class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button v-auth="[curdAuth.add]" type="primary" @click="handleCreate">新增账号</a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              auth: curdAuth.getToken,
              icon: 'clarity:info-standard-line',
              tooltip: '获取token',
              onClick: handleToken.bind(null, record),
            },
            {
              auth: curdAuth.edit,
              icon: 'clarity:note-edit-line',
              tooltip: '编辑用户资料',
              onClick: handleEdit.bind(null, record),
            },
            {
              auth: curdAuth.del,
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除此账号',
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
    <AccountDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup name="AccountManagement">
  import { reactive, ref, unref } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getAccountList, adminGetToken, adminDel } from '/@/api/admin/system';
  import { PageWrapper } from '/@/components/Page';

  import AccountDrawer from './AccountDrawer.vue';

  import { columns, searchFormSchema, curdAuth } from './account.data';
  import RoleTree from '/@/views/admin/system/account/RoleTree.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { TreeItem } from '/@/components/Tree';
  import { isArray } from '/@/utils/is';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';

  const treeData = ref<TreeItem[]>([]);
  const { createMessage } = useMessage();
  const { clipboardRef, copiedRef } = useCopyToClipboard();

  const [registerDrawer, { openDrawer }] = useDrawer();
  const searchInfo = reactive<Recordable>({});
  const [registerTable, { reload }] = useTable({
    title: '账号列表',
    api: getAccountList,
    rowKey: 'id',
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    showIndexColumn: false,
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    handleSearchInfoFn(info) {
      return info;
    },
    afterFetch(info) {
      if (isArray(info.roleList)) {
        treeData.value = info.roleList;
      }
      return info.items;
    },
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
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
    adminDel(record.id).finally(handleSuccess);
  }

  function handleSuccess() {
    reload();
  }

  function handleSelect(rid = '') {
    searchInfo.rid = rid;
    reload();
  }

  function handleToken(record: Recordable) {
    adminGetToken(record.id)
      .then((result) => {
        clipboardRef.value = result;
        if (unref(copiedRef)) {
          createMessage.success('token已复制到剪切板!');
        }
      })
      .catch((_) => {});
  }
</script>
