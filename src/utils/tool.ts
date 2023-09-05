export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error || 'code' in error) {
    return error.message;
  }

  if (error.data) {
    if (typeof error.data?.message === 'string') {
      return error.data.message;
    }

    if (typeof error.data === 'string') {
      return error.data;
    }

    return JSON.stringify(error.data);
  }

  return i18n.t('commonGenerator.unknownError');
};