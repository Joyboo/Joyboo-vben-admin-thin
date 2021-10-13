import type { ErrorLogInfo } from '/#/store';
import { useUserStore } from '/@/store/modules/user';
import { multipleApi } from '/@/api/sys/errorLog';

import { defineStore } from 'pinia';
import { store } from '/@/store';

import { formatToDateTime } from '/@/utils/dateUtil';
import projectSetting from '/@/settings/projectSetting';

import { ErrorTypeEnum } from '/@/enums/exceptionEnum';

// 上报给服务器的结构体
type ServerErrorLogInfo = ErrorLogInfo & {
  uid?: string | number;
  username?: string;
  realname?: string;
};

export interface ErrorLogState {
  errorLogInfoList: Nullable<ErrorLogInfo[]>;
  errorLogListCount: number;
  // 上报到服务器的队列
  reportList: ServerErrorLogInfo[];
  // 定时器运行间隔，毫秒
  reportLimit: number;
  // 是否上报中，用户Layout右上角icon转圈圈
  reporting: boolean;
  // 除了定时器定时上报，当report长度超过此值也会立即触发上报
  reportAutoLen: number;
}

export const useErrorLogStore = defineStore({
  id: 'app-error-log',
  state: (): ErrorLogState => ({
    errorLogInfoList: null,
    errorLogListCount: 0,
    reportList: [],
    reportLimit: 30000,
    reporting: false,
    reportAutoLen: 10,
  }),
  getters: {
    getErrorLogInfoList(): ErrorLogInfo[] {
      return this.errorLogInfoList || [];
    },
    getErrorLogListCount(): number {
      return this.errorLogListCount;
    },
  },
  actions: {
    addErrorLogInfo(info: ErrorLogInfo) {
      const item = {
        ...info,
        time: formatToDateTime(new Date()),
      };
      this.errorLogInfoList = [item, ...(this.errorLogInfoList || [])];
      this.errorLogListCount += 1;

      const userStore = useUserStore();
      const userInfo = userStore.getUserInfo;
      this.reportList.push({
        stack: '',
        ...item,
        uid: userInfo.id,
        username: userInfo.username,
        realname: userInfo.realname,
      });
      if (this.reportList.length >= this.reportAutoLen) {
        this.reportErrorLog();
      }
    },

    clearErrorLog() {
      this.errorLogInfoList = [];
      this.errorLogListCount = 0;
    },

    setErrorLogListCount(count: number): void {
      this.errorLogListCount = count;
    },

    /**
     * Triggered after ajax request error
     * @param error
     * @returns
     */
    addAjaxErrorInfo(error) {
      const { useErrorHandle } = projectSetting;
      if (!useErrorHandle) {
        return;
      }
      const errInfo: Partial<ErrorLogInfo> = {
        message: error.message,
        type: ErrorTypeEnum.AJAX,
      };
      if (error.response) {
        const {
          config: { url = '', data: params = '', method = 'get', headers = {} } = {},
          data = {},
        } = error.response;
        errInfo.url = url;
        errInfo.name = 'Ajax Error!';
        errInfo.file = '-';
        errInfo.stack = JSON.stringify(data);
        errInfo.detail = JSON.stringify({ params, method, headers });
      }
      this.addErrorLogInfo(errInfo as ErrorLogInfo);
    },
    reportErrorLog() {
      // 正在上报 或 队列为空
      if (this.reporting || this.reportList.length === 0) {
        return;
      }

      // 批量上报
      this.reporting = true;
      multipleApi(this.reportList)
        .then(() => {
          this.reportList = [];
        })
        .catch(() => {})
        .finally(() => {
          this.reporting = false;
        });
    },
    startListenErrorLog() {
      setInterval(this.reportErrorLog, this.reportLimit);
    },
    getReporting(): boolean {
      return this.reporting;
    },
  },
});

// Need to be used outside the setup
export function useErrorLogStoreWithOut() {
  return useErrorLogStore(store);
}
