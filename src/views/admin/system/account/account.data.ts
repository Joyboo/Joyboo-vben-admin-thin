import { adminChange } from '/@/api/admin/system';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch, Tag } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { usePermission } from '/@/hooks/web/usePermission';
import { CurdAuthType, Auth } from '/@/enums/auth';

type AdminCurdAuth = CurdAuthType & {
  getToken: string;
};

export const curdAuth: AdminCurdAuth = {
  add: Auth.AdminAdd,
  edit: Auth.AdminEdit,
  del: Auth.AdminDel,
  getToken: Auth.AdminGetToken,
};

export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 60,
    sorter: true,
  },
  {
    title: '账号',
    dataIndex: 'username',
  },
  {
    title: '用户名',
    dataIndex: 'realname',
  },
  {
    title: '创建时间',
    dataIndex: 'itime',
  },
  {
    title: '角色',
    dataIndex: 'relation.name',
  },
  {
    title: '是否在线',
    dataIndex: 'online',
    customRender: ({ text }) => {
      return text
        ? h(Tag, { color: '#87d068' }, () => '在线')
        : h(Tag, { color: '#f50' }, () => '不在线');
    },
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: 100,
    sorter: true,
    helpMessage: '越小越靠前',
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
  username: '',
  password: '',
  realname: '',
  rid: 0,
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
      required: false,
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
  password: [],
};
