/**
 * 响应类型枚举
 */
export enum RESPONSE_TYPE {
  /**
   * 普通请求，即同源请求
   */
  basic = 'basic',
  /**
   * 跨域请求
   */
  cors = 'cors',
  /**
   * 网络错误，主要用于 Service Worker
   */
  error = 'error',
  /**
   * 如果 fetch 请求的 type 属性设为 no-cors，就会返回这个值，详见请求部分。表示发出的是简单的跨域请求，类似<form>表单的那种跨域请求
   */
  opaque = 'opaque',
  /**
   * 如果 fetch 请求的 redirect 属性设为 manual，就会返回这个值
   */
  opaqueredirect = 'opaqueredirect'
}

/**
 * 响应数据类型枚举
 */
export enum RESPONSE_BODY_TYPE {
  /**
   * 文本字符串
   */
  text = 'text',
  /**
   * 序列化对象
   */
  json = 'json',
  /**
   * 表单对象
   */
  formData = 'formData',
  /**
   * 二进制 blob 对象
   */
  blob = 'blob',
  /**
   * 二进制 arrayBuffer 对象
   */
  arrayBuffer = 'arrayBuffer'
}
