/* eslint-disable @typescript-eslint/indent */
import React, { Component, ReactNode } from 'react';
import Icon, {
  CodeOutlined,
  CopyOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Tooltip, Row, Col, Button, Space, Typography } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';
import { getErrorMessage } from '../../utils/tool';
import generateRequestJson from '../../utils/generateRequestJson';
import MyModal from '../Modal';
import { AxiosRequestConfig } from 'axios';
import { WarnSvg } from '../Icon';
import classNames from 'classnames';

import { ProgressTypeEnum } from '../ModalForm';

import { RequestMethodEnum } from '../RequestInQuery/index.enum';
interface IRequestInQueryProps {
  className?: string;
  progressClassName?: string;
  visible: boolean;
  json: {
    [key: string]: any;
  };
  actionContent?: any;
  customContent?: any;
  url: string | any;
  title: string | React.ReactElement<'span'>;
  hideCurrentModal: () => void;
  hideTransferModal: () => void;
  success: () => void;
  level?: 'high' | 'low' | 'waring';
  renderNoProgress?: (data: any) => React.ReactNode;
  requestHeader?: AxiosRequestConfig;
  withIcon?: 'default' | 'waring';
  customIcon?: any;
  requestMethod?: RequestMethodEnum;
  requestFinished?: (requestResponse?: any) => void;
  unTurnBooleanToString?: boolean;
  batch?: boolean;
  batchKey?: string;
  batchTransformKey?: string;
  formContent?: React.ReactElement;
  onValidCheck?: () => Promise<boolean> | boolean;
  onValidCheckIsAsyncFuc?: boolean;

  //DMP-8690,关闭errorModal触发的事件；
  hideErrorModal?: () => void;

  // 新增跳转按钮 DMP-10334
  jumpUrl?: string;

  progressTarget?: () => HTMLElement;

  progressType?: ProgressTypeEnum;
}

class RequestInQuery extends Component<IRequestInQueryProps> {
  public static defaultProps = {
    requestMethod: RequestMethodEnum.Post,
  };

  public state = {
    copyJsonTitle: '复制JSON',
    jsonWrap: false,
    visible: false,
    step: {
      step_index: 0,
      steps: [],
      error: '',
      description: '',
      done_message: '',
      steps_warning: [],
    },
    success: false,
    error: false,
    errorMessage: '',
    resultData: [],
    noProgress: false,
    storybook: {},
    excuteStatus: false,
    progressId: '',
    progressInitStatus: [],
  };

  public batchJson = '';

  public concurrency = 0;

