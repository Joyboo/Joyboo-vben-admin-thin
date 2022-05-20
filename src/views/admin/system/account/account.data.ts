import { adminChange, avatarUploadApi } from '/@/api/admin/system';
import { BasicColumn, FormProps, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch, Tag } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { usePermission } from '/@/hooks/web/usePermission';
import { CurdAuthType, Auth } from '/@/enums/auth';
import { renderAvatar } from '/@/utils/formRenderHelper';
import { Rule, useForm, UseFormReturnType } from '/@/components/Form';
// import { useUserStore } from '/@/store/modules/user';
import { useOnceStore } from '/@/store/modules/once';

// const userStore = useUserStore();
const onceStore = useOnceStore();

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
      return text && text > 0
        ? h(Tag, { color: '#87d068' }, () => '在线： ' + text)
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
    colProps: { span: 4 },
  },
  {
    field: 'realname',
    label: '用户名',
    component: 'Input',
    colProps: { span: 4 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '正常', value: 1 },
        { label: '锁定', value: 0 },
      ] as OptionsItem[],
    },
    colProps: { span: 3 },
  },
];
const baseFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    subLabel: '隐藏字段，主要用来判断是否编辑状态',
    defaultValue: 0,
    component: 'InputNumber',
    show: false,
  },
  {
    field: 'username',
    label: '用户名',
    subLabel: '11位的手机号',
    required: true,
    defaultValue: '',
    component: 'Input',
    componentProps: { maxlength: 11 },
    dynamicRules: ({ values }) => {
      const isUpdate = values.id > 0;
      return [
        {
          required: isUpdate,
          trigger: ['change', 'blur'],
          validator(_, value: any) {
            return new Promise((resolve, reject) => {
              if (value === '' || value.length !== 11) {
                reject('请输入11位长度的用户名');
              }
              // if (!isUpdate) {
              // 此处是动态异步校验，change就会触发，太频繁，交给提交的时候检查
              // isAccountExist(value).then(resolve).catch(reject);
              // }
              resolve(value);
            });
          },
        },
      ];
    },
  },
  {
    field: 'password',
    label: '密码',
    defaultValue: '',
    component: 'StrengthMeter',
    colProps: { span: 12 },
    dynamicRules: ({ values }) => {
      const isUpdate = values.id > 0;
      return [
        {
          required: !isUpdate,
          trigger: ['change', 'blur'],
          validator(_, value: any) {
            return new Promise((resolve, reject) => {
              if (isUpdate) {
                if (value && value.length < 6) {
                  reject('密码过短');
                }
              } else {
                if (value === '') {
                  reject('请输入密码');
                }
              }
              resolve(value);
            });
          },
        },
      ];
    },
  },
  {
    field: 'confirmPassword',
    label: '确认密码',
    defaultValue: '',
    component: 'StrengthMeter',
    colProps: { span: 11, offset: 1 },
    dynamicRules: ({ model, values }) => {
      const field = 'password';
      const isUpdate = values.id > 0;
      const required = !isUpdate || model[field] !== '';
      return [
        {
          required,
          trigger: ['change', 'blur'],
          validator(_, value: any) {
            return new Promise((resolve, reject) => {
              if (isUpdate) {
                if (value === '' && model[field] !== '') {
                  reject('请确认密码');
                }
                if (value && value !== model[field]) {
                  reject('两次输出的密码不一致');
                }
              } else {
                if (value === '') {
                  reject('请输入密码');
                }
                if (value !== model[field]) {
                  reject('两次输入的密码不一致');
                }
              }
              resolve(value);
            });
          },
        },
      ];
    },
  },
  {
    field: 'realname',
    label: '真实姓名',
    subLabel: '最长10个字符',
    required: true,
    defaultValue: '',
    component: 'Input',
    componentProps: { maxlength: 10 },
  },
  {
    field: 'status',
    label: '状态',
    defaultValue: 1,
    component: 'Switch',
    componentProps: {
      checkedValue: 1,
      unCheckedValue: 0,
      checkedChildren: '正常',
      unCheckedChildren: '锁定',
    },
  },
  {
    field: 'sort',
    label: '排序',
    subLabel: '越小越靠前',
    defaultValue: 9,
    component: 'InputNumber',
    componentProps: { min: 0, max: 255 },
    required: true,
  },
  {
    field: 'avatar',
    label: '用户头像',
    defaultValue: '',
    component: 'CropperAvatar',
    render: renderAvatar({ uploadApi: avatarUploadApi }),
  },
];

const authFormSchema: FormSchema[] = [
  {
    field: 'rid',
    label: '角色组',
    subLabel: '权限所属的分组',
    required: true,
    // defaultValue: 0,
    component: 'ApiSelect',
    componentProps: { api: onceStore.getRoleOptions },
  },
];

const baseFormConfig = {
  layout: 'vertical',
  showActionButtonGroup: false,
};

export const dataTabs: {
  key: string;
  tab: string;
  Form: UseFormReturnType;
}[] = [
  {
    key: '1',
    tab: '基本信息',
    Form: useForm(Object.assign({ schemas: baseFormSchema }, baseFormConfig) as FormProps),
  },
  {
    key: '2',
    tab: '权限设置',
    Form: useForm(Object.assign({ schemas: authFormSchema }, baseFormConfig) as FormProps),
  },
];

const pwdRules: Rule[] = [
  {
    required: false,
    trigger: ['change', 'blur'],
    validator(_, value: any) {
      return new Promise((resolve, reject) => {
        if (value && value.length < 6) {
          reject('密码过短');
        } else {
          resolve(value);
        }
      });
    },
  },
];

export const modifyFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    required: true,
    componentProps: { disabled: true },
  },
  {
    field: '__password',
    label: '旧密码',
    subLabel: '留空表示不修改密码',
    component: 'StrengthMeter',
    rules: pwdRules,
  },
  {
    field: 'password',
    label: '新密码',
    subLabel: '修改密码请先填写旧密码',
    defaultValue: '',
    component: 'StrengthMeter',
    colProps: { span: 8 },
    rules: pwdRules,
  },
  {
    field: 'confirmPassword',
    label: '确认新密码',
    defaultValue: '',
    component: 'StrengthMeter',
    colProps: { span: 7, offset: 1 },
    dynamicRules: ({ model }) => {
      const field = 'password';
      const required = model[field] !== '';
      return [
        {
          required,
          trigger: ['change', 'blur'],
          validator(_, value: any) {
            return new Promise((resolve, reject) => {
              if (value === '' && model[field] !== '') {
                reject('请确认密码');
              }
              if (value && value !== model[field]) {
                reject('两次输出的密码不一致');
              } else {
                resolve(value);
              }
            });
          },
        },
      ];
    },
  },
  {
    field: 'realname',
    label: '真实姓名',
    required: true,
    component: 'Input',
  },
  {
    field: 'avatar',
    label: '头像',
    defaultValue: '',
    component: 'CropperAvatar',
    render: renderAvatar({ uploadApi: avatarUploadApi }),
  },
];
