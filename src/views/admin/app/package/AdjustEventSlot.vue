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
  import { defineComponent, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { Input, Tooltip } from 'ant-design-vue';
  import { Button } from '/@/components/Button';

  export default defineComponent({
    name: 'AdjustEventSlot',
    components: { BasicForm, [Input.name]: Input, Tooltip, Button },
    emits: ['success', 'register'],
    setup(props) {
      console.log('adjusr props ', props);
      const [register, { appendSchemaByField, removeSchemaByFiled, validate }] = useForm({
        schemas: [
          {
            field: 'key0',
            component: 'Input',
            label: 'Key',
            colProps: {
              span: 8,
            },
            required: true,
          },
          {
            field: 'value0',
            component: 'Input',
            label: 'Value',
            colProps: {
              span: 8,
            },
            required: true,
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

      async function handleSubmit() {
        try {
          const data = await validate();
          console.log(data);
        } catch (e) {
          console.log(e);
        }
      }

      const n = ref(1);

      async function add() {
        const curr = n.value;
        const appto = curr - 1;

        // 追加到操作列之前
        await appendSchemaByField(
          {
            field: `key${curr}`,
            component: 'Input',
            label: 'Key',
            colProps: {
              span: 8,
            },
            required: true,
          },
          `${appto}`,
        );
        // 追加到上一个
        await appendSchemaByField(
          {
            field: `value${curr}`,
            component: 'Input',
            label: 'Value',
            colProps: {
              span: 8,
            },
            required: true,
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
        console.log('del field ' + field);
        if (n.value > 1) {
          removeSchemaByFiled([`key${field}`, `value${field}`, `${field}`]);
          n.value--;
        }
      }

      return { register, handleSubmit, add, del };
    },
  });
</script>

<style lang="less" scoped></style>
