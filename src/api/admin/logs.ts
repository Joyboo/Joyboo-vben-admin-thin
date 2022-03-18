import { defHttp } from '/@/utils/http/axios';

enum Api {
  LogIndex = '/admin/logSql/index',
  LogExport = '/admin/logSql/export',
  AdminLogIndex = '/admin/LogLogin/index',
  ErrorLogIndex = '/admin/LogError/index',
  HttpTracker = '/admin/HttpTracker/index',
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
