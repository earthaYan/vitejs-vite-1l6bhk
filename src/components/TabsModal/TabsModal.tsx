import { Button, Steps } from 'antd';
import { useState } from 'react';
import { ITabsModal } from '.';
import ModalForm from '../ModalForm';

import './index.less';

const TabsModal: React.FC<ITabsModal> = (props) => {
  const {
    index,
    tab,
    flow,
    showNextButton = true,
    hide,
    ...ModalFormProps
  } = props;

  const [innerIndex, setInnerIndex] = useState(index === undefined ? 0 : index);

  const handleTabClick = (item: any, newIndex: number) => {
    if (index === undefined) {
      setInnerIndex(newIndex);
    } else if (props.handleTabClick) {
      props.handleTabClick(item, newIndex, currentIndex);
    }

    if (item.callBack) {
      item.callBack();
    }
  };

  const currentIndex = index === undefined ? innerIndex : index;

  const goToNext = () => {
    if (currentIndex === tab.length - 1) {
      return;
    }
    handleTabClick(tab[currentIndex + 1], currentIndex + 1);
  };
  const goToLast = () => {
    if (currentIndex === 0) {
      return;
    }
    handleTabClick(tab[currentIndex - 1], currentIndex - 1);
  };

  const hideModal = (flag?: boolean) => {
    if (flag && index === undefined) {
      setInnerIndex(0);
    }
    hide(flag);
  };

  const createTabTitles = () => {
    return (
      <Steps
        current={currentIndex}
        size="small"
        className="tab-modal-step-wrapper"
      >
        {tab.map((item, i) => {
          return (
            <Steps.Step
              status={item.hasError ? 'error' : undefined}
              key={item.title}
              onClick={handleTabClick.bind(null, item, i)}
              title={item.title}
            />
          );
        })}
      </Steps>
    );
  };

  const renderCustomButton = () => {
    return (
      <>
        {showNextButton && currentIndex !== 0 && (
          <Button onClick={goToLast}>上一步</Button>
        )}
        {showNextButton && currentIndex !== tab.length - 1 && (
          <>
            <Button
              type="primary"
              onClick={goToNext}
              {...props.customButtonProps}
            >
              下一步
            </Button>
          </>
        )}
      </>
    );
  };

  const isNoSave = props.isNoSave ?? currentIndex !== tab.length - 1;
  return (
    <ModalForm
      {...ModalFormProps}
      hide={hideModal}
      tabs={createTabTitles()}
      isNoSave={isNoSave}
      customBtn={renderCustomButton()}
    >
      {props.children}
      {tab.map((item: any, i) => (
        <div hidden={i !== currentIndex} key={i}>
          {item.render()}
        </div>
      ))}
    </ModalForm>
  );
};

export default TabsModal;
