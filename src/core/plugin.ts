import { IRequestContext, IResponseContext } from '../typings';

export abstract class HTTPPlugin {
  /**
   * 名称
   */
  abstract name: string;

  /**
   * 请求
   */
  abstract request(ctx: IRequestContext): void;

  /**
   * 等待
   */
  abstract await(ctx: IRequestContext & { promise: Promise<unknown> }): void;

  /**
   * 响应
   */
  abstract response(ctx: Readonly<IRequestContext> & IResponseContext<any>): void;
}
