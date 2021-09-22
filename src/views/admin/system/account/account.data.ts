import { adminChange, getAllRoleList } from '/@/api/admin/system';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { usePermission } from '/@/hooks/web/usePermission';

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
        disabled: !hasPermission(['/admin/edit']),
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

export const accountFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: '账号',
    component: 'Input',
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
            if (match) {
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
    component: 'InputPassword',
    required: true,
    show: false,
    rules: [
      {
        required: true,
        message: '请输入密码',
      },
    ],
  },
  {
    label: '角色',
    field: 'rid',
    component: 'ApiSelect',
    componentProps: {
      api: getAllRoleList,
      labelField: 'name',
      valueField: 'id',
    },
    required: true,
  },
  {
    field: 'realname',
    label: '用户名',
    component: 'Input',
    componentProps: {
      placeholder: '请输入用户真实姓名',
    },
    required: true,
  },
  {
    field: 'sort',
    label: '排序',
    helpMessage: '越小越靠前',
    defaultValue: 9,
    component: 'InputNumber',
    required: true,
  },
];
