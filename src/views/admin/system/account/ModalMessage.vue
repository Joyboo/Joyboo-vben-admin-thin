<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="发送消息"
    width="500px"
    @ok="handleSubmit"
  >
    <template #title>
      <div v-if="isAll">给所有在线管理员发送消息</div>
      <Space v-else>
        <Avatar :src="dataSource.avatar || HeaderImg" />
        {{ dataSource.realname }}
      </Space>
    </template>

    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Space, Avatar } from 'ant-design-vue';
  import HeaderImg from '/@/assets/images/header.jpg';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { messageFormSchema } from './account.data';
  import { useUserStore } from '/@/store/modules/user';
  import { setSend } from '/@/logics/mitt/websocket';
  import { useMessage } from '/@/hooks/web/useMessage';

  const isAll = ref(false);
  const dataSource = ref<Recordable>({});
  const userStore = useUserStore();
  const { createMessage } = useMessage();

  const [registerForm, { validate, getFieldsValue, resetFields }] = useForm({
    layout: 'vertical',
    schemas: messageFormSchema,
    showActionButtonGroup: false,
  });
  const [register, { changeLoading, changeOkLoading, closeModal }] = useModalInner(async (data) => {
    console.log('open data ', data);
    isAll.value = !!data.all;
    dataSource.value = data.record ?? {};

    await resetFields();
  });

  async function handleSubmit() {
    changeLoading(true);
    changeOkLoading(true);
    try {
      await validate();
      const values = getFieldsValue();

      const { id: formId, avatar: formAvatar, realname: formName } = userStore.getUserInfo;

      setSend(
        Object.assign(values, {
          class: 'Admin\\Admin',
          action: 'message',
          toId: isAll.value ? 'all' : dataSource.value.id,
          toName: isAll.value ? '所有人' : dataSource.value.realname,
          toAvatar: dataSource.value.avatar ?? '',
          formId,
          formName,
          formAvatar,
        }),
      );

      createMessage.success('发送成功');
      closeModal();
    } catch (e) {
      console.error(e);
    } finally {
      changeLoading(false);
      changeOkLoading(false);
    }
  }
</script>
