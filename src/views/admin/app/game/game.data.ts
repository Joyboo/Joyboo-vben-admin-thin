import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { gameChange } from '/@/api/admin/app';
import { useMessage } from '/@/hooks/web/useMessage';
import { usePermission } from '/@/hooks/web/usePermission';
import { FormActionType } from '/@/components/Form';
import { CurdAuth } from '/#/utils';
// import { Moment } from 'moment';

export const curdAuth: CurdAuth = {
  add: '/package/add',
  edit: '/package/edit',
  del: '/package/del',
};

export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '游戏名',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: '登录密钥',
    dataIndex: 'extension.logkey',
    width: 180,
  },
  {
    title: '支付密钥',
    dataIndex: 'extension.paykey',
    width: 180,
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: 50,
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
          gameChange(record.id, 'status', newStatus)
            .then(() => {
              record.status = newStatus;
              createMessage.success(`已成功修改角色状态`);
            })
            .catch(() => {
              // createMessage.error('修改角色状态失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
  {
    title: '创建时间',
    dataIndex: 'itime',
    width: 180,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '禁用', value: 0 },
        { label: '启用', value: 1 },
      ],
    },
    colProps: { span: 8 },
  },
  {
    field: 'name',
    label: '游戏名',
    component: 'Input',
    colProps: { span: 8 },
  },
];

// 基本信息
const formSchemaBase: FormSchema[] = [
  {
    field: 'name',
    label: '游戏名',
    required: true,
    component: 'Input',
    colProps: { lg: 24, md: 24 },
  },
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    field: 'status',
    label: '本游戏是否显示',
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '隐藏', value: 0 },
        { label: '显示', value: 1 },
      ],
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    field: 'extension.type',
    label: '类型',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: 'H5', value: 0 },
        { label: '手游', value: 1 },
      ],
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    field: 'sort',
    label: '排序',
    helpMessage: '越小越靠前',
    defaultValue: 9,
    component: 'InputNumber',
    componentProps: {
      min: 1,
      max: 255,
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    field: 'extension.logkey',
    label: '登录密钥',
    required: true,
    component: 'Input',
    slot: 'myGameKey',
    colProps: { lg: 12, md: 24 },
  },
  {
    field: 'extension.paykey',
    label: '支付密钥',
    required: true,
    component: 'Input',
    slot: 'myGameKey',
    colProps: { lg: 12, md: 24 },
  },
  {
    field: 'extension.logurl',
    label: '登录api网址',
    defaultValue: '',
    helpMessage: ['平台会将用户token传到此网址', '手游此项可随便填'],
    component: 'Input',
  },
  {
    field: 'extension.payurl',
    label: '支付api网址',
    defaultValue: '',
    helpMessage: '平台会将支付信息传到此网址',
    component: 'Input',
  },
  {
    field: 'extension.h5entry',
    label: '平台入口网址',
    defaultValue: '',
    helpMessage: 'H5游戏的入口地址',
    component: 'Input',
    ifShow: ({ values }) => values['extension.type'] === 0,
  },
];

// 充值信息
const formSchemaPay: FormSchema[] = [
  {
    label: '充值产品ID',
    field: 'extension.goodsids',
    defaultValue: '',
    helpMessage: '逗号,或换行符隔开',
    component: 'InputTextArea',
    componentProps: {
      rows: 8,
      placeholder: '逗号或换行符隔开',
    },
  },
];

// 维护弹窗
const formSchemaMtn: FormSchema[] = [
  {
    field: 'extension.mtn.switch',
    label: '维护开关',
    helpMessage: '维护期间时打开',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '关闭', value: 0 },
        { label: '开启', value: 1 },
      ],
    },
  },
  {
    field: 'extension.mtn.begintime',
    label: '维护时间',
    component: 'DatePicker',
    defaultValue: '',
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      placeholder: '请选择开始时间',
    },
    ifShow: ({ values }) => values['extension.mtn.switch'] === 1,
    colProps: { lg: 12, md: 24 },
  },
  {
    field: 'extension.mtn.endtime',
    label: '-',
    labelWidth: '20px',
    component: 'DatePicker',
    defaultValue: '',
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      placeholder: '请选择结束时间',
    },
    ifShow: ({ values }) => values['extension.mtn.switch'] === 1,
    colProps: { lg: 12, md: 24 },
  },
  {
    label: '维护公告',
    field: 'extension.mtn.notice',
    component: 'InputTextArea',
    defaultValue: '',
    componentProps: {
      rows: 3,
    },
    ifShow: ({ values }) => values['extension.mtn.switch'] === 1,
  },
  {
    field: 'extension.facebook.fansurl',
    label: 'Facebook粉丝页',
    defaultValue: '',
    component: 'Input',
  },
  {
    field: 'extension.google.privacy',
    label: 'Google隐私政策页',
    defaultValue: '',
    component: 'Input',
  },
];

