declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTTPPromise<T> {
    /**
     * 取消请求
     */
    cancel: () => void;
  }
}

export default {};
