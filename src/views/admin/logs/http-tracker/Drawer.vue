<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" showFooter title="追踪详情" width="50%">
    <Description @register="registerDesc" :data="dataSource" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { Description, useDescription } from '/@/components/Description';
  import { descColumns } from './data';

  const dataSource = ref({});

  const [registerDrawer] = useDrawerInner(async (data) => {
    console.log('open data ', data);

    dataSource.value = data;
  });
  const [registerDesc] = useDescription({
    schema: descColumns,
    column: 2,
  });
</script>

<style lang="less" scoped></style>
