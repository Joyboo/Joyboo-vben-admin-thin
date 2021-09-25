<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="70%"
    @ok="handleSubmit"
  >
    <Tabs v-model:activeKey="currActiveKey">
      <TabPane
        :key="index.toString()"
        :tab="item.name"
        force-render
        v-for="(item, index) in refForm"
      >
        <BasicForm @register="item.registerForm">
          <template #makeKey="{ model, field }">
            <Input v-model:value="model[field]">
              <template #addonAfter>
                <Tooltip title="点击随机生成">
                  <Icon
                    icon="ant-design:barcode-outlined"
                    style="cursor: pointer"
                    @click="getPackageKey(model, field)"
                  />
                </Tooltip>
              </template>
            </Input>
          </template>
          <template #adjust="{ model, field }">
            <!--插槽内嵌表单-->
            <AdjustEventSlot :adjustEvent="model[field]" />
          </template>
        </BasicForm>
      </TabPane>
    </Tabs>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { Input, Tooltip, Tabs, TabPane } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { BasicForm, FormProps, useForm } from '/@/components/Form/index';
  import { MyFormItemType, FormList } from './package.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { packageAdd, packageeEdit, packageGetKey } from '/@/api/admin/app';
  import { useMessage } from '/@/hooks/web/useMessage';
  import AdjustEventSlot from './AdjustEventSlot.vue';

  export default defineComponent({
    name: 'PackageDrawer',
    components: { BasicDrawer, BasicForm, AdjustEventSlot, Input, Tooltip, Icon, Tabs, TabPane },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const currActiveKey = ref('0');
      const { createMessage } = useMessage();

      const fromPropsLayout: FormProps = {
        labelWidth: 130,
        showActionButtonGroup: false,
      };

      const refForm: MyFormItemType[] = [];
      for (const item of FormList) {
        const [registerForm, methods] = useForm(
          Object.assign({}, fromPropsLayout, { schemas: item.schemas }),
        );
        refForm.push({ registerForm, methods, name: item.name } as MyFormItemType);
      }

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        // 打开时指定选中第一项
        currActiveKey.value = '0';

        refForm.forEach(async (_item) => {
          await _item.methods.resetFields();
          if (unref(isUpdate)) {
            await _item.methods.setFieldsValue({ ...data.record });
          } else {
            await _item.methods.removeSchemaByFiled('id');
          }
        });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增游戏' : '编辑游戏'));

      async function handleSubmit() {
        try {
          let post = {};

          for (const item of refForm) {
            const val = await item.methods.validate();
            post = Object.assign({}, post, val);
          }

          setDrawerProps({ confirmLoading: true });

          if (unref(isUpdate)) {
            await packageeEdit('POST', post);
          } else {
            await packageAdd('POST', post);
          }

          createMessage.success(getTitle.value + '成功');
          closeDrawer();
          emit('success');
        } catch (e) {
          createMessage.error(getTitle.value + '失败');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      function getPackageKey(model, field) {
        let column: string = field;
        const index = field.indexOf('.');
        if (index !== -1) {
          // 转换extension.logkey
          column = column.slice(index + 1);
        }
        packageGetKey(column)
          .then((result) => {
            model[field] = result;
          })
          .catch((_) => {});
      }

      const { getIsMobile } = useAppInject();

      return {
        registerDrawer,
        refForm,
        getTitle,
        handleSubmit,
        getPackageKey,
        getIsMobile,
        currActiveKey,
      };
    },
  });
</script>
