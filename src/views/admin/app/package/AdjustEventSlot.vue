<template>
  <BasicForm @register="register">
    <template #footer>
      <Tooltip title="新增一行">
        <Button
          ghost
          color="success"
          class="ml-2"
          preIcon="ant-design:plus-outlined"
          @click="add"
        />
      </Tooltip>
      <Tooltip title="提交 （仅提交adjust事件的数据）">
        <Button
          v-if="isUpdate"
          ghost
          color="success"
          class="ml-2"
          preIcon="ant-design:check-outlined"
          @click="handleSubmit"
        />
      </Tooltip>
    </template>
    <template #del="{ field }">
      <Tooltip title="删除此行">
        <Button ghost color="warning" preIcon="ant-design:delete-outlined" @click="del(field)" />
      </Tooltip>
    </template>
  </BasicForm>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, toRefs, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { Input, Tooltip } from 'ant-design-vue';
  import { Button } from '/@/components/Button';
  import { packageSaveAdjustEvent } from '/@/api/admin/app';

  export default defineComponent({
    name: 'AdjustEventSlot',
    components: { BasicForm, [Input.name]: Input, Tooltip, Button },
    props: {
      adjustEvent: {
        type: [Object, String],
        default: () => {},
      },
      updId: {
        type: Number,
        default: 0,
      },
    },
    emits: ['update:adjustEvent'],
    setup(props, { emit }) {
      console.log('adjusr props ', props);
      const n = ref(1);
      const { updId } = toRefs(props);

      const inputChange = () => {
        toKeyValue()
          .then((adjust) => {
            emit('update:adjustEvent', adjust);
          })
          .catch((_) => {});
      };

      const [register, { appendSchemaByField, removeSchemaByFiled, validate }] = useForm({
        schemas: [
          {
            field: 'key0',
            component: 'Input',
            componentProps: {
              allowClear: false,
              onChange: inputChange,
            },
            label: 'Key',
            colProps: {
              span: 8,
            },
          },
          {
            field: 'value0',
            component: 'Input',
            componentProps: {
              allowClear: false,
              onChange: inputChange,
            },
            label: 'Value',
            colProps: {
              span: 8,
            },
          },
          {
            field: '0',
            component: 'Input',
            label: ' ',
            colProps: {
              span: 8,
            },
            slot: 'del',
          },
          {
            field: 'action',
            label: ' ',
            component: 'Input',
            slot: 'footer',
          },
        ],
        labelWidth: 100,
        actionColOptions: { span: 24 },
        showResetButton: false,
        showSubmitButton: false,
      });

      async function toKeyValue() {
        try {
          const data = await validate();
          const max = unref(n);
          const adjust = {};
          for (let i = 0; i < max; i++) {
            const key = `key${i}`;
            const value = `value${i}`;
            adjust[data[key]] = data[value];
          }
          console.log('toKeyValue adjust, ', adjust);
          return adjust;
        } catch (e) {
          // throw new Error(e.toString());
        }
      }

      function handleSubmit() {
        toKeyValue()
          .then((adjust) => {
            packageSaveAdjustEvent(adjust);
          })
          .catch((_) => {});
      }

      async function add() {
        const curr = n.value;
        const appto = curr - 1;

        // 追加到操作列之前
        await appendSchemaByField(
          {
            field: `key${curr}`,
            component: 'Input',
            componentProps: {
              allowClear: false,
              onChange: inputChange,
            },
            label: 'Key',
            colProps: {
              span: 8,
            },
          },
          `${appto}`,
        );
        // 追加到上一个
        await appendSchemaByField(
          {
            field: `value${curr}`,
            component: 'Input',
            componentProps: {
              allowClear: false,
              onChange: inputChange,
            },
            label: 'Value',
            colProps: {
              span: 8,
            },
          },
          `key${curr}`,
        );

        await appendSchemaByField(
          {
            field: `${curr}`,
            component: 'Input',
            label: ' ',
            colProps: {
              span: 8,
            },
            slot: 'del',
          },
          `value${curr}`,
        );
        n.value++;
      }

      function del(field) {
        if (n.value > 1) {
          removeSchemaByFiled([`key${field}`, `value${field}`, `${field}`]);
          n.value--;
        }
      }

      const isUpdate = computed(() => unref(updId) > 0);

      return { register, handleSubmit, add, del, isUpdate };
    },
  });
</script>

<style lang="less" scoped></style>
