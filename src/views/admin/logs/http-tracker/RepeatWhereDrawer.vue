<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    class="repeat-where"
    showFooter
    title="筛选 & 复发"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #where="{ model, field }">
        <div style="background: #ececec; padding: 10px">
          <Card title="SQL预览" :bordered="false">
            <template #extra>
              <div class="sql-tips">包含 % 则为 LIKE，不包含则为 =</div>
            </template>
            <div v-if="model[field]">
              <span style="color: red; font-weight: bold">WHERE&nbsp;&nbsp;</span>
              <TypographyText copyable>{{ model[field] }}</TypographyText>
            </div>
          </Card>
        </div>
      </template>
    </BasicForm>

    <template #footer>
      <div class="flex justify-between items-center">
        <Space>
          <Popconfirm title="请确认操作" @confirm="handleRepeat">
            <a-button color="warning">复发请求</a-button>
          </Popconfirm>
          <a-button color="success" @click="handleCount">试运行</a-button>
        </Space>
        <!--  自定义footer会覆盖组件footer，自己写确认取消按钮  -->
        <Space>
          <a-button type="default" @click="handleCancel">取消</a-button>
          <a-button type="default" @click="handleReset">重置</a-button>
          <a-button type="primary" @click="handleSubmit">查询</a-button>
        </Space>
      </div>
    </template>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { Card, Descriptions, Typography, Space, Popconfirm } from 'ant-design-vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { timePikerExtra, dateRangeArray } from '/@/utils/dateUtil';
  import { isDef } from '/@/utils/is';
  import { useMessage } from '/@/hooks/web/useMessage';
  // import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { h } from 'vue';
  import { httpTrackerCount, httpTrackerRun } from '/@/api/admin/logs';
  import { ResultEnum } from '/@/enums/httpEnum';

  const emit = defineEmits(['submit', 'register']);

  const TypographyText = Typography.Text;
  const { createConfirm } = useMessage();
  // const { clipboardRef, copiedRef } = useCopyToClipboard();

  const schemas: FormSchema[] = [
    {
      field: 'timeType',
      label: '时间类型',
      helpMessage: [
        'instime: 记录入库时间',
        'start_time: 收到请求时间',
        'end_time: 请求处理完成时间',
      ],
      required: true,
      component: 'Select',
      defaultValue: 'instime',
      componentProps: {
        options: ['instime', 'start_time', 'end_time'].map((item) => ({
          label: item,
          value: item,
        })) as OptionsItem[],
        onChange: changeValue,
      },
      colProps: { span: 8 },
    },
    // {
    //   field: 'timeStamp',
    //   label: '时间格式',
    //   required: true,
    //   component: 'Select',
    //   componentProps: {
    //     options: [
    //       { label: 'YYYY-MM-DD HH:mm:ss', value: 'YYYY-MM-DD HH:mm:ss' },
    //       { label: '秒级时间戳', value: 'x' },
    //       { label: '毫秒时间戳', value: 'X' },
    //     ] as OptionsItem[],
    //   },
    //   colProps: { span: 6 },
    // },
    {
      field: 'time',
      label: '时间范围',
      subLabel: '（点击确定按钮触发Change）',
      component: 'RangePicker',
      defaultValue: dateRangeArray(0),
      required: true,
      componentProps: {
        allowClear: false,
        showTime: true,
        ranges: timePikerExtra(),
        style: { width: '100%' },
        onOk: changeValue,
      },
      colProps: { span: 15, offset: 1 },
    },
    {
      field: 'repeated',
      label: '复发状态',
      // defaultValue: 0,
      component: 'Select',
      componentProps: {
        options: [
          { label: '普通请求', value: 0 },
          { label: '复发请求', value: 1 },
        ] as OptionsItem[],
        onChange: changeValue,
      },
      colProps: { span: 8 },
    },
    {
      field: 'depth',
      label: '记录深度',
      subLabel: '复发请求时，请选择值运行父级',
      component: 'Select',
      componentProps: {
        options: [
          { label: '父级', value: 0 },
          { label: '子级', value: 1 },
        ] as OptionsItem[],
        onChange: changeValue,
      },
      colProps: { span: 7, offset: 1 },
    },
    {
      field: 'url',
      label: 'URL匹配',
      component: 'Input',
      componentProps: { onChange: changeValue },
      colProps: { span: 7, offset: 1 },
    },
    {
      field: 'path',
      label: 'path匹配',
      component: 'Input',
      componentProps: { onChange: changeValue },
      colProps: { span: 8 },
    },
    {
      field: 'server_name',
      label: '服务器匹配',
      component: 'Input',
      componentProps: { onChange: changeValue },
      colProps: { span: 7, offset: 1 },
    },
    {
      field: 'ip',
      label: 'IP匹配',
      component: 'Input',
      componentProps: { onChange: changeValue },
      colProps: { span: 7, offset: 1 },
    },
    {
      field: 'rq_key',
      label: '请求参数筛选 - Key',
      component: 'Input',
      componentProps: { onChange: changeValue },
      colProps: { span: 8 },
    },
    {
      field: 'rq_value',
      label: 'Value',
      component: 'Input',
      componentProps: { onChange: changeValue },
      colProps: { span: 15, offset: 1 },
    },
    {
      field: 'sql',
      label: '自定义SQL',
      component: 'InputTextArea',
      componentProps: { rows: 3, onChange: changeValue },
    },
    {
      field: 'where',
      label: 'SQL预览',
      labelWidth: 0,
      component: 'InputTextArea',
      componentProps: { rows: 5, disabled: true },
      colSlot: 'where',
    },
  ];

  const [registerForm, { getFieldsValue, setFieldsValue, validate, resetFields }] = useForm({
    layout: 'vertical',
    // labelWidth: 120,
    schemas,
    showActionButtonGroup: false,
    fieldMapToTime: [['time', ['begintime', 'endtime'], 'YYYY-MM-DD HH:mm:ss']],
  });
  const [registerDrawer, { changeLoading, changeOkLoading, closeDrawer }] = useDrawerInner(
    async () => {
      // console.log('open data ', data);
      changeValue();
    },
  );

  // 有%为like,暂不识别_
  function getSymbol(str: string | number) {
    return str.toString().indexOf('%') >= 0 ? 'LIKE' : '=';
  }

  async function changeValue() {
    await validate();
    const record = getFieldsValue();
    let where = '';

    if (isDef(record.begintime) && isDef(record.endtime) && isDef(record.timeType)) {
      where += `${record.timeType} BETWEEN UNIX_TIMESTAMP('${record.begintime}') AND UNIX_TIMESTAMP('${record.endtime}')`;
    }

    ['repeated', 'server_name', 'url', 'ip', 'depth'].forEach((item) => {
      if (isDef(record[item]) && record[item] !== '') {
        const sb = getSymbol(record[item]);
        where += ` AND ${item} ${sb} '${record[item]}'`;
      }
    });
    // request->key
    ['path'].forEach((item) => {
      if (isDef(record[item]) && record[item] !== '') {
        const sb = getSymbol(record[item]);
        where += ` AND request->'$.${item}' ${sb} '${record[item]}'`;
      }
    });

    // 请求参数, GET,POST,JSON
    if (
      isDef(record.rq_key) &&
      isDef(record.rq_value) &&
      record.rq_key !== '' &&
      record.rq_value !== ''
    ) {
      const sb = getSymbol(record.rq_value);
      const arr: string[] = [];
      ['GET', 'POST', 'JSON'].forEach((k) => {
        arr.push(`request->'$.${k}.${record.rq_key}' ${sb} '${record.rq_value}'`);
      });
      where += ` AND ( ${arr.join(' OR ')} )`;
    }

    if (isDef(record.sql) && record.sql !== '') {
      where += ` AND ${record.sql}`;
    }

    setFieldsValue({ where });
  }

  // function handleCopySql() {
  //   const record = getFieldsValue();
  //   if (isDef(record.where) && record.where !== '') {
  //     clipboardRef.value = record.where;
  //     if (unref(copiedRef)) {
  //       createMessage.success('WHERE已复制到剪切板！');
  //     }
  //   } else {
  //     createMessage.error('WHERE为空');
  //   }
  // }

  async function handleCount() {
    changeLoading(true);
    try {
      await validate();
      const record = getFieldsValue();
      const { code, result, message } = await httpTrackerCount({ where: record.where });
      if (code === ResultEnum.SUCCESS) {
        createConfirm({
          width: '60%',
          iconType: 'success',
          title: () => '运行结果确认',
          content: () =>
            h(Descriptions, { bordered: true, column: 1, labelStyle: { width: '150px' } }, () => [
              h(Descriptions.Item, { label: 'WHERE条件' }, () =>
                h(TypographyText, { copyable: true }, () => record.where),
              ),
              h(Descriptions.Item, { label: 'COUNT行数' }, () => result.count),
            ]),
        });
      } else {
        createConfirm({
          width: '60%',
          iconType: 'error',
          title: () => 'WEHRE条件出错',
          content: () =>
            h(Descriptions, { bordered: true, column: 1, labelStyle: { width: '150px' } }, () => [
              h(Descriptions.Item, { label: 'WHERE条件' }, () =>
                h(TypographyText, { copyable: true }, () => record.where),
              ),
              h(Descriptions.Item, { label: '出错原因' }, () => message),
            ]),
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      changeLoading(false);
    }
  }

  async function handleRepeat() {
    changeOkLoading(true);
    try {
      await validate();
      const record = getFieldsValue();
      const { code, result, message } = await httpTrackerRun({ where: record.where });
      if (code === ResultEnum.SUCCESS) {
        createConfirm({
          width: '60%',
          iconType: 'success',
          title: () => '执行结果确认',
          content: () =>
            h(Descriptions, { bordered: true, column: 1, labelStyle: { width: '150px' } }, () => [
              h(Descriptions.Item, { label: 'WHERE条件' }, () =>
                h(TypographyText, { copyable: true }, () => record.where),
              ),
              h(Descriptions.Item, { label: 'COUNT行数' }, () => result.count),
              h(Descriptions.Item, { label: 'Task返回状态值' }, () => result.task),
            ]),
        });
      } else {
        createConfirm({
          width: '60%',
          iconType: 'error',
          title: () => '执行出错',
          content: () =>
            h(Descriptions, { bordered: true, column: 1, labelStyle: { width: '150px' } }, () => [
              h(Descriptions.Item, { label: 'WHERE条件' }, () =>
                h(TypographyText, { copyable: true }, () => record.where),
              ),
              h(Descriptions.Item, { label: '出错原因' }, () => message),
            ]),
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      changeOkLoading(false);
    }
  }

  function handleCancel() {
    closeDrawer();
  }
  function handleReset() {
    resetFields();
  }

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();
      emit('submit', values.where);
      closeDrawer();
    } catch (e) {
      console.log(e);
    }
  }
</script>

<style lang="less" scoped>
  .sql-tips {
    font-size: 0.8rem;
    color: green;
  }
</style>
