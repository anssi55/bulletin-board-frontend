type ServiceInit = {
  status: 'init';
};

type ServiceLoading = {
  status: 'loading';
};

type ServiceLoaded<T> = {
  status: 'loaded';
  payload: T;
};

type ServiceError = {
  status: 'error';
  error: Error;
};

export type Service<T> = ServiceInit | ServiceLoading | ServiceLoaded<T> | ServiceError;
