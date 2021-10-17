import type { CSSProperties } from 'vue';

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

export const growCardList: GrowCardItem[] = [
  {
    title: '本日营收',
    lasttitle: '对比昨天',
    // lasttitleStyle: { color: 'red' },
    value: 2000,
    total: 1200,
    color: 'green',
    action: '日',
  },
  {
    title: '本月营收',
    lasttitle: '对比上月',
    // lasttitleStyle: { color: 'red' },
    value: 20000,
    total: 500000,
    color: 'blue',
    action: '月',
  },
];
