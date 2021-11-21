import { CurdAuthType, Auth } from '/@/enums/auth';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { usePermission } from '/@/hooks/web/usePermission';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { whitelistChange } from '/@/api/admin/app';
import { useMessage } from '/@/hooks/web/useMessage';

export const curdAuth: CurdAuthType = {
  add: Auth.WhitelistAdd,
  edit: Auth.WhitelistEdit,
  del: Auth.WhitelistDel,
};

export const columns: BasicColumn[] = [
  {
    dataIndex: 'id',
    title: 'ID',
    sorter: true,
    width: 80,
  },
  {
    dataIndex: 'devid',
    title: '设备号',
  },
  {
    dataIndex: 'name',
    title: '备注',
  },
  {
    dataIndex: 'sort',
    title: '排序',
    helpMessage: '越小越靠前',
    width: 100,
    sorter: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      const { hasPermission } = usePermission();
      return h(Switch, {
        checked: record.status === 1,
        checkedChildren: '已启用',
        unCheckedChildren: '已禁用',
        disabled: !hasPermission([curdAuth.edit]),
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? 1 : 0;
          const { createMessage } = useMessage();
          whitelistChange(record.id, 'status', newStatus)
            .then(() => {
              record.status = newStatus;
              createMessage.success('操作成功');
            })
            .catch(() => {})
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'devid',
    label: ' ',
    component: 'Input',
    componentProps: {
      placeholder: '设备号',
    },
    colProps: { xs: 24, sm: 24, md: 12, lg: 4, xl: 4, xxl: 3 },
  },
];

// 独占一行，{ span: 24 } 未生效
const oneSpan = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 };

export const formSchema: FormSchema[] = [
  {
    field: 'devid',
    label: '设备号',
    component: 'InputTextArea',
    componentProps: {
      maxlength: 40,
      showCount: true,
    },
    required: true,
    defaultValue: '',
    colProps: oneSpan,
  },
  {
    field: 'name',
    label: '备注',
    component: 'InputTextArea',
    componentProps: {
      rows: 5,
    },
    defaultValue: '',
    colProps: oneSpan,
  },
  {
    field: 'sort',
    label: '排序',
    helpMessage: '越小越靠前',
    defaultValue: 9,
    component: 'InputNumber',
    required: true,
    colProps: oneSpan,
  },
  {
    field: 'status',
    label: '状态',
    defaultValue: 1,
    component: 'Switch',
    componentProps: {
      checkedValue: 1,
      unCheckedValue: 0,
      checkedChildren: '已启用',
      unCheckedChildren: '已禁用',
    },
    colProps: oneSpan,
  },
];
