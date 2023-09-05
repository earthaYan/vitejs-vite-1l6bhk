import { Button, Modal, ModalProps } from 'antd';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDrag, useDrop } from 'react-dnd';
import ModalTitle from './components/Title';
import React, { ReactNode, useRef, useState } from 'react';
import { ItemTypeEnum } from './itemType';

export interface MyModalProps extends ModalProps {
  visible?: boolean;
  url?: string;
  footer?: any[] | ReactNode;
  smallHeader?: boolean;
  handleEvent?: {
    handleClick?: () => void;
  };
}
const MyModal: React.FC<MyModalProps> = (props) => {
  const { t } = useTranslation();

  const {
    visible,
    title,
    handleEvent,
    children,
    smallHeader,
    width,
    className,
    style,
    ...otherSetting
  } = props;

  const basicSet = {
    title: 'DMP',
    width: width || 800,
    closable: true,
    keyboard: false,
    maskClosable: false,
    footer: [
      <Button
        key="back"
        onClick={(e: any) => {
          handleEvent?.handleClick?.();
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
      >
        {t('common.closed')}
      </Button>,
    ],
  };
  if (window.innerWidth <= 1366 && !width) {
    basicSet.width = 720;
  }
  const titleName = title || basicSet.title;

  const [position, setPosition] = useState({ left: 0, top: 0 });
  const positionAtStart = useRef({ left: 0, top: 0 });

  const [, drag, dragPreview] = useDrag({
    item: { type: ItemTypeEnum.CARD },
    begin: () => {
      const { left, top } = position;
      positionAtStart.current = { left, top };
    },
  });

  const [, drop] = useDrop({
    accept: ItemTypeEnum.CARD,
    hover(_, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset();
      setPosition({
        left: positionAtStart.current.left + (delta?.x ?? 0),
        top: positionAtStart.current.top + (delta?.y ?? 0),
      });
    },
  });

  const newTitle = (
    <ModalTitle title={titleName} dragPreview={dragPreview} titleRef={drag} />
  );

  return (
    <Modal
      transitionName=""
      maskTransitionName=""
      {...basicSet}
      title={newTitle}
      open={visible}
      onCancel={handleEvent?.handleClick}
      style={{
        transform: `translate(${position.left}px, ${position.top}px)`,
        ...style,
      }}
      {...otherSetting}
      className={classNames(
        'action-sky-modal',
        'action-sky-drag-modal',
        className
      )}
      modalRender={(modal) => {
        return (
          <>
            <div
              ref={(ref) => {
                drop(ref?.parentElement?.parentElement ?? null);
              }}
            >
              {modal}
            </div>
          </>
        );
      }}
    >
      {children}
    </Modal>
  );
};

export default MyModal;
