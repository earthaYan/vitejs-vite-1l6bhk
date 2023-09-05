import React from 'react';

// eslint-disable-next-line @typescript-eslint/naming-convention
type useModalVisibleReturn = [
  boolean,
  boolean,
  () => void,
  () => void,
  () => void
];

/**
 * use hooks with modal
 * @param modalStatus modal status in redux
 * @param setModalStatus the method of update modal status
 * @returns [visible, load, hideModal, closeModal, showModal]
 */
const useModalVisible = (
  modalStatus: boolean,
  setModalStatus: (state: boolean) => void,
  // eslint-disable-next-line @typescript-eslint/ban-types
  resetData?: Function
): useModalVisibleReturn => {
  const [visible, setVisible] = React.useState<boolean>(false);
  const [load, setLoad] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (modalStatus && !load) {
      setLoad(true);
    }
    setVisible(modalStatus);
  }, [modalStatus]);

  const closeModal = React.useCallback(() => {
    setModalStatus(false);
    if (resetData) {
      resetData();
    }
  }, [setModalStatus, resetData]);

  const hideModal = React.useCallback(
    (flag?: boolean) => {
      if (flag) {
        closeModal();
      } else {
        setVisible(false);
      }
    },
    [closeModal]
  );

  const showModal = React.useCallback(() => {
    setVisible(true);
  }, []);

  return [visible, load, hideModal, closeModal, showModal];
};

export default useModalVisible;
