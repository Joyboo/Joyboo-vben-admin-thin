import { CurdAuth } from '/#/utils';
import { h } from 'vue';
import { Switch, Tag } from 'ant-design-vue';
import { usePermission } from '/@/hooks/web/usePermission';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { sysinfoChange } from '/@/api/admin/system';
import { useMessage } from '/@/hooks/web/useMessage';

export const curdAuth: CurdAuth = {
  add: '/sysinfo/add',
  edit: '/sysinfo/edit',
  del: '/sysinfo/del',
};

export const columns: BasicColumn[] = [
  {
    title: '变量名',
    dataIndex: 'varname',
    width: 200,
  },
  {
    title: '值类型',
    dataIndex: 'type',
    width: 90,
    customRender: ({ record }) => {
      const type = record.type;
      const color = { 0: 'blue', 1: 'green', 2: 'orange' };
      const text = { 0: 'Number', 1: 'String', 2: 'Json|Array' };
      return h(Tag, { color: color[type] }, () => text[type]);
    },
  },
  {
    title: '变量值',
    dataIndex: 'value',
    width: 350,
    align: 'left',
    slots: { customRender: 'varValue' },
  },
  {
    title: '说明',
    dataIndex: 'remark',
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
          sysinfoChange(record.id, 'status', newStatus)
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
    field: 'varname',
    label: '变量名',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'remark',
    label: '说明',
    component: 'Input',
    colProps: { span: 6 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'varname',
    label: '变量名',
    defaultValue: '',
    required: true,
    component: 'Input',
  },
  {
    field: 'type',
    label: '值类型',
    defaultValue: 0,
    component: 'RadioButtonGroup',
    componentProps: {
      options: [
        { label: 'Number', value: 0 },
        { label: 'String', value: 1 },
        { label: 'Json|Array', value: 2 },
      ],
    },
  },
  {
    field: 'value',
    label: '变量值',
    defaultValue: '',
    required: true,
    component: 'InputTextArea',
    componentProps: { rows: 15 },
  },
  {
    field: 'remark',
    label: '说明',
    defaultValue: '',
    component: 'Input',
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
  },
];
