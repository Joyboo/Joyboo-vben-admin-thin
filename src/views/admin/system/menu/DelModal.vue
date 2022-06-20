<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    width="500px"
    title="确认删除操作"
    @ok="handleSubmit"
  >
    <BasicForm v-show="hasChid" @register="registerForm">
      <template #formHeader>
        <Space class="mt-4 mb-4">
          <span>此菜单包含</span>
          <span :style="{ color: 'red' }">{{ childNum }}</span>
          <span>个子菜单</span>
        </Space>
      </template>
    </BasicForm>
    <Space v-show="!hasChid" direction="vertical" class="one-tips">
      <div :style="{ color: 'red' }">确定要删除此菜单吗</div>
      <div class="ant-tag-cyan">{{ dataSource.title }}</div>
    </Space>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { isArray } from '/@/utils/is';
  import { ref, computed } from 'vue';
  import { Space } from 'ant-design-vue';
  import { menuDel } from '/@/api/admin/system';
  import { treeMap } from '/@/utils/helper/treeHelper';
  import { BasicForm, useForm } from '/@/components/Form';
  import { TreeItem } from '/@/components/Tree';
  import { useOnceStore } from '/@/store/modules/once';
  import { delSchemas } from './menu.data';
  import { useMessage } from '/@/hooks/web/useMessage';

  const emit = defineEmits(['register', 'success']);
  const onceStore = useOnceStore();
  const { createMessage } = useMessage();
  const dataSource = ref<TreeItem>({});
  // 有没有子元素
  const hasChid = computed(() => {
    return isArray(dataSource.value.children) && dataSource.value.children.length > 0;
  });
  // 所有子元素的id
  const childIds = computed(() => {
    const idArray: any[] = [];
    if (hasChid.value) {
      treeMap(dataSource.value.children ?? [], {
        conversion: (item) => {
          idArray.push(item.id);
          return item;
        },
      });
    }
    return idArray;
  });
  // 子元素数量
  const childNum = computed(() => childIds.value.length);

  const [register, { changeOkLoading, closeModal }] = useModalInner(async (data) => {
    // console.log(data);
    dataSource.value = data;

    const treeData = await onceStore.menuTreeDisabledId({ id: data.id });
    await resetFields();
    await updateSchema({
      field: 'changeid',
      componentProps: { treeData },
    });
  });
  const [registerForm, { updateSchema, validate, resetFields }] = useForm({
    layout: 'vertical',
    schemas: delSchemas,
    showActionButtonGroup: false,
  });

  async function handleSubmit() {
    changeOkLoading(true);
    try {
      const values = await validate();
      // 当前
      values.id = dataSource.value.id;
      // 儿子孙子们
      values.chilrenids = childIds.value.join(',');

      await menuDel(values);

      createMessage.success('操作成功');
      emit('success');
      closeModal();
    } catch (e) {
      console.error(e);
    } finally {
      changeOkLoading(false);
    }
  }
</script>

<style lang="less" scoped>
  .one-tips {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    font-size: 1.1rem;
  }
</style>