// 分成信息
const formSchemaDivide: FormSchema[] = [
  {
    field: 'extension.divide.cp',
    label: 'CP分成比例',
    defaultValue: '20',
    helpMessage: '研发的分成百分比',
    component: 'Input',
    componentProps: {
      suffix: '%',
      allowClear: false,
    },
  },
  {
    field: 'extension.divide.ios',
    label: 'IOS分成比例',
    defaultValue: '30',
    component: 'Input',
    componentProps: {
      suffix: '%',
      allowClear: false,
    },
  },
  {
    field: 'extension.divide.google',
    label: 'Google分成比例',
    defaultValue: '30',
    component: 'Input',
    componentProps: {
      suffix: '%',
      allowClear: false,
    },
  },
  {
    field: 'extension.divide.uwp',
    label: 'MG分成比例',
    defaultValue: '55',
    helpMessage: 'UWP分成比例',
    component: 'Input',
    componentProps: {
      suffix: '%',
      allowClear: false,
    },
  },
  {
    field: 'extension.divide.payssion',
    label: 'payssion分成比例',
    defaultValue: '30',
    component: 'Input',
    componentProps: {
      suffix: '%',
      allowClear: false,
    },
  },
  {
    field: 'extension.divide.huawei',
    label: '华为分成比例',
    defaultValue: '0',
    component: 'Input',
    componentProps: {
      suffix: '%',
      allowClear: false,
    },
  },
  {
    field: 'extension.divide.paypal',
    label: 'paypal分成比例',
    defaultValue: '6',
    component: 'Input',
    componentProps: {
      suffix: '%',
      allowClear: false,
    },
    colProps: { lg: 8, md: 24 },
  },
  {
    field: 'extension.divide.paypal-fix',
    label: '+',
    labelWidth: '20px',
    defaultValue: '0.05',
    component: 'Input',
    componentProps: {
      suffix: '%',
      allowClear: false,
    },
    colProps: { lg: 5, md: 24 },
  },
];

// 网页充值
const formSchemaH5sdk: FormSchema[] = [
  {
    field: 'extension.h5sdk.isshow',
    label: '是否显示',
    helpMessage: '是否显示在网页充值',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '关闭', value: 0 },
        { label: '开启', value: 1 },
      ],
    },
  },
  {
    field: 'extension.h5sdk.name',
    label: '显示游戏名',
    helpMessage: '网页充值显示的游戏名',
    component: 'Input',
    defaultValue: '',
  },
  {
    field: 'extension.h5sdk.pkgbnd',
    label: '包',
    helpMessage: '登录appid用哪个包的',
    component: 'Select', // todo 获取数据
    defaultValue: '',
  },
  {
    field: 'extension.h5sdk.isshowmnlogo',
    label: '显示游戏名',
    helpMessage: '网页充值显示的游戏名',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '关闭', value: 0 },
        { label: '开启', value: 1 },
      ],
    },
  },
];

export interface MyFormItemType {
  key?: string;
  name: string;
  registerForm: (instance: FormActionType) => void;
  methods: FormActionType;
}

export const FormList = [
  {
    name: '基础信息',
    schemas: formSchemaBase,
  },
  {
    name: '充值信息',
    schemas: formSchemaPay,
  },
  {
    name: '维护弹窗',
    schemas: formSchemaMtn,
  },
  {
    name: '分成信息',
    schemas: formSchemaDivide,
  },
  {
    name: '网页充值',
    schemas: formSchemaH5sdk,
  },
];
