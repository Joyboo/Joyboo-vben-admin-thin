import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type AccountParams = BasicPageParams & {
  username?: string;
  realname?: string;
};

export type RoleParams = {
  name?: string;
  status?: string;
};

export type RolePageParams = BasicPageParams & RoleParams;

export type MenuParams = {
  title?: string;
  status?: string;
};

export interface AccountListItem {
  id: string;
  account: string;
  email: string;
  nickname: string;
  role: number;
  createTime: string;
  remark: string;
  status: number;
}

export interface DeptListItem {
  id: string;
  orderNo: string;
  createTime: string;
  remark: string;
  status: number;
}

export interface MenuListItem {
  id: string;
  orderNo: string;
  createTime: string;
  status: number;
  icon: string;
  component: string;
  permission: string;
}

export interface MenuFormParams {
  id?: number;
  // 父级id
  pid: number;
  // 菜单类型,0-目录,1-菜单,2-按钮
  type: number;
  // 路由name
  name: string;
  // 显示名称
  title: string;
  // 排序
  sort: number;
  // 图标
  icon?: string;
  path?: string;
  component?: string;
  redirect?: string;
  // 状态,0-禁用，1-启用
  status: number;
  // 权限标识
  permission?: string;
  // 是否外链,0-否，1-是
  isext?: number;
  // 是否显示,0-否，1-是
  isshow?: number;
  // 是否缓存0-否，1-是
  keepalive?: number;
  // 是否固钉，0-否，1-是
  affix?: number;
  // 是否显示在面包屑,0-否，1-是
  breadcrumb?: number;
}

export interface RoleListItem {
  id: string;
  name: string;
  value: string;
  status: number;
  sort: string;
  itime: string;
}

export interface UploadApiResult {
  message: string;
  code: number;
  url: string;
}

export interface RoleFormParams {
  name: string;
  value: string;
  status: number;
  remark?: string;
  menu?: string;
}

export interface AccountInfo {
  roleList: LabelValueOptions;
  menuList: MenuFormParams[];
  roleAuth: MenuFormParams[];
  checkByRid: object;
  result: object;
}

/**
 * @description: Request list return value
 */
export type AccountListGetResultModel = BasicFetchResult<AccountListItem>;

export type DeptListGetResultModel = BasicFetchResult<DeptListItem>;

export type MenuListGetResultModel = BasicFetchResult<MenuListItem>;

export type RolePageListGetResultModel = BasicFetchResult<RoleListItem>;

export type AccountInfoResultModel = BasicFetchResult<AccountInfo>;
