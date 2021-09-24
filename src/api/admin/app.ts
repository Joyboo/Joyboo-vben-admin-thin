import { defHttp } from '/@/utils/http/axios';
import { Method } from 'axios';
import { GameIndexSearchParams, PackgeIndexSearch } from './model/appModel';

enum Api {
  GameIndex = '/admin/game/index',
  GameAdd = '/admin/game/add',
  GameEdit = '/admin/game/edit',
  GameDel = '/admin/game/del',
  GameChange = '/admin/game/change',
  GameGetkey = '/admin/game/gkey',

  PackageIndex = '/admin/package/index',
  PackageAdd = '/admin/package/add',
  PackageEdit = '/admin/package/edit',
  PackageDel = '/admin/package/del',
  PackageChange = '/admin/package/change',
  PackGetKey = '/admin/package/gkey',
}

export const gameIndex = (params: GameIndexSearchParams) =>
  defHttp.get({ url: Api.GameIndex, params });

export const gameAdd = (method: Method, params?: any) =>
  defHttp.request({ url: Api.GameAdd, method, params });

export const gameEdit = (method: Method, params?: any) =>
  defHttp.request({ url: Api.GameEdit, method, params });

export const gameDel = (id: number) => defHttp.get({ url: Api.GameDel, params: { id } });

export const gameChange = (id: number, column: string, status: number) =>
  defHttp.post({ url: Api.GameChange, params: { id, column, status } });

export const gameGetKey = (column: string) =>
  defHttp.get({ url: Api.GameGetkey, params: { column } });

export const packageIndex = (params: PackgeIndexSearch) =>
  defHttp.get({ url: Api.PackageIndex, params });

export const packageAdd = (method: Method, params) =>
  defHttp.request({ url: Api.PackageAdd, method, params });

export const packageeEdit = (method: Method, params) =>
  defHttp.request({ url: Api.PackageEdit, method, params });

export const packageDel = (id: number) => defHttp.get({ url: Api.PackageDel, params: { id } });

export const packageChange = (id: number, column: string, status: number) =>
  defHttp.post({ url: Api.PackageChange, params: { id, column, status } });

export const packageGetKey = (column: string) =>
  defHttp.get({ url: Api.PackGetKey, params: { column } });