  public handleHide = () => {
    if (this.state.excuteStatus) {
      return;
    }

    this.props.hideCurrentModal();
    this.setState({
      jsonWrap: false,
      excuteStatus: false,
    });
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  public getBatchJson = () => {
    const { url, title, json, unTurnBooleanToString } = this.props;
    const currentJson: any = Array.isArray(json) ? json : { ...json };

    if (!unTurnBooleanToString) {
      for (const key in currentJson) {
        if (typeof currentJson[key] === 'boolean') {
          currentJson[key] = currentJson[key] + '';
        }
      }
    }

    const jsonHeader = unTurnBooleanToString
      ? ` "headers": {"content_type":"application/json"},\n`
      : '';
    const resultUrl = typeof url === 'string' ? url : url.api; // storybook api mock

    let resultJson = '';
    resultJson += '[\n';
    this.concurrency = currentJson.concurrency;
    delete currentJson.concurrency;
    const batchKeys = currentJson[this.props.batchKey ?? '']?.split(',');
    let currentUrl = resultUrl;

    if (typeof resultUrl === 'string' && resultUrl.startsWith('/')) {
      currentUrl = resultUrl.substr(1);
    }

    (batchKeys || []).forEach((item: any, index: number) => {
      const batchTransformKey = this.props
        .batchTransformKey as keyof typeof currentJson;
      const newJson = batchTransformKey
        ? {
            ...currentJson,
            [this.props.batchKey as keyof typeof currentJson]: item,
            [batchTransformKey]: `${currentJson[batchTransformKey]}-${item}`,
          }
        : {
            ...currentJson,
            [this.props.batchKey as keyof typeof currentJson]: item,
          };
      resultJson += `{\n  "url": "${currentUrl}", \n  "title": "${title}",\n  ${jsonHeader}"json": `;
      resultJson += `  ${JSON.stringify(newJson)
        .replace(/,"/g, ',\n"')
        .replace('{', '{\n')}`;
      resultJson += index === batchKeys?.length - 1 ? '\n}' : '\n},';
    });
    resultJson += '\n]\n';
    this.batchJson = resultJson;

    return resultJson;
  };

  public getJson() {
    const { url, title, json, unTurnBooleanToString } = this.props;

    if (this.props.batch && this.props.batchKey) {
      return this.getBatchJson();
    }
    return generateRequestJson(
      url,
      `${title}`,
      json,
      unTurnBooleanToString ? 'json' : undefined
    );
  }

  public generateContent = () => {
    const level = this.props.level ? this.props.level : false;
    const content = this.props.customContent
      ? this.props.customContent
      : this.props.actionContent;
    let iconType: ReactNode;

    switch (this.props.withIcon) {
      case 'default':
        iconType = <InfoCircleOutlined style={{ fontSize: 43 }} />;
        break;

      case 'waring':
        iconType = <Icon component={WarnSvg} />;
        break;
    }

    return (
      <div
        className={classNames(
          {
            warning: level === 'high',
            warn: level === 'waring',
          },
          'modal-content'
        )}
      >
        {this.props.withIcon ? (
          <div className="content-with-icon">
            <div className="icon">
              {this.props.customIcon ? this.props.customIcon : iconType}
            </div>
            <div className="text">{content}</div>
          </div>
        ) : (
          content
        )}
      </div>
    );
  };

  public setContent() {
    const { actionContent } = this.props;

    if (typeof actionContent === 'object') {
      const actionList = [];
      for (const key of Object.keys(actionContent)) {
        actionList.push(
          <Row key={key}>
            <Col
              span={8}
              style={{
                textAlign: 'right',
              }}
            >
              <Typography.Text type="secondary">{key}</Typography.Text>
            </Col>
            <Col span={14} offset={1}>
              <span className="whitespace-pre-line">{actionContent[key]}</span>
            </Col>
          </Row>
        );
      }

      return (
        <Space direction="vertical" size="small" className="full-width-element">
          {actionList}
        </Space>
      );
    } else {
      return this.generateContent();
    }
  }

  public handleCopyJson = () => {
    const CopySuccess = (
      <>
        <span
          style={{
            color: '#a0a0a0',
          }}
        >
          复制成功
        </span>
        <a>执行批处理</a>
      </>
    );
    this.setState({
      copyJsonTitle: CopySuccess,
    });
    setTimeout(() => {
      this.setState({
        copyJsonTitle: '复制JSON',
      });
    }, 4000);
  };

  public handleJsonView = () => {
    this.setState((state: any) => ({
      jsonWrap: !state.jsonWrap,
    }));
  };

  public setExcuteStatus = (val: boolean) => {
    this.setState({
      excuteStatus: val,
    });
  };

  public setError = (error: any) => {
    this.setState({
      error: true,
      errorMessage: JSON.stringify(
        this.props.requestMethod === RequestMethodEnum.Get
          ? error.data
          : getErrorMessage(error) || '未知错误，请查看接口'
      ),
      excuteStatus: false,
      visible: false,
    });
  };

  public renderErrorMessage = (msg: string) => {
    const splitString = '$LicenseLink';
    if (!msg.includes(splitString)) return msg;

    const [normalString, linkString] = msg.split(splitString);

    return (
      <>
        <span>{normalString}</span>
        <a
          href="/license"
          style={{
            color: 'red',
            borderBottom: '1px solid red',
            textDecoration: 'none',
          }}
        >
          {linkString}
        </a>
      </>
    );
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  public submit = () => {
    const { url, json, requestHeader, requestMethod } = this.props;
    this.setExcuteStatus(true);
  };

  public verify = async () => {
    if (this.props.onValidCheck) {
      const isPass = this.props.onValidCheckIsAsyncFuc
        ? await this.props.onValidCheck()
        : this.props.onValidCheck();

      if (isPass) {
        this.submit();
      }
    } else {
      this.submit();
    }
  };

  public handleCloseProgressList = () => {
    this.setState({
      visible: false,
    });
    this.props.success();
  };

  public handleErrorModalClose = () => {
    this.setState({
      error: false,
    });
    this.props.hideCurrentModal();
    if (this.props.hideErrorModal) {
      this.props.hideErrorModal();
    }
  };

  public handleProgressModalClose = () => {
    this.setState({
      noProgress: false,
    });
  };

  public render() {
    return (
      <>
        <MyModal
          transitionName=""
          maskTransitionName=""
          className={classNames(this.props.className, 'action-sky-modal')}
          visible={this.props.visible}
          title={this.props.level ? this.props.title : '操作清单'}
          width={this.props.level ? 650 : 800}
          destroyOnClose={true}
          keyboard={false}
          maskClosable={false}
          mask={!(this.props.level && this.props.level === 'low')}
          onCancel={this.handleHide}
          footer={
            <div className="action-sky-modal-footer">
              <Tooltip
                title={
                  this.state.excuteStatus
                    ? '按钮不可用,存在正在执行的任务...'
                    : ''
                }
              >
                <Button onClick={this.handleHide}>关闭</Button>
              </Tooltip>
              <Space>
                <Button
                  type="dashed"
                  icon={<CodeOutlined />}
                  onClick={this.handleJsonView}
                >
                  查看JSON
                </Button>
                <CopyToClipboard text={this.getJson()}>
                  <Tooltip
                    arrowPointAtCenter={true}
                    title={this.state.copyJsonTitle}
                  >
                    <Button
                      type="dashed"
                      icon={<CopyOutlined />}
                      onClick={this.handleCopyJson}
                    >
                      复制json
                    </Button>
                  </Tooltip>
                </CopyToClipboard>
                <Tooltip title={this.state.excuteStatus ? '执行中...' : ''}>
                  <Button
                    type="primary"
                    onClick={this.verify}
                    loading={this.state.excuteStatus}
                  >
                    执行
                  </Button>
                </Tooltip>
              </Space>
            </div>
          }
        >
          <div hidden={this.state.jsonWrap}>
            {this.setContent()}
            {this.props.formContent}
          </div>
          <div
            className="action-sky-modal-json-wrapper"
            hidden={!this.state.jsonWrap}
          >
            {this.getJson()}
          </div>
        </MyModal>
        <MyModal
          className={this.props.className ?? ''}
          visible={this.state.error}
          handleEvent={{
            handleClick: this.handleErrorModalClose,
          }}
          destroyOnClose={true}
        >
          <div
            style={{
              color: 'red',
              padding: '10px',
              backgroundColor: '#fff',
              borderRadius: '4px',
            }}
          >
            <span className="whitespace-pre-line">
              {this.renderErrorMessage(this.state.errorMessage)}
            </span>
          </div>
        </MyModal>
        <MyModal
          visible={this.state.noProgress}
          handleEvent={{
            handleClick: this.handleProgressModalClose,
          }}
          destroyOnClose={true}
        >
          {!!this.props.renderNoProgress
            ? this.props.renderNoProgress(this.state.resultData)
            : ''}
        </MyModal>
      </>
    );
  }
}

export default RequestInQuery;
