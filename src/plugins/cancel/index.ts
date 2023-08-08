import { HTTPPlugin } from '../../core/plugin';
import { IRequestContext, IResponseContext } from '../../typings';
import './types';

export class CancelPlugin extends HTTPPlugin {
  name = 'CancelPlugin';

  private controllerMap: Record<number, AbortController> = {};

  request = (ctx: IRequestContext) => {
    const controller = new AbortController();
    const { signal } = controller;
    ctx.request.signal = signal;
    this.controllerMap[ctx.request.id] = controller;
  };

  await = (ctx: IRequestContext & { promise: HTTPPromise<unknown> }) => {
    ctx.promise.cancel = () => this.controllerMap[ctx.request.id].abort();
  };

  response = (ctx: Readonly<IRequestContext> & IResponseContext<any>) => {
    delete this.controllerMap[ctx.request.id];
  };
}
