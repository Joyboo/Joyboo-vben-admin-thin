<template>
  <div v-loading="loading">
    <UploadDragger
      :customRequest="customRequest"
      :accept="getStringAccept"
      :showUploadList="false"
      class="upload-part"
    >
      <p class="ant-upload-drag-icon">
        <Icon :size="30" icon="ant-design:inbox-outlined" />
      </p>
      <p class="ant-upload-text">{{ uploadText }}</p>
      <p class="ant-upload-hint"> 支持超大文件上传 </p>
      <Progress
        v-if="percent > 0"
        :percent="percent"
        :status="status"
        class="upload-part-progress"
      />
      <p v-if="value">
        <Space>
          <Tag color="green">已上传</Tag>
          <div class="upload-part-value">{{ value }}</div>
        </Space>
      </p>
      <p v-else>
        <Tag color="red">未上传</Tag>
      </p>
    </UploadDragger>
  </div>
</template>

<script setup lang="ts" name="UploadPart">
  import { computed, ref } from 'vue';
  import { Upload, Progress, Tag, Space } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { ResultEnum } from '/@/enums/httpEnum';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { UploadApiResult } from '/@/api/sys/model/uploadModel';

  const UploadDragger = Upload.Dragger;

  const emit = defineEmits(['change']);
  const props = defineProps({
    value: {
      type: String,
      default: '',
    },
    // 分片大小
    partSize: {
      type: Number,
      default: 2 * 1024 * 1024,
    },
    uploadApi: {
      type: Function as PropType<PromiseFn>,
      default: null,
      required: true,
    },
    partApi: {
      type: Function as PropType<PromiseFn>,
      default: null,
      required: true,
    },
    accept: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  });

  const fileList = computed({
    get: () => props.value,
    set: (val) => {
      emit('change', val);
    },
  });
  const loading = ref(false);
  const percent = ref(0);
  const status = ref('');
  const uploadText = ref('点击或拖拽开始上传');
  const { createErrorModal } = useMessage();

  async function customRequest(params) {
    const file = params.file as File;
    const { name } = file;
    const parts = createPart(file);
    const length = parts.length;
    let count = 0;

    loading.value = true;
    status.value = 'normal';
    uploadText.value = '开始上传';

    try {
      // 获取上传id
      const { result: upload_id } = await readyed({ type: 'start', filename: name });

      uploadText.value = '上传中';
      for (let i = 0; i < length; i++) {
        await uploadPart(i, parts[i], upload_id, name);
        count++;
        percent.value = parseInt((count / length) * 100);
      }

      uploadText.value = '上传完成，合并文件中';
      // 合并分片文件
      const data = await readyed({ type: 'end', filename: name, upload_id });

      fileList.value = data.result;
      status.value = 'success';
      uploadText.value = '上传合并完成';
    } catch (e) {
      status.value = 'exception';
      console.error(e);
      uploadText.value = '上传失败';
      createErrorModal({
        title: '上传失败',
        content: () => e,
      });
    } finally {
      loading.value = false;
    }
  }

  // 切割分片
  function createPart(file: File) {
    const { partSize } = props;
    const list: Blob[] = [];
    for (let i = 0; i < file.size; i += partSize) {
      list.push(file.slice(i, i + partSize));
    }
    return list;
  }

  /**
   * 上传单个文件
   * @param part 分片标识
   * @param file
   * @param upload_id 唯一标识符
   * @param name 文件原名
   */
  function uploadPart(
    part: number,
    file: Blob,
    upload_id: string,
    filename: string,
  ): Promise<UploadApiResult> {
    const { uploadApi } = props;

    return new Promise((resolve, reject) => {
      uploadApi({ file, filename, data: { upload_id, filename, part } })
        .then((result) => {
          const data = result.data as UploadApiResult;
          if (result.status === ResultEnum.SUCCESS && data.code === ResultEnum.SUCCESS) {
            resolve(data);
          } else {
            reject(`上传失败了，请重新上传：${upload_id}`);
          }
        })
        .catch(reject);
    });
  }

  function readyed(params: any): Promise<any> {
    const { partApi } = props;
    return new Promise((resolve, reject) => {
      partApi(Object.assign(params, { _t: new Date().getTime() }))
        .then((result) => {
          if (result && result.code === ResultEnum.SUCCESS) {
            resolve(result);
          } else {
            reject('失败');
          }
        })
        .catch(reject);
    });
  }

  const getStringAccept = computed(() => {
    return props.accept
      .map((item) => {
        if (item.indexOf('/') > 0 || item.startsWith('.')) {
          return item;
        } else {
          return `.${item}`;
        }
      })
      .join(',');
  });
</script>

<style lang="less" scoped>
  .upload-part {
    &-progress {
      padding: 0 @padding-sm;
    }

    &-value {
      font-weight: bold;
    }
  }
</style>
