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
          <template v-if="item.key === 'base'" #makeKey="{ model, field }">
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
          <template v-if="item.key === 'adjust'" #adjust>
            <BasicForm @register="ajRegister">
              <template #footer>
                <Tooltip title="新增一行">
                  <Button
                    ghost
                    color="success"
                    class="ml-2"
                    preIcon="ant-design:plus-outlined"
                    @click="add"
                  />
                </Tooltip>
                <Tooltip title="提交 （仅提交adjust事件的数据）">
                  <Button
                    v-if="isUpdate"
                    ghost
                    color="success"
                    class="ml-2"
                    preIcon="ant-design:check-outlined"
                    @click="saveAdEvent"
                  />
                </Tooltip>
              </template>
              <template #del="{ field }">
                <Tooltip title="删除此行">
                  <Button
                    ghost
                    color="warning"
                    preIcon="ant-design:delete-outlined"
                    @click="del(field)"
                  />
                </Tooltip>
              </template>
            </BasicForm>
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
  import { Button } from '/@/components/Button';
  import { BasicForm, FormProps, useForm } from '/@/components/Form/index';
  import { FormList, formSchemaAdjustEvent } from './package.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { isArray } from '/@/utils/is';
  import {
    packageAdd,
    packageeEdit,
    packageGetKey,
    packageSaveAdjustEvent,
  } from '/@/api/admin/app';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { MyFormItemType } from '/#/utils';

  export default defineComponent({
    name: 'PackageDrawer',
    components: { BasicDrawer, BasicForm, Input, Tooltip, Icon, Tabs, TabPane, Button },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const n = ref(1);
      const currActiveKey = ref('0');
      const { createMessage } = useMessage();
      const userStore = useUserStore();
      const gamelist = computed(() => userStore.getGameListOptions);

      const fromPropsLayout: FormProps = {
        labelWidth: 130,
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

        refForm.forEach(async (f) => {
          await f.methods.resetFields();

          // 设置游戏数据
          f.methods.updateSchema({
            field: 'gameid',
            componentProps: { options: gamelist },
          });
        });
        if (unref(isUpdate)) {
          const result = packageeEdit('GET', { id: data.record.id });
          if (!isArray(result['extension.qzf.pf'])) {
            result['extension.qzf.pf'] = result['extension.qzf.pf'].split(',');
          }
          refForm.forEach(async (f) => {
            await f.methods.setFieldsValue({ ...result });
          });
        } else {
          refForm.forEach(async (f) => {
            await f.methods.removeSchemaByFiled('id');
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增游戏' : '编辑游戏'));

      async function handleSubmit() {
        try {
          let post = {};

          for (const item of refForm) {
            const val = await item.methods.validate();
            post = Object.assign({}, post, val);
          }

          // 将 adjust 处理为键值对json
          const adjust = await toKeyValue();
          post = Object.assign({}, post, { 'extension.adjust.event': adjust });
          // ["paypal", "payssion"] => 'paypal,payssion'
          if (isArray(post['extension.qzf.pf'])) {
            post['extension.qzf.pf'] = post['extension.qzf.pf'].join(',');
          }

          setDrawerProps({ confirmLoading: true });

          const doAxios = unref(isUpdate) ? packageeEdit : packageAdd;
          await doAxios('POST', post);

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

      /******** adjust event *********/
      const [ajRegister, ajMethods] = useForm({
        schemas: formSchemaAdjustEvent,
        labelWidth: 100,
        actionColOptions: { span: 24 },
        showResetButton: false,
        showSubmitButton: false,
      });

      async function toKeyValue() {
        try {
          const data = await ajMethods.validate();
          const max = unref(n);
          const adjust = {};
          for (let i = 0; i < max; i++) {
            const key = `key${i}`;
            const value = `value${i}`;
            adjust[data[key]] = data[value];
          }
          console.log('toKeyValue adjust, ', adjust);
          return adjust;
        } catch (e) {
          // throw new Error(e.toString());
        }
      }

      function saveAdEvent() {
        toKeyValue()
          .then((adjust) => {
            packageSaveAdjustEvent(adjust);
          })
          .catch((_) => {});
      }

      async function add() {
        const curr = n.value;
        const appto = curr - 1;

        // 追加到操作列之前
        await ajMethods.appendSchemaByField(
          {
            field: `key${curr}`,
            component: 'Input',
            componentProps: {
              allowClear: false,
            },
            required: true,
            label: 'Key',
            colProps: {
              span: 8,
            },
          },
          `${appto}`,
        );
        // 追加到上一个
        await ajMethods.appendSchemaByField(
          {
            field: `value${curr}`,
            component: 'Input',
            componentProps: {
              allowClear: false,
            },
            label: 'Value',
            required: true,
            colProps: {
              span: 8,
            },
          },
          `key${curr}`,
        );

        await ajMethods.appendSchemaByField(
          {
            field: `${curr}`,
            component: 'Input',
            label: ' ',
            colProps: {
              span: 8,
            },
            slot: 'del',
          },
          `value${curr}`,
        );
        n.value++;
      }

      function del(field) {
        if (n.value > 1) {
          ajMethods.removeSchemaByFiled([`key${field}`, `value${field}`, `${field}`]);
          n.value--;
        }
      }

      return {
        registerDrawer,
        refForm,
        getTitle,
        handleSubmit,
        getPackageKey,
        getIsMobile,
        currActiveKey,
        isUpdate,
        saveAdEvent,
        add,
        del,
        ajRegister,
      };
    },
  });
</script>
