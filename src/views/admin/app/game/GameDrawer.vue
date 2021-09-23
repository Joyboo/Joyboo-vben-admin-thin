<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #myGameKey="{ model, field }">
        <Input v-model:value="model[field]">
          <template #addonAfter>
            <Tooltip title="点击随机生成">
              <Icon
                icon="ant-design:barcode-outlined"
                style="cursor: pointer"
                @click="getGameKey(model, field)"
              />
            </Tooltip>
          </template>
        </Input>
      </template>
      <template #myDividePaypal="{ model }">
        <InputGroup compact>
          <Input
            v-model:value="model['extension.divide.paypal']"
            :class="['paypal', { fullWidth: getIsMobile }]"
            suffix="%"
          />
          <Input v-if="!getIsMobile" class="paypalInputSymbol" placeholder="+ 额外比例" disabled />
          <Input
            v-model:value="model['extension.divide.paypal-fix']"
            :class="['paypal-fix', { fullWidth: getIsMobile }]"
            suffix="%"
          />
        </InputGroup>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { Input, InputGroup, Tooltip } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './game.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { useAppInject } from '/@/hooks/web/useAppInject';

  export default defineComponent({
    name: 'GameDrawer',
    components: { BasicDrawer, BasicForm, Input, InputGroup, Tooltip, Icon },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      // let id = 0;

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 120,
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告

        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
          });
          // id = data.record.id;
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });

          console.log(values);
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      async function getGameKey(model, field) {
        console.log('click getGameKey ', model, field);
      }

      const { getIsMobile } = useAppInject();

      return {
        registerDrawer,
        registerForm,
        getTitle,
        handleSubmit,
        getGameKey,
        getIsMobile,
      };
    },
  });
</script>

<style lang="less" scoped>
  .paypal {
    width: 35%;
    text-align: center;
  }

  .paypal-fix {
    width: 35%;
    text-align: center;
    border-left: 0;
  }

  .paypalInputSymbol {
    width: 30%;
    border-left: 0;
    pointer-events: none;
    background-color: #fff;
  }

  /* 需要定义在最下面以覆盖上面的CSS */
  .fullWidth {
    width: 100%;
  }
</style>
