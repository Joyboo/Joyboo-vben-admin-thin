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
          <FormItem label="名称" v-bind="validateInfos.gameid">
            <Input v-model:value="formState.name" />
          </FormItem>

          <FormItem label="类型">
            <RadioGroup
              name="typeRadio"
              v-model:value="formState.extension.type"
              button-style="solid"
            >
              <RadioButton v-for="tpItem in typeOptions" :key="tpItem.value" :value="tpItem.value">
                {{ tpItem.label }}
              </RadioButton>
            </RadioGroup>
          </FormItem>

          <FormItem label="密钥" v-bind="validateInfos.loginkey">
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

          <FormItem label="状态">
            <Switch v-model:checked="formState.status" :checkedValue="1" :unCheckedValue="0" />
          </FormItem>

          <FormItem>
            <template #label> 排序 <BasicHelp text="越小越靠前" placement="top" /></template>
            <InputNumber :min="1" :max="255" v-model:value="formState.sort" />
          </FormItem>

          <FormItem>
            <template #label>
              登录API网址 <BasicHelp :text="['平台会将用户token传到此网址', '手游此项可随便填']" />
            </template>
            <Input v-model:value="formState.extension.logurl" />
          </FormItem>

          <FormItem>
            <template #label>
              支付API网址 <BasicHelp text="平台会将支付信息传到此网址" />
            </template>
            <Input v-model:value="formState.extension.payurl" />
          </FormItem>

          <FormItem label="平台入口网址" v-show="formState.extension.type === 0">
            <Input v-model:value="formState.extension.h5entry" />
          </FormItem>
        </TabPane>

        <TabPane :key="2" tab="充值信息" force-render>
          <FormItem>
            <template #label> 充值产品id <BasicHelp text="逗号,或换行符隔开" /> </template>
            <Textarea
              v-model:value="formState.extension.goodsids"
              showCount
              placeholder="逗号,或换行符隔开"
              :rows="12"
            />
          </FormItem>
        </TabPane>

        <TabPane :key="3" tab="维护弹窗" force-render>
          <FormItem>
            <template #label> 维护开关 <BasicHelp text="维护期间打开" /> </template>

            <RadioGroup
              name="mtnRadio"
              v-model:value="formState.extension.mtn.switch"
              button-style="solid"
            >
              <RadioButton
                v-for="mtnItem in mtnOptions"
                :key="mtnItem.value"
                :value="mtnItem.value"
              >
                {{ mtnItem.label }}
              </RadioButton>
            </RadioGroup>
          </FormItem>

          <FormItem v-show="formState.extension.mtn.switch === 1">
            <template #label> 维护时间 <BasicHelp text="北京时间" placement="top" /> </template>
            <RangePicker
              show-time
              :value="[formState.extension.mtn.begintime, formState.extension.mtn.endtime]"
              format="YYYY-MM-DD HH:mm:ss"
              valueFormat="YYYY-MM-DD HH:mm:ss"
              @change="changeMtnRange"
            />
          </FormItem>

          <FormItem label="维护公告" v-show="formState.extension.mtn.switch === 1">
            <Textarea v-model:value="formState.extension.mtn.notice" showCount :rows="5" />
          </FormItem>

          <FormItem label="FB粉丝页">
            <Input v-model:value="formState.extension.facebook.fansurl" />
          </FormItem>

          <FormItem label="隐私政策页">
            <Input v-model:value="formState.extension.google.privacy" />
          </FormItem>
        </TabPane>

        <TabPane :key="4" tab="分成信息" force-render>
          <FormItem>
            <template #label>
              CP分成比例 <BasicHelp text="研发分成比例" placement="top" />
            </template>
            <InputNumber v-model:value="formState.extension.divide.cp" :formatter="formatter" />
          </FormItem>

          <FormItem label="IOS分成比例">
            <InputNumber v-model:value="formState.extension.divide.ios" :formatter="formatter" />
          </FormItem>

          <FormItem label="google分成比例">
            <InputNumber v-model:value="formState.extension.divide.google" :formatter="formatter" />
          </FormItem>

          <FormItem label="paypal分成比例">
            <InputNumber v-model:value="formState.extension.divide.paypal" :formatter="formatter" />
            +
            <InputNumber
              v-model:value="formState.extension.divide['paypal-fix']"
              :formatter="formatter"
            />
          </FormItem>

          <FormItem label="payssion分成比例">
            <InputNumber
              v-model:value="formState.extension.divide.payssion"
              :formatter="formatter"
            />
          </FormItem>

          <FormItem label="华为分成比例">
            <InputNumber v-model:value="formState.extension.divide.huawei" :formatter="formatter" />
          </FormItem>

          <FormItem label="MG/UWP分成比例">
            <InputNumber v-model:value="formState.extension.divide.uwp" :formatter="formatter" />
          </FormItem>
        </TabPane>

        <TabPane :key="5" tab="网页充值" force-render>
          <FormItem label="本游戏是否显示">
            <RadioGroup
              name="h5sdkRadio"
              v-model:value="formState.extension.h5sdk.isshow"
              button-style="solid"
            >
              <RadioButton
                v-for="h5sdkItem in h5sdkOption"
                :key="h5sdkItem.value"
                :value="h5sdkItem.value"
              >
                {{ h5sdkItem.label }}
              </RadioButton>
            </RadioGroup>
          </FormItem>

          <FormItem label="显示游戏名">
            <Input v-model:value="formState.extension.h5sdk.name" />
          </FormItem>

          <FormItem>
            <template #label>
              参数包 <BasicHelp text="facebook和google登录的appid和key用的包" />
            </template>
            <Select
              allowClear
              :options="packageOptions"
              v-model:value="formState.extension.h5sdk.pkgbnd"
            />
          </FormItem>

          <FormItem label="是否显示角标">
            <RadioGroup
              name="minilogRadio"
              v-model:value="formState.extension.h5sdk.isshowmnlogo"
              button-style="solid"
            >
              <RadioButton
                v-for="h5sdkItem in h5sdkOption"
                :key="h5sdkItem.value"
                :value="h5sdkItem.value"
              >
                {{ h5sdkItem.label }}
              </RadioButton>
            </RadioGroup>
          </FormItem>

          <Divider />

          <FormItem label="角标图" v-show="formState.extension.h5sdk.isshowmnlogo === 1">
            <BasicUpload
              :maxNumber="1"
              :multiple="false"
              @change="handleChangeMnlogoUrl"
              @delete="handleDelete"
              :emptyHidePreview="true"
              @preview-delete="hendlerPreviewDeleteMnlogoImg"
              :api="gameUploadApi"
              :accept="uploadAccept"
              :value="viewPrefixImg(formState.extension.h5sdk.mnlogo)"
            />
          </FormItem>

          <FormItem FormItem label="游戏logo">
            <BasicUpload
              :maxNumber="1"
              :multiple="false"
              @change="handleChangeGamelogoUrl"
              @delete="handleDelete"
              :emptyHidePreview="true"
              @preview-delete="hendlerPreviewDeleteGamelogoImg"
              :api="gameUploadApi"
              :accept="uploadAccept"
              :value="viewPrefixImg(formState.extension.h5sdk.gamelogo)"
            />
          </FormItem>

          <FormItem FormItem label="轮播图">
            <BasicUpload
              :maxNumber="5"
              @change="handleChangeCarouselUrl"
              @delete="handleDelete"
              :emptyHidePreview="true"
              @preview-delete="hendlerPreviewDeleteCarouselImg"
              :api="gameUploadApi"
              :accept="uploadAccept"
              :value="viewPrefixImg(formState.extension.h5sdk.carousel)"
            />
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
    TabPane,
    Form,
    FormItem,
    Input,
    Select,
    RadioButton,
    RadioGroup,
    InputNumber,
    Textarea,
    Tooltip,
    Row,
    Col,
    Switch,
    Divider,
    RangePicker,
  } from 'ant-design-vue';
  import { DeploymentUnitOutlined } from '@ant-design/icons-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicHelp } from '/@/components/Basic';
  import { BasicUpload } from '/@/components/Upload';
  import { FormData, RuleData } from './game.data';
  import { useUserStore } from '/@/store/modules/user';
  import { gameAdd, gameEdit, gameGetKey, gameUploadApi, delGameImg } from '/@/api/admin/app';
  import { deepMerge } from '/@/utils';
  import { Moment } from 'moment';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref(true);
  const activeKey = ref(1);
  const { createMessage } = useMessage();
  const formState = reactive(FormData);
  const rulesRef = reactive(RuleData);
  const useForm = Form.useForm;
  const { resetFields, validate, validateInfos } = useForm(formState, rulesRef);

  const typeOptions: OptionsItem[] = [
    { label: 'H5', value: 0 },
    { label: '手游', value: 1 },
  ];
  // 维护
  const mtnOptions: OptionsItem[] = [
    { label: '关闭', value: 0 },
    { label: '开启', value: 1 },
  ];
  // H5SDK
  const h5sdkOption: OptionsItem[] = [
    { label: '隐藏', value: 0 },
    { label: '显示', value: 1 },
  ];

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
  const packageOptions = computed(() => userStore.getPackageOptions);
  const domain = computed(() => userStore.getUserInfo.config.imageDomain);

  let rowId = ref(0);

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    isUpdate.value = data.isUpdate;
    resetFields();
    if (isUpdate.value) {
      setDrawerProps({ confirmLoading: true });
      rowId.value = data.record.id;
      const result = await gameEdit('GET', { id: rowId.value });
      deepMerge(formState, result);
    }

    setDrawerProps({ confirmLoading: false });
  });

  const getTitle = computed(() =>
    !unref(isUpdate) ? '新增游戏' : '编辑游戏 (id: ' + rowId.value + ')',
  );
  // 允许上传的文件类型
  const uploadAccept = ref(['jpg', 'jpeg', 'gif', 'png', 'webp']);

  // 随机生成密钥
  const makeKey = (field) => {
    gameGetKey(field)
      .then((key) => {
        formState.extension[field] = key;
      })
      .catch((_) => {});
  };

  // 维护时间
  const changeMtnRange = (
    _: [Moment, Moment] | [string, string],
    dateStrings: [string, string],
  ) => {
    const [begintime, endtime] = dateStrings;
    formState.extension.mtn.begintime = begintime;
    formState.extension.mtn.endtime = endtime;
  };
  // InputNumber加 % 后缀展示
  const formatter = (value: number | string) => (value ? `${value} %` : '');
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

  /********************** 角标图 ************************/
  const handleChangeMnlogoUrl = (list: string[]) => {
    formState.extension.h5sdk.mnlogo = list.join(',');
    createMessage.info('操作成功');
  };
  // 预览Modal的删除按钮
  const hendlerPreviewDeleteMnlogoImg = (url: string) => {
    formState.extension.h5sdk.mnlogo = '';
    delServerImg(url);
  };
  /********************** 游戏logo ************************/
  const handleChangeGamelogoUrl = (list: string[]) => {
    formState.extension.h5sdk.gamelogo = list.join(',');
    createMessage.info('操作成功');
  };
  // 预览Modal的删除按钮
  const hendlerPreviewDeleteGamelogoImg = (url: string) => {
    formState.extension.h5sdk.mnlogo = '';
    delServerImg(url);
  };
  /********************** 轮播图（多图） ************************/
  const handleChangeCarouselUrl = (list: string[]) => {
    // console.log('change list ', list);
    const origin: string[] = [];
    for (const url of list) {
      if (url) {
        origin.push(url);
      }
    }
    formState.extension.h5sdk.carousel = origin.join(',');
    createMessage.info('操作成功');
  };
  const hendlerPreviewDeleteCarouselImg = (url: string) => {
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
      delGameImg(url);
    }
  }

  async function handleSubmit() {
    try {
      setDrawerProps({ confirmLoading: true });

      await validate();

      const post = toRaw(formState);
      if (isUpdate.value) {
        gameEdit('POST', Object.assign({}, post, { id: rowId.value }));
      } else {
        gameAdd('POST', post);
      }

      createMessage.success(getTitle.value + '成功');
      closeDrawer();
      emit('success');
    } catch (e) {
      console.log('e ', e);
      // createMessage.error(getTitle.value + '失败');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>

<style lang="less" scoped></style>
