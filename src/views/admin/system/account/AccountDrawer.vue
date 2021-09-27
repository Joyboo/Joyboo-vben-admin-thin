<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <Tabs v-model:activeKey="currActiveKey">
      <TabPane
        :key="index.toString()"
        :tab="item.name"
        force-render
        v-for="(item, index) in refForm"
      >
        <BasicForm @register="item.registerForm">
          <template v-if="item.key === 'base'" #avatar="{ model, field }">
            <CropperAvatar
              :uploadApi="avatarUpload"
              :value="avatar(model[field])"
              btnText="更换头像"
              :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
              @change="(_, data) => (model[field] = data.url)"
              width="150"
            />
          </template>
          <template v-if="item.key === 'role'" #BasicTree>
            <BasicTree
              title="该角色组拥有的权限，仅作为展示，修改无效"
              :treeData="treeMenu"
              :checkable="true"
              ref="asyncExpandTreeRef"
              :replaceFields="{ key: 'id' }"
            />
          </template>
        </BasicForm>
      </TabPane>
    </Tabs>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref, nextTick } from 'vue';
  import { Tabs, TabPane } from 'ant-design-vue';
  import { BasicForm, FormProps, useForm } from '/@/components/Form/index';
  import { FormList } from './account.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { MyFormItemType } from '/#/utils';
  import { useUserStore } from '/@/store/modules/user';
  import { adminAdd, adminEdit, avatarUpload } from '/@/api/admin/system';
  import headerImg from '/@/assets/images/header.jpg';
  import { CropperAvatar } from '/@/components/Cropper';
  import { BasicTree, TreeActionType, TreeItem } from '/@/components/Tree/index';
  import { isArray } from '/@/utils/is';

  export default defineComponent({
    name: 'AccountDrawer',
    components: { BasicDrawer, BasicForm, Tabs, TabPane, CropperAvatar, BasicTree },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      // tabs当前选中标签页的key
      const currActiveKey = ref('0');
      // 编辑id
      let rowId = 0;
      // 权限展示树数据
      const treeMenu = ref<TreeItem[]>([]);
      // 权限展示树Ref
      const asyncExpandTreeRef = ref<Nullable<TreeActionType>>(null);
      // 每个rid对应哪些权限
      let checkByRid = {};

      const userStore = useUserStore();
      const gamelist = computed(() => userStore.getGameListOptions);

      const fromPropsLayout: FormProps = {
        labelWidth: 130,
        showActionButtonGroup: false,
      };

      const refForm: MyFormItemType[] = [];
      for (const item of FormList) {
        const [registerForm, methods] = useForm(
          Object.assign({}, fromPropsLayout, { schemas: item.schemas }),
        );
        refForm.push({ registerForm, methods, name: item.name, key: item.key } as MyFormItemType);
      }

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        rowId = isUpdate.value ? data.record.id : 0;

        // 角色，菜单
        const doAxios = unref(isUpdate) ? adminEdit : adminAdd;
        const resp = await doAxios('GET', isUpdate.value ? { id: rowId } : {});
        const { roleList, roleAuth, menuList, result } = resp;
        checkByRid = resp.checkByRid;

        treeMenu.value = roleAuth;
        nextTick(() => {
          // 展开全部
          unref(asyncExpandTreeRef)?.expandAll(true);
          // 选全部取消选中
          unref(asyncExpandTreeRef)?.checkAll(false);
          // 当前需要选中
          if (isUpdate.value) {
            changeRid(result['rid']);
          }
        });

        refForm.forEach(async (f) => {
          await f.methods.resetFields();
          await f.methods.updateSchema([
            {
              field: 'rid',
              componentProps: {
                options: roleList,
                onChange: changeRid,
              },
            },
            {
              field: 'extension.gid',
              componentProps: { options: gamelist },
            },
            {
              field: 'extension.homePath',
              componentProps: {
                treeData: menuList,
                replaceFields: { key: 'id', value: 'id', title: 'title' },
                onSelect: handleSelectMenu,
                getPopupContainer: () => document.body,
              },
            },
            {
              field: 'password',
              helpMessage: unref(isUpdate) ? '留空表示不修改密码' : '',
            },
          ]);

          if (unref(isUpdate)) {
            await f.methods.setFieldsValue({ ...result });
          }
        });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增账号' : '编辑账号'));

      function handleSelectMenu(keys) {
        console.log('handleSelectMenu ', keys);
      }

      async function handleSubmit() {
        try {
          setDrawerProps({ confirmLoading: true });
          let post = {};
          for (const item of refForm) {
            const val = await item.methods.validate();
            post = Object.assign({}, post, val);
          }

          for (const { schemas } of FormList) {
            // 在一些场景中，清除按钮会将值设为undefined，比如Select,对于设置过defaultValue的字段,还原为defaultValue
            for (const sh of schemas) {
              if (typeof sh.defaultValue !== 'undefined' && typeof post[sh.field] === 'undefined') {
                post[sh.field] = sh.defaultValue;
              }
            }
          }

          const doAxios = unref(isUpdate) ? adminEdit : adminAdd;
          await doAxios('POST', unref(isUpdate) ? Object.assign(post, { id: rowId }) : {});

          closeDrawer();
          emit('success');
        } catch (e) {
          console.log('menuDrawer catch', e);
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      const avatar = (userAvatar: string) => {
        return userAvatar ? userStore.getUserInfo.config.imageDomain + userAvatar : headerImg;
      };

      const handleCheck = (checkedKeys, e) => {
        console.log('onChecked', checkedKeys, e);
      };

      function changeRid(value) {
        unref(asyncExpandTreeRef)?.checkAll(false);
        if (value !== undefined) {
          if (checkByRid[value] === true) {
            unref(asyncExpandTreeRef)?.checkAll(true);
          } else if (isArray(checkByRid[value]) && checkByRid[value].length > 0) {
            unref(asyncExpandTreeRef)?.setCheckedKeys(checkByRid[value]);
          }
        }
      }

      return {
        registerDrawer,
        refForm,
        getTitle,
        handleSubmit,
        currActiveKey,
        avatarUpload,
        avatar,
        gamelist,
        treeMenu,
        handleCheck,
        asyncExpandTreeRef,
      };
    },
  });
</script>

<style lang="less" scoped>
  .useLayout {
    cursor: pointer;

    &:hover {
      color: @primary-color;
    }
  }
</style>
