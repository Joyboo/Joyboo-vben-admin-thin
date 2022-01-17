<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="isUpdate ? '编辑Crontab (id: ' + rowId + ')' : '新增Crontab'"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #crontabArgs="{ model, field }">
        <div style="background-color: #eee; padding: 15px">
          <Card>
            <Row :gutter="[20, 10]">
              <template v-for="(argsItem, idx) in model[field]" :key="idx">
                <Col :span="9">
                  <Input v-model:value="argsItem.key" placeholder="参数名" />
                </Col>
                <Col :span="9">
                  <Input v-model:value="argsItem.value" placeholder="参数值" />
                </Col>
                <Col :span="6">
                  <Tooltip title="删除此行" placement="right">
                    <a-button
                      ghost
                      color="warning"
                      preIcon="ant-design:delete-outlined"
                      @click="delArgs(model, field, argsItem)"
                    />
                  </Tooltip>
                </Col>
              </template>

              <Col :span="24">
                <Tooltip title="添加一行">
                  <a-button
                    ghost
                    color="success"
                    preIcon="ant-design:plus-outlined"
                    @click="
                      model[field].push({
                        key: '',
                        value: '',
                      })
                    "
                  />
                </Tooltip>
              </Col>
            </Row>
          </Card>
        </div>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { Row, Col, Tooltip, Input, Card } from 'ant-design-vue';
  import { ref, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './crontab.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { crontabAdd, crontabEdit } from '/@/api/admin/system';
  // import { useMessage } from '/@/hooks/web/useMessage';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref(false);
  const rowId = ref(0);
  // const { createConfirm, createMessage } = useMessage();

  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 130,
    schemas: formSchema,
    showActionButtonGroup: false,
  });

  const [registerDrawer, { closeDrawer, changeLoading, changeOkLoading }] = useDrawerInner(
    async (data) => {
      resetFields();
      isUpdate.value = !!data?.isUpdate;

      if (unref(isUpdate)) {
        changeLoading(true);
        changeOkLoading(true);
        rowId.value = data.record.id;
        const result = await crontabEdit('GET', { id: data.record.id });
        setFieldsValue({
          ...result,
        });
      } else {
        setFieldsValue({ rclass: '\\Linkunyuan\\EsUtility\\Task\\Crontab' });
      }

      changeLoading(false);
      changeOkLoading(false);
    },
  );

  async function handleSubmit() {
    try {
      const values = await validate();
      changeLoading(true);
      changeOkLoading(true);
      if (unref(isUpdate)) {
        values.id = rowId.value;
        await crontabEdit('POST', values);
      } else {
        await crontabAdd('POST', values);
      }

      closeDrawer();

      emit('success');
    } finally {
      changeLoading(false);
      changeOkLoading(false);
    }
  }

  const delArgs = (model, field, item) => {
    const index = model[field].indexOf(item);
    if (index !== -1) {
      model[field].splice(index, 1);
    }
  };
</script>
