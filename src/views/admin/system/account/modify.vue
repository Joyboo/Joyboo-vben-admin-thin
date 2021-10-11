<template>
  <PageWrapper
    v-loading="loadingRef"
    contentBackground
    :contentStyle="{ padding: '50px' }"
    title="个人设置"
  >
    <Form
      :model="formState"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 15 }"
      size="small"
      :colon="false"
      @submit="handleSubmit"
    >
      <FormItem v-bind="validateInfos.username">
        <template #label> 用户名 <BasicHelp text="请输入手机号" /> </template>
        <Input disabled v-model:value="formState.username" :maxlength="11" />
      </FormItem>

      <FormItem>
        <template #label>
          旧密码
          <BasicHelp text="如想修改，请先填写旧密码" />
        </template>
        <InputPassword allow-clear v-model:value="oldPassword" placeholder="留空表示不修改密码" />
      </FormItem>

      <FormItem v-bind="validateInfos.password">
        <template #label>
          新密码
          <BasicHelp text="如想修改，请先填写旧密码" />
        </template>
        <StrengthMeter v-model:value="formState.password" />
      </FormItem>

      <FormItem label="确认新密码">
        <InputPassword allow-clear v-model:value="confirmPassword" />
      </FormItem>

      <FormItem label="真实姓名" v-bind="validateInfos.realname">
        <Input v-model:value="formState.realname" :maxlength="10" />
      </FormItem>

      <FormItem label="默认游戏">
        <Select :options="gameOptions" v-model:value="formState.extension.gid" allowClear />
      </FormItem>

      <FormItem label="默认首页">
        <TreeSelect
          :treeData="menuTreeData"
          :replaceFields="{ value: 'id', label: 'name' }"
          v-model:value="formState.extension.homePath"
          allowClear
        />
      </FormItem>

      <FormItem label="头像">
        <CropperAvatar
          :uploadApi="avatarUploadApi"
          :value="formState.avatar ? domain + formState.avatar : HeaderImg"
          btnText="更换头像"
          :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
          width="150"
          @change="avatarChange"
        />
      </FormItem>
    </Form>

    <template #rightFooter>
      <a-button type="primary" @click="handleSubmit">保存修改</a-button>
    </template>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { Form, FormItem, Select, TreeSelect, Input, InputPassword } from 'ant-design-vue';
  import type { TreeDataItem } from 'ant-design-vue/es/tree/Tree';
  import { reactive, ref, computed, toRaw } from 'vue';
  import { BasicHelp } from '/@/components/Basic';
  import { CropperAvatar } from '/@/components/Cropper';
  import { StrengthMeter } from '/@/components/StrengthMeter';
  import { FormData, RuleData } from './account.data';
  import { avatarUploadApi, adminModify } from '/@/api/admin/system';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { deepMerge } from '/@/utils';
  import { useUserStore } from '/@/store/modules/user';
  import HeaderImg from '/@/assets/images/header.jpg';
  import { PageWrapper } from '/@/components/Page';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { UploadApiResult } from '/@/api/sys/model/uploadModel';

  const formState = reactive(FormData);

  const loadingRef = ref(true);
  const confirmPassword = ref<string>('');
  // 是否需要修改密码
  const isUpdatePassword = computed(() => formState.password === '');
  // 旧密码
  const oldPassword = ref<string>('');

  const userStore = useUserStore();
  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();

  const gameOptions = computed(() => userStore.getGameListOptions);
  const domain = computed(() => userStore.getUserInfo.config.imageDomain);
  const menuTreeData = ref<TreeDataItem[]>([]);

  RuleData.password = [
    {
      required: !isUpdatePassword.value,
    },
    {
      validator(_, value: any) {
        return new Promise((resolve, reject) => {
          if (oldPassword.value) {
            if (value === '') {
              reject('请填写新密码');
            } else if (value !== confirmPassword.value) {
              reject('两次输出的密码不一致');
            }
          }
          resolve(value);
        });
      },
    },
  ];
  const rulesRef = reactive(RuleData);
  const useForm = Form.useForm;
  const { validate, validateInfos } = useForm(formState, rulesRef);

  adminModify('GET')
    .then(({ menuList, result }) => {
      menuTreeData.value = menuList;
      deepMerge(formState, result);
    })
    .catch((error) => {
      console.error(error);
      // 出错的情况不能继续
      createConfirm({
        title: () => '出错了',
        content: () => t('sys.api.errMsg502'),
        onOk: () => window.location.reload(),
        onCancel: () => window.location.reload(),
        iconType: 'error',
      });
    })
    .finally(() => {
      loadingRef.value = false;
    });

  const handleSubmit = async () => {
    console.log('submit', formState);
    loadingRef.value = true;
    try {
      await validate();
      const post = toRaw(formState);

      await adminModify('POST', Object.assign({}, post, { __password: oldPassword.value }));

      createMessage.success('操作成功');
    } catch (e) {
      console.log('handleSubmit error ', e);
    } finally {
      loadingRef.value = false;
    }
  };

  const avatarChange = (_, data: UploadApiResult) => {
    if (data.code === 200) {
      formState.avatar = data.url || '';
    } else {
      createMessage.error(data.message);
    }
  };
</script>

<style lang="less" scoped></style>
