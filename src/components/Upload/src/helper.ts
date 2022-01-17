import { dataURLtoFile } from '/@/utils/file/base64Conver';

export function checkFileType(file: File, accepts: string[]) {
  const newTypes = accepts.join('|');
  // const reg = /\.(jpg|jpeg|png|gif|txt|doc|docx|xls|xlsx|xml)$/i;
  const reg = new RegExp('\\.(' + newTypes + ')$', 'i');

  return reg.test(file.name);
}

export function checkImgType(file: File) {
  return isImgTypeByName(file.name);
}

export function isImgTypeByName(name: string) {
  return /\.(jpg|jpeg|png|gif)$/i.test(name);
}

export function getBase64WithFile(file: File) {
  return new Promise<{
    result: string;
    file: File;
  }>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve({ result: reader.result as string, file });
    reader.onerror = (error) => reject(error);
  });
}

/**
 * 若图片超宽，压缩为指定宽度、比例
 * @param file
 * @param width
 * @param quality 压缩比例, 0-1
 */
export function compressImg(file: File, width: number, quality?: any): Promise<File> {
  return new Promise(async (resolve, reject) => {
    try {
      const content = await getBase64WithFile(file);

      const Img = new Image();
      Img.crossOrigin = '';
      Img.src = content.result;
      Img.onload = () => {
        try {
          // 宽度超标
          if (Img.width && Img.width > width) {
            const height = (width / Img.width) * Img.height;
            // 生成canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.width = width;
            canvas.height = height;
            // 通过canvas drawImage方法绘制图片
            ctx.drawImage(Img, 0, 0, width, height); // 后四个为位置参数，左上角x,y坐标，右下角x,y坐标
            // 通过canvas toDataURl方法获取图像base64编码，quality为压缩质量参数，值越小图像越模糊
            const base64 = canvas.toDataURL('image/jpeg', quality);
            resolve(dataURLtoFile(base64, file.name));
          } else {
            resolve(file);
          }
        } catch (e) {
          reject(e);
        }
      };
      Img.onerror = reject;
    } catch (e) {
      reject(e);
    }
  });
}
