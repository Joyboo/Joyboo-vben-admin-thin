import { defHttp } from '/@/utils/http/axios';
import { bodyArrayJoin } from '/@/utils';

enum Api {
  DashboardAnalysis = '/admin/admin/dashboardAnalysis',
}

export type SearchParams = {
  gameid?: number;
  tzn: number;
};

export const dashboardAnalysis = (params: SearchParams) => {
  return defHttp.get({ url: Api.DashboardAnalysis, params: bodyArrayJoin(params) });
};
