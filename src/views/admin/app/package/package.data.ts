import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { CurdAuth } from '/#/utils';

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
    title: '所属游戏',
    dataIndex: 'gameid',
    width: 100,
  },
  {
    title: '包名',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '包id',
    dataIndex: 'pkgbnd',
    width: 200,
  },
  {
    title: '操作系统',
    dataIndex: 'os',
    width: 80,
    customRender: ({ record }) => {
      const type = record.os;
      const color = { 0: 'blue', 1: 'green', 2: 'orange' };
      const text = { 0: '安卓', 1: '苹果', 2: '微软' };
      return h(Tag, { color: color[type] }, () => text[type]);
    },
  },
  {
    title: '登录密钥',
    dataIndex: 'extension.logkey',
  },
  {
    title: '支付密钥',
    dataIndex: 'extension.paykey',
  },
  {
    title: '排序',
    helpMessage: '越小越靠前',
    dataIndex: 'sort',
    width: 80,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'gameid',
    label: '所属游戏',
    component: 'Select',
    componentProps: {
      options: [],
    },
    colProps: { span: 8 },
  },
  {
    field: 'name',
    label: '包名或包id',
    helpMessage: '支持模糊搜索',
    component: 'Input',
    colProps: { span: 8 },
  },
];

// 基本信息
const formSchemaBase: FormSchema[] = [
  {
    field: 'gameid',
    label: '所属游戏',
    required: true,
    component: 'Select',
    // colProps: { lg: 12, md: 24 },
  },
  {
    field: 'os',
    label: '包操作系统',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '安卓', value: 0 },
        { label: '苹果', value: 1 },
        { label: '微软', value: 2 },
      ],
    },
  },
  {
    field: 'name',
    label: '包名',
    defaultValue: '',
    required: true,
    component: 'Input',
    colProps: { lg: 12, md: 24 },
  },
  {
    field: 'pkgbnd',
    label: '包id',
    defaultValue: '',
    required: true,
    component: 'Input',
    colProps: { lg: 12, md: 24 },
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
    required: true,
  },
  {
    field: 'extension.logkey',
    label: '登录密钥',
    component: 'Input',
    slot: 'makeKey',
    colProps: { lg: 12, md: 24 },
  },
  {
    field: 'extension.paykey',
    label: '支付密钥',
    component: 'Input',
    slot: 'makeKey',
    colProps: { lg: 12, md: 24 },
  },
  {
    field: 'url',
    label: '下载地址',
    defaultValue: '',
    component: 'Input',
  },
  {
    field: 'extension.logurl',
    label: '登录api网址',
    helpMessage: ['平台会将用户token传到此网址', '手游此项可随便填'],
    defaultValue: '',
    component: 'Input',
  },
  {
    field: 'extension.payurl',
    label: '支付api网址',
    helpMessage: '平台会将支付信息传到此网址',
    defaultValue: '',
    component: 'Input',
  },
  {
    field: 'extension.domain.report',
    label: 'report域名',
    defaultValue: 'https://api-report.wonderlandgame.com',
    component: 'Input',
  },
  {
    field: 'extension.domain.sdk',
    label: 'sdk域名',
    defaultValue: 'https://api-sdk.wonderlandgame.com',
    component: 'Input',
  },
  {
    field: 'extension.domain.pay',
    label: 'pay域名',
    defaultValue: 'https://api-pay.wonderlandgame.com',
    component: 'Input',
  },
];

// 第三方配置
const formSchemaThird: FormSchema[] = [
  {
    field: '',
    label: 'google参数',
    component: 'Divider',
  },
  {
    field: 'extension.google_paykey',
    label: 'paykey公钥',
    component: 'InputTextArea',
    defaultValue: '',
    componentProps: {
      rows: 3,
    },
  },
  {
    field: 'extension.google.web_clientid',
    label: 'web_client客户端id',
    component: 'InputTextArea',
    defaultValue: '',
    componentProps: {
      rows: 3,
    },
  },
  {
    field: '',
    label: '华为参数',
    component: 'Divider',
  },
  {
    field: 'extension.huawei.production.clientid',
    label: '正式client_id',
    component: 'InputTextArea',
    defaultValue: '',
    componentProps: {
      rows: 3,
    },
  },
  {
    field: 'extension.huawei.production.clientsecret',
    label: '正式client_secret',
    component: 'InputTextArea',
    defaultValue: '',
    componentProps: {
      rows: 3,
    },
  },
  {
    field: '',
    label: 'facebook参数',
    component: 'Divider',
  },
  {
    field: 'extension.facebook.bindnotice',
    label: '绑定通知',
    component: 'InputTextArea',
    defaultValue: '',
    componentProps: {
      rows: 3,
    },
  },
  {
    field: 'extension.facebook.appid',
    label: 'appid',
    component: 'InputTextArea',
    defaultValue: '',
    componentProps: {
      rows: 3,
    },
  },
  {
    field: '',
    label: 'MG参数',
    component: 'Divider',
  },
  {
    field: 'extension.mg.appkey',
    label: 'appkey',
    component: 'InputTextArea',
    defaultValue: '',
    componentProps: {
      rows: 3,
    },
  },
  {
    field: 'extension.mg.publickey',
    label: 'publickey',
    component: 'InputTextArea',
    defaultValue: '',
    componentProps: {
      rows: 3,
    },
  },
];

