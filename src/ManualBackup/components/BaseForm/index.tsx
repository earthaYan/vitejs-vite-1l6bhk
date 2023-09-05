import {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
} from 'react';
import { Input, Select, Form } from 'antd';
import { IBaseFormProps, backupToolEnum } from './index.d';
import { FormInstance } from 'antd/es/form';

const BaseForm: ForwardRefRenderFunction<
  { form: FormInstance },
  IBaseFormProps
> = (props, ref) => {
  const [form] = Form.useForm();
  useImperativeHandle(ref, () => ({
    form,
  }));
  useEffect(() => {
    if (!!props.instanceSelectData) {
      form.setFieldsValue({
        server_id: props.instanceSelectData.server_id ?? '',
        mysql_id: props.instanceSelectData.mysql_instance_id ?? '',
      });
    }
  }, [props.instanceSelectData]);
  return (
    <Form form={form}>
      <Form.Item
        name="server_id"
        label="主机名"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input readOnly={true} />
      </Form.Item>
      <Form.Item
        name="mysql_id"
        label="数据库实例名"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input readOnly={true} />
      </Form.Item>
      <Form.Item
        name="backup_tool"
        label="备份工具"
        initialValue={backupToolEnum.XtraBackup}
      >
        <Select
          dropdownMatchSelectWidth={false}
          onChange={props.backupToolChange}
        >
          <Select.Option value={backupToolEnum.XtraBackup}>
            {backupToolEnum.XtraBackup}
          </Select.Option>
          <Select.Option value={backupToolEnum.mysqlbackup}>
            {backupToolEnum.mysqlbackup}
          </Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export default forwardRef(BaseForm);
