import { defineStore } from 'pinia';
import { store } from '/@/store';
import { roleOptions, menuTreeList } from '/@/api/admin/system';
import { TreeItem } from '/@/components/Tree';
import { treeMap } from '/@/utils/helper/treeHelper';
import { cloneDeep } from 'lodash-es';

interface OnceType {
  // 所有角色组
  roleOptions: Nullable<OptionsItem[]>;
  // 所有菜单列表
  menuTreeList: Nullable<TreeItem[]>;
}

export const useOnceStore = defineStore({
  id: 'once-api',
  state: (): OnceType => ({
    roleOptions: null,
    menuTreeList: null,
  }),
  getters: {},
  actions: {
    async getRoleOptions(): Promise<OptionsItem[]> {
      if (this.roleOptions === null) {
        this.roleOptions = await roleOptions();
      }
      return this.roleOptions;
    },
    async getMenuTreeList(): Promise<TreeItem[]> {
      if (this.menuTreeList === null) {
        const treeData: TreeItem[] = await menuTreeList();
        this.menuTreeList = treeData;
      }
      return this.menuTreeList;
    },
    async menuTreeDisabledId({ id }): Promise<TreeItem[]> {
      const disabeldSet = new Set([id]);
      const treeData = await this.getMenuTreeList();
      return treeMap(cloneDeep(treeData), {
        conversion: (item) => {
          if (disabeldSet.has(item.pid) || disabeldSet.has(item.id)) {
            item.disabled = true;
            disabeldSet.add(item.id);
          } else {
            item.disabled = false;
          }
          return item;
        },
      });
    },
  },
});

export function useOnceStoreWithOut() {
  return useOnceStore(store);
}
