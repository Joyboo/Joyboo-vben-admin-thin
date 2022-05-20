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
              icon: 'ant-design:message-outlined',
              color: 'success',
              ifShow: isNumber(record.online) && record.online > 0,
              tooltip: '给Ta发送消息',
              onClick: handleSendUserMessage.bind(null, record),
            },
            {
              icon: 'ant-design:undo-outlined',
              ifShow: isNumber(record.online) && record.online > 0,
              tooltip: '通知此用户刷新',
              popConfirm: {
                placement: 'leftBottom',
                title: '确认操作',
                confirm: handleSendUserRefresh.bind(null, record),
              },
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
  import { reactive, ref, unref, h } from 'vue';
  import { Space, Input } from 'ant-design-vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getAccountList, adminGetToken, adminDel } from '/@/api/admin/system';
  import { PageWrapper } from '/@/components/Page';

  import AccountDrawer from './AccountDrawer.vue';

  import { columns, searchFormSchema, curdAuth } from './account.data';
  import RoleTree from '/@/views/admin/system/account/RoleTree.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { TreeItem } from '/@/components/Tree';
  import { isArray, isNumber } from '/@/utils/is';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { setSend } from '/@/logics/mitt/websocket';
  import { useUserStore } from '/@/store/modules/user';

  const treeData = ref<TreeItem[]>([]);
  const { createMessage, createConfirm } = useMessage();
  const userStore = useUserStore();
  const { clipboardRef, copiedRef } = useCopyToClipboard();

  const [registerDrawer, { openDrawer }] = useDrawer();
  const searchInfo = reactive<Recordable>({});
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
      width: 190,
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

  /**
   * 单独给玩家发消息
   * @param record
   */
  function handleSendUserMessage(record: Recordable) {
    const message = ref('');
    createConfirm({
      width: 500,
      iconType: 'info',
      title: () => '发送消息',
      content: () => {
        return h(Space, { direction: 'vertical', class: ['w-full', 'pr-4'] }, () => [
          h('div', null, '发送给:  ' + record.realname),
          h(Input.TextArea, {
            rows: 5,
            showCount: true,
            value: message.value,
            'onUpdate:value': (val) => (message.value = val),
          }),
        ]);
      },
      onOk() {
        if (message.value) {
          setSend({
            class: 'Admin\\Sysinfo',
            action: 'sendUserMessage',
            // 我是谁
            formId: userStore.userInfo?.id,
            // 我叫啥
            formName: userStore.userInfo?.realname,
            // 发给谁
            toId: record.id,
            // 发什么
            message: message.value,
          });
          createMessage.success('发送成功');
        }
      },
      onCancel() {
        message.value = '';
      },
    });
  }

  /**
   * 通知某个玩家刷新
   * @param record
   */
  function handleSendUserRefresh(record: Recordable) {
    setLoading(true);
    setSend({
      class: 'Admin\\Sysinfo',
      action: 'refreshUser',
      id: record.id,
    });
    setLoading(false);
    createMessage.success('操作成功');
  }
</script>
