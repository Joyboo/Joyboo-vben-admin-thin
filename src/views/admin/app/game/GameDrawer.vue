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
      <template #myGameKey="{ model, field }">
        <Input v-model:value="model[field]">
          <template #addonAfter>
            <Tooltip title="点击随机生成">
              <Icon
                icon="ant-design:barcode-outlined"
                style="cursor: pointer"
                @click="getGameKey(model, field)"
              />
            </Tooltip>
          </template>
        </Input>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { Input, Tooltip } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './game.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { adminAdd, adminEdit } from '/@/api/admin/system';

  export default defineComponent({
    name: 'GameDrawer',
    components: { BasicDrawer, BasicForm, Input, Tooltip, Icon },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);

      const [registerForm, { resetFields, setFieldsValue, removeSchemaByFiled, validate }] =
        useForm({
          labelWidth: 120,
          schemas: formSchema,
          showActionButtonGroup: false,
        });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告

        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
          });
        } else {
          // todo ok的话，menu和role都这么干
          removeSchemaByFiled('id');
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增游戏' : '编辑游戏'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });

          if (unref(isUpdate)) {
            await adminEdit('POST', values);
          } else {
            await adminAdd('POST', values);
          }
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      async function getGameKey(model, field) {
        console.log('click getGameKey ', model, field);
      }

      const { getIsMobile } = useAppInject();

      return {
        registerDrawer,
        registerForm,
        getTitle,
        handleSubmit,
        getGameKey,
        getIsMobile,
      };
    },
  });
</script>
