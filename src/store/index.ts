import { configureStore } from '@reduxjs/toolkit';
import mysqlService from './mysqlService';


const store = configureStore({
  reducer: {
    mysqlService
  },
});
export type IReduxState = ReturnType<typeof store.getState>;
export default store;