<template>
  <Space direction="vertical" size="small" class="w-full">
    <Row :gutter="[20, 20]" v-for="(item, idx) in dataSource" :key="idx">
      <Col :span="colProps.left">
        <Input v-model:value="item[keyName]" :placeholder="keyText" />
      </Col>
      <Col :span="colProps.right">
        <Input v-model:value="item[valueName]" :placeholder="valueText" />
      </Col>
      <Col :span="2">
        <Tooltip title="删除此行" placement="right">
          <a-button
            ghost
            color="warning"
            preIcon="ant-design:delete-outlined"
            @click="delLine(idx)"
          />
        </Tooltip>
      </Col>
    </Row>
    <div class="flex justify-between items-center">
      <div>
        <Tooltip title="添加一行">
          <a-button ghost color="success" preIcon="ant-design:plus-outlined" @click="addLine" />
        </Tooltip>
        <Tooltip title="提交">
          <a-button
            v-if="showSubmit"
            ghost
            color="success"
            class="ml-2"
            :loading="loadingRef"
            preIcon="ant-design:check-outlined"
            @click="saveKeyValue"
          />
        </Tooltip>
      </div>

      <div>
        <a-button
          type="dashed"
          preIcon="bytesize:download"
          :iconSize="16"
          @click="handleDownloadTemplate"
        >
          下载模板
        </a-button>

        <Tooltip>
          <template #title>
            <div>Excel上传</div>
            <div>第一行为表头，会被忽略</div>
            <div>第一列为{{ keyText }}，第二列为{{ valueText }}</div>
          </template>
          <ImpExcel class="import-excel" @success="uploadSuccess" @error="uploadError">
            <a-button
              color="warning"
              class="ml-2"
              :iconSize="16"
              preIcon="ant-design:file-excel-outlined"
            >
              Excel上传
            </a-button>
          </ImpExcel>
        </Tooltip>
      </div>
    </div>
  </Space>
</template>

<script lang="ts" setup name="DynamicLine">
  import { ref, computed, PropType } from 'vue';
  import { Space, Row, Col, Tooltip, Input } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ImpExcel, jsonToSheetXlsx, ExcelData } from '/@/components/Excel';

  type ColPropsType = { left: number; right: number };
  type apiParamType = { id: number; name: string; kv: Array<Recordable> };

  const emit = defineEmits(['update-data', 'submit']);

  const props = defineProps({
    id: {
      type: Number,
      default: 0,
    },
    extKey: {
      type: String,
      default: '',
    },
    data: {
      type: Array as PropType<Array<Recordable>>,
      default: () => [],
    },
    keyName: {
      type: String,
      default: 'Key',
    },
    keyText: {
      type: String,
      default: 'Key',
    },
    valueName: {
      type: String,
      default: 'Value',
    },
    valueText: {
      type: String,
      default: 'Value',
    },
    ifSubmit: {
      type: Boolean,
      default: false,
    },
    // 左右Input栅格分配
    colProps: {
      type: Object as PropType<ColPropsType>,
      default: () => ({ left: 11, right: 11 }),
      // 累加 = 22， 留2格给按钮
      validator: (value: ColPropsType) => value.left + value.right === 22,
    },
    // 下载模板文件名
    downTplName: {
      type: String,
      default: () => new Date().getTime() + '.xlsx',
    },
    submitApi: {
      type: Function as PropType<PromiseFn<apiParamType>>,
      default: null,
    },
  });

  const { createMessage } = useMessage();

  const dataSource = computed({
    get: () => props.data,
    set: (val) => emit('update-data', val),
  });
  const showSubmit = computed(() => {
    // 后端saveKeyValue方法中非KeyValue格式会被过滤
    return props.ifSubmit && props.id > 0 && props.keyName === 'Key' && props.valueName === 'Value';
  });

  const loadingRef = ref(false);

  function delLine(index: number) {
    dataSource.value.splice(index, 1);
    if (dataSource.value.length === 0) {
      addLine();
    }
  }

  function addLine() {
    dataSource.value = [...dataSource.value, { [props.keyName]: '', [props.valueName]: '' }];
  }

  function saveKeyValue() {
    if (props.id <= 0) {
      return;
    }
    loadingRef.value = true;
    props
      .submitApi({
        id: props.id,
        name: props.extKey,
        kv: props.data,
      })
      .then(() => {
        createMessage.success('保存成功');
      })
      .catch((_) => {})
      .finally(() => {
        loadingRef.value = false;
      });
    emit('submit', props.id, props.extKey, props.data);
  }

  function uploadSuccess(excelData: ExcelData[]) {
    const { keyName, valueName } = props;
    // 只读第一个Sheet
    const [data] = excelData;
    // 第一列做Key,第二列做Value
    const [key, value] = data.header;
    const add: Array<Recordable> = [];
    data.results.forEach((item) => {
      add.push({ [keyName]: item[key], [valueName]: item[value] });
    });
    dataSource.value = [...dataSource.value, ...add].filter(
      (item) => item[keyName] !== '' || item[valueName] !== '',
    );
  }

  function uploadError() {
    createMessage.error('Excel上传失败');
  }

  function handleDownloadTemplate() {
    const { keyText, valueText, downTplName, keyName, valueName } = props;

    const header = { [keyName]: keyText, [valueName]: valueText };
    const cols = Object.keys(header).map((_) => ({ wpx: 200 }));

    jsonToSheetXlsx({
      data: [],
      header,
      filename: `${downTplName}-模板.xlsx`,
      json2sheetOpts: { header: Object.keys(header) },
      workSheetOpts: { '!cols': cols, '!rows': [{ hpx: 20 }] },
    });
  }
</script>

<style lang="less" scoped>
  .import-excel {
    display: inline-block;
  }
</style>
