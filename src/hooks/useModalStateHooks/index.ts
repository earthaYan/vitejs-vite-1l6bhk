import React, { useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ModalState } from './index.d';
import { IReduxState } from '../../store';
import { updateModalState } from '../../store/mysqlService';

const useModalStateHooks = (
  modalName: string
): {
  isShow: boolean;
  selectData: any;
  setModalStatus: (status: boolean) => void;
} => {
  const reduxState = useSelector(
    (state: IReduxState) => ({
      isShow: state.mysqlService.modalStatus[modalName],
      selectData: state.mysqlService.tableSelectData,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();
  const setModalStatus = (status: boolean) => {
    dispatch(updateModalState({ btnName: modalName, status }));
  };

  return { ...reduxState, setModalStatus };
};
export default useModalStateHooks;
