import {
  AccountParams,
  MenuParams,
  MenuFormParams,
  RolePageParams,
  MenuListGetResultModel,
  AccountListGetResultModel,
  RolePageListGetResultModel,
  RoleFormParams,
  UploadApiResult,
  AccountInfo,
} from './model/systemModel';
import { defHttp } from '/@/utils/http/axios';
import { Method } from 'axios';

import { UploadFileParams } from '/#/axios';
import { useGlobSetting } from '/@/hooks/setting';

enum Api {
  AccountList = '/admin/admin/index',
  AdminChange = '/admin/admin/change',
  AdminAdd = '/admin/admin/add',
  AdminEdit = '/admin/admin/edit',
  IsAccountExist = '/admin/admin/accountExist',
  AvatarUpload = '/admin/admin/upload',
  AdminGetToken = '/admin/admin/getToken',

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
}

export const getAccountList = (params: AccountParams) =>
  defHttp.get<AccountListGetResultModel>({ url: Api.AccountList, params });

export const getMenuList = (params?: MenuParams) =>
  defHttp.get<MenuListGetResultModel>({ url: Api.MenuList, params });

export const adminChange = (id: number, column: string, status: number) =>
  defHttp.post({ url: Api.AdminChange, params: { id, column, status } });

export const adminAdd = (method: Method, params?: any) =>
  defHttp.request<AccountInfo>({ url: Api.AdminAdd, method, params });

export const adminEdit = (method: Method, params?: any) =>
  defHttp.request<AccountInfo>({ url: Api.AdminEdit, method, params });

export const adminGetToken = (id: number) =>
  defHttp.get({ url: Api.AdminGetToken, params: { id } });

// 头像上传
export const avatarUploadApi = (
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) => {
  const { uploadUrl } = useGlobSetting();
  return defHttp.uploadFile<UploadApiResult>(
    {
      baseURL: uploadUrl,
      url: Api.AvatarUpload,
      onUploadProgress,
    },
    params,
  );
};

export const menuAdd = (params: MenuFormParams) => defHttp.post({ url: Api.MenuAdd, params });

export const menuEdit = (params: MenuFormParams) => defHttp.post({ url: Api.MenuEdit, params });

export const menuDel = (id: number) => defHttp.get({ url: Api.MenuDel, params: { id } });

export const changeMenu = (id: number, column: string, status: number) =>
  defHttp.post({ url: Api.MenuChange, params: { id, column, status } });

export const getRoleListByPage = (params?: RolePageParams) =>
  defHttp.get<RolePageListGetResultModel>({ url: Api.RolePageList, params });

export const roleChange = (id: number, column: string, status: number) =>
  defHttp.post({ url: Api.RoleChange, params: { id, column, status } });

export const roleAdd = (params: RoleFormParams) => defHttp.post({ url: Api.RoleAdd, params });

export const roleEdit = (params: RoleFormParams) => defHttp.post({ url: Api.RoleEdit, params });

export const roleDel = (id: number) => defHttp.get({ url: Api.RoleDel, params: { id } });

export const isAccountExist = (username: string) =>
  defHttp.get({ url: Api.IsAccountExist, params: { username } }, { errorMessageMode: 'none' });
