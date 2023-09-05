import { render } from 'react-dom';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
const mountNode = document.getElementById('root') as HTMLElement;
render(
  <Provider store={store}>
    <App />
  </Provider>,
  mountNode
);
