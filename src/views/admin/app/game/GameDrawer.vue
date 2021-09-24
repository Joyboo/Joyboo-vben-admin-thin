<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
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
      </TabPane>
    </Tabs>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { Input, Tooltip, Tabs, TabPane } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { BasicForm, FormProps, useForm } from '/@/components/Form/index';
  import { MyFormItemType, FormList } from './game.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { gameAdd, gameEdit, gameGetKey } from '/@/api/admin/app';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'GameDrawer',
    components: { BasicDrawer, BasicForm, Input, Tooltip, Icon, Tabs, TabPane },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const currActiveKey = ref('0');
      const { createMessage } = useMessage();

      const fromPropsLayout: FormProps = {
        labelWidth: 120,
        showActionButtonGroup: false,
      };

      const refForm: MyFormItemType[] = [];
      for (const item of FormList) {
        const [registerForm, methods] = useForm(
          Object.assign({}, fromPropsLayout, { schemas: item.schemas }),
        );
        refForm.push({ registerForm, methods, name: item.name, key: item.key } as MyFormItemType);
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
            await gameEdit('POST', post);
          } else {
            await gameAdd('POST', post);
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

      function getGameKey(model, field) {
        // 转换extension.logkey
        const column = field.slice(field.indexOf('.') + 1);
        gameGetKey(column)
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
        getGameKey,
        getIsMobile,
        currActiveKey,
      };
    },
  });
</script>
