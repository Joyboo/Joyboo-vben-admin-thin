<template>
  <Table
    v-if="getDataSource.length"
    :showHeader="false"
    :bordered="false"
    :pagination="false"
    :dataSource="getDataSource"
    :rowKey="(r) => r[rowKey]"
    :columns="getColumns"
    tableLayout="fixed"
    :scroll="scroll"
    v-bind="summaryAttrs"
  />
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent, unref, computed, toRaw } from 'vue';
  import { Table } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { isFunction, isArray, isUnDef } from '/@/utils/is';
  import type { BasicColumn } from '../types/table';
  import { INDEX_COLUMN_FLAG, FETCH_SETTING } from '../const';
  import { useTableContext } from '../hooks/useTableContext';

  const SUMMARY_ROW_KEY = '_row';
  const SUMMARY_INDEX_KEY = '_index';
  const props = {
    summaryFunc: {
      type: [Function, Array] as PropType<Fn>,
    },
    summaryData: {
      type: Array as PropType<Recordable[]>,
    },
    summaryAttrs: {
      type: Object as PropType<Recordable>,
      default() {
        return { rowClassName: () => 'summaryRowClass', bordered: true };
      },
    },
    scroll: {
      type: Object as PropType<Recordable>,
    },
    rowKey: {
      type: String as PropType<string | ((record: Recordable) => string)>,
      default: 'key',
    },
  };

  export default defineComponent({
    name: 'BasicTableFooter',
    components: { Table },
    props,
    setup(props) {
      const table = useTableContext();

      const getDataSource = computed((): Recordable[] => {
        const { summaryFunc, summaryData, rowKey } = props;

        // 直传数据
        if (summaryData?.length) {
          summaryData.map((item, i) => {
            const rk = isFunction(rowKey) ? rowKey(item) : rowKey;
            if (isUnDef(item[rk])) {
              item[rk] = i;
            }
            return item;
          });
          return summaryData;
        }

        // 传Function
        if (isFunction(summaryFunc)) {
          let dataSource = toRaw(unref(table.getDataSource()));
          dataSource = summaryFunc(dataSource);
          dataSource.map((item, i) => {
            const rk = isFunction(rowKey) ? rowKey(item) : rowKey;
            if (isUnDef(item[rk])) {
              item[rk] = i;
            }
            return item;
          });
          return dataSource;
        }

        // 与服务端约定的默认字段
        const { footerField } = FETCH_SETTING;
        const rawData = toRaw(unref(table.getRawDataSource()));

        return isArray(rawData[footerField]) ? rawData[footerField] : [];
      });

      const getColumns = computed(() => {
        const dataSource = unref(getDataSource);
        const columns: BasicColumn[] = cloneDeep(table.getColumns());
        const index = columns.findIndex((item) => item.flag === INDEX_COLUMN_FLAG);
        const hasRowSummary = dataSource.some((item) => Reflect.has(item, SUMMARY_ROW_KEY));
        const hasIndexSummary = dataSource.some((item) => Reflect.has(item, SUMMARY_INDEX_KEY));

        if (index !== -1) {
          if (hasIndexSummary) {
            columns[index].customRender = ({ record }) => record[SUMMARY_INDEX_KEY];
            columns[index].ellipsis = false;
          } else {
            Reflect.deleteProperty(columns[index], 'customRender');
          }
        }

        if (table.getRowSelection() && hasRowSummary) {
          const isFixed = columns.some((col) => col.fixed === 'left');
          columns.unshift({
            width: 60,
            title: 'selection',
            key: 'selectionKey',
            align: 'center',
            ...(isFixed ? { fixed: 'left' } : {}),
            customRender: ({ record }) => record[SUMMARY_ROW_KEY],
          });
        }
        return columns;
      });
      return { getColumns, getDataSource };
    },
  });
</script>
