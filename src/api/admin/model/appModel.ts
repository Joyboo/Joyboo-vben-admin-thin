import { BasicPageParams } from '/@/api/model/baseModel';

export type GameIndexSearchParams = BasicPageParams & {
  status?: number;
  name?: string;
};

export type PackgeIndexSearch = BasicPageParams & {
  gameid?: number;
  name?: string;
};
