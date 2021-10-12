<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #myMenuDrawer="{ model, field }">
        <Input v-model:value="model[field]" placeholder="组件">
          <template #addonAfter>
            <Tooltip title="使用LAYOUT组件" class="useLayout">
              <Icon icon="ant-design:layout-outlined" @click="model[field] = 'LAYOUT'" />
            </Tooltip>
          </template>
        </Input>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './menu.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { Tooltip, Input } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { getMenuList, menuAdd, menuEdit } from '/@/api/admin/system';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref(true);
  let id = 0;

  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
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
      id = data.record.id;
    }
    const treeData = await getMenuList();
    updateSchema({
      field: 'pid',
      componentProps: { treeData },
    });
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'));

  async function handleSubmit() {
    try {
      const values = await validate();

      if (typeof values.pid === 'undefined') {
        values.pid = 0;
      }

      setDrawerProps({ confirmLoading: true });

      if (unref(isUpdate)) {
        values.id = id;
        await menuEdit(values);
      } else {
        await menuAdd(values);
      }

      closeDrawer();
      emit('success');
    } catch (e) {
      console.log('menuDrawer catch', e);
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