// 切支付
const formSchemaQzf: FormSchema[] = [
  {
    field: 'extension.qzf.enable',
    label: '是否开启',
    helpMessage: '开启H5支付',
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
    field: 'extension.qzf.pf',
    label: 'H5支付方式',
    helpMessage: '切支付开启时有效',
    component: 'CheckboxGroup',
    defaultValue: [],
    componentProps: {
      options: [
        { label: 'paypal', value: 'paypal' },
        { label: 'payssion', value: 'payssion' },
        { label: 'uwp', value: 'uwp' },
      ],
    },
    ifShow: ({ values }) => values['extension.qzf.enable'] === 1,
  },
  {
    field: 'extension.qzf.condition',
    label: '开启条件',
    defaultValue: '',
    component: 'Input',
    ifShow: ({ values }) => values['extension.qzf.enable'] === 1,
  },
  {
    field: '',
    label: 'paypal参数',
    component: 'Divider',
  },
  {
    field: 'extension.paypal.env',
    label: '支付环境',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '沙盒', value: 0 },
        { label: '正式', value: 1 },
      ],
    },
  },
  {
    field: 'extension.paypal.production.clientid',
    label: ' ',
    labelWidth: '20px',
    component: 'InputTextArea',
    defaultValue: '',
    componentProps: {
      rows: 2,
      placeholder: '正式clientId',
    },
    colProps: { lg: 12, md: 24 },
    ifShow: ({ values }) => values['extension.paypal.env'] === 1,
  },
  {
    field: 'extension.paypal.production.clientsecret',
    label: ' ',
    labelWidth: '20px',
    component: 'InputTextArea',
    defaultValue: '',
    componentProps: {
      rows: 2,
      placeholder: '正式clientSecret',
    },
    colProps: { lg: 12, md: 24 },
    ifShow: ({ values }) => values['extension.paypal.env'] === 1,
  },
  {
    field: 'extension.paypal.sandbox.clientid',
    label: ' ',
    labelWidth: '20px',
    component: 'InputTextArea',
    defaultValue: '',
    componentProps: {
      rows: 2,
      placeholder: '沙盒clientId',
    },
    colProps: { lg: 12, md: 24 },
    ifShow: ({ values }) => values['extension.paypal.env'] === 0,
  },
  {
    field: 'extension.paypal.sandbox.clientsecret',
    label: ' ',
    labelWidth: '20px',
    component: 'InputTextArea',
    defaultValue: '',
    componentProps: {
      rows: 2,
      placeholder: '沙盒clientSecret',
    },
    colProps: { lg: 12, md: 24 },
    ifShow: ({ values }) => values['extension.paypal.env'] === 0,
  },
  {
    field: '',
    label: 'payssion参数',
    component: 'Divider',
  },
  {
    field: 'extension.payssion.env',
    label: '支付环境',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '沙盒', value: 0 },
        { label: '正式', value: 1 },
      ],
    },
  },
  {
    field: 'extension.payssion.production.clientid',
    label: ' ',
    labelWidth: '20px',
    component: 'InputTextArea',
    defaultValue: '',
    componentProps: {
      rows: 2,
      placeholder: '正式clientId',
    },
    colProps: { lg: 12, md: 24 },
    ifShow: ({ values }) => values['extension.payssion.env'] === 1,
  },
  {
    field: 'extension.payssion.production.clientsecret',
    label: ' ',
    labelWidth: '20px',
    component: 'InputTextArea',
    defaultValue: '',
    componentProps: {
      rows: 2,
      placeholder: '正式clientSecret',
    },
    colProps: { lg: 12, md: 24 },
    ifShow: ({ values }) => values['extension.payssion.env'] === 1,
  },
  {
    field: 'extension.payssion.sandbox.clientid',
    label: ' ',
    labelWidth: '20px',
    component: 'InputTextArea',
    defaultValue: '',
    componentProps: {
      rows: 2,
      placeholder: '沙盒clientId',
    },
    colProps: { lg: 12, md: 24 },
    ifShow: ({ values }) => values['extension.payssion.env'] === 0,
  },
  {
    field: 'extension.payssion.sandbox.clientsecret',
    label: ' ',
    labelWidth: '20px',
    component: 'InputTextArea',
    defaultValue: '',
    componentProps: {
      rows: 2,
      placeholder: '沙盒clientSecret',
    },
    colProps: { lg: 12, md: 24 },
    ifShow: ({ values }) => values['extension.payssion.env'] === 0,
  },
];

// adjust
const formSchemaAdjust: FormSchema[] = [
  {
    field: 'extension.adjust.currency',
    label: '货币类型',
    defaultValue: '',
    component: 'Input',
  },
  {
    field: 'extension.adjust.event',
    label: '事件',
    helpMessage: 'Key和Value若为空，忽略当前行',
    defaultValue: '',
    component: 'Input',
    slot: 'adjust',
  },
];

// adjust event
export const formSchemaAdjustEvent: FormSchema[] = [
  {
    field: 'key0',
    component: 'Input',
    componentProps: {
      allowClear: false,
    },
    required: true,
    label: 'Key',
    colProps: {
      span: 8,
    },
  },
  {
    field: 'value0',
    component: 'Input',
    componentProps: {
      allowClear: false,
    },
    required: true,
    label: 'Value',
    colProps: {
      span: 8,
    },
  },
  {
    field: '0',
    component: 'Input',
    label: ' ',
    colProps: {
      span: 8,
    },
    slot: 'del',
  },
  {
    field: 'action',
    label: ' ',
    component: 'Input',
    slot: 'footer',
  },
];

export const FormList = [
  {
    key: 'base',
    name: '基础信息',
    schemas: formSchemaBase,
  },
  {
    key: 'third',
    name: '第三方配置',
    schemas: formSchemaThird,
  },
  {
    key: 'qzf',
    name: '切支付配置',
    schemas: formSchemaQzf,
  },
  {
    key: 'adjust',
    name: 'adjust配置',
    schemas: formSchemaAdjust,
  },
];
