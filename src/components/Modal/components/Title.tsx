import React, { ReactNode, Ref } from 'react';

interface IProps {
  title?: ReactNode | string;
  titleRef?: Ref<HTMLDivElement>;
  dragPreview?: Ref<HTMLDivElement>;
}

const ModalTitle: React.FC<IProps> = (props) => {
  return (
    <div ref={props.titleRef} className="drag-modal-title">
      {props.title}
      <div ref={props.dragPreview}></div>
    </div>
  );
};

export default ModalTitle;
