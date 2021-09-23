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
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { accountFormSchema } from './account.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  // import { adminAdd, adminEdit } from '/@/api/admin/system';

  export default defineComponent({
    name: 'AccountDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      let id = 0;

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 100,
        schemas: accountFormSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 12, md: 24 },
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        // 获取必要信息, todo 前置游戏、包等信息
        // const result = await adminAdd('GET');

        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
          });
          id = data.record.id;
        }
        /* const treeData = await getMenuList();
        updateSchema({
          field: 'pid',
          componentProps: { treeData },
        });*/
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
            // await adminEdit(values);
          } else {
            // await adminAdd(values);
          }

          closeDrawer();
          emit('success');
        } catch (e) {
          console.log('menuDrawer catch', e);
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return { registerDrawer, registerForm, getTitle, handleSubmit };
    },
  });
</script>

<style lang="less" scoped>
  .useLayout {
    cursor: pointer;

    &:hover {
      color: @primary-color;
    }
  }
</style>
