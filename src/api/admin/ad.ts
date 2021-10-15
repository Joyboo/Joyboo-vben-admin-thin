import { defHttp } from '/@/utils/http/axios';

enum Api {
  ExpenseIndex = '/admin/expense/index',
}

export const expenseIndex = (params: any) => defHttp.get({ url: Api.ExpenseIndex, params });
