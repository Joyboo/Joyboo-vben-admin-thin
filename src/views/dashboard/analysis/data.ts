import type { CSSProperties } from 'vue';

// 首页 Card结构体
export interface GrowCardItem {
  icon?: string;
  title: string;
  lasttitle: string;
  lasttitleStyle?: CSSProperties;
  value: number;
  total: number;
  color: string;
  action: string;
}

export interface WeekData {
  // 本周
  week?: Array<number | string>;
  // 上周
  last?: Array<number | string>;
}

// chartData结构体
export interface EchartStruct {
  title: string;
  // y轴刻度前缀
  ystart: string;
  // y轴刻度后缀
  yend: string;

  dataindex: string;
  // 数据
  data?: WeekData;
}

export interface RevenueStrust {
  today: number;
  yesterday: number;
  month: number;
  lastmonth: number;
}

type ChartOne = {
  [x: string]: WeekData;
};

export interface AnalysisResult {
  revenue: RevenueStrust;
  chart: ChartOne;
}

export const panleList: EchartStruct[] = [
  {
    dataindex: 'reg',
    title: '新增账号',
    ystart: '',
    yend: '',
    data: {},
  },
  {
    dataindex: 'dau',
    title: 'DAU',
    ystart: '',
    yend: '',
    data: {},
  },
  {
    dataindex: 'money',
    title: '付费',
    ystart: '$',
    yend: '',
    data: {},
  },
  {
    dataindex: 'ffl',
    title: '付费率',
    ystart: '',
    yend: '%',
    data: {},
  },
  {
    dataindex: 'arppu',
    title: 'ARPPU',
    ystart: '$',
    yend: '',
    data: {},
  },
  {
    dataindex: 'arpu',
    title: 'ARPU',
    ystart: '$',
    yend: '',
    data: {},
  },
];
