import { defHttp } from '/@/utils/http/axios';
import { Method } from 'axios';
import { GameIndexSearchParams, PackgeIndexSearch } from './model/appModel';
import { UploadFileParams } from '/#/axios';
import { UploadApiResult } from '/@/api/sys/model/uploadModel';
import { useGlobSetting } from '/@/hooks/setting';

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
  PackageSaveAdjustEvent = '/admin/package/saveAdjustEvent',
  PackageImgUpload = '/admin/package/upload',
  PackageUnlink = '/admin/package/unlink',
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

export const packageEdit = (method: Method, params) =>
  defHttp.request({ url: Api.PackageEdit, method, params });

export const packageDel = (id: number) => defHttp.get({ url: Api.PackageDel, params: { id } });

export const packageChange = (id: number, column: string, status: number) =>
  defHttp.post({ url: Api.PackageChange, params: { id, column, status } });

export const packageGetKey = (column: string) =>
  defHttp.get({ url: Api.PackGetKey, params: { column } });

export const packageSaveAdjustEvent = (id: number, adjust?: object) =>
  defHttp.post({ url: Api.PackageSaveAdjustEvent, params: { id, adjust } });

export const uploadApi = (
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) => {
  const { uploadUrl } = useGlobSetting();
  return defHttp.uploadFile<UploadApiResult>(
    {
      baseURL: uploadUrl,
      url: Api.PackageImgUpload,
      onUploadProgress,
    },
    params,
  );
};

export const delPackageImg = (url: string) =>
  defHttp.post({ url: Api.PackageUnlink, params: { url } });
