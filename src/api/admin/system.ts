import {
  AccountParams,
  MenuParams,
  MenuFormParams,
  RoleParams,
  RolePageParams,
  MenuListGetResultModel,
  AccountListGetResultModel,
  RolePageListGetResultModel,
  RoleListGetResultModel,
} from './model/systemModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  AccountList = '/admin/admin/index',
  AdminChange = '/admin/admin/change',
  IsAccountExist = '/admin/admin/accountExist',
  DeptList = '/system/getDeptList',

  MenuList = '/admin/menu/index',
  MenuAdd = '/admin/menu/add',
  MenuEdit = '/admin/menu/edit',
  MenuDel = '/admin/menu/del',
  MenuChange = '/admin/menu/change',

  RolePageList = '/admin/role/index',
  RoleChange = '/admin/role/change',
  RoleAdd = '/admin/role/add',
  RoleEdit = '/admin/role/edit',
  RoleDel = '/admin/role/del',
  GetAllRoleList = '/admin/role/getAllRoleList',
}

export const getAccountList = (params: AccountParams) =>
  defHttp.get<AccountListGetResultModel>({ url: Api.AccountList, params });

export const getMenuList = (params?: MenuParams) =>
  defHttp.get<MenuListGetResultModel>({ url: Api.MenuList, params });

export const adminChange = (id: number, column: string, status: number) =>
  defHttp.post({ url: Api.AdminChange, params: { id, column, status } });

export const menuAdd = (params: MenuFormParams) => defHttp.post({ url: Api.MenuAdd, params });

export const menuEdit = (params: MenuFormParams) => defHttp.post({ url: Api.MenuEdit, params });

export const menuDel = (id: number) => defHttp.get({ url: Api.MenuDel, params: { id } });

export const changeMenu = (id: number, column: string, status: number) =>
  defHttp.post({ url: Api.MenuChange, params: { id, column, status } });

export const getRoleListByPage = (params?: RolePageParams) =>
  defHttp.get<RolePageListGetResultModel>({ url: Api.RolePageList, params });

export const getAllRoleList = (params?: RoleParams) =>
  defHttp.get<RoleListGetResultModel>({ url: Api.GetAllRoleList, params });

export const roleChange = (id: number, column: string, status: number) =>
  defHttp.post({ url: Api.RoleChange, params: { id, column, status } });

export const roleAdd = (params: MenuFormParams) => defHttp.post({ url: Api.RoleAdd, params });

export const roleEdit = (params: MenuFormParams) => defHttp.post({ url: Api.RoleEdit, params });

export const roleDel = (id: number) => defHttp.get({ url: Api.RoleDel, params: { id } });

export const isAccountExist = (username: string) =>
  defHttp.get({ url: Api.IsAccountExist, params: { username } }, { errorMessageMode: 'none' });
