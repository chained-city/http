import {
  REQUEST_OPTIONAL_CACHE,
  REQUEST_OPTIONAL_CREDENTIALS,
  REQUEST_OPTIONAL_MODE,
  REQUEST_OPTIONAL_REDIRECT,
  REQUEST_OPTIONAL_REFERRER_POLICY,
  REQUEST_TYPE
} from '../constants/request';
import { RESPONSE_BODY_TYPE } from '../constants/response';
import {
  IResponseBodyType,
  IRequest,
  IRequestContext,
  IResponseContext,
  IContext,
  ICoreRequest,
  HTTPConfig,
  IResponse
} from '../typings';
import { createChained } from './chained';

let id = 0;

const getId = () => ++id;

const transformRequest = (request: IRequest<RESPONSE_BODY_TYPE | undefined, true>) => {
  if (typeof request.cache === 'function') request.cache = request.cache(REQUEST_OPTIONAL_CACHE);
  if (typeof request.mode === 'function') request.mode = request.mode(REQUEST_OPTIONAL_MODE);
  if (typeof request.credentials === 'function')
    request.credentials = request.credentials(REQUEST_OPTIONAL_CREDENTIALS);
  if (typeof request.redirect === 'function') request.redirect = request.redirect(REQUEST_OPTIONAL_REDIRECT);
  if (typeof request.referrerPolicy === 'function')
    request.referrerPolicy = request.referrerPolicy(REQUEST_OPTIONAL_REFERRER_POLICY);

  const context = request as unknown as ICoreRequest<RESPONSE_BODY_TYPE, false>;

  if (!context.id) context.id = getId();

  return context;
};

export abstract class HTTP<R = any, Body extends object | void = void, BodyDataKey extends string = ''> {
  private originChained =
    createChained<
      Body extends void
        ? unknown
        : BodyDataKey extends ''
        ? { data: unknown } & Body
        : { [key in BodyDataKey]: unknown } & Body
    >();

  interceptors = this.originChained.interceptors;

  plugin = this.originChained.plugin;

  protected abstract core(requestContext: IRequestContext): Promise<R>;

  protected abstract transform<B>(
    response: R,
    bodyType: RESPONSE_BODY_TYPE
  ): Promise<IResponseContext<IResponseBodyType<B>>>;

  private config: HTTPConfig;

  constructor(config: HTTPConfig = {}) {
    this.config = config;
  }

  request(
    options: IRequest<RESPONSE_BODY_TYPE.json>
  ): HTTPPromise<IContext<RESPONSE_BODY_TYPE.json, Body extends void ? unknown : Body>>;
  request(options: IRequest<RESPONSE_BODY_TYPE.text>): HTTPPromise<IContext<RESPONSE_BODY_TYPE.text, string>>;
  request(options: IRequest<RESPONSE_BODY_TYPE.formData>): HTTPPromise<IContext<RESPONSE_BODY_TYPE.formData, FormData>>;
  request(options: IRequest<RESPONSE_BODY_TYPE.blob>): HTTPPromise<IContext<RESPONSE_BODY_TYPE.blob, Blob>>;
  request(
    options: IRequest<RESPONSE_BODY_TYPE.arrayBuffer>
  ): HTTPPromise<IContext<RESPONSE_BODY_TYPE.arrayBuffer, ArrayBuffer>>;
  request(options: IRequest): HTTPPromise<IContext<RESPONSE_BODY_TYPE, Body extends void ? unknown : Body>>;

  request<B>(
    options: IRequest<RESPONSE_BODY_TYPE.json>
  ): HTTPPromise<
    IContext<
      RESPONSE_BODY_TYPE.json,
      Body extends void ? B : BodyDataKey extends '' ? Body & { data: B } : Body & { [key in BodyDataKey]: B }
    >
  >;
  request<B>(options: IRequest): HTTPPromise<IContext<RESPONSE_BODY_TYPE, B>>;
  async request<B>(options: IRequest) {
    let data = {} as IRequestContext<RESPONSE_BODY_TYPE, false>;
    const coreRequest = async () => {
      if (this.config.baseURL) options.url = options.url ? `${this.config.baseURL}${options.url}` : this.config.baseURL;

      let requestContext: IRequestContext<RESPONSE_BODY_TYPE, false> = {
        request: transformRequest(options)
      };

      const requestResult = await this.originChained.request.trigger(requestContext);

      if (!requestResult) return false;
      if (requestResult !== undefined) requestContext = requestResult;

      data = requestContext;
      const coreResult = await this.core(requestContext);

      const responseContext = await this.transform<B>(coreResult, options.bodyType || RESPONSE_BODY_TYPE.json);

      let context = { ...requestContext, ...responseContext };

      const responseResult = await this.originChained.response.trigger(context as any);

      if (!responseResult) return false;
      if (responseResult !== undefined) context = responseResult as any;

      return context;
    };

    const promise = coreRequest() as HTTPPromise<{
      body: IResponseBodyType<B>;
      response: IResponse;
      request: ICoreRequest<RESPONSE_BODY_TYPE, false>;
    }>;

    await this.originChained.await.trigger({
      ...data,
      promise
    });

    return promise;
  }

