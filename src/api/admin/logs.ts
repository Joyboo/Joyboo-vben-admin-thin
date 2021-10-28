import { defHttp } from '/@/utils/http/axios';

enum Api {
  LogIndex = '/admin/log/index',
  LogExport = '/admin/log/export',
  AdminLogIndex = '/admin/adminLog/index',
  ErrorLogIndex = '/admin/errorLog/index',
}

export const logIndex = (params: any) => defHttp.get({ url: Api.LogIndex, params });

export const adminLogIndex = (params: any) => defHttp.get({ url: Api.AdminLogIndex, params });

export const errorLogIndex = (params: any) => defHttp.get({ url: Api.ErrorLogIndex, params });

export const logExport = (params: any) =>
  defHttp.get(
    { url: Api.LogExport, timeout: 60000, responseType: 'blob', params },
    { isReturnNativeResponse: true },
  );
