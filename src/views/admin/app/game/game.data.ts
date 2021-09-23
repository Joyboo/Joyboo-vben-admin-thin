import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { gameChange } from '/@/api/admin/app';
import { useMessage } from '/@/hooks/web/useMessage';
import { usePermission } from '/@/hooks/web/usePermission';

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
    dataIndex: 'logkey',
    width: 180,
  },
  {
    title: '支付密钥',
    dataIndex: 'paykey',
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
        disabled: !hasPermission(['/game/edit']),
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

export const formSchema: FormSchema[] = [
  {
    field: '',
    component: 'Divider',
    label: '基本信息',
  },
  {
    field: 'name',
    label: '游戏名',
    required: true,
    component: 'Input',
    colProps: { lg: 12, md: 24 },
  },
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { lg: 12, md: 24 },
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
    helpMessage: ['平台会将用户token传到此网址', '手游此项可随便填'],
    component: 'Input',
  },
  {
    field: 'extension.payurl',
    label: '支付api网址',
    helpMessage: '平台会将支付信息传到此网址',
    component: 'Input',
  },
  {
    field: 'extension.h5entry',
    label: '平台入口网址',
    helpMessage: 'H5游戏的入口地址',
    component: 'Input',
    ifShow: ({ values }) => values['extension.type'] === 0,
  },
  {
    field: '',
    component: 'Divider',
    label: '充值信息',
  },
  {
    label: '充值产品ID',
    field: 'extension.goodsids',
    helpMessage: '逗号,或换行符隔开',
    component: 'InputTextArea',
    componentProps: {
      rows: 8,
      placeholder: '逗号或换行符隔开',
    },
  },
  {
    field: '',
    component: 'Divider',
    label: '维护弹窗',
  },
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
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: '请选择开始时间1',
    },
    ifShow: ({ values }) => values['extension.mtn.switch'] === 1,
    colProps: { lg: 12, md: 24 },
  },
  {
    field: 'extension.mtn.endtime',
    label: '-',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: '请选择结束时间',
    },
    ifShow: ({ values }) => values['extension.mtn.switch'] === 1,
    colProps: { lg: 12, md: 24 },
  },
  {
    label: '维护公告',
    field: 'extension.mtn.notice',
    component: 'InputTextArea',
    componentProps: {
      rows: 3,
    },
    ifShow: ({ values }) => values['extension.mtn.switch'] === 1,
  },
  {
    field: 'extension.facebook.fansurl',
    label: 'Facebook粉丝页',
    component: 'Input',
  },
  {
    field: 'extension.google.privacy',
    label: 'Google隐私政策页',
    component: 'Input',
  },
  {
    field: '',
    component: 'Divider',
    label: '分成信息',
  },
  {
    field: 'extension.divide.cp',
    label: 'CP分成比例',
    helpMessage: '研发的分成百分比',
    component: 'Input',
    componentProps: {
      suffix: '%',
    },
    colProps: { lg: 8, md: 24 },
  },
  {
    field: 'extension.divide.ios',
    label: 'IOS分成比例',
    component: 'Input',
    componentProps: {
      suffix: '%',
    },
    colProps: { lg: 8, md: 24 },
  },
  {
    field: 'extension.divide.google',
    label: 'Google分成比例',
    component: 'Input',
    componentProps: {
      suffix: '%',
    },
    colProps: { lg: 8, md: 24 },
  },
  {
    field: 'extension.divide.uwp',
    label: 'MG分成比例',
    helpMessage: 'UWP分成比例',
    component: 'Input',
    componentProps: {
      suffix: '%',
    },
    colProps: { lg: 8, md: 24 },
  },
  {
    field: 'extension.divide.payssion',
    label: 'payssion分成比例',
    component: 'Input',
    componentProps: {
      suffix: '%',
    },
    colProps: { lg: 8, md: 24 },
  },
  {
    field: 'extension.divide.huawei',
    label: '华为分成比例',
    component: 'Input',
    componentProps: {
      suffix: '%',
    },
    colProps: { lg: 8, md: 24 },
  },
  {
    field: '_slot.paypal',
    label: 'paypal分成比例',
    component: 'InputGroup',
    colProps: { lg: 16, md: 24 },
    slot: 'myDividePaypal',
  },
];
