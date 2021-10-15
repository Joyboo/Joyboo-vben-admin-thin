<template>
  <BasicTable @register="registerTable" />
</template>

<script lang="ts" setup name="Expense">
  import { computed, ref } from 'vue';
  import { BasicTable, useTable, FormSchema, BasicColumn } from '/@/components/Table';
  import { expenseIndex } from '/@/api/admin/ad';
  import { formatDaysAgo, timePikerExtra } from '/@/utils/dateUtil';
  import { useUserStore } from '/@/store/modules/user';
  import { isFunction, isUnDef } from '/@/utils/is';

  const userStore = useUserStore();
  const gameOptions = computed(() => userStore.getGameListOptions);
  const gameKeyValue = computed(() => useUserStore().gameKeyValue);
  const packageOptions = ref<OptionsItem[]>([]);

  const searchFormSchema: FormSchema[] = [
    {
      field: 'gameid',
      label: ' ',
      component: 'Select',
      defaultValue: [], // todo 默认值
      componentProps: {
        options: gameOptions.value,
        mode: 'multiple',
        maxTagCount: 0,
        placeholder: '游戏',
        maxTagPlaceholder: (values: Array<number>) => {
          return '已选' + values.length + '个游戏';
        },
        onChange: async (value: number | Array<number>) => {
          if (isFunction(getForm)) {
            getForm().updateSchema({
              field: 'pkgbnd',
              componentProps: { options: await userStore.filterPackageByGameids(value) },
            });
          }
        },
      },
      // slot: 'gameids',
      colProps: { xs: 24, sm: 24, md: 12, lg: 4, xl: 4, xxl: 3 },
    },
    {
      field: 'pkgbnd',
      label: ' ',
      component: 'Select',
      defaultValue: [], // todo 默认值
      componentProps: {
        options: packageOptions.value,
        mode: 'multiple',
        maxTagCount: 0,
        placeholder: '包',
        maxTagPlaceholder: (values: Array<number>) => {
          return '已选' + values.length + '个包';
        },
      },
      // slot: 'pkgbnd',
      colProps: { xs: 24, sm: 24, md: 12, lg: 4, xl: 4, xxl: 3 },
    },
    {
      field: 'time',
      label: ' ',
      component: 'RangePicker',
      defaultValue: [formatDaysAgo(-14), formatDaysAgo()],
      componentProps: {
        showTime: false,
        ranges: timePikerExtra(),
      },
      colProps: { xs: 24, sm: 24, md: 12, lg: 6, xl: 6, xxl: 4 },
    },
  ];

  const columns: BasicColumn[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      sorter: true,
      width: 80,
    },
    {
      dataIndex: 'etime',
      title: '日期',
      sorter: true,
      width: 120,
    },
    {
      dataIndex: 'gameid',
      title: '所属游戏',
    },
  ];

  const [registerTable, { getForm }] = useTable({
    title: '广告消耗列表',
    api: expenseIndex,
    columns,
    formConfig: {
      compact: true,
      labelWidth: 10,
      schemas: searchFormSchema,
      autoAdvancedLine: 1,
      showAdvancedButton: true,
      fieldMapToTime: [['time', ['begintime', 'endtime'], 'YYYY-MM-DD']],
    },
    afterFetch(items) {
      // id替换为name
      items = items.map((item: any) => {
        if (isUnDef(gameKeyValue.value[item.gameid])) {
          item.gameid = gameKeyValue.value[item.gameid];
        }
        return item;
      });
      return items;
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
  });
</script>

<style lang="less" scoped></style>
