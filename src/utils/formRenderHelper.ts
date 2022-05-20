import { RenderCallbackParams } from '/@/components/Form';
import { h, VNode } from 'vue';
import { deepMerge } from '/@/utils/index';
import { BasicUpload } from '/@/components/Upload';
import { isArray, isString } from '/@/utils/is';
import { useMessage } from '/@/hooks/web/useMessage';
import { CropperAvatar } from '/@/components/Cropper';
import { UploadApiResult } from '/@/api/sys/model/uploadModel';
import { ResultEnum } from '/@/enums/httpEnum';
import HeaderImg from '/@/assets/images/header.jpg';

type RenderFn = (renderCallbackParams: RenderCallbackParams) => VNode | VNode[] | string;

const { createMessage } = useMessage();

type renderUploadType = { api: PromiseFn } & Recordable;
export const renderUpload = (options: renderUploadType): RenderFn => {
  return ({ model, field }) => {
    const delServerImage = (url) => {
      console.log('todo 删除服务端文件: ', url);
    };
    const baseProps = deepMerge(
      {
        maxNumber: 1,
        multiple: false,
        emptyHidePreview: true,
        accept: ['jpg', 'jpeg', 'gif', 'png', 'webp'],
      },
      options,
    );
    return h(BasicUpload, {
      value: isString(model[field])
        ? model[field].split(',').filter((item) => item !== '')
        : isArray(model[field])
        ? model[field]
        : [],
      onChange: (values) => {
        const arr = values.filter((item) => item !== '');
        model[field] = baseProps.multiple ? arr : arr[0] ?? '';
      },
      onDelete: (record: Recordable) => {
        if (record.status === ResultEnum.TYPE) {
          delServerImage(record.responseData.url);
        }
      },
      onPreviewDelete: (url) => {
        model[field] = '';
        delServerImage(url);
      },
      ...baseProps,
    });
  };
};

type renderUploadAvatarType = { uploadApi: PromiseFn } & Recordable;
export const renderAvatar = (options: renderUploadAvatarType): RenderFn => {
  return ({ model, field }) => {
    return h(CropperAvatar, {
      // uploadApi: avatarUploadApi,
      width: 150,
      value: model[field] || HeaderImg,
      showBtn: false,
      onChange: (_, data: UploadApiResult) => {
        if (data.code === ResultEnum.SUCCESS) {
          model[field] = data.url || '';
        } else {
          createMessage.error(data.message);
        }
      },
      ...options,
    });
  };
};
