import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { gameChange } from '/@/api/admin/app';
import { useMessage } from '/@/hooks/web/useMessage';
import { usePermission } from '/@/hooks/web/usePermission';
import { CurdAuthType, Auth } from '/@/enums/auth';
// import { Moment } from 'moment';

type gameCurdAuth = CurdAuthType & {
  give: string;
};

export const curdAuth: gameCurdAuth = {
  add: Auth.GameAdd,
  edit: Auth.GameEdit,
  del: Auth.GameDel,
  give: Auth.GameGive,
};

export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
    sorter: true,
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
    width: 90,
    sorter: true,
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
              createMessage.success(`操作成功`);
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

export const giveFormSchema: FormSchema[] = [
  {
    field: 'gameid',
    label: '',
    component: 'Input',
    show: false,
  },
  {
    field: 'give',
    label: '分配给Ta',
    slot: 'give',
    component: 'Input',
  },
];

export const FormData = {
  name: '',
  sort: 9,
  status: 1,
  extension: {
    type: 0,
    logkey: '',
    paykey: '',
    logurl: '',
    payurl: '',
    h5entry: '',
    goodsids: '',
    facebook: {
      fansurl: '',
    },
    google: {
      privacy: '',
    },
    divide: {
      cp: 20,
      ios: 30,
      google: 30,
      paypal: 6,
      'paypal-fix': 0.05,
      payssion: 30,
      huawei: 0,
      uwp: 55,
    },
    mtn: {
      switch: 0,
      begintime: '',
      endtime: '',
      notice: '',
    },
    h5sdk: {
      isshow: 0,
      name: '',
      gameid: '',
      pkgbnd: '',
      isshowmnlogo: 1,
      mnlogo: '', // 角标
      gamelogo: '', // logo
      carousel: '', // 轮播图
    },
  },
};

export const RuleData = {
  name: [
    {
      required: true,
      message: '请输入包名',
    },
  ],
  loginkey: [
    {
      required: true,
      message: '密钥为空',
    },
  ],
};
