import { defHttp } from '/@/utils/http/axios';

enum Api {
  multiple = '/admin/LogError/multiple',
}

export const multipleApi = (params: any) => defHttp.post({ url: Api.multiple, params });
