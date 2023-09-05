import { FormInstance } from "antd";

export interface IBackupConfigFormRef{
  form: FormInstance;
  updateBackupCnf: () => void;
}