  get(
    url: string,
    options?: IRequest<RESPONSE_BODY_TYPE.json>
  ): HTTPPromise<IContext<RESPONSE_BODY_TYPE.json, Body extends void ? unknown : Body>>;
  get(url: string, options: IRequest<RESPONSE_BODY_TYPE.text>): HTTPPromise<IContext<RESPONSE_BODY_TYPE.text, string>>;
  get(
    url: string,
    options: IRequest<RESPONSE_BODY_TYPE.formData>
  ): HTTPPromise<IContext<RESPONSE_BODY_TYPE.formData, FormData>>;
  get(url: string, options: IRequest<RESPONSE_BODY_TYPE.blob>): HTTPPromise<IContext<RESPONSE_BODY_TYPE.blob, Blob>>;
  get(
    url: string,
    options: IRequest<RESPONSE_BODY_TYPE.arrayBuffer>
  ): HTTPPromise<IContext<RESPONSE_BODY_TYPE.arrayBuffer, ArrayBuffer>>;
  get(url: string, options: IRequest): HTTPPromise<IContext<RESPONSE_BODY_TYPE, Body extends void ? unknown : Body>>;

  get<B>(
    url: string,
    options?: IRequest<RESPONSE_BODY_TYPE.json> | IRequest
  ): HTTPPromise<
    IContext<
      RESPONSE_BODY_TYPE.json,
      Body extends void ? B : BodyDataKey extends '' ? Body & { data: B } : Body & { [key in BodyDataKey]: B }
    >
  >;
  get<B>(url: string, options: IRequest = {}) {
    return this.request<B>({ ...options, url, method: REQUEST_TYPE.GET });
  }

  post(
    url: string,
    options?: IRequest<RESPONSE_BODY_TYPE.json>
  ): HTTPPromise<IContext<RESPONSE_BODY_TYPE.json, Body extends void ? unknown : Body>>;
  post(url: string, options: IRequest<RESPONSE_BODY_TYPE.text>): HTTPPromise<IContext<RESPONSE_BODY_TYPE.text, string>>;
  post(
    url: string,
    options: IRequest<RESPONSE_BODY_TYPE.formData>
  ): HTTPPromise<IContext<RESPONSE_BODY_TYPE.formData, FormData>>;
  post(url: string, options: IRequest<RESPONSE_BODY_TYPE.blob>): HTTPPromise<IContext<RESPONSE_BODY_TYPE.blob, Blob>>;
  post(
    url: string,
    options: IRequest<RESPONSE_BODY_TYPE.arrayBuffer>
  ): HTTPPromise<IContext<RESPONSE_BODY_TYPE.arrayBuffer, ArrayBuffer>>;
  post(url: string, options: IRequest): HTTPPromise<IContext<RESPONSE_BODY_TYPE, Body extends void ? unknown : Body>>;

  post<B>(
    url: string,
    options?: IRequest<RESPONSE_BODY_TYPE.json> | IRequest
  ): HTTPPromise<
    IContext<
      RESPONSE_BODY_TYPE.json,
      Body extends void ? B : BodyDataKey extends '' ? Body & { data: B } : Body & { [key in BodyDataKey]: B }
    >
  >;
  post<B>(url: string, options: IRequest = {}) {
    return this.request<B>({ ...options, url, method: REQUEST_TYPE.POST });
  }

