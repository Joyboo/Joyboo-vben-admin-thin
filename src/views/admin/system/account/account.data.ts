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

export const FormData = {
  id: '',
  username: '',
  password: '',
  realname: '',
  rid: '',
  sort: 9,
  status: 1,
  avatar: '',
  desc: '',
  extension: {
    gid: '',
    newnid: 0, // 已废弃，后期删掉
    homePath: '', // 自定义首页 menuid
    gameids: [],
    pkgbnd: [],
    wechat: {
      openid: '',
      nickname: '',
      sex: '',
    },
    qq: {
      openid: '',
      nickname: '',
      gender: '',
    },
    alipay: {
      user_id: '',
      nick_name: '',
      gender: '',
    },
    weibo: {
      id: '',
      name: '',
      gender: '',
    },
  },
};

export const RuleData = {
  username: [
    {
      required: true,
    },
    {
      validator(_, value: any) {
        return new Promise((resolve, reject) => {
          const match = /^\d{11}$/.test(value);
          if (match || value === 'admin') {
            resolve(value);
          } else {
            reject('请输入11位数字的账号');
          }
        });
      },
    },
  ],
  realname: [
    {
      required: true,
      message: '请输入真实姓名',
    },
  ],
  rid: [
    {
      required: true,
      message: '请选择角色组',
    },
  ],
};

// dynamicRules: ({ values }) => {
//   return [
//     {
//       // required: true,
//       validator: (_, value) => {
//         if (value && value.length < 6) {
//           return Promise.reject('密码过于简单!');
//         }
//         if (value && value !== values.password) {
//           return Promise.reject('两次输入的密码不一致!');
//         }
//         return Promise.resolve();
//       },
//     },
//   ];
// }
