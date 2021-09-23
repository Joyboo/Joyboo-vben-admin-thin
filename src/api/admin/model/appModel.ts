import { BasicPageParams } from '/@/api/model/baseModel';

export type GameIndexSearchParams = BasicPageParams & {
  status?: number;
  name?: string;
};

export interface GameParams {
  id?: number;
  name: string;
  sort: number;
  status: number;
  extension: Recordable;
}
