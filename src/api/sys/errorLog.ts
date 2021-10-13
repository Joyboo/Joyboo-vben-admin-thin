import { defHttp } from '/@/utils/http/axios';

enum Api {
  multiple = '/admin/errorLog/multiple',
}

export const multipleApi = (params: any) => defHttp.post({ url: Api.multiple, params });
