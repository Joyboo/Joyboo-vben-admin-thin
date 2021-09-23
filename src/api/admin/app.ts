import { defHttp } from '/@/utils/http/axios';
import { Method } from 'axios';
import { GameIndexSearchParams, GameParams } from './model/appModel';

enum Api {
  GameIndex = '/admin/game/index',
  GameAdd = '/admin/game/add',
  GameEdit = '/admin/game/edit',
  GameDel = '/admin/game/del',
  GameChange = '/admin/game/change',

  PackageIndex = '/admin/package/index',
  PackageAdd = '/admin/package/add',
  PackageEdit = '/admin/package/edit',
  PackageDel = '/admin/package/del',
  PackageChange = '/admin/package/change',
}

export const gameIndex = (params: GameIndexSearchParams) =>
  defHttp.get({ url: Api.GameIndex, params });

export const gameAdd = (method: Method, params?: GameParams) =>
  defHttp.request({ url: Api.GameAdd, method, params });

export const gameEdit = (method: Method, params?: GameParams) =>
  defHttp.request({ url: Api.GameEdit, method, params });

export const gameDel = (id: number) => defHttp.get({ url: Api.GameDel, params: { id } });

export const gameChange = (id: number, column: string, status: number) =>
  defHttp.post({ url: Api.GameChange, params: { id, column, status } });
