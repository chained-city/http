import { Chained } from '@logically/coding-model';
import requestHeadersMiddleware from '../middlewares/request/headers';
import requestParametersMiddleware from '../middlewares/request/parameters';
import requestParamsMiddleware from '../middlewares/request/params';
import { CancelPlugin } from '../plugins/cancel';
import { IRequestContext, IResponseContext } from '../typings';
import { HTTPPlugin } from './plugin';

/***
 * 创建 HTTP 链
 */
export const createChained = <B>() => {
  /**
   * 请求链式中间件
   */
  const requestChained = new Chained<IRequestContext>();

  requestChained.use([requestHeadersMiddleware, requestParametersMiddleware, requestParamsMiddleware], {
    afterUse: true
  });

  /**
   * 等待链式中间件
   */
  const awaitChained = new Chained<IRequestContext & { promise: HTTPPromise<unknown> }>();

  /**
   * 响应链式中间件
   */
  const responseChained = new Chained<Readonly<IRequestContext> & IResponseContext<B>>();

  const registerPlugin = (plugin: HTTPPlugin) => {
    requestChained.use(plugin.request);
    awaitChained.use(plugin.await);
    responseChained.use(plugin.response);

    return {
      register: registerPlugin
    };
  };

  registerPlugin(new CancelPlugin());

  const requestUse = (...args: Parameters<typeof requestChained.use>) => {
    requestChained.use(...args);
    return { use: requestUse };
  };

  const awaitUse = (...args: Parameters<typeof awaitChained.use>) => {
    awaitChained.use(...args);
    return { use: requestUse };
  };

  const responseUse = (...args: Parameters<typeof responseChained.use>) => {
    responseChained.use(...args);
    return { use: requestUse };
  };

  const chained = {
    request: requestChained,
    await: awaitChained,
    response: responseChained,
    interceptors: {
      request: { use: requestUse },
      await: { use: awaitUse },
      response: { use: responseUse }
    },
    plugin: {
      register: registerPlugin
    }
  };

  return chained;
};
