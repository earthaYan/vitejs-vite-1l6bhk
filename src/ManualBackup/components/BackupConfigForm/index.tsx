import { IBackupConfigFormProps, IBackupConfigFormRef } from './index.d';
import { Input, Form } from 'antd';
import SupportService from '../../../mock/SupportService';
import {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
} from 'react';

const BackupConfigForm: ForwardRefRenderFunction<
  IBackupConfigFormRef,
  IBackupConfigFormProps
> = (props, ref) => {
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    form,
    updateBackupCnf,
  }));
  // ======replace content =====
  // const { form, index } = props;
  // useEffect(() => {
  //   if (index === 1) {
  //     updateBackupCnf();
  //   }
  // }, [index]);
  const updateBackupCnf = () => {
    form.setFieldsValue({
      backup_cnf: '正在获取配置文件信息,请稍后',
    });
    SupportService.readUmcFile({
      path: `./backupcnfs/backup.${props.backupTool.toLowerCase()}`,
    }).then((res) => {
      form.setFieldsValue({
        backup_cnf: res,
      });
    });
  };

  return (
    <Form form={form}>
      <Form.Item
        name="backup_cnf"
        label="备份配置模板"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input.TextArea
          style={{
            resize: 'none',
            height: 300,
          }}
        />
      </Form.Item>
    </Form>
  );
};

export default forwardRef(BackupConfigForm);
