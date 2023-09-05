import React, { Component } from 'react';
import { Button, Space, Tooltip } from 'antd';
import { RequestInQuery } from '../index';
import { ModalProps } from 'antd/es/modal';
import { AxiosRequestConfig } from 'axios';
import classNames from 'classnames';
import MyModal from '../Modal/MyModal';
import { RequestMethodEnum } from '../RequestInQuery/index.enum';

type OnSaveReturnType =
  | { [key: string]: any }
  | Promise<{ [key: string]: any }>;

export enum ProgressTypeEnum {
  'oceanbase' = 'oceanbase',
  'actiondb' = 'actiondb',
  'postgresql' = 'postgresql',
}

export interface IModalFormProps extends ModalProps {
  onSave: () => OnSaveReturnType;
  onSaveIsAsyncFuc?: boolean;
  url: string | any;
  title: string | React.ReactElement<'span'>;
  hide: (flag?: any) => void;
  show: () => void;
  dictionaries: {
    [key: string]: any;
  };
  success: () => void;
  customDictionaries?: {
    [key: string]: any;
  };
  footerParams?: any;
  tabs?: any;
  id?: string;
  requestHeader?: AxiosRequestConfig;
  isNoSave?: boolean;
  saveDisable?: boolean;
  requestMethod?: RequestMethodEnum;
  requestFinished?: (requestResponse?: any) => void;
  unTurnBooleanToString?: boolean;
  batch?: boolean;
  batchKey?: string;
  batchTransformKey?: string;

  // 新增跳转按钮 DMP-10334
  jumpUrl?: string;
  customBtn?: React.ReactNode;

  // DMP-10969
  hideErrorModal?: () => void;

  progressType?: ProgressTypeEnum;
  saveBtnLoading?: boolean;
}

class ModalForm extends Component<IModalFormProps, any> {
  public dictionariesContent: {
    [key: string]: any;
  } = {};

  public json: {
    [key: string]: any;
  } = {};

  public state = {
    visible: false,
  };

  public cancel = () => {
    this.props.hide(true);
  };

  public ok = async () => {
    if (this.props.saveDisable) {
      return;
    }
    let formContent: {
      [key: string]: any;
    } = {};
    if (this.props.onSaveIsAsyncFuc) {
      formContent = await this.props.onSave();
    } else {
      formContent = this.props.onSave();
    }
    this.json = formContent;
    const { dictionaries } = this.props;

    if (Object.keys(formContent).length > 0) {
      this.dictionariesContent = {};
      for (const key of Object.keys(formContent)) {
        if (key in dictionaries) {
          const text = dictionaries[key];
          if (typeof text === 'string') {
            this.dictionariesContent[text] = formContent[key];
          } else {
            const { textKey, value } = text(formContent[key]);
            this.dictionariesContent[textKey] = value;
          }
        }
      }

      this.props.hide(false);
      this.setState({
        visible: true,
      });
    }
  };

  public back = () => {
    this.props.show();
    this.setState({
      visible: false,
    });
  };

  public hideAction = () => {
    this.setState({
      visible: false,
    });
    this.props.hide(false);
  };

  public getButtonByFooterParams = () => {
    const { footerParams } = this.props;
    const isNotEmpty = !!footerParams;
    let reactNode;
    if (isNotEmpty) {
      const paramsLength = footerParams.length;
      if (paramsLength === 1) {
        const btnData = footerParams[0];
        reactNode = (
          <Tooltip placement="top" title={btnData.tipText}>
            <Button
              hidden={btnData.hidden}
              disabled={btnData.disabled}
              onClick={() => {
                if (!btnData.disabled) {
                  btnData.callback();
                }
              }}
              type={btnData.type}
            >
              {btnData.text}
            </Button>
          </Tooltip>
        );
      }
    } else {
      reactNode = null;
    }
    return reactNode;
  };

  public render() {
    const footerBtn = this.getButtonByFooterParams();
    const { id, className, customDictionaries, customBtn } = this.props;
    const key = !!id ? id : 'modal-add';
    const dictionaries: any =
      !!customDictionaries && !!Object.keys(customDictionaries).length
        ? Object.assign({}, this.dictionariesContent, customDictionaries)
        : this.dictionariesContent;
    return (
      <>
        <MyModal
          transitionName=""
          maskTransitionName=""
          className={classNames(className, 'action-sky-modal')}
          visible={this.props.visible}
          width={this.props.width ?? 720}
          title={
            <>
              {this.props.title}
              <div hidden={!this.props.tabs}>{this.props.tabs}</div>
            </>
          }
          forceRender={this.props.forceRender}
          destroyOnClose={this.props.destroyOnClose}
          onCancel={this.cancel}
          keyboard={false}
          maskClosable={false}
          footer={
            <div className="action-sky-modal-footer">
              <Button onClick={this.cancel}>
            关闭
              </Button>
              <Space>
                {customBtn}
                {footerBtn}
                <Button
                  hidden={!!this.props.isNoSave}
                  type="primary"
                  onClick={this.ok}
                  disabled={this.props.saveDisable}
                  loading={!!this.props.saveBtnLoading}
                >
                保存
                </Button>
              </Space>
            </div>
          }
        >
          <div id={key}> {this.props.children}</div>
        </MyModal>
        <RequestInQuery
          className={className ?? ''}
          visible={this.state.visible}
          json={this.json}
          actionContent={dictionaries}
          hideCurrentModal={this.back}
          url={this.props.url}
          progressType={this.props.progressType}
          title={this.props.title}
          hideTransferModal={this.hideAction}
          requestHeader={this.props.requestHeader}
          requestMethod={this.props.requestMethod}
          requestFinished={this.props.requestFinished}
          unTurnBooleanToString={this.props.unTurnBooleanToString}
          success={() => {
            this.props.success();
            this.props.hide(true);
          }}
          batch={this.props.batch}
          batchKey={this.props.batchKey}
          batchTransformKey={this.props.batchTransformKey}
          jumpUrl={this.props.jumpUrl}
          hideErrorModal={this.props.hideErrorModal}
        />
      </>
    );
  }
}

export default ModalForm;
