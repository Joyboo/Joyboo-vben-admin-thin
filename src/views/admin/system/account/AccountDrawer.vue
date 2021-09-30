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
          <FormItem v-bind="validateInfos.username">
            <template #label> 用户名 <BasicHelp text="请输入手机号" /> </template>
            <Input v-model:value="formState.username" :maxlength="11" />
          </FormItem>

          <FormItem>
            <template #label>
              密码
              <BasicHelp v-if="isUpdate" text="留空表示不修改密码" />
            </template>
            <StrengthMeter
              v-model:value="formState.password"
              :placeholder="isUpdate ? '留空表示不修改密码' : ''"
            />
          </FormItem>

          <FormItem label="确认密码">
            <InputPassword v-model:value="confirmPassword" />
          </FormItem>

          <FormItem label="真实姓名" v-bind="validateInfos.realname">
            <Input v-model:value="formState.realname" :maxlength="10" />
          </FormItem>

          <FormItem label="状态">
            <Switch v-model:checked="formState.status" :checkedValue="1" :unCheckedValue="0" />
          </FormItem>

          <FormItem>
            <template #label> 排序 <BasicHelp text="越小越靠前" placement="top" /></template>
            <InputNumber :min="1" :max="255" v-model:value="formState.sort" />
          </FormItem>

          <FormItem label="默认游戏">
            <Select :options="gameOptions" v-model:value="formState.extension.gid" allowClear />
          </FormItem>

          <FormItem label="默认首页">
            <TreeSelect
              :treeData="menuTreeData"
              :replaceFields="{ value: 'id', label: 'name' }"
              allowClear
            />
          </FormItem>

          <FormItem label="头像">
            <CropperAvatar
              :uploadApi="avatarUploadApi"
              :value="formState.avatar"
              btnText="更换头像"
              :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
              width="150"
            />
          </FormItem>
        </TabPane>

        <TabPane :key="2" tab="角色分组" force-render>
          <FormItem label="分组" v-bind="validateInfos.rid">
            <Select :options="roleOptions" v-model:value="formState.rid" @change="changeRid" />
          </FormItem>

          <FormItem>
            <template #label> 权限展示 <BasicHelp text="仅作为展示，修改无效" /> </template>
            <BasicTree
              toolbar
              search
              :treeData="treeMenu"
              :checkable="true"
              ref="asyncExpandTreeRef"
              :replaceFields="{ key: 'id' }"
            />
          </FormItem>
        </TabPane>

        <TabPane :key="3" tab="游戏和包" force-render>
          <FormItem label="分配游戏">
            <CheckboxGroup v-model:value="formState.extension.gameids">
              <Checkbox
                v-for="gameItem in gameOptions"
                :key="gameItem.value"
                :value="gameItem.value"
              >
                {{ gameItem.label }}
              </Checkbox>
            </CheckboxGroup>
          </FormItem>
          <!-- todo 根据游戏筛选穿梭框的内容 -->
          <FormItem label="分配包">
            <Transfer />
          </FormItem>
        </TabPane>
      </Tabs>
    </Form>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import {
    Tabs,
    TabPane,
    Form,
    FormItem,
    Input,
    InputPassword,
    Select,
    TreeSelect,
    InputNumber,
    Switch,
    Transfer,
    Checkbox,
    CheckboxGroup,
  } from 'ant-design-vue';
  import { ref, computed, unref, reactive, toRaw, nextTick } from 'vue';
  import { StrengthMeter } from '/@/components/StrengthMeter';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicHelp } from '/@/components/Basic';
  import { CropperAvatar } from '/@/components/Cropper';
  import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree';
  import { FormData, RuleData } from './account.data';
  import { useUserStore } from '/@/store/modules/user';
  import { adminAdd, adminEdit, avatarUploadApi } from '/@/api/admin/system';
  import { deepMerge } from '/@/utils';
  import { isArray } from '/@/utils/is';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref(true);
  const activeKey = ref(1);
  const confirmPassword = ref<string>('');

  const { createMessage } = useMessage();
  const formState = reactive(FormData);
  const rulesRef = reactive(RuleData);
  const useForm = Form.useForm;
  const { resetFields, validate, validateInfos } = useForm(formState, rulesRef);

  const userStore = useUserStore();
  const gameOptions = computed(() => userStore.getGameListOptions);
  const packageOptions = computed(() => userStore.getPackageOptions);
  const roleOptions = ref<OptionsItem[]>([]);
  // 默认菜单树（不包含按钮级别）
  const menuTreeData = ref<TreeItem[]>([]);
  // 权限展示树（包含按钮级别）
  const treeMenu = ref<TreeItem[]>([]);
  // 权限展示树Ref
  const asyncExpandTreeRef = ref<Nullable<TreeActionType>>(null);
  // 每个rid对应哪些权限
  let checkByRidList = {};
  const domain = computed(() => userStore.getUserInfo.config.imageDomain);

  let rowId = ref(0);

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    isUpdate.value = data.isUpdate;
    resetFields();
    setDrawerProps({ confirmLoading: true });

    if (isUpdate.value) {
      rowId.value = data.record.id;
      const result = await adminEdit('GET', { id: rowId.value });
      deepMerge(formState, result);

      // 当前需要选中
      changeRid(result['rid']);

      // todo 赋值操作
    } else {
      const { menuList, roleList, roleAuth, checkByRid } = await adminAdd('GET');
      menuTreeData.value = menuList;
      treeMenu.value = roleAuth;
      roleOptions.value = roleList;
      checkByRidList = checkByRid;
    }

    nextTick(() => {
      // 展开全部
      unref(asyncExpandTreeRef)?.expandAll(true);
      // 选全部取消选中
      unref(asyncExpandTreeRef)?.checkAll(false);
    });

    setDrawerProps({ confirmLoading: false });
  });
  // todo 为了husky
  console.log(packageOptions, domain, closeDrawer);

  const getTitle = computed(() =>
    !unref(isUpdate) ? '新增管理员' : '编辑管理员 (id: ' + rowId.value + ')',
  );

  function changeRid(value: any) {
    unref(asyncExpandTreeRef)?.checkAll(false);
    if (value === undefined) {
      return;
    }
    if (checkByRidList[value] === true) {
      unref(asyncExpandTreeRef)?.checkAll(true);
    } else if (isArray(checkByRidList[value]) && checkByRidList[value].length > 0) {
      unref(asyncExpandTreeRef)?.setCheckedKeys(checkByRidList[value]);
    }
  }

  async function handleSubmit() {
    try {
      setDrawerProps({ confirmLoading: true });

      await validate();

      const post = toRaw(formState);
      if (isUpdate.value) {
        // adminEdit('POST', Object.assign({}, post, { id: rowId.value }));
      } else {
        // adminAdd('POST', post);
      }
      console.log('submit post', post);
      createMessage.success(getTitle.value + '成功');
      // closeDrawer();
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
