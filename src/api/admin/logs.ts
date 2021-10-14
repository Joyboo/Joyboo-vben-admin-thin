import { defHttp } from '/@/utils/http/axios';

enum Api {
  LogIndex = '/admin/log/index',
  AdminLogIndex = '/admin/adminLog/index',
  ErrorLogIndex = '/admin/errorLog/index',
}

export const logIndex = (params: any) => defHttp.get({ url: Api.LogIndex, params });

export const adminLogIndex = (params: any) => defHttp.get({ url: Api.AdminLogIndex, params });

export const errorLogIndex = (params: any) => defHttp.get({ url: Api.ErrorLogIndex, params });
