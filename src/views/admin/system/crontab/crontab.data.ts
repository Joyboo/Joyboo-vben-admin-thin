import { CurdAuth } from '/#/utils';
import { h, VNode } from 'vue';
import { Switch, Tag } from 'ant-design-vue';
import { usePermission } from '/@/hooks/web/usePermission';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { crontabChange } from '/@/api/admin/system';
import { useMessage } from '/@/hooks/web/useMessage';
import { JsonPreview } from '/@/components/CodeEditor';

export const curdAuth: CurdAuth = {
  add: '/crontab/add',
  edit: '/crontab/edit',
  del: '/crontab/del',
};

export const columns: BasicColumn[] = [
  {
    dataIndex: 'id',
    title: 'ID',
    sorter: true,
    width: 80,
  },
  {
    dataIndex: 'name',
    title: '任务名',
    width: 200,
  },
  {
    dataIndex: 'rule',
    title: '执行规则',
    width: 120,
  },
  {
    dataIndex: 'eclass',
    title: '类和方法',
    width: 200,
    format: (text: string, record: Recordable) => {
      return text + ' -> ' + record.method;
    },
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
        checked: record.status === 0,
        checkedChildren: '已启用',
        unCheckedChildren: '已禁用',
        disabled: !hasPermission([curdAuth.edit]),
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? 0 : 1; // 实际有3种状态，快捷方式提供两种就足够, 而且与其他status不同的是为兼容老数据，0-启用，1-禁用
          const { createMessage } = useMessage();
          crontabChange(record.id, 'status', newStatus)
            .then(() => {
              record.status = newStatus;
              createMessage.success('操作成功');
            })
            .catch(() => {})
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
  {
    title: '运行的系统',
    dataIndex: 'sys',
    customRender: ({ text }) => {
      const eh: VNode[] = [];
      const color = { 0: 'blue', 1: 'green', 2: 'orange', 3: 'cyan' };
      const t = { 1: 'report', 2: 'pay', 3: 'sdk', 4: '后台' };
      text.forEach((item: number) => {
        eh.push(h(Tag, { color: color[item], style: { margin: '0 5px' } }, () => t[item]));
      });
      return h('span', {}, eh);
    },
    width: 150,
  },
  {
    title: '运行的服务器',
    dataIndex: 'server',
    customRender: ({ text }) => {
      const eh: VNode[] = [];
      const color = { 1: 'orange', 2: 'cyan' };
      const t = { 1: '1服', 2: '2服' };
      text.forEach((item: number) => {
        eh.push(h(Tag, { color: color[item], style: { margin: '0 5px' } }, () => t[item]));
      });
      return h('span', {}, eh);
    },
    width: 150,
  },
  {
    dataIndex: 'args',
    title: '参数',
    customRender: ({ text }) => {
      if (text === '') {
        return h('span');
      } else {
        return h(JsonPreview, { data: text, deep: 0 });
      }
    },
  },
  {
    dataIndex: 'remark',
    title: '说明',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: ' ',
    component: 'Input',
    componentProps: {
      placeholder: '任务名 | 方法',
    },
    // :xs="8" :sm="8" :md="8" :lg="8" :xl="8" :xxl="8"
    colProps: { xs: 24, sm: 24, md: 12, lg: 4, xl: 4, xxl: 3 },
  },
  {
    field: 'status',
    label: ' ',
    component: 'Select',
    componentProps: {
      allowClear: true,
      placeholder: '状态',
      options: [
        { label: '启用', value: 0 },
        { label: '禁用', value: 1 },
        { label: '运行一次', value: 2 },
      ],
    },
    colProps: { xs: 24, sm: 24, md: 12, lg: 4, xl: 4, xxl: 3 },
  },
  {
    field: 'sys',
    label: ' ',
    component: 'Select',
    componentProps: {
      allowClear: true,
      placeholder: '运行的系统',
      options: [
        { label: 'report', value: 1 },
        { label: 'pay', value: 2 },
        { label: 'sdk', value: 3 },
        { label: '后台', value: 4 },
      ],
    },
    colProps: { xs: 24, sm: 24, md: 12, lg: 4, xl: 4, xxl: 3 },
  },
  {
    field: 'server',
    label: ' ',
    component: 'Select',
    componentProps: {
      allowClear: true,
      placeholder: '运行的服务器',
      options: [
        { label: '1服', value: 1 },
        { label: '2服', value: 2 },
      ],
    },
    colProps: { xs: 24, sm: 24, md: 12, lg: 4, xl: 4, xxl: 3 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'name',
    label: '任务名',
    component: 'Input',
    required: true,
    defaultValue: '',
  },
  {
    field: 'rule',
    label: '执行规则',
    component: 'Input',
    componentProps: {
      placeholder: '* * * * *',
    },
    required: true,
    defaultValue: '',
  },
  {
    field: 'rclass',
    label: '异步任务模板类', // todo Set Default Class
    component: 'Input',
    required: true,
    defaultValue: '',
  },
  {
    field: 'eclass',
    label: '运行类',
    component: 'Input',
    required: true,
    defaultValue: '',
    colProps: { lg: 12, md: 12 },
  },
  {
    field: 'method',
    label: '运行方法',
    component: 'Input',
    required: true,
    defaultValue: '',
    colProps: { lg: 12, md: 12 },
  },
  {
    field: 'args',
    label: '参数',
    component: 'Input',
    defaultValue: [],
    slot: 'crontabArgs',
  },
  {
    field: 'remark',
    label: '说明',
    component: 'InputTextArea',
    defaultValue: '',
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '启用', value: 0 },
        { label: '禁用', value: 1 },
        { label: '运行一次', value: 2 },
      ],
    },
  },
  {
    field: 'sys',
    label: '运行的系统',
    component: 'CheckboxGroup',
    defaultValue: [],
    componentProps: {
      options: [
        { label: 'report', value: 1 },
        { label: 'pay', value: 2 },
        { label: 'sdk', value: 3 },
        { label: '后台', value: 4 },
      ],
    },
  },
  {
    field: 'server',
    label: '运行的服务器id',
    component: 'CheckboxGroup',
    defaultValue: [],
    componentProps: {
      options: [
        { label: '1服', value: 1 },
        { label: '2服', value: 2 },
      ],
    },
  },
];
