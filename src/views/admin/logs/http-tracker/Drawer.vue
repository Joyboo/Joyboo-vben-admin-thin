<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" showFooter title="追踪详情" width="50%">
    <Description @register="registerDesc" :data="dataSource" />
    <template #centerFooter>
      <Popconfirm title="请确认操作" @confirm="handleRepeat">
        <a-button type="primary" color="warning">复发</a-button>
      </Popconfirm>
    </template>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Popconfirm } from 'ant-design-vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { Description, useDescription } from '/@/components/Description';
  import { descColumns } from './data';

  const emit = defineEmits(['repeat', 'register']);

  const dataSource = ref<Recordable>({});

  const [registerDrawer] = useDrawerInner(async (data) => {
    console.log('open data ', data);

    dataSource.value = data;
  });
  const [registerDesc] = useDescription({
    schema: descColumns,
    column: 2,
  });

  function handleRepeat() {
    emit('repeat', { ...dataSource.value });
  }
</script>

<style lang="less" scoped></style>
