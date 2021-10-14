/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import moment from 'moment';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';
const DATE_FORMAT = 'YYYY-MM-DD ';

export function formatToDateTime(
  date: moment.MomentInput = undefined,
  format = DATE_TIME_FORMAT,
): string {
  return moment(date).format(format);
}

export function formatToDate(date: moment.MomentInput = undefined, format = DATE_FORMAT): string {
  return moment(date).format(format);
}

export function formatDaysAgo(day?: number) {
  day = day ?? 0;
  const d = new Date();
  d.setTime(d.getTime() + 3600 * 1000 * 24 * day);
  return d;
  // return moment().startOf('day').subtract(day, 'days').format(format);
}

export function timePikerExtra() {
  const ranges = {
    今天: [moment().startOf('day'), moment()],
    昨天: [moment().startOf('day').subtract(1, 'days'), moment().endOf('day').subtract(1, 'days')],
    近三天: [moment().startOf('day').subtract(2, 'days'), moment().endOf('day')],
    近一周: [moment().startOf('day').subtract(1, 'weeks'), moment()],
    本月: [moment().startOf('month'), moment()],
    上月: [
      moment()
        .month(moment().month() - 1)
        .startOf('month'),
      moment()
        .month(moment().month() - 1)
        .endOf('month'),
    ],
    本年: [moment().startOf('year'), moment()],
  };
  return ranges;
}

export const dateUtil = moment;
