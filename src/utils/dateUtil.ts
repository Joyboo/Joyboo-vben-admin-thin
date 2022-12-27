/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import moment from 'moment';

export const DATE_TIME_FORMAT_FULL = 'YYYY-MM-DD HH:mm:ss';
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';
export const DATE_FORMAT = 'YYYY-MM-DD ';

// 日期范围默认展示天数
export const DATE_RANGE_DAYS = 14;

export function formatToDateTime(
  date: moment.MomentInput = undefined,
  format = DATE_TIME_FORMAT,
): string {
  return moment(date).format(format);
}

export function formatToDate(date: moment.MomentInput = undefined, format = DATE_FORMAT): string {
  return moment(date).format(format);
}

export function fmtFullTime(timestamp: number, format = DATE_TIME_FORMAT_FULL) {
  if (timestamp.toString().length === 10) {
    timestamp *= 1000;
  }
  return moment(timestamp).format(format);
}

export function formatDaysAgo(day?: number) {
  return moment().subtract(day, 'days');
}

export function dateRangeArray(day = DATE_RANGE_DAYS) {
  return [formatDaysAgo(day).startOf('day'), formatDaysAgo().endOf('day')];
}

export function timePikerExtra() {
  const ranges = {
    今天: () => [moment().startOf('day'), moment().endOf('day')],
    昨天: () => [
      moment().startOf('day').subtract(1, 'days'),
      moment().endOf('day').subtract(1, 'days'),
    ],
    近三天: () => [moment().startOf('day').subtract(2, 'days'), moment().endOf('day')],
    近一周: () => [moment().startOf('day').subtract(1, 'weeks'), moment().endOf('day')],
    近一月: () => [moment().startOf('day').subtract(1, 'month'), moment().endOf('day')],
    本月: () => [moment().startOf('month'), moment().endOf('month')],
    上月: () => [
      moment()
        .month(moment().month() - 1)
        .startOf('month'),
      moment()
        .month(moment().month() - 1)
        .endOf('month'),
    ],
    本年: () => [moment().startOf('year'), moment().endOf('year')],
    去年: () => [
      moment().startOf('year').subtract(1, 'year'),
      moment().subtract(1, 'year').endOf('year'),
    ],
  };
  return ranges;
}

export const dateUtil = moment;