  patch(
    url: string,
    options?: IRequest<RESPONSE_BODY_TYPE.json>
  ): HTTPPromise<IContext<RESPONSE_BODY_TYPE.json, Body extends void ? unknown : Body>>;
  patch(
    url: string,
    options: IRequest<RESPONSE_BODY_TYPE.text>
  ): HTTPPromise<IContext<RESPONSE_BODY_TYPE.text, string>>;
  patch(
    url: string,
    options: IRequest<RESPONSE_BODY_TYPE.formData>
  ): HTTPPromise<IContext<RESPONSE_BODY_TYPE.formData, FormData>>;
  patch(url: string, options: IRequest<RESPONSE_BODY_TYPE.blob>): HTTPPromise<IContext<RESPONSE_BODY_TYPE.blob, Blob>>;
  patch(
    url: string,
    options: IRequest<RESPONSE_BODY_TYPE.arrayBuffer>
  ): HTTPPromise<IContext<RESPONSE_BODY_TYPE.arrayBuffer, ArrayBuffer>>;
  patch(url: string, options: IRequest): HTTPPromise<IContext<RESPONSE_BODY_TYPE, Body extends void ? unknown : Body>>;

  patch<B>(
    url: string,
    options?: IRequest<RESPONSE_BODY_TYPE.json> | IRequest
  ): HTTPPromise<
    IContext<
      RESPONSE_BODY_TYPE.json,
      Body extends void ? B : BodyDataKey extends '' ? Body & { data: B } : Body & { [key in BodyDataKey]: B }
    >
  >;
  patch<B>(url: string, options: IRequest = {}) {
    return this.request<B>({ ...options, url, method: REQUEST_TYPE.PATCH });
  }

  put(
    url: string,
    options?: IRequest<RESPONSE_BODY_TYPE.json>
  ): HTTPPromise<IContext<RESPONSE_BODY_TYPE.json, Body extends void ? unknown : Body>>;
  put(url: string, options: IRequest<RESPONSE_BODY_TYPE.text>): HTTPPromise<IContext<RESPONSE_BODY_TYPE.text, string>>;
  put(
    url: string,
    options: IRequest<RESPONSE_BODY_TYPE.formData>
  ): HTTPPromise<IContext<RESPONSE_BODY_TYPE.formData, FormData>>;
  put(url: string, options: IRequest<RESPONSE_BODY_TYPE.blob>): HTTPPromise<IContext<RESPONSE_BODY_TYPE.blob, Blob>>;
  put(
    url: string,
    options: IRequest<RESPONSE_BODY_TYPE.arrayBuffer>
  ): HTTPPromise<IContext<RESPONSE_BODY_TYPE.arrayBuffer, ArrayBuffer>>;
  put(url: string, options: IRequest): HTTPPromise<IContext<RESPONSE_BODY_TYPE, Body extends void ? unknown : Body>>;

  put<B>(
    url: string,
    options?: IRequest<RESPONSE_BODY_TYPE.json> | IRequest
  ): HTTPPromise<
    IContext<
      RESPONSE_BODY_TYPE.json,
      Body extends void ? B : BodyDataKey extends '' ? Body & { data: B } : Body & { [key in BodyDataKey]: B }
    >
  >;
  put<B>(url: string, options: IRequest = {}) {
    return this.request<B>({ ...options, url, method: REQUEST_TYPE.PUT });
  }

  delete(
    url: string,
    options?: IRequest<RESPONSE_BODY_TYPE.json>
  ): HTTPPromise<IContext<RESPONSE_BODY_TYPE.json, Body extends void ? unknown : Body>>;
  delete(
    url: string,
    options: IRequest<RESPONSE_BODY_TYPE.text>
  ): HTTPPromise<IContext<RESPONSE_BODY_TYPE.text, string>>;
  delete(
    url: string,
    options: IRequest<RESPONSE_BODY_TYPE.formData>
  ): HTTPPromise<IContext<RESPONSE_BODY_TYPE.formData, FormData>>;
  delete(url: string, options: IRequest<RESPONSE_BODY_TYPE.blob>): HTTPPromise<IContext<RESPONSE_BODY_TYPE.blob, Blob>>;
  delete(
    url: string,
    options: IRequest<RESPONSE_BODY_TYPE.arrayBuffer>
  ): HTTPPromise<IContext<RESPONSE_BODY_TYPE.arrayBuffer, ArrayBuffer>>;
  delete(url: string, options: IRequest): HTTPPromise<IContext<RESPONSE_BODY_TYPE, Body extends void ? unknown : Body>>;

  delete<B>(
    url: string,
    options?: IRequest<RESPONSE_BODY_TYPE.json> | IRequest
  ): HTTPPromise<
    IContext<
      RESPONSE_BODY_TYPE.json,
      Body extends void ? B : BodyDataKey extends '' ? Body & { data: B } : Body & { [key in BodyDataKey]: B }
    >
  >;
  delete<B>(url: string, options: IRequest = {}) {
    return this.request<B>({ ...options, url, method: REQUEST_TYPE.DELETE });
  }
}

export default HTTP;
