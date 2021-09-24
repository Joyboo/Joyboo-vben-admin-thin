import type { ComputedRef, Ref } from 'vue';

export type DynamicProps<T> = {
  [P in keyof T]: Ref<T[P]> | T[P] | ComputedRef<T[P]>;
};

export interface CurdAuth {
  // 查看的权限标识，一般不需要
  index?: string;
  // 新增的权限标识
  add: string;
  // 编辑的权限标识
  edit: string;
  // 删除的权限标识
  del: string;
}
