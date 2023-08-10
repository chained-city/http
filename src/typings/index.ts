import { FuncMapOrMap } from '@logically/types';
import {
  REQUEST_TYPE,
  REQUEST_OPTIONAL_CACHE,
  REQUEST_OPTIONAL_MODE,
  REQUEST_OPTIONAL_CREDENTIALS,
  REQUEST_OPTIONAL_REDIRECT,
  REQUEST_OPTIONAL_REFERRER_POLICY
} from '../constants/request';
import { RESPONSE_BODY_TYPE } from '../constants/response';

type UseMap<TM, M, U> = U extends true ? FuncMapOrMap<TM, M> : M;

/**
 * 请求类型
 */
export type IRequestType = keyof typeof REQUEST_TYPE;

/**
 * 请求可选项
 */
export interface IRequestOptional<USEMAP extends boolean = true> {
  /**
   * 请求地址
   */
  url?: string;
  /**
   * 方法
   * @default "POST"
   */
  method?: IRequestType;
  /**
   * 请求头
   */
  headers?: Headers;
  /**
   * 主体参数
   */
  body?: any;
  /**
   * 指定如何处理缓存
   * @default 'default'
   */
  cache?: UseMap<typeof REQUEST_OPTIONAL_CACHE, REQUEST_OPTIONAL_CACHE, USEMAP>;
  /**
   * 指定请求的模式
   * @default 'cors'
   */
  mode?: UseMap<typeof REQUEST_OPTIONAL_MODE, REQUEST_OPTIONAL_MODE, USEMAP>;
  /**
   * 指定是否发送 Cookie
   * @default 'same-origin'
   */
  credentials?: UseMap<typeof REQUEST_OPTIONAL_CREDENTIALS, REQUEST_OPTIONAL_CREDENTIALS, USEMAP>;
  /**
   * 指定一个 AbortSignal 实例，用于取消fetch()请求
   */
  signal?: AbortSignal;
  /**
   * 用于页面卸载时，告诉浏览器在后台保持连接，继续发送数据
   * @default false
   */
  keepalive?: boolean;
  /**
   * 指定 HTTP 跳转的处理方法
   * @default 'follow'
   */
  redirect?: UseMap<typeof REQUEST_OPTIONAL_REDIRECT, REQUEST_OPTIONAL_REDIRECT, USEMAP>;
  /**
   * 指定一个哈希值，用于检查 HTTP 回应传回的数据是否等于这个预先设定的哈希值
   * @description 比如，下载文件时，检查文件的 SHA-256 哈希值是否相符，确保没有被篡改。
   */
  integrity?: string;
  /**
   * 用于设定fetch()请求的referer标头
   */
  referrer?: string;
  /**
   * 属性用于设定Referer标头的规则
   * @default 'no-referrer-when-downgrade'
   */
  referrerPolicy?: UseMap<typeof REQUEST_OPTIONAL_REFERRER_POLICY, REQUEST_OPTIONAL_REFERRER_POLICY, USEMAP>;
}

/**
 * 请求参数
 */
export interface IRequest<T = RESPONSE_BODY_TYPE, USEMAP extends boolean = true> extends IRequestOptional<USEMAP> {
  /**
   * 路由参数
   */
  params?: any;
  /**
   * 查询参数
   */
  query?: any;
  /**
   * 附带参数
   * @description 根据请求方法放入相应位置 query | body 以及相应的数据结构
   */
  parameters?: any;
  /**
   * 返回主体类型
   * @default 'json'
   */
  bodyType?: T;
  /**
   * 模拟数据
   */
  mock?: { [path: string]: any };
}

/**
 * 核心请求参数
 */
export interface ICoreRequest<T = RESPONSE_BODY_TYPE, USEMAP extends boolean = true> extends IRequest<T, USEMAP> {
  /**
   * 请求Id
   */
  id: number;
  /**
   * 请求地址
   */
  url: string;
}

/**
 * 响应参数
 */
export interface IResponse {
  /**
   * 响应头
   */
  readonly headers: Headers;
  /**
   * 是否发生过重定向
   */
  readonly redirected: boolean;
  /**
   * HTTP 状态码 100 - 599
   */
  readonly status: number;
  /**
   * 状态文字描述
   */
  readonly statusText: string;
  /**
   * 返回请求类型
   */
  readonly type: ResponseType;
  /**
   * 地址
   */
  readonly url: string;
}

/**
 * 请求上下文
 */
export interface IRequestContext<T = RESPONSE_BODY_TYPE, USEMAP extends boolean = false> {
  request: ICoreRequest<T, USEMAP>;
}

/**
 * 响应主体类型
 */
export type IResponseBodyType<B> = string | Blob | ArrayBuffer | FormData | B;

/**
 * 响应上下文
 */
export interface IResponseContext<B> {
  body: B;
  response: IResponse;
}

/**
 * 上下文
 */
export type IContext<T = RESPONSE_BODY_TYPE, B = any> = IRequestContext<T> & IResponseContext<B>;

/**
 * HTTP 配置
 */
export interface HTTPConfig {
  /**
   * 基础 URL 将与 request 时的 URL 进行前置拼接
   */
  baseURL?: string;
}
