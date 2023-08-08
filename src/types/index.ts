declare global {
  interface HTTPPromise<T> extends Promise<T> {}
}

export {};
