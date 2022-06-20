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
  AdminDel = '/admin/admin/del',
  AdminModify = '/admin/admin/modify',
  IsAccountExist = '/admin/admin/accountExist',
  AvatarUpload = '/admin/admin/upload',
  AdminGetToken = '/admin/admin/getToken',

  MenuList = '/admin/menu/index',
  MenuAdd = '/admin/menu/add',
  MenuEdit = '/admin/menu/edit',
  MenuDel = '/admin/menu/del',
  MenuChange = '/admin/menu/change',
  MenuTreeList = '/admin/menu/treeList',

  RolePageList = '/admin/role/index',
  RoleChange = '/admin/role/change',
  RoleAdd = '/admin/role/add',
  RoleEdit = '/admin/role/edit',
  RoleDel = '/admin/role/del',
  RoleOptions = '/admin/role/options',

  SysinfoIndex = '/admin/sysinfo/index',
  SysinfoAdd = '/admin/sysinfo/add',
  SysInfoEdit = '/admin/sysinfo/edit',
  SysinfoDel = '/admin/sysinfo/del',
  SysinfoChange = '/admin/sysinfo/change',
  SysinfoShowSwooleTable = '/admin/sysinfo/showSwooleTable',

  CrontabIndex = '/admin/crontab/index',
  CrontabAdd = '/admin/crontab/add',
  CrontabEdit = '/admin/crontab/edit',
  CrontabDel = '/admin/crontab/del',
  CrontabChange = '/admin/crontab/change',

  TinymceUpload = '/admin/xxx', // 示例值
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

export const adminModify = (method: Method, params?: any) =>
  defHttp.request({ url: Api.AdminModify, method, params });

export const adminDel = (id: number) => defHttp.get({ url: Api.AdminDel, params: { id } });

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

export const menuTreeList = () => defHttp.get({ url: Api.MenuTreeList });

export const menuAdd = (params: MenuFormParams) => defHttp.post({ url: Api.MenuAdd, params });

export const menuEdit = (params: MenuFormParams) => defHttp.post({ url: Api.MenuEdit, params });

export const menuDel = (params: any) => defHttp.post({ url: Api.MenuDel, params });

export const changeMenu = (id: number, column: string, status: number) =>
  defHttp.post({ url: Api.MenuChange, params: { id, column, status } });

export const getRoleListByPage = (params?: RolePageParams) =>
  defHttp.get<RolePageListGetResultModel>({ url: Api.RolePageList, params });

export const roleChange = (id: number, column: string, status: number) =>
  defHttp.post({ url: Api.RoleChange, params: { id, column, status } });

export const roleAdd = (params: RoleFormParams) => defHttp.post({ url: Api.RoleAdd, params });

export const roleEdit = (params: RoleFormParams) => defHttp.post({ url: Api.RoleEdit, params });

export const roleDel = (id: number) => defHttp.get({ url: Api.RoleDel, params: { id } });

export const roleOptions = () => defHttp.get<OptionsItem[]>({ url: Api.RoleOptions });

export const isAccountExist = (username: string) =>
  defHttp.get({ url: Api.IsAccountExist, params: { username } }, { errorMessageMode: 'none' });

export const sysinfoIndex = (params?: any) => defHttp.get({ url: Api.SysinfoIndex, params });

export const sysinfoChange = (id: number, column: string, status: number) =>
  defHttp.post({ url: Api.SysinfoChange, params: { id, column, status } });

export const sysinfoEdit = (method: Method, params?: any) =>
  defHttp.request({ url: Api.SysInfoEdit, method, params });

export const sysinfoAdd = (method: Method, params?: any) =>
  defHttp.request<AccountInfo>({ url: Api.SysinfoAdd, method, params });

export const sysinfoDel = (id: number) => defHttp.get({ url: Api.SysinfoDel, params: { id } });

export const sysinfoShowSwooleTable = () => defHttp.get({ url: Api.SysinfoShowSwooleTable });

export const crontabIndex = (params?: any) => defHttp.get({ url: Api.CrontabIndex, params });

export const crontabChange = (id: number, column: string, status: number) =>
  defHttp.post({ url: Api.CrontabChange, params: { id, column, status } });

export const crontabEdit = (method: Method, params?: any) =>
  defHttp.request({ url: Api.CrontabEdit, method, params });

export const crontabAdd = (method: Method, params?: any) =>
  defHttp.request<AccountInfo>({ url: Api.CrontabAdd, method, params });

export const crontabDel = (id: number) => defHttp.get({ url: Api.CrontabDel, params: { id } });

export const tinymceUpload = async (params: UploadFileParams) => {
  const file = params.file as File;
  const { uploadUrl } = useGlobSetting();
  return defHttp.uploadFile<UploadApiResult>(
    {
      baseURL: uploadUrl,
      url: Api.TinymceUpload,
    },
    { file, filename: file.name },
  );
};
