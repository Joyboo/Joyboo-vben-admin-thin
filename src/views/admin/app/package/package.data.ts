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
    width: 100,
  },
  {
    title: '包id',
    dataIndex: 'pkgbnd',
    width: 180,
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
export const formSchemaBase: FormSchema[] = [
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
    slot: 'myPackageKey',
    colProps: { lg: 12, md: 24 },
  },
  {
    field: 'extension.paykey',
    label: '支付密钥',
    component: 'Input',
    slot: 'myPackageKey',
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
export const formSchemaThird: FormSchema[] = [
  {
    field: 'extension.google_paykey',
    label: 'google参数',
    component: 'InputTextArea',
    defaultValue: '',
    componentProps: {
      rows: 3,
      placeholder: 'paykey公钥',
    },
    colProps: { lg: 12, md: 24 },
  },
  {
    field: 'extension.google.web_clientid',
    label: '',
    component: 'InputTextArea',
    defaultValue: '',
    componentProps: {
      rows: 3,
      placeholder: 'web_client客户端id',
    },
    colProps: { lg: 12, md: 24 },
  },
];
