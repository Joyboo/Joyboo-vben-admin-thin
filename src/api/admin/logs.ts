import { defHttp } from '/@/utils/http/axios';

enum Api {
  LogIndex = '/admin/logSql/index',
  LogExport = '/admin/logSql/export',
  AdminLogIndex = '/admin/LogLogin/index',
  ErrorLogIndex = '/admin/LogError/index',
  HttpTracker = '/admin/HttpTracker/index',
  HttpTrackerRepeat = '/admin/HttpTracker/repeat',
  HttpTrackerCount = '/admin/HttpTracker/count',
  HttpTrackerRun = '/admin/HttpTracker/run',
}

export const logIndex = (params: any) => defHttp.get({ url: Api.LogIndex, params });

export const adminLogIndex = (params: any) => defHttp.get({ url: Api.AdminLogIndex, params });

export const errorLogIndex = (params: any) => defHttp.get({ url: Api.ErrorLogIndex, params });

export const logExport = (params: any) =>
  defHttp.get(
    { url: Api.LogExport, timeout: 60000, responseType: 'blob', params },
    { isReturnNativeResponse: true },
  );

export const httpTracker = (params: any) => defHttp.get({ url: Api.HttpTracker, params });

export const httpTrackerRepeat = (pointId: string) => {
  return defHttp.post({ url: Api.HttpTrackerRepeat, params: { pointId } });
};

export const httpTrackerCount = (data) => {
  return defHttp.post(
    {
      url: Api.HttpTrackerCount,
      data,
    },
    { isTransformResponse: false },
  );
};

export const httpTrackerRun = (data) => {
  return defHttp.post(
    {
      url: Api.HttpTrackerRun,
      data,
    },
    { isTransformResponse: false },
  );
};
