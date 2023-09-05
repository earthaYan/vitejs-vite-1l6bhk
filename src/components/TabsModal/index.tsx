import { ButtonProps } from 'antd';
import { IModalFormProps } from '../ModalForm';
import TabsModal from './TabsModal';

export interface ITabsModal extends IModalFormProps {
  tab: {
    title: string;
    render: () => any;
    hasError?: boolean;
    callBack?: (index?: number) => void;
  }[];
  showNextButton?: boolean;
  flow?: boolean;
  smallFlow?: boolean;
  index?: number;
  handleTabClick?: (item: any, nextIndex: number, currentIndex: number) => void;
  customButtonProps?: Omit<ButtonProps, 'onClick' | 'type'>;
  customFooterTip?: string;
}

export default TabsModal;
