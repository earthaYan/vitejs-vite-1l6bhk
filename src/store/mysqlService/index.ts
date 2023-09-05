import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ModalState } from '../../hooks/useModalStateHooks/index.d';

export interface IMysqlServiceState {
  tableSelectData: any;
  modalStatus: ModalState;
}
const initialState: IMysqlServiceState = {
  tableSelectData: {
    server_id :'server_1',
    mysql_instance_id:'mysql-i1'
  },
  modalStatus: {},
};
const mysqlService = createSlice({
  name: 'mysqlService',
  initialState,
  reducers: {
    initModalStatus: (state, action: PayloadAction<ModalState>) => {
      state.modalStatus = action.payload;
    },
    updateModalState: (
      state,
      action: PayloadAction<{ btnName: string; status: boolean }>
    ) => {
      state.modalStatus[action.payload.btnName] = action.payload.status;
    },
  },
});
export const { initModalStatus, updateModalState } = mysqlService.actions;

export default mysqlService.reducer;
