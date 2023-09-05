import { Button } from 'antd';
import ManualBackup from './ManualBackup';
import useModalStateHooks from './hooks/useModalStateHooks';

const Demo:React.FC = () => {
  const { setModalStatus } = useModalStateHooks('manual-backup');
  const handleClick = () => {
    setModalStatus(true);
  };
  return (
    <>
      <Button onClick={handleClick}>手动备份</Button>
      <ManualBackup />
    </>
  );
};
export default Demo;
