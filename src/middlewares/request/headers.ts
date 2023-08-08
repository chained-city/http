import { REQUEST_BODY_TYPE } from '../../constants/request';
import { IRequestContext } from '../../typings';

const requestHeadersMiddleware = (ctx: IRequestContext) => {
  const options = ctx.request;

  if (!options.headers) options.headers = new Headers();

  if (!options.headers.get('Content-Type') && !(options?.body instanceof FormData))
    options.headers.set('Content-Type', REQUEST_BODY_TYPE.json);
};

export default requestHeadersMiddleware;
