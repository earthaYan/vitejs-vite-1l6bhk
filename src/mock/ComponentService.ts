import { AxiosRequestConfig } from 'axios';

class ComponentService {
  public IsInstalled(_params: any, _options?: AxiosRequestConfig) {
    return new Promise((resolve) => {
      resolve(true);
    });
  }
}
export default new ComponentService();
