<template>
  <BasicDrawer
    :title="isUpdate ? '编辑账号(id=' + rowId + ')' : '新增账号'"
    width="50%"
    showFooter
    :destroyOnClose="true"
    @register="register"
    @ok="handleSubmit"
    @close="handleClose"
  >
    <Tabs v-model:activeKey="activeKey" tabPosition="left">
      <TabPane v-for="item in dataTabs" :key="item.key" :tab="item.tab" force-render>
        <BasicForm @register="item.Form[0]" :style="{ minHeight: '50vh' }" />
      </TabPane>
    </Tabs>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Tabs } from 'ant-design-vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { dataTabs } from './account.data';
  import { deepMerge } from '/@/utils';
  import { adminAdd, adminEdit } from '/@/api/admin/system';
  import { omit, pick } from 'lodash-es';

  const TabPane = Tabs.TabPane;
  const emit = defineEmits(['success', 'register']);
  const { createMessage } = useMessage();

  const [baseFormSchems] = dataTabs;

  const rowId = ref(0);
  const activeKey = ref(baseFormSchems.key);
  const isUpdate = ref(false);

  const [register, { changeOkLoading, changeLoading, closeDrawer }] = useDrawerInner(
    async (data) => {
      changeLoading(true);
      changeOkLoading(true);
      isUpdate.value = !!data.isUpdate;

      // await resetFieldses();

      rowId.value = isUpdate.value ? data.record.id : 0;

      baseFormSchems.Form[1].updateSchema([
        {
          field: 'username',
          componentProps: { disabled: isUpdate.value },
        },
        {
          field: 'password',
          subLabel: isUpdate.value ? '留空表示不修改密码' : '',
        },
      ]);

      if (isUpdate.value) {
        const result: Recordable = await adminEdit('GET', { id: rowId.value });

        const beforeField = ['rid'];

        for (const item of dataTabs) {
          const { setFieldsValue, resetFields } = item.Form[1];
          await resetFields();
          // 先set动态校验规则的依赖数据
          await setFieldsValue(pick(result, beforeField));
          await setFieldsValue(omit({ ...result, id: rowId.value }, beforeField));
        }
      }
      changeLoading(false);
      changeOkLoading(false);
    },
  );

  async function handleSubmit() {
    let lastKey = '';
    try {
      changeOkLoading(true);

      const post: Recordable = {};
      for (const item of dataTabs) {
        lastKey = item.key;
        const { validate, getFieldsValue } = item.Form[1];
        await validate();
        deepMerge(post, getFieldsValue());
      }

      if (isUpdate.value) {
        adminEdit('POST', Object.assign({ id: rowId.value }, post));
      } else {
        adminAdd('POST', omit(post, 'id'));
      }

      createMessage.success('操作成功');
      closeDrawer();
      emit('success');
    } catch (e) {
      // 验证失败或出错，切换到对应标签页
      activeKey.value = lastKey;
      console.log(e);
    } finally {
      changeOkLoading(false);
    }
  }

  async function handleClose() {
    await resetFieldses();
    activeKey.value = baseFormSchems.key;
  }

  async function resetFieldses() {
    for (const item of dataTabs) {
      const { resetFields } = item.Form[1];
      await resetFields();
    }
  }
</script>

<style lang="less" scoped></style>
