export type CurdAuthType = {
  // 查看的权限标识，一般不需要
  index?: string;
  // 新增的权限标识
  add: string;
  // 编辑的权限标识
  edit: string;
  // 删除的权限标识
  del: string;
};

// 权限码 permCode
export enum Auth {
  AdminAdd = '/admin/add',
  AdminEdit = '/admin/edit',
  AdminDel = '/admin/del',
  AdminGetToken = '/admin/getToken',

  CrontabAdd = '/crontab/add',
  CrontabEdit = '/crontab/edit',
  CrontabDel = '/crontab/del',

  MenuAdd = '/menu/add',
  MenuEdit = '/menu/edit',
  MenuDel = '/menu/del',

  RoleAdd = '/role/add',
  RoleEdit = '/role/edit',
  RoleDel = '/role/del',

  SysinfoAdd = '/sysinfo/add',
  SysinfoEdit = '/sysinfo/edit',
  SysinfoDel = '/sysinfo/del',

  GameAdd = '/game/add',
  GameEdit = '/game/edit',
  GameDel = '/game/del',
  GameGive = '/admin/give',

  PackageAdd = '/package/add',
  PackageEdit = '/package/edit',
  PackageDel = '/package/del',

  WhitelistAdd = '/whitelist/add',
  WhitelistEdit = '/whitelist/edit',
  WhitelistDel = '/whitelist/del',
}
