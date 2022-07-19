<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button color="success" @click="handleSendMessageAll">给在线管理员发送消息</a-button>
        <a-button v-auth="[curdAuth.add]" type="primary" @click="handleCreate">新增账号</a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'ant-design:message-outlined',
              color: 'success',
              ifShow: isNumber(record.online) && record.online > 0,
              tooltip: '消息',
              onClick: handleSendUserMessage.bind(null, record),
            },
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
                placement: PlacementEnum.LEFTBOTTOM,
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <AccountDrawer @register="registerDrawer" @success="handleSuccess" />
    <ModalMessage @register="registerModal" />
  </PageWrapper>
</template>
<script lang="ts" setup name="AccountManagement">
  import { unref } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getAccountList, adminGetToken, adminDel } from '/@/api/admin/system';
  import { PageWrapper } from '/@/components/Page';

  import AccountDrawer from './AccountDrawer.vue';
  import ModalMessage from './ModalMessage.vue';

  import { columns, searchFormSchema, curdAuth } from './account.data';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { isNumber } from '/@/utils/is';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { PlacementEnum } from '/@/enums/components';

  const { createMessage } = useMessage();
  const { clipboardRef, copiedRef } = useCopyToClipboard();

  const [registerModal, { openModal }] = useModal();
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { reload, setLoading }] = useTable({
    title: '账号列表',
    api: getAccountList,
    rowKey: 'id',
    columns,
    formConfig: {
      labelWidth: 60,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    showIndexColumn: false,
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    actionColumn: {
      width: 160,
      title: '操作',
      align: 'right',
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

  function handleToken(record: Recordable) {
    setLoading(true);
    adminGetToken(record.id)
      .then((result) => {
        clipboardRef.value = result;
        if (unref(copiedRef)) {
          createMessage.success('token已复制到剪切板!');
        }
      })
      .catch((_) => {})
      .finally(() => {
        setLoading(false);
      });
  }

  // 给在线管理员发送消息
  function handleSendMessageAll() {
    openModal(true, { all: true });
  }

  /**
   * 单独给玩家发消息
   * @param record
   */
  function handleSendUserMessage(record: Recordable) {
    openModal(true, { all: false, record });
  }
</script>
