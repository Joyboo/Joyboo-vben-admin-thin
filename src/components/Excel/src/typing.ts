import type { JSON2SheetOpts, WritingOptions, BookType, WorkSheet } from 'xlsx';

export interface ExcelData<T = any> {
  header: string[];
  results: T[];
  meta: { sheetName: string };
}

export interface JsonToSheet<T = any> {
  data: T[];
  header?: T;
  filename?: string;
  json2sheetOpts?: JSON2SheetOpts;
  write2excelOpts?: WritingOptions;
  workSheetOpts?: WorkSheet;
}

export interface AoAToSheet<T = any> {
  data: T[][];
  header?: T[];
  filename?: string;
  write2excelOpts?: WritingOptions;
}

export interface ExportModalResult {
  filename: string;
  bookType: BookType;
}
