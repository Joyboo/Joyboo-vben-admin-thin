<template>
  <PageWrapper
    v-loading="loadingRef"
    contentBackground
    :contentStyle="{ padding: '50px' }"
    title="个人设置"
  >
    <BasicForm @register="register" />
    <template #rightFooter>
      <a-button type="primary" @click="handleSubmit">保存修改</a-button>
    </template>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref, onBeforeMount } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form';
  import { modifyFormSchema } from './account.data';
  import { adminModify } from '/@/api/admin/system';
  import { deepMerge } from '/@/utils';
  import { treeMap } from '/@/utils/helper/treeHelper';

  const loadingRef = ref(false);
  // 源数据（修改的几个字段会合并到源数据中提交）
  const dataSource = ref<Recordable>({});

  const userStore = useUserStore();
  const { createMessage } = useMessage();

  const [register, { setFieldsValue, getFieldsValue, updateSchema, validate }] = useForm({
    layout: 'vertical',
    schemas: modifyFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 16, offset: 4 },
  });

  onBeforeMount(async () => {
    loadingRef.value = true;
    try {
      const { menuList, result } = await adminModify('GET');
      dataSource.value = result;

      await updateSchema({
        field: 'extension.homePath',
        componentProps: {
          treeData: treeMap(menuList, {
            conversion: (item) => {
              item.disabled = item.type !== 1;
              return item;
            },
          }),
        },
      });
      await setFieldsValue({ ...result });
    } catch (e) {
      console.error(e);
      createMessage.error('出错了');
    } finally {
      loadingRef.value = false;
    }
  });

  async function handleSubmit() {
    loadingRef.value = true;
    try {
      await validate();

      const origin: Recordable = { ...dataSource.value };
      await adminModify('POST', deepMerge(origin, getFieldsValue()));

      // 重新获取用户信息
      await userStore.getUserInfoAction();
      createMessage.success('操作成功');
    } catch (e) {
      console.error('handleSubmit error ', e);
    } finally {
      loadingRef.value = false;
    }
  }
</script>

<style lang="less" scoped></style>
