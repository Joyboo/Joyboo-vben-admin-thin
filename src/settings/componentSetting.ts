// Used to configure the general configuration of some components without modifying the components

import type { SorterResult } from '../components/Table';
import { TableSizeEnum } from '/@/enums/sizeEnum';

export default {
  // basic-table setting
  table: {
    // Form interface request general configuration
    // support xxx.xxx.xxx
    fetchSetting: {
      // The field name of the current page passed to the background
      pageField: 'page',
      // The number field name of each page displayed in the background
      sizeField: 'pageSize',
      // Field name of the form data returned by the interface
      listField: 'items',
      // 合计字段
      footerField: 'summer',
      // 导出全部时发送的表头字段
      exportThField: '_th',
      // 导出全部时发送的文件名
      exprotFilename: '_fname',
      // Total number of tables returned by the interface field name
      totalField: 'total',
    },
    // Number of pages that can be selected
    pageSizeOptions: ['20', '50', '100', '200', '500'],
    // Default display quantity on one page
    defaultPageSize: 20,
    // Table Default Size
    defaultSize: TableSizeEnum.SMALL,
    // Custom general sort function
    defaultSortFn: (sortInfo: SorterResult) => {
      const { field, order } = sortInfo;
      return {
        // The sort field passed to the backend you
        _sortField: field,
        // Sorting method passed to the background asc/desc
        _sortValue: order,
      };
    },
    // Custom general filter function
    defaultFilterFn: (data: Partial<Recordable<string[]>>) => {
      return data;
    },
  },
  // scrollbar setting
  scrollbar: {
    // Whether to use native scroll bar
    // After opening, the menu, modal, drawer will change the pop-up scroll bar to native
    native: false,
  },
};
