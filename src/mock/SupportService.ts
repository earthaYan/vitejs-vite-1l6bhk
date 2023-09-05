import { AxiosRequestConfig } from 'axios';

class SupportService {
  public readUmcFile(_params: any, _options?: AxiosRequestConfig) {
    return new Promise((resolve) => {
      resolve(
        '[global]\nbackup_lock_path = ./backup_lock\n[mysql_backup]\nxb_defaults = --parallel=1 --use-memory=200MB --tmpdir={} --ftwrl-wait-timeout=120 --ftwrl-wait-threshold=120 --kill-long-queries-timeout=60 --kill-long-query-type=all --ftwrl-wait-query-type=all --no-version-check\nxb_backup_to_image = --defaults-file={} --host={} --port={} --user={} --keyring-file-data={} --compress --throttle=300 --no-timestamp --stream=xbstream\nxb_incremental_backup_to_image = --defaults-file={} --host={} --port={} --user={} --keyring-file-data={} --incremental --incremental-lsn={} --compress --throttle=300 --no-timestamp --stream=xbstream\nxb_image_to_backup_dir = -x\nxb_decompress = --decompress --remove-original --target-dir={}\nxb_full_apply_log = --defaults-file={} --keyring-file-data={} --apply-log\nxb_apply_incremental_backup = --defaults-file={} --keyring-file-data={} --apply-log --incremental-dir={}\nxb_copy_back = --defaults-file={} --force-non-empty-directories --move-back --target-dir={}\n\nxb_mysql8_0_backup_to_image = --defaults-file={} --backup --host={} --port={} --user={} --keyring-file-data={} --compress --throttle=300 --stream=xbstream --target-dir={}\nxb_mysql8_0_incremental_backup_to_image = --defaults-file={} --backup --host={} --port={} --user={} --keyring-file-data={} --incremental-lsn={} --compress --throttle=300 --stream=xbstream --target-dir={}\nxb_mysql8_0_full_apply_log = --defaults-file={} --keyring-file-data={} --prepare --target-dir={}\nxb_mysql8_0_apply_incremental_backup = --defaults-file={} --keyring-file-data={} --prepare --incremental-dir={} --target-dir={}\n\nxb_backup_to_image_timeout_seconds = 21600\nxb_incremental_backup_to_image_timeout_seconds = 21600\nxb_image_to_backup_dir_timeout_seconds = 21600\nxb_decompress_seconds = 21600\nxb_full_apply_log_timeout_seconds = 21600\nxb_apply_incremental_backup_timeout_seconds = 21600\nxb_copy_back_timeout_seconds = 21600'
      );
    });
  }
}
export default new SupportService();
