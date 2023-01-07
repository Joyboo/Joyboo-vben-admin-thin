<template>
  <template v-if="isShowAll">
    <Dropdown
      placement="bottomLeft"
      :trigger="['click']"
      :dropMenuList="[
        {
          icon: 'excel-export|svg',
          text: t('component.excel.exportCurrentPage'),
          event: ExportEnum.CURR,
          onClick: exportCurrentPage,
          divider: true,
        },
        {
          icon: 'excel-export|svg',
          text: t('component.excel.exportAllPage'),
          event: ExportEnum.ALL,
          onClick: exportAllPage,
        },
      ]"
    >
      <Tooltip placement="top">
        <template #title>
          <span>{{ t('component.excel.exportModalTitle') }}</span>
        </template>
        <DownloadOutlined />
      </Tooltip>
    </Dropdown>
  </template>
  <template v-else-if="isAuth">
    <Tooltip placement="top">
      <template #title>
        <span>{{ t('component.excel.exportModalTitle') }}</span>
      </template>
      <DownloadOutlined @click="doExport" />
    </Tooltip>
  </template>
</template>

<script lang="ts" setup>
  import { toRaw, unref, computed } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { DownloadOutlined } from '@ant-design/icons-vue';
  import type { TableSetting } from '../../types/table';
  import { ExportEnum, BasicColumn } from '../../types/table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTableContext } from '../../hooks/useTableContext';
  import { jsonToSheetXlsx } from '/@/components/Excel';
  import { Dropdown } from '/@/components/Dropdown';
  import { isDef, isFunction, isString, isArray, isUnDef } from '/@/utils/is';
  import { FETCH_SETTING, ACTION_COLUMN_FLAG, ROW_KEY } from '../../const';
  import { useRouter } from 'vue-router';
  import { downloadByData } from '/@/utils/file/download';
  import { dateUtil } from '/@/utils/dateUtil';
  import { usePermission } from '/@/hooks/web/usePermission';

  const props = defineProps({
    setting: {
      type: Object as PropType<TableSetting>,
      default: () => ({ exportType: ExportEnum.NOT }),
    },
  });

  const { hasPermission } = usePermission();
  const table = useTableContext();
  const { t } = useI18n();
  const { footerField, exportThField, exprotFilename } = FETCH_SETTING;
  const { currentRoute } = useRouter();
  const title = unref(currentRoute).meta.title;

  // 权限认证
  const isAuth = computed<boolean>(() => {
    const { exportAuth = false } = props.setting;
    return (exportAuth && hasPermission(exportAuth)) || !exportAuth;
  });

  // 显示下拉框，同时展示导出当前页 和 导出全部页
  const isShowAll = computed<boolean>(() => {
    const { exportType, exportAllFn } = props.setting;
    return isAuth.value && exportType === ExportEnum.AND && isFunction(exportAllFn);
  });

  // 单选操作，导出当前页 或 导出全部页
  const doExport = () => {
    const { exportType, exportAllFn } = props.setting;
    switch (exportType) {
      case ExportEnum.CURR:
        return exportCurrentPage();
      case ExportEnum.ALL:
        if (isFunction(exportAllFn)) {
          exportAllPage();
        } else {
          console.error('导出全部需要传递function: TableSetting.exportAllFn');
        }
        break;
      default:
        console.error(`Unknown exportType: ${exportType}`);
        break;
    }
  };

  function getColumns(): BasicColumn[] {
    return table
      .getColumns()
      .filter((item) => item.flag !== ACTION_COLUMN_FLAG && !item.defaultHidden);
  }

  // 合计行数据
  function getSummaryData() {
    // 直传summaryData
    const { summaryFunc, summaryData, rowKey } = table.getBindValues.value;
    if (summaryData?.length) {
      summaryData.map((item, i) => {
        if (isString(rowKey) && isUnDef(item[rowKey])) {
          item[rowKey] = i;
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
        if (isString(rowKey) && isUnDef(item[rowKey])) {
          item[rowKey] = i;
        }
        return item;
      });
      return dataSource;
    }
    // 与服务端约定的默认字段
    const rawData = toRaw(unref(table.getRawDataSource()));
    return isArray(rawData[footerField]) ? rawData[footerField] : [];
  }

  // 导出全部页
  async function exportAllPage() {
    table.setLoading(true);
    try {
      const columns = getColumns();
      // _th=ymd=日期|reg=注册|login=登录
      let th: string[] = [];
      columns.forEach((col: BasicColumn) => {
        th.push(col.dataIndex + '=' + col.title);
      });
      const header = {};
      header[exportThField] = th.join('|');
      const ymd = dateUtil().format('YYYYMMDDHHmmss');
      const filename = `${title}-${ymd}.xlsx`;
      header[exprotFilename] = filename;

      const { exportAllFn } = props.setting;
      if (isFunction(exportAllFn)) {
        const { data, headers } = await exportAllFn(header);
        downloadByData(data, filename, headers['content-type']);
      }
    } catch (e) {
      console.error('导出全部失败 ', e);
    } finally {
      table.setLoading(false);
    }
  }

  // 导出当前页
  function exportCurrentPage() {
    const columns = getColumns();
    // 表格数据
    const dataSource = table.getDataSource();
    // 合计行数据
    const summer = getSummaryData();

    // 计算表头
    const header = {};
    columns.forEach((item) => {
      if (isString(item.dataIndex)) {
        header[item.dataIndex] = item.title;
      }
    });

    // 有些Table数据是通过customRender渲染的，运行它获取最终表格数据
    // 需注意的是 customRender 也允许为插槽，暂不支持插槽模式渲染的数据
    const data: any[] = [];

    // 计算单行数据
    const tableRowRender = (dataItem: any) => {
      const row = {};
      columns.forEach((columnItem: BasicColumn) => {
        if (isDef(columnItem.dataIndex)) {
          const col = isFunction(columnItem.customRender)
            ? columnItem.customRender({
                text: dataItem[columnItem.dataIndex],
                record: dataItem,
                index: dataItem[ROW_KEY],
                /**
                 * 此量为自定义字段, 用于在customRender中判断是否导出模式，以返回不同类型值
                 * 为什么要有此量? 因为customRender允许返回 string | VNode | Jsx, 而导出模式只能为string类型
                 */
                exportMode: true,
              })
            : dataItem[columnItem.dataIndex] ?? '';
          row[columnItem.dataIndex] = col;
        }
      });
      return row;
    };

    dataSource.forEach((dataSourceItem: any) => {
      const row = tableRowRender(dataSourceItem);
      row && data.push(row);
    });

    if (isArray(summer) && summer.length > 0) {
      summer.forEach((summerItem) => {
        const row = tableRowRender(summerItem);
        row && data.push(row);
      });
    }

    jsonToSheetXlsx({
      data,
      header,
      filename: `${title}.xlsx`,
      json2sheetOpts: {
        // 指定顺序
        header: Object.keys(header),
      },
    });
  }
</script>

<style lang="less" scoped></style>
