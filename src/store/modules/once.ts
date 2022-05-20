import { defineStore } from 'pinia';
import { store } from '/@/store';
import { roleOptions } from '/@/api/admin/system';

interface OnceType {
  // 所有角色组
  roleOptions: Nullable<OptionsItem[]>;
}

export const useOnceStore = defineStore({
  id: 'once-api',
  state: (): OnceType => ({
    roleOptions: null,
  }),
  getters: {},
  actions: {
    async getRoleOptions(): Promise<OptionsItem[]> {
      if (this.roleOptions === null) {
        this.roleOptions = await roleOptions();
      }
      return this.roleOptions;
    },
  },
});

export function useOnceStoreWithOut() {
  return useOnceStore(store);
}
