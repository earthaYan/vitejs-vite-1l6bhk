import { AxiosRequestConfig } from 'axios';

class MysqlService {
  public backupRulesExistForMysqlInstance(
    _params: any,
    _options?: AxiosRequestConfig
  ) {
    return new Promise((resolve) => {
      resolve('true');
    });
  }
}
export default new MysqlService();
