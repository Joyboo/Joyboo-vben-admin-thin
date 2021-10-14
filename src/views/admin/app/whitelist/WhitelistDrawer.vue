<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './whitelist.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { whitelistAdd, whitelistEdit } from '/@/api/admin/app';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref(true);
  const rowId = ref(0);

  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    if (unref(isUpdate)) {
      setFieldsValue({
        ...data.record,
      });
      rowId.value = data.record.id;
    }
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));

  async function handleSubmit() {
    try {
      const values = await validate();

      setDrawerProps({ confirmLoading: true });

      if (unref(isUpdate)) {
        values.id = rowId.value;
        await whitelistEdit('POST', values);
      } else {
        await whitelistAdd('POST', values);
      }

      closeDrawer();
      emit('success');
    } catch (e) {
      console.log('catch', e);
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>

<style lang="less" scoped>
  .useLayout {
    cursor: pointer;

    &:hover {
      color: @primary-color;
    }
  }
</style>
