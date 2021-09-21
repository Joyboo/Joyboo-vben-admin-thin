import { defineStore } from 'pinia';
import { store } from '/@/store';

import { RoleListGetResultModel } from '/@/api/admin/model/systemModel';
import { getAllRoleList } from '/@/api/admin/system';

interface AdminState {
  // role角色列表
  roleList: RoleListGetResultModel;
  // 游戏列表
  // 包列表
  // 合并
}
export const useAdminStore = defineStore({
  id: 'app-admin',
  state: (): AdminState => ({
    roleList: [],
  }),
  getters: {
    role(): RoleListGetResultModel {
      return this.roleList;
    },
  },
  actions: {
    async getRoleList(): Promise<RoleListGetResultModel> {
      // console.log('get Rolelist 1 length', this.roleList.length);
      if (this.roleList.length === 0) {
        const list = await getAllRoleList();
        this.roleList = list;
      }
      // console.log('get Rolelist 2', this.roleList);
      return this.roleList;
    },
  },
});

// Need to be used outside the setup
export function useAdminStoreWithOut() {
  return useAdminStore(store);
}
