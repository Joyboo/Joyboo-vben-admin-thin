<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="isUpdate ? '编辑后台配置 (id: ' + rowId + ')' : '新增后台配置'"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './sysinfo.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { sysinfoEdit, sysinfoAdd } from '/@/api/admin/system';
  // import { useMessage } from '/@/hooks/web/useMessage';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref(false);
  const rowId = ref(0);
  // const { createConfirm, createMessage } = useMessage();

  const [registerForm, { resetFields, setFieldsValue, validate, updateSchema }] = useForm({
    labelWidth: 90,
    schemas: formSchema,
    showActionButtonGroup: false,
  });

  const [registerDrawer, { closeDrawer, changeLoading, changeOkLoading }] = useDrawerInner(
    async (data) => {
      resetFields();
      isUpdate.value = !!data?.isUpdate;

      if (unref(isUpdate)) {
        changeLoading(true);
        changeOkLoading(true);
        rowId.value = data.record.id;
        const result = await sysinfoEdit('GET', { id: data.record.id });
        setFieldsValue({
          ...result,
        });
      }

      updateSchema({ field: 'type', componentProps: { disabled: isUpdate.value } });

      changeLoading(false);
      changeOkLoading(false);
    },
  );

  async function handleSubmit() {
    try {
      changeLoading(true);
      changeOkLoading(true);

      const values = await validate();

      if (values.type === 2) {
        values.value = JSON.parse(values.value);
      }

      if (unref(isUpdate)) {
        values.id = rowId.value;
        await sysinfoEdit('POST', values);
      } else {
        await sysinfoAdd('POST', values);
      }

      closeDrawer();

      emit('success');
    } finally {
      changeLoading(false);
      changeOkLoading(false);
    }
  }
</script>
