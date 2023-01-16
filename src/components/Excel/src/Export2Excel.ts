import xlsx from 'xlsx';
import type { WorkBook } from 'xlsx';
import type { JsonToSheet, AoAToSheet } from './typing';
import { deepMerge } from '/@/utils';

const { utils, writeFile } = xlsx;

const DEF_FILE_NAME = 'excel-list.xlsx';

export function jsonToSheetXlsx<T = any>({
  data,
  header,
  filename = DEF_FILE_NAME,
  json2sheetOpts = {},
  write2excelOpts = { bookType: 'xlsx' },
  workSheetOpts = {},
}: JsonToSheet<T>) {
  const arrData = [...data];
  if (header) {
    arrData.unshift(header);
    json2sheetOpts.skipHeader = true;
  }

  const worksheet = utils.json_to_sheet(arrData, json2sheetOpts);
  deepMerge(worksheet, workSheetOpts);

  /* add worksheet to workbook */
  const workbook: WorkBook = {
    SheetNames: [filename],
    Sheets: {
      [filename]: Object.assign(worksheet, workSheetOpts),
    },
  };
  /* output format determined by filename */
  writeFile(workbook, filename, write2excelOpts);
  /* at this point, out.xlsb will have been downloaded */
}

export function aoaToSheetXlsx<T = any>({
  data,
  header,
  filename = DEF_FILE_NAME,
  write2excelOpts = { bookType: 'xlsx' },
}: AoAToSheet<T>) {
  const arrData = [...data];
  if (header) {
    arrData.unshift(header);
  }

  const worksheet = utils.aoa_to_sheet(arrData);

  /* add worksheet to workbook */
  const workbook: WorkBook = {
    SheetNames: [filename],
    Sheets: {
      [filename]: worksheet,
    },
  };
  /* output format determined by filename */
  writeFile(workbook, filename, write2excelOpts);
  /* at this point, out.xlsb will have been downloaded */
}

/**
 * todo xlsx大坑！！ by Joyboo
 * 1. 如果Y-m-d格式，则传入excel时间必须为当天的第0秒，否则无论如何后面都会带上 H:i:s 格式时间
 * 2. sheetjs对不同时区处理是需要计算偏移的
 * https://github.com/SheetJS/sheetjs/issues/1470
 * https://github.com/SheetJS/sheetjs/issues/2350
 * 以下为+8区偏移
 */
export function timezoneOffsetMill(): number {
  const baseDate = new Date(1899, 11, 30, 0, 0, 0);
  const baseDateUtc = new Date(Date.UTC(1899, 11, 30, 0, 0, 0));
  return baseDateUtc.valueOf() + baseDate.getTimezoneOffset() * 60000 - baseDate.valueOf();
}
