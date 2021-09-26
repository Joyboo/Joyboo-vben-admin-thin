import { adminChange } from '/@/api/admin/system';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { usePermission } from '/@/hooks/web/usePermission';
import { CurdAuth } from '/#/utils';

type AdminCurdAuth = CurdAuth & {
  getToken: string;
};

export const curdAuth: AdminCurdAuth = {
  add: '/admin/add',
  edit: '/admin/edit',
  del: '/admin/del',
  getToken: '/admin/getToken',
};

export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 60,
  },
  {
    title: '账号',
    dataIndex: 'username',
    width: 120,
  },
  {
    title: '用户名',
    dataIndex: 'realname',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'itime',
    width: 180,
  },
  {
    title: '角色',
    dataIndex: 'rid',
    width: 200,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ record }) => {
      const status = record.status;
      const enable = ~~status === 1;
      const { hasPermission } = usePermission();
      return h(Switch, {
        checked: enable,
        checkedChildren: '正常',
        unCheckedChildren: '锁定',
        disabled: !hasPermission([curdAuth.edit]),
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? 1 : 0;
          const { createMessage } = useMessage();
          adminChange(record.id, 'status', newStatus)
            .then(() => {
              record.status = newStatus;
              createMessage.success(`已成功修改状态`);
            })
            .catch(() => {
              createMessage.error('修改状态失败');
            })
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
    field: 'username',
    label: '账号',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'realname',
    label: '用户名',
    component: 'Input',
    colProps: { span: 8 },
  },
];

// 基本设置
const formSchemaBase: FormSchema[] = [
  {
    field: 'username',
    label: '账号',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '请输入账号',
      maxLength: 11,
    },
    rules: [
      {
        required: true,
        message: '需要11位长度',
      },
      {
        validator(_, value) {
          return new Promise((resolve, reject) => {
            const match = /^\d{11}$/.test(value);
            if (match || value === 'admin') {
              resolve();
            } else {
              reject('请输入11位数字的账号');
            }
          });
        },
      },
    ],
  },
  {
    field: 'password',
    label: '密码',
    component: 'StrengthMeter',
    defaultValue: '',
    componentProps: {
      placeholder: '密码',
    },
    rules: [
      {
        // required: true,
        message: '请输入密码',
      },
    ],
  },
  {
    field: 'confirmPassword',
    label: '确认密码',
    component: 'InputPassword',
    defaultValue: '',
    dynamicRules: ({ values }) => {
      return [
        {
          // required: true,
          validator: (_, value) => {
            if (value && value !== values.password) {
              return Promise.reject('两次输入的密码不一致!');
            }
            return Promise.resolve();
          },
        },
      ];
    },
  },
  {
    field: 'realname',
    label: '用户名',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '请输入用户真实姓名',
    },
    required: true,
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '锁定', value: 0 },
        { label: '正常', value: 1 },
      ],
    },
  },
  {
    field: 'sort',
    label: '排序',
    helpMessage: '越小越靠前',
    defaultValue: 9,
    component: 'InputNumber',
    required: true,
  },
  {
    field: 'extension.gid',
    label: '默认游戏',
    helpMessage: '筛选下拉框默认选中的游戏',
    defaultValue: '',
    component: 'Select',
  },
  {
    field: 'extension.homePath',
    label: '默认打开菜单',
    helpMessage: '进入后台时打开的菜单页',
    defaultValue: '',
    component: 'TreeSelect',
  },
  {
    field: 'avatar',
    label: '头像',
    component: 'Input',
    slot: 'avatar',
  },
];

// 角色
const formSchemaRole: FormSchema[] = [
  {
    field: 'rid',
    label: '角色',
    component: 'Select',
    required: true,
  },
  {
    field: ' ',
    label: '权限展示',
    helpMessage: '此处仅作为展示',
    component: 'TreeSelect',
  },
];

export const FormList = [
  {
    key: 'base',
    name: '基础信息',
    schemas: formSchemaBase,
  },
  {
    key: 'role',
    name: '角色分配',
    schemas: formSchemaRole,
  },
];
