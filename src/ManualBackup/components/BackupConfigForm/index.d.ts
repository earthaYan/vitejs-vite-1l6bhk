import { FormInstance } from 'antd/es/form';

export interface IBackupConfigFormProps {
  backupTool: string;
  // ====replace content====
  // form: FormInstance;
  // index: number;
}
export interface IBackupConfigFormRef {
  form: FormInstance;
  updateBackupCnf: () => void;
}
