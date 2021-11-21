<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="70%"
    @ok="handleSubmit"
  >
    <Form
      :model="formState"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 15 }"
      size="small"
      :colon="false"
    >
      <Tabs v-model:activeKey="activeKey">
        <TabPane :key="1" tab="基础信息" force-render>
          <FormItem label="所属游戏" v-bind="validateInfos.gameid">
            <Select allowClear :options="gameOptions" v-model:value="formState.gameid" />
          </FormItem>

          <FormItem label="包操作系统">
            <RadioGroup name="osRadio" v-model:value="formState.os" button-style="solid">
              <RadioButton v-for="osItem in osOptions" :key="osItem.value" :value="osItem.value">
                {{ osItem.label }}
              </RadioButton>
            </RadioGroup>
          </FormItem>

          <FormItem label="包名" v-bind="validateInfos.name">
            <Row :gutter="colGutter">
              <Col v-bind="colSpan">
                <Input v-model:value="formState.name" placeholder="包名" />
              </Col>
              <Col v-bind="colSpan">
                <Input v-model:value="formState.pkgbnd" placeholder="包id(bundle_id或pkg_id)" />
              </Col>
            </Row>
          </FormItem>

          <FormItem>
            <template #label> 排序 <BasicHelp text="越小越靠前" placement="top" /></template>
            <InputNumber :min="1" :max="255" v-model:value="formState.sort" />
          </FormItem>

          <FormItem label="密钥">
            <Row :gutter="colGutter">
              <Col v-bind="colSpan">
                <Input v-model:value="formState.extension.logkey" placeholder="登录密钥">
                  <template #addonAfter>
                    <Tooltip title="随机生成" placement="top" @click="makeKey('logkey')">
                      <span :style="{ cursor: 'pointer' }"> <DeploymentUnitOutlined /> 随机 </span>
                    </Tooltip>
                  </template>
                </Input>
              </Col>
              <Col v-bind="colSpan">
                <Input v-model:value="formState.extension.paykey" placeholder="支付密钥">
                  <template #addonAfter>
                    <Tooltip title="随机生成" placement="top" @click="makeKey('paykey')">
                      <span :style="{ cursor: 'pointer' }"> <DeploymentUnitOutlined /> 随机 </span>
                    </Tooltip>
                  </template>
                </Input>
              </Col>
            </Row>
          </FormItem>

          <FormItem label="下载地址"> <Input v-model:value="formState.url" /></FormItem>

          <FormItem>
            <template #label>
              登录api地址
              <BasicHelp
                :text="['平台会将用户token传到此网址', '手游此项可随便填']"
                placement="top"
            /></template>
            <Input v-model:value="formState.extension.logurl" />
          </FormItem>

          <FormItem>
            <template #label>
              支付api地址
              <BasicHelp text="平台会将支付信息传到此网址" placement="top" />
            </template>
            <Input v-model:value="formState.extension.payurl" />
          </FormItem>

          <FormItem label="report域名">
            <Input v-model:value="formState.extension.domain.report" />
          </FormItem>
          <FormItem label="sdk域名">
            <Input v-model:value="formState.extension.domain.sdk" />
          </FormItem>
          <FormItem label="pay域名">
            <Input v-model:value="formState.extension.domain.pay" />
          </FormItem>
        </TabPane>

        <TabPane :key="2" tab="第三方配置" force-render>
          <FormItem label="google参数">
            <Row :gutter="colGutter">
              <Col v-bind="colSpan">
                <Textarea
                  v-model:value="formState.extension.google_paykey"
                  showCount
                  placeholder="paykey公钥"
                  :rows="5"
                />
              </Col>
              <Col v-bind="colSpan">
                <Textarea
                  v-model:value="formState.extension.google.web_clientid"
                  showCount
                  placeholder="web_client客户端id"
                  :rows="5"
                />
              </Col>
            </Row>
          </FormItem>

          <FormItem label="华为参数">
            <Row :gutter="colGutter">
              <Col v-bind="colSpan">
                <Textarea
                  v-model:value="formState.extension.huawei.production.clientid"
                  showCount
                  placeholder="正式clientid"
                  :rows="5"
                />
              </Col>
              <Col v-bind="colSpan">
                <Textarea
                  v-model:value="formState.extension.huawei.production.clientsecret"
                  showCount
                  placeholder="正式clientsecret"
                  :rows="5"
                />
              </Col>
            </Row>
          </FormItem>

          <FormItem label="facebook参数">
            <Row :gutter="colGutter">
              <Col v-bind="colSpan">
                <Textarea
                  v-model:value="formState.extension.facebook.bindnotice"
                  showCount
                  placeholder="绑定通知"
                  :rows="5"
                />
              </Col>
              <Col v-bind="colSpan">
                <Textarea
                  v-model:value="formState.extension.facebook.appi"
                  showCount
                  placeholder="appid"
                  :rows="5"
                />
              </Col>
            </Row>
          </FormItem>

          <FormItem label="MG参数">
            <Row :gutter="colGutter">
              <Col v-bind="colSpan">
                <Textarea
                  v-model:value="formState.extension.mg.appkey"
                  showCount
                  placeholder="appkey"
                  :rows="5"
                />
              </Col>
              <Col v-bind="colSpan">
                <Textarea
                  v-model:value="formState.extension.mg.publickey"
                  showCount
                  placeholder="publickey"
                  :rows="5"
                />
              </Col>
            </Row>
          </FormItem>
        </TabPane>

        <TabPane :key="3" tab="切支付" force-render>
          <FormItem>
            <template #label>
              切支付
              <BasicHelp text="开启H5支付" placement="top" />
            </template>
            <RadioGroup
              name="qzfRadio"
              v-model:value="formState.extension.qzf.enable"
              button-style="solid"
            >
              <RadioButton
                v-for="qzfItem in qzfOptions"
                :key="qzfItem.value"
                :value="qzfItem.value"
              >
                {{ qzfItem.label }}
              </RadioButton>
            </RadioGroup>
          </FormItem>

          <FormItem v-show="formState.extension.qzf.enable === 1">
            <template #label>
              H5支付方式
              <BasicHelp text="切支付开启时有效" placement="top" />
            </template>
            <CheckboxGroup v-model:value="formState.extension.qzf.pf">
              <Checkbox
                v-for="qzfPfItem in qzfPfOptions"
                :key="qzfPfItem.value"
                :value="qzfPfItem.value"
              >
                {{ qzfPfItem.label }}
              </Checkbox>
            </CheckboxGroup>
          </FormItem>

          <FormItem label="开启条件" v-show="formState.extension.qzf.enable === 1">
            <Input v-model:value="formState.extension.qzf.condition" />
          </FormItem>

          <!-- 昏割线 -->
          <Divider />

          <FormItem label="paypal参数">
            <Row :gutter="colGutter">
              <Col :span="24">
                <RadioGroup
                  name="paypalRadio"
                  v-model:value="formState.extension.paypal.env"
                  button-style="solid"
                >
                  <RadioButton
                    v-for="shaboxItem in shaboxOptions"
                    :key="shaboxItem.value"
                    :value="shaboxItem.value"
                  >
                    {{ shaboxItem.label }}
                  </RadioButton>
                </RadioGroup>
              </Col>
              <Col v-bind="colSpan" v-show="formState.extension.paypal.env === 1">
                <Textarea
                  v-model:value="formState.extension.paypal.production.clientid"
                  showCount
                  placeholder="正式clientid"
                  :rows="5"
                />
              </Col>
              <Col v-bind="colSpan" v-show="formState.extension.paypal.env === 1">
                <Textarea
                  v-model:value="formState.extension.paypal.production.clientsecret"
                  showCount
                  placeholder="正式clientsecret"
                  :rows="5"
                />
              </Col>

              <Col v-bind="colSpan" v-show="formState.extension.paypal.env === 0">
                <Textarea
                  v-model:value="formState.extension.paypal.sandbox.clientid"
                  showCount
                  placeholder="沙盒clientid"
                  :rows="5"
                />
              </Col>
              <Col v-bind="colSpan" v-show="formState.extension.paypal.env === 0">
                <Textarea
                  v-model:value="formState.extension.paypal.sandbox.clientsecret"
                  showCount
                  placeholder="沙盒clientsecret"
                  :rows="5"
                />
              </Col>
            </Row>
          </FormItem>

          <!-- 昏割线 -->
          <Divider />

          <FormItem label="payssion参数">
            <Row :gutter="colGutter">
              <Col :span="24">
                <RadioGroup
                  name="payssionRadio"
                  v-model:value="formState.extension.payssion.env"
                  button-style="solid"
                >
                  <RadioButton
                    v-for="shaboxItem in shaboxOptions"
                    :key="shaboxItem.value"
                    :value="shaboxItem.value"
                  >
                    {{ shaboxItem.label }}
                  </RadioButton>
                </RadioGroup>
              </Col>
              <Col v-bind="colSpan" v-show="formState.extension.payssion.env === 1">
                <Textarea
                  v-model:value="formState.extension.payssion.production.clientid"
                  showCount
                  placeholder="正式clientid"
                  :rows="5"
                />
              </Col>
              <Col v-bind="colSpan" v-show="formState.extension.payssion.env === 1">
                <Textarea
                  v-model:value="formState.extension.payssion.production.clientsecret"
                  showCount
                  placeholder="正式clientsecret"
                  :rows="5"
                />
              </Col>

              <Col v-bind="colSpan" v-show="formState.extension.payssion.env === 0">
                <Textarea
                  v-model:value="formState.extension.payssion.sandbox.clientid"
                  showCount
                  placeholder="沙盒clientid"
                  :rows="5"
                />
              </Col>
              <Col v-bind="colSpan" v-show="formState.extension.payssion.env === 0">
                <Textarea
                  v-model:value="formState.extension.payssion.sandbox.clientsecret"
                  showCount
                  placeholder="沙盒clientsecret"
                  :rows="5"
                />
              </Col>
            </Row>
          </FormItem>
        </TabPane>

        <TabPane :key="4" tab="adjust" force-render>
          <FormItem label="货币类型">
            <Input v-model:value="formState.extension.adjust.currency" />
          </FormItem>

          <!-- 昏割线 -->
          <Divider />

          <FormItem label="事件">
            <Row :gutter="colGutter">
              <template v-for="(adjustEvent, idx) in formState.extension.adjust.event" :key="idx">
                <Col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" :xxl="8">
                  <Input v-model:value="adjustEvent.Key" placeholder="Key" />
                </Col>
                <Col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" :xxl="8">
                  <Input v-model:value="adjustEvent.Value" placeholder="Value" />
                </Col>
                <Col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" :xxl="4">
                  <Tooltip title="删除此行" placement="right">
                    <Button
                      ghost
                      color="warning"
                      preIcon="ant-design:delete-outlined"
                      @click="delAdjust(adjustEvent)"
                    />
                  </Tooltip>
                </Col>
              </template>

              <Col :span="24">
                <Tooltip title="添加一行">
                  <Button
                    ghost
                    color="success"
                    preIcon="ant-design:plus-outlined"
                    @click="addAdjust"
                  />
                </Tooltip>
                <Tooltip title="提交adjust数据">
                  <Button
                    v-if="isUpdate"
                    ghost
                    color="success"
                    class="ml-2"
                    :loading="saveAdjustButtonLoading"
                    preIcon="ant-design:check-outlined"
                    @click="saveAdjust"
                  />
                </Tooltip>
              </Col>
            </Row>
          </FormItem>
        </TabPane>

        <TabPane :key="5" tab="评分配置" force-render>
          <FormItem label="开关">
            <RadioGroup
              name="ratingRadio"
              v-model:value="formState.extension.rating.pop"
              button-style="solid"
            >
              <RadioButton :value="0">关闭</RadioButton>
              <RadioButton :value="1">开启</RadioButton>
            </RadioGroup>
          </FormItem>

          <FormItem v-show="formState.extension.rating.pop === 1">
            <template #label>
              定时器 <BasicHelp :text="['多少分钟后弹出', '开关打开时有效']" />
            </template>
            <InputNumber v-model:value="formState.extension.rating.time" />
          </FormItem>

          <Divider />

          <FormItem label="背景图">
            <BasicUpload
              :maxNumber="1"
              :multiple="false"
              @change="handleChangeBgUrl"
              @delete="handleDelete"
              :emptyHidePreview="true"
              @preview-delete="hendlerPreviewDeleteBgUrl"
              :api="packageUploadApi"
              :accept="uploadAccept"
              :value="viewPrefixImg(formState.extension.rating.bgurl)"
            />
          </FormItem>

          <Divider />

          <FormItem label="按钮图">
            <BasicUpload
              :maxNumber="1"
              :multiple="false"
              @change="handleChangeBtnUrl"
              @delete="handleDelete"
              :emptyHidePreview="true"
              @preview-delete="hendlerPreviewDeleteBtnUrl"
              :api="packageUploadApi"
              :accept="uploadAccept"
              :value="viewPrefixImg(formState.extension.rating.btnurl)"
            />
          </FormItem>

          <Divider />

          <FormItem label="标题图 rate now">
            <BasicUpload
              :maxNumber="1"
              :multiple="false"
              @change="handleChangeTitUrl"
              @delete="handleDelete"
              :emptyHidePreview="true"
              @preview-delete="hendlerPreviewDeleteTitUrl"
              :api="packageUploadApi"
              :accept="uploadAccept"
              :value="viewPrefixImg(formState.extension.rating.titurl)"
            />
          </FormItem>

          <Divider />

          <FormItem label="左按钮图 its ok">
            <BasicUpload
              :maxNumber="1"
              :multiple="false"
              @change="handleChangeLeftUrl"
              @delete="handleDelete"
              :emptyHidePreview="true"
              @preview-delete="hendlerPreviewDeleteLeftUrl"
              :api="packageUploadApi"
              :accept="uploadAccept"
              :value="viewPrefixImg(formState.extension.rating.lefturl)"
            />
          </FormItem>

          <FormItem label="右按钮图 love it">
            <BasicUpload
              :maxNumber="1"
              :multiple="false"
              @change="handleChangeRightUrl"
              @delete="handleDelete"
              :emptyHidePreview="true"
              @preview-delete="hendlerPreviewDeleteRightUrl"
              :api="packageUploadApi"
              :accept="uploadAccept"
              :value="viewPrefixImg(formState.extension.rating.righturl)"
            />
          </FormItem>

          <FormItem label="跳转地址">
            <Input v-model:value="formState.extension.rating.storeurl" />
          </FormItem>
        </TabPane>

        <TabPane :key="6" tab="分享配置" force-render>
          <FormItem label="分享图">
            <BasicUpload
              :maxNumber="1"
              :multiple="false"
              @change="handleChangeShareImg"
              @delete="handleDelete"
              :emptyHidePreview="true"
              @preview-delete="hendlerPreviewDeleteShareImg"
              :api="packageUploadApi"
              :accept="uploadAccept"
              :value="viewPrefixImg(formState.extension.share.img)"
            />
          </FormItem>
        </TabPane>

        <TabPane :key="7" tab="aihelp配置" force-render>
          <FormItem label="sectionid">
            <Input v-model:value="formState.extension.aihelp.sectionid" />
          </FormItem>
        </TabPane>
      </Tabs>
    </Form>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref, reactive, toRaw } from 'vue';
  import {
    Tabs,
    Form,
    Input,
    Select,
    Radio,
    Checkbox,
    InputNumber,
    Row,
    Col,
    Tooltip,
    Divider,
  } from 'ant-design-vue';
  import { DeploymentUnitOutlined } from '@ant-design/icons-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicHelp } from '/@/components/Basic';
  import { Button } from '/@/components/Button';
  import { BasicUpload } from '/@/components/Upload';
  import { PackageForm, packageRule } from './package.data';
  import { useUserStore } from '/@/store/modules/user';
  import {
    packageAdd,
    packageEdit,
    packageGetKey,
    packageUploadApi,
    delPackageImg,
    packageSaveAdjustEvent,
  } from '/@/api/admin/app';
  import { deepMerge } from '/@/utils';
  import { omit } from 'lodash-es';
  // import type { FormActionType, FormProps} from '/@/components/Form/src/types/form';

  const emit = defineEmits(['success', 'register']);

  const FormItem = Form.Item;
  const TabPane = Tabs.TabPane;
  const Textarea = Input.TextArea;
  const RadioButton = Radio.Button;
  const RadioGroup = Radio.Group;
  const CheckboxGroup = Checkbox.Group;

  const isUpdate = ref(true);
  const saveAdjustButtonLoading = ref(false);
  const activeKey = ref(1);
  // const formElRef = ref<Nullable<FormActionType>>(null);
  const { createMessage } = useMessage();
  const formState = reactive(PackageForm);
  const rulesRef = reactive(packageRule);
  const useForm = Form.useForm;
  const { resetFields, validate, validateInfos } = useForm(formState, rulesRef);

  const osOptions: OptionsItem[] = [
    { label: '安卓', value: 0 },
    { label: '苹果', value: 1 },
    { label: '微软', value: 2 },
  ];

  const qzfOptions: OptionsItem[] = [
    { label: '开', value: 1 },
    { label: '关', value: 0 },
  ];

  const qzfPfOptions: OptionsItem[] = [
    { label: 'paypal', value: 'paypal' },
    { label: 'payssion', value: 'payssion' },
    { label: 'uwp', value: 'uwp' },
  ];

  const shaboxOptions: OptionsItem[] = [
    { label: '沙盒', value: 0 },
    { label: '正式', value: 1 },
  ];

  // PC两个Input占一行，Mobile每个一行
  const colSpan = reactive({
    xs: 24,
    sm: 24,
    md: 12,
    lg: 12,
    xl: 12,
    xxl: 12,
  });
  // 水平间距/垂直间距
  const colGutter = [20, 20];

  const userStore = useUserStore();
  const gameOptions = computed(() => userStore.getGameListOptions);
  const domain = computed(() => userStore.getUserInfo.config.imageDomain);

  let rowId = ref(0);

  const [registerDrawer, { closeDrawer, changeLoading, changeOkLoading }] = useDrawerInner(
    async (data) => {
      isUpdate.value = data.isUpdate;
      resetFields();
      if (isUpdate.value) {
        changeLoading(true);
        changeOkLoading(true);
        rowId.value = data.record.id;
        const result = await packageEdit('GET', { id: rowId.value });
        deepMerge(formState, result);
      }

      changeLoading(false);
      changeOkLoading(false);
    },
  );

  const getTitle = computed(() =>
    !unref(isUpdate) ? '新增包' : '编辑包 (id: ' + rowId.value + ')',
  );
  // 允许上传的文件类型
  const uploadAccept = ref(['jpg', 'jpeg', 'gif', 'png', 'webp']);

  // 随机生成密钥
  const makeKey = (field) => {
    packageGetKey(field)
      .then((key) => {
        formState.extension[field] = key;
      })
      .catch((_) => {});
  };

  // 给图片拼上域名前缀
  const viewPrefixImg = (url: string) => {
    return url
      ? url
          .split(',')
          .filter((item) => item !== '')
          .map((item) => {
            return item.indexOf(domain.value) === -1 ? domain.value + item : item;
          })
      : [];
  };

  // 添加一行adjust.Event
  const addAdjust = () => {
    formState.extension.adjust.event.push({
      Key: '',
      Value: '',
    });
  };
  const delAdjust = (item) => {
    const index = formState.extension.adjust.event.indexOf(item);
    if (index !== -1) {
      formState.extension.adjust.event.splice(index, 1);
    }
  };
  // 保存adjust事件
  const saveAdjust = () => {
    saveAdjustButtonLoading.value = true;
    const adjust = formState.extension.adjust.event;
    packageSaveAdjustEvent(rowId.value, adjust)
      .finally(() => {
        saveAdjustButtonLoading.value = false;
      })
      .then(() => {
        createMessage.success('保存成功');
      })
      .catch((_) => {});
  };

  /********************** 背景图 ************************/
  const handleChangeBgUrl = (list: string[]) => {
    formState.extension.rating.bgurl = list.join(',');
    createMessage.info('操作成功');
  };
  // 预览Modal的删除按钮
  const hendlerPreviewDeleteBgUrl = (url: string) => {
    formState.extension.rating.bgurl = '';
    delServerImg(url);
  };

  /********************** 按钮图 ************************/
  const handleChangeBtnUrl = (list: string[]) => {
    formState.extension.rating.btnurl = list.join(',');
    createMessage.info('操作成功');
  };
  // 预览Modal的删除按钮
  const hendlerPreviewDeleteBtnUrl = (url: string) => {
    formState.extension.rating.btnurl = '';
    delServerImg(url);
  };
  /********************** 标题图 ************************/
  const handleChangeTitUrl = (list: string[]) => {
    formState.extension.rating.titurl = list.join(',');
    createMessage.info('操作成功');
  };
  const hendlerPreviewDeleteTitUrl = (url: string) => {
    formState.extension.rating.titurl = '';
    delServerImg(url);
  };
  /********************** 左按钮图 ************************/
  const handleChangeLeftUrl = (list: string[]) => {
    formState.extension.rating.lefturl = list.join(',');
    createMessage.info('操作成功');
  };
  const hendlerPreviewDeleteLeftUrl = (url: string) => {
    formState.extension.rating.lefturl = '';
    delServerImg(url);
  };
  /********************** 右按钮图 ************************/
  const handleChangeRightUrl = (list: string[]) => {
    formState.extension.rating.righturl = list.join(',');
    createMessage.info('操作成功');
  };
  const hendlerPreviewDeleteRightUrl = (url: string) => {
    formState.extension.rating.righturl = '';
    delServerImg(url);
  };
  /********************** 分享图 ************************/
  const handleChangeShareImg = (list: string[]) => {
    formState.extension.share.img = list.join(',');
    createMessage.info('操作成功');
  };
  const hendlerPreviewDeleteShareImg = (url: string) => {
    formState.extension.share.img = '';
    delServerImg(url);
  };

  // 上传Modal的删除(公共方法)
  function handleDelete(record: Recordable) {
    if (record.status === 'status') {
      // 已上传成功了但还未保存时，点击上传Modal的删除按钮
      delServerImg(record.responseData.url);
    }
    console.log('handleDelete record=', record);
  }

  function delServerImg(url: string) {
    if (url) {
      delPackageImg(url);
    }
  }

  async function handleSubmit() {
    try {
      changeLoading(true);
      changeOkLoading(true);

      await validate();

      const post = toRaw(formState);
      if (isUpdate.value) {
        await packageEdit('POST', Object.assign({}, post, { id: rowId.value }));
      } else {
        await packageAdd('POST', omit(post, 'id'));
      }

      createMessage.success(getTitle.value + '成功');
      closeDrawer();
      emit('success');
    } catch (e) {
      console.log('e ', e);
      // createMessage.error(getTitle.value + '失败');
    } finally {
      changeLoading(false);
      changeOkLoading(false);
    }
  }
</script>

<style lang="less" scoped></style>
