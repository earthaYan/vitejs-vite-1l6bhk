import { useRef, useEffect, useState } from 'react';
import { TabsModal } from '../components';
import ComponentService from '../mock/ComponentService';
import MysqlService from '../mock/MysqlService';
import { dictionaries } from './index.data';
import { ITabsModal } from '../components/TabsModal';
import BaseForm from './components/BaseForm';
import { backupToolEnum } from './components/BaseForm/index.d';
import qs from 'query-string';
import BackupConfigForm from './components/BackupConfigForm';
import Icon from '@ant-design/icons';
import { WarnSvg } from '../components/Icon';
import Form, { FormInstance } from 'antd/es/form';
import useModalStateHooks from '../hooks/useModalStateHooks';
import useModalVisible from '../hooks/useModalVisible';
import BackupEvaluate from '../ManualBackup/components/BackupEvaluate';
import { IBackupConfigFormRef } from './components/BackupConfigForm/index.d';
import React from 'react';
// eslint-disable-next-line sonarjs/cognitive-complexity
const ManualBackup = () => {
  const baseForm = useRef<FormInstance>();
  const backupConfigForm = useRef<IBackupConfigFormRef | null>();
  // ====replace content====
  // const [backupConfigForm] = Form.useForm();
  const {
    isShow,
    selectData: instanceSelectData,
    setModalStatus,
  } = useModalStateHooks('manual-backup');
  const [index, setIndex] = useState(0);
  const [checkIsPending, setCheckIsPending] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createBackupSetRuleVisible, setCreateBackupSetRuleVisible] =
    useState(false);
  const [backupTool, setBackupTool] = useState(backupToolEnum.XtraBackup);
  const [backupConfigHasError, setBackupConfigHasError] = useState(false);
  const serverId = instanceSelectData?.server_id ?? '';
  const mysqlId = instanceSelectData?.mysql_instance_id ?? '';
  const resetState = () => {
    baseForm.current?.resetFields();
    backupConfigForm.current?.form.resetFields();
    // ====replace content====
    // backupConfigForm.resetFields();
    setIndex(0);
    setErrorMessage(null);
    setBackupTool(backupToolEnum.XtraBackup);
    setBackupConfigHasError(false);
  };
  const [visible, load, hideModal, closeModal, showModal] = useModalVisible(
    isShow,
    setModalStatus,
    resetState
  );

  const tabClick = (item: ITabsModal['tab'], scopeIndex: number) => {
    if (createBackupSetRuleVisible) {
      setCreateBackupSetRuleVisible(false);
    } else {
      setIndex(scopeIndex);
    }
  };

  const createBackupSetRuleSubmit = () => {
    setCreateBackupSetRuleVisible(false);
  };

  const backupToolChange = (scopeBackupTool: backupToolEnum) => {
    console.log(scopeBackupTool);
    setBackupTool(scopeBackupTool);
  };
  const onSave = async () => {
    if (createBackupSetRuleVisible) {
      setCreateBackupSetRuleVisible(false);
      return {};
    }

    const baseFormValues = baseForm.current?.getFieldsValue();
    try {
      const backupConfigFormValues =
        await backupConfigForm.current?.form.validateFields();
      // ====replace content====
      // const backupConfigFormValues = await backupConfigForm.validateFields();
      setBackupConfigHasError(false);
      return {
        mysql_id: baseFormValues.mysql_id,
        backup_tool: baseFormValues.backup_tool.toLowerCase(),
        backup_cnf: backupConfigFormValues.backup_cnf,
      };
    } catch (error) {
      setBackupConfigHasError(true);
      return null;
    }
  };

  const success = () => {
    closeModal();
  };

  // precheck
  const precheck = async () => {
    try {
      setCheckIsPending(true);
      await checkUrmanManager();
      const checkInstallAgent = await checkUrmanAgent();
      if (!checkInstallAgent)
        setErrorMessage(`主机${serverId}未安装urman-agent组件，请先安装！`);
      const checkBackupSetExistRes = await checkBackupSetExist();

      if (checkBackupSetExistRes !== 'true') {
        setCreateBackupSetRuleVisible(true);
      }

      setCheckIsPending(false);
    } catch (error) {
      const err = error as any;
      setCheckIsPending(false);
      setErrorMessage(err.data.message);
    }
  };

  const checkUrmanManager = async () =>
    ComponentService.IsInstalled(
      {
        component_types: ['urman-mgr'],
      },
      {
        paramsSerializer: (params) => qs.stringify(params),
      }
    );

  const checkUrmanAgent = async () => {
    return ComponentService.IsInstalled(
      {
        component_types: ['urman-agent'],
        server_id: serverId,
      },
      {
        /**
         * maybe should modify when this issue is resolved.
         * https://github.com/axios/axios/issues/1443
         */
        paramsSerializer: (params) => qs.stringify(params),
      }
    );
  };

  const checkBackupSetExist = async () => {
    return MysqlService.backupRulesExistForMysqlInstance({
      server_id: serverId,
      mysql_id: mysqlId,
    });
  };
  // render
  const renderTabs = (): ITabsModal['tab'] => {
    if (
      checkIsPending ||
      errorMessage ||
      createBackupSetRuleVisible ||
      !instanceSelectData
    ) {
      return [];
    }
    return [
      {
        title: '基本配置',
        render: () => (
          <BaseForm
            ref={(ref) => (baseForm.current = ref?.form)}
            instanceSelectData={instanceSelectData}
            backupToolChange={backupToolChange}
          />
        ),
      },
      {
        title: '备份配置',
        hasError: backupConfigHasError,
        render: () => (
          <BackupConfigForm
            ref={(ref) => (backupConfigForm.current = ref)}
            // form={backupConfigForm} // ====replace content====
            // index={index}// ====replace content====
            backupTool={backupTool}
          />
        ),
        callBack: () => {
          backupConfigForm.current?.updateBackupCnf();
        },
      },
      {
        title: '评估结果',
        render: () => <BackupEvaluate />,
      },
    ];
  };

  const renderContent = (): React.ReactNode | null => {
    if (checkIsPending) {
      return '检测中';
    }

    if (createBackupSetRuleVisible) {
      return (
        <section className="tips-icon-wrapper warning-tips">
          <div className="tips-icon">
            <Icon component={WarnSvg} />
          </div>
          <div className="tips-content">urman 将创建一个默认备份规则!</div>
        </section>
      );
    }

    if (errorMessage) {
      return <div className="error-message-wrapper">{errorMessage}</div>;
    }

    return null;
  };

  const renderCreateRuleSubmitBtn = () => {
    if (createBackupSetRuleVisible) {
      return [
        {
          text: '确认',
          type: 'primary',
          callback: createBackupSetRuleSubmit,
        },
      ];
    }

    return null;
  };

  useEffect(() => {
    if (visible) precheck();
  }, [visible]);
  return !!load ? (
    <>
      <TabsModal
        index={index}
        handleTabClick={tabClick}
        tab={renderTabs()}
        flow={true}
        className="mysql-form-modal mysql-manual-backup"
        visible={visible}
        onSave={onSave}
        onSaveIsAsyncFuc={true}
        url="/v3/database/manual_backup"
        title="手工备份"
        hide={hideModal}
        show={showModal}
        dictionaries={dictionaries}
        success={success}
        footerParams={renderCreateRuleSubmitBtn()}
        showNextButton={!createBackupSetRuleVisible && !checkIsPending}
        customButtonProps={{
          disabled: !!errorMessage,
        }}
        destroyOnClose={true}
      >
        {renderContent()}
      </TabsModal>
    </>
  ) : null;
};

export default ManualBackup;
