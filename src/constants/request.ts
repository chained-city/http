/**
 * 请求类型
 */
export enum REQUEST_TYPE {
  /**
   * 从服务器取出资源（一项或多项）
   */
  GET = 'GET',
  /**
   * 在服务器新建一个资源
   */
  POST = 'POST',
  /**
   * 在服务器更新资源（客户端提供改变后的完整资源）
   */
  PUT = 'PUT',
  /**
   * 在服务器更新资源（客户端提供改变的属性）
   */
  PATCH = 'PATCH',
  /**
   * 从服务器删除资源
   */
  DELETE = 'DELETE'
}

/**
 * 请求数据类型
 */
export enum REQUEST_BODY_TYPE {
  /**
   * 序列化的JSON字符串
   */
  json = 'application/json',
  /**
   * 表单数据，boundary 分割
   */
  form = 'multipart/form-data ',
  /**
   * URL编码数据
   */
  urlencoded = 'application/x-www-form-urlencoded '
}

/**
 * 请求可选项 缓存处理
 */
export enum REQUEST_OPTIONAL_CACHE {
  /**
   * 先在缓存里面寻找匹配的请求
   */
  default = 'default',
  /**
   * 直接请求远程服务器，并且不更新缓存
   */
  'no-store' = 'no-store',
  /**
   * 直接请求远程服务器，并且更新缓存
   */
  reload = 'reload',
  /**
   * 将服务器资源跟本地缓存进行比较，有新的版本才使用服务器资源，否则使用缓存
   */
  'no-cache' = 'no-cache',
  /**
   * 缓存优先，只有不存在缓存的情况下，才请求远程服务器
   */
  'force-cache' = 'force-cache',
  /**
   * 只检查缓存，如果缓存里面不存在，将返回504错误
   */
  'only-if-cached' = 'only-if-cached'
}

/**
 * 请求可选项 请求模式
 */
export enum REQUEST_OPTIONAL_MODE {
  /**
   * 允许跨域请求
   */
  cors = 'cors',
  /**
   * 只允许同源请求
   */
  'same-origin' = 'same-origin',
  /**
   * 请求方法只限于 GET、POST 和 HEAD，并且只能使用有限的几个简单标头，不能添加跨域的复杂标头，相当于提交表单所能发出的请求
   */
  'no-cors' = 'no-cors'
}

/**
 * 请求可选项 是否发送 Cookie
 */
export enum REQUEST_OPTIONAL_CREDENTIALS {
  /**
   * 同源请求时发送 Cookie，跨域请求时不发送
   */
  'same-origin' = 'same-origin',
  /**
   * 不管同源请求，还是跨域请求，一律发送 Cookie
   */
  include = 'include',
  /**
   * 一律不发送
   */
  omit = 'omit'
}

/**
 * 请求可选项 HTTP 跳转处理方法
 */
export enum REQUEST_OPTIONAL_REDIRECT {
  /**
   * fetch 跟随 HTTP 跳转
   */
  follow = 'follow',
  /**
   * 如果发生跳转，fetch 就报错
   */
  error = 'error',
  /**
   * fetch 不跟随 HTTP 跳转，但是response.url属性会指向新的 URL，response.redirected属性会变为true，由开发者自己决定后续如何处理跳转
   */
  manual = 'manual'
}

/**
 * Referer 标头规则
 */
export enum REQUEST_OPTIONAL_REFERRER_POLICY {
  /**
   * 总是发送 Referer 标头，除非从 HTTPS 页面请求 HTTP 资源时不发送
   */
  'no-referrer-when-downgrade' = 'no-referrer-when-downgrade',
  /**
   * 不发送 Referer 标头
   */
  'no-referrer' = 'no-referrer',
  /**
   * Referer 标头只包含域名，不包含完整的路径
   */
  'origin' = 'origin',
  /**
   * 同源请求 Referer 标头包含完整的路径，跨域请求只包含域名
   */
  'origin-when-cross-origin' = 'origin-when-cross-origin',
  /**
   * 跨域请求不发送 Referer，同源请求发送
   */
  'same-origin' = 'same-origin',
  /**
   * Referer 标头只包含域名，HTTPS 页面请求 HTTP 资源时不发送 Referer 标头
   */
  'strict-origin' = 'strict-origin',
  /**
   * 同源请求时 Referer 标头包含完整路径，跨域请求时只包含域名，HTTPS 页面请求 HTTP 资源时不发送该标头
   */
  'strict-origin-when-cross-origin' = 'strict-origin-when-cross-origin',
  /**
   * 不管什么情况，总是发送Referer标头
   */
  'unsafe-url' = 'unsafe-url'
}
