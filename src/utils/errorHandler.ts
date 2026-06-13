// src/utils/errorHandler.ts

export const getErrorMessage = (err: any): string => {
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }
  if (err?.message) {
    return err.message;
  }
  return 'Something went wrong';
};

