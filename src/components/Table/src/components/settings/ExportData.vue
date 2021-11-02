<template>
  <template v-if="setting.exportType === ExportEnum.AND && isFunction(setting.exportAllFn)">
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
  <template v-else>
    <Tooltip placement="top">
      <template #title>
        <span>{{ t('component.excel.exportModalTitle') }}</span>
      </template>
      <DownloadOutlined @click="doExport" />
    </Tooltip>
  </template>
</template>

<script lang="ts" setup>
  import { unref } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { DownloadOutlined } from '@ant-design/icons-vue';
  import type { TableSetting } from '../../types/table';
  import { ExportEnum, BasicColumn } from '../../types/table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTableContext } from '../../hooks/useTableContext';
  import { jsonToSheetXlsx } from '/@/components/Excel';
  import { Dropdown } from '/@/components/Dropdown';
  import { isDef, isFunction, isString, isArray } from '/@/utils/is';
  import { FETCH_SETTING, ACTION_COLUMN_FLAG, ROW_KEY } from '../../const';
  import { get } from 'lodash-es';
  import { useRouter } from 'vue-router';
  import { downloadByData } from '/@/utils/file/download';

  const props = defineProps({
    setting: {
      type: Object as PropType<TableSetting>,
      default() {
        return { exportType: ExportEnum.NOT };
      },
    },
  });

  const table = useTableContext();
  const { t } = useI18n();
  const { footerField, listField, exportThField, exprotFilename } = FETCH_SETTING;
  const { currentRoute } = useRouter();
  const title = unref(currentRoute).meta.title;

  // 处理非ALL操作
  const doExport = () => {
    switch (props.setting.exportType) {
      case ExportEnum.CURR:
        return exportCurrentPage();
      case ExportEnum.ALL:
        if (isFunction(props.setting.exportAllFn)) {
          return exportAllPage();
        }
      default:
        console.error('Export All Need Function Type Props: TableSetting.exportAllFn!!!');
        break;
    }
  };

  // 导出全部页
  async function exportAllPage() {
    table.setLoading(true);
    try {
      // 获取Columns并排除掉操作列
      const columns = table.getColumns().filter((item) => item.flag !== ACTION_COLUMN_FLAG);

      // 表头 _th=ymd=日期|reg=注册|login=登录
      let th: string[] = [];
      columns.forEach((col: BasicColumn) => {
        th.push(col.dataIndex + '=' + col.title);
      });
      const header = {};
      header[exportThField] = th.join('|');

      const filename = title + '-' + new Date().getTime() + '.xlsx';
      header[exprotFilename] = filename;
      // table.setProps({ searchInfo : header});
      if (isFunction(props.setting.exportAllFn)) {
        const respose = await props.setting.exportAllFn(header);
        downloadByData(respose.data, filename, respose.headers['content-type']);
      }
    } catch (e) {
      console.error('导出全部失败 ', e);
    } finally {
      table.setLoading(false);
    }
  }

  // 导出当前页
  function exportCurrentPage() {
    // 获取Columns并排除掉操作列
    const columns = table.getColumns().filter((item) => item.flag !== ACTION_COLUMN_FLAG);
    // getDataSource无法获取到传给BasicTable的Props的合计行
    // const dataSource = table.getDataSource();
    const rawData = table.getRawDataSource();

    // todo 无法获取到afterFetch的Prop , 处理列数据请使用customRender
    // 表格数据
    const dataSource = Array.isArray(rawData) ? rawData : get(rawData, listField);
    // 合计行数据
    const summer = Array.isArray(rawData) ? [] : get(rawData, footerField) ?? [];

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
      data: data,
      header: header,
      filename: title + '.xlsx',
      json2sheetOpts: {
        // 指定顺序
        header: Object.keys(header),
      },
    });
  }
</script>

<style lang="less" scoped></style>
