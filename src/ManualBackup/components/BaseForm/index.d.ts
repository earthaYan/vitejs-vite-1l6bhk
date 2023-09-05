// eslint-disable-next-line @typescript-eslint/naming-convention
export enum backupToolEnum {
  XtraBackup = 'XtraBackup',
  mysqlbackup = 'mysqlbackup',
}
export interface IBaseFormProps {
  backupToolChange: (backupTool: backupToolEnum) => void;
  instanceSelectData: any;
}
