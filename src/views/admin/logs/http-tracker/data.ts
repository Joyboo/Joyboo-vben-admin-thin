import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Typography } from 'ant-design-vue';
import { fmtFullTime, formatDaysAgo, timePikerExtra } from '/@/utils/dateUtil';
import { DescItem } from '/@/components/Description';
import { JsonPreview } from '/@/components/CodeEditor';

export const columns: BasicColumn[] = [
  {
    dataIndex: 'point_id',
    title: 'ID',
    width: 350,
    align: 'left',
    // customRender: ({ text }) => h(Typography.Text, { copyable: true }, () => text),
  },
  {
    dataIndex: 'url',
    title: 'url',
    align: 'left',
    width: 480,
  },
  {
    dataIndex: 'point_name',
    title: '标识名',
    width: 150,
  },
  // {
  //   dataIndex: 'depth',
  //   title: '第几级',
  //   width: 80,
  //   helpMessage: 'depth, 树级深度，0-树根',
  // },
  // {
  //   dataIndex: 'ip',
  //   title: 'IP',
  //   width: 100,
  // },
  {
    dataIndex: 'server_name',
    title: '运行服务器',
    width: 130,
  },
  {
    dataIndex: 'runtime',
    title: '运行时长',
    width: 100,
    customRender: ({ text }) => {
      if (!text) {
        return text;
      }
      const color = text < 500 ? 'green' : 'red';
      let dw = 'ms';
      if (text > 1000) {
        text /= 1000;
        dw = 's';
      }
      return h('span', { style: { color } }, text + ' ' + dw);
    },
  },
  {
    dataIndex: 'start_time',
    title: '请求时间',
    width: 150,
    customRender: ({ text }) => (text ? fmtFullTime(text) : ''),
  },
  {
    dataIndex: 'end_time',
    title: '响应时间',
    width: 150,
    customRender: ({ text }) => (text ? fmtFullTime(text) : ''),
  },
  {
    dataIndex: 'request',
    title: '请求参数',
    width: 500,
    customRender: ({ text }) => {
      if (text === '') {
        return h('span');
      } else {
        return h(JsonPreview, { data: text, deep: 0 });
      }
    },
  },
  {
    dataIndex: 'response',
    title: '响应数据',
    width: 500,
    customRender: ({ text }) => {
      if (text === '') {
        return h('span');
      } else {
        return h(JsonPreview, { data: text, deep: 0 });
      }
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'time',
    label: ' ',
    labelWidth: 1,
    component: 'RangePicker',
    defaultValue: [formatDaysAgo(-14), formatDaysAgo()],
    componentProps: {
      allowClear: false,
      showTime: false,
      ranges: timePikerExtra(),
    },
    colProps: { xs: 24, sm: 24, md: 12, lg: 6, xl: 6, xxl: 4 },
  },
  {
    field: 'envkey.one',
    label: ' ',
    labelWidth: 50,
    component: 'Select',
    defaultValue: 'point_name',
    helpMessage: 'LIKE搜索',
    componentProps: {
      options: [
        { label: '标识名', value: 'point_name' },
        { label: 'URL', value: 'url' },
      ] as OptionsItem[],
    },
    colProps: { xs: 24, sm: 24, md: 12, lg: 4, xl: 4, xxl: 2 },
  },
  {
    field: 'envvalue.one',
    label: ' ',
    labelWidth: 1,
    component: 'Input',
    colProps: { xs: 24, sm: 24, md: 12, lg: 6, xl: 6, xxl: 3 },
  },
  {
    field: 'envkey.two',
    label: ' ',
    helpMessage: ['&& 为 AND LIKE', '|| 为 OR LIKE'],
    labelWidth: 50,
    defaultValue: 'point_id',
    component: 'Select',
    componentProps: {
      options: [
        { label: 'ID', value: 'point_id' },
        { label: '请求参数', value: 'request' },
        { label: '响应数据', value: 'response' },
      ] as OptionsItem[],
    },
    colProps: { xs: 24, sm: 24, md: 12, lg: 4, xl: 4, xxl: 2 },
  },
  {
    field: 'envvalue.two',
    label: ' ',
    labelWidth: 6,
    component: 'Input',
    colProps: { xs: 24, sm: 24, md: 12, lg: 6, xl: 6, xxl: 3 },
    rules: [
      {
        required: false,
      },
      {
        validator(_, value: any) {
          return new Promise((resolve, reject) => {
            if (!value) {
              resolve(value);
            } else {
              const isAnd = value.indexOf('&&') >= 0;
              const isOr = value.indexOf('||') >= 0;
              if (isAnd && isOr) {
                reject('请不要同时包含 && 和 ||');
              } else {
                resolve(value);
              }
            }
          });
        },
      },
    ],
  },
  {
    field: 'runtime',
    label: '响应时间 >= ',
    labelWidth: 100,
    component: 'InputNumber',
    componentProps: { style: { width: '100%' } },
    colProps: { xs: 24, sm: 24, md: 12, lg: 6, xl: 6, xxl: 3 },
  },
];

export const descColumns: DescItem[] = [
  {
    field: 'point_name',
    label: '标记名',
    span: 2,
  },
  {
    field: 'point_id',
    label: 'pointId',
    labelStyle: { width: '100px' },
  },
  {
    field: 'parent_id',
    label: 'parentId',
  },
  {
    field: 'is_next',
    label: 'isNext',
  },
  {
    field: 'depth',
    label: 'depth',
  },
  {
    field: 'status',
    label: 'status',
  },
  {
    field: 'ip',
    label: 'IP',
  },
  {
    field: 'server_name',
    label: '运行服务器',
  },
  {
    field: 'instime',
    label: 'log时间',
    render: (text) => (text ? fmtFullTime(text) : ''),
  },
  {
    field: 'start_time',
    label: '请求时间',
    render: (text) => (text ? fmtFullTime(text) : ''),
  },
  {
    field: 'end_time',
    label: '响应时间',
    render: (text) => (text ? fmtFullTime(text) : ''),
  },
  {
    field: 'url',
    label: 'url',
    span: 2,
    render: (val) => h(Typography.Text, { copyable: true }, () => val),
  },
  {
    field: 'request',
    label: '请求参数',
    span: 2,
    render: (text) => {
      if (text === '') {
        return h('span');
      } else {
        return h(JsonPreview, { data: text, deep: 10 });
      }
    },
  },
  {
    field: 'response',
    label: '响应数据',
    span: 2,
    render: (text) => {
      if (text === '') {
        return h('span');
      } else {
        return h(JsonPreview, { data: text, deep: 10 });
      }
    },
  },
];
