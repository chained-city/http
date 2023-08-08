declare global {
  interface HTTPPromise<T> {
    /**
     * 取消请求
     */
    cancel: () => void;
  }
}

export default {};
