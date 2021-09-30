import { BasicColumn } from '/@/components/Table';
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
    sorter: true,
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
    width: 90,
    sorter: true,
  },
];

export const PackageForm = {
  gameid: '',
  os: 0,
  name: '',
  pkgbnd: '',
  url: '',
  sort: 9,
  extension: {
    logkey: '',
    paykey: '',
    h5entry: '',
    logurl: '',
    payurl: '',
    domain: {
      report: '',
      sdk: '',
      pay: '',
    },
    google_paykey: '',
    google: {
      web_clientid: '',
    },
    huawei: {
      production: {
        clientid: '',
        clientsecret: '',
      },
    },
    facebook: {
      bindnotice: '',
      appid: '',
    },
    mg: {
      publickey: '',
      appkey: '',
    },
    qzf: {
      enable: 0,
      pf: [],
      condition: '',
    },
    paypal: {
      env: 0,
      production: {
        clientid: '',
        clientsecret: '',
      },
      sandbox: {
        clientid: '',
        clientsecret: '',
      },
    },
    payssion: {
      env: 0,
      production: {
        clientid: '',
        clientsecret: '',
      },
      sandbox: {
        clientid: '',
        clientsecret: '',
      },
    },
    adjust: {
      currency: '',
      event: [
        {
          Key: '',
          Value: '',
        },
      ],
    },
    rating: {
      pop: 0,
      time: 5,
      bgurl: '',
      btnurl: '',
      titurl: '',
      storeurl: '',
      lefturl: '',
      righturl: '',
    },
    share: {
      img: '',
    },
    aihelp: {
      sectionid: '',
    },
  },
};

export const packageRule = {
  name: [
    {
      required: true,
      message: '请输入包名',
    },
  ],
  gameid: [
    {
      required: true,
      message: '请选择游戏',
    },
  ],
};
