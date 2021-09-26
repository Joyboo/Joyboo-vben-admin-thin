/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  id: string | number;
  token: string;
  role: RoleInfo;
}

export interface GameListModel {
  id: number;
  name: string;
}

export interface PkgListModel {
  id: number;
  name: string;
  pkgbnd: string;
  gameid: number;
}

export interface UserConfig {
  imageDomain: string;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[];
  // 用户id
  id: string | number;
  // 用户名
  username: string;
  // 真实名字
  realname: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
  // 可用游戏列表
  gameList: GameListModel[];
  // 可用包列表
  pkgList: PkgListModel[];
  // 配置项
  config: UserConfig;
}
