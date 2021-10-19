import { defHttp } from '/@/utils/http/axios';
import { bodyArrayJoin } from '/@/utils';

enum Api {
  ExpenseIndex = '/admin/expense/index',
  ExpenseChange = '/admin/expense/change',
}

export const expenseIndex = (params: any) => {
  return defHttp.get({ url: Api.ExpenseIndex, params: bodyArrayJoin(params) });
};

export const expenseChange = (id: number, column: string, cost: number) =>
  defHttp.post({ url: Api.ExpenseChange, params: { id, column, cost } });
