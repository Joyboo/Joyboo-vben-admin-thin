import { defineStore } from 'pinia';
import { store } from '/@/store';

type configType = {
  domain: string;
};

interface OnceApiType {
  config: Nullable<configType>; // image domain
}

export const useOnceApiStore = defineStore({
  id: 'once-api',
  state: (): OnceApiType => ({
    config: null,
  }),
  getters: {},
  actions: {
    async getDomain() {
      if (this.config === null) {
        // todo 请求api，设置config
        this.config = { domain: 'test' };
      }
      return this.config;
    },
  },
});

export function useOnceApiStoreWithOut() {
  return useOnceApiStore(store);
}
