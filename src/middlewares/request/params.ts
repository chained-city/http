import { REQUEST_BODY_TYPE, REQUEST_TYPE } from '../../constants/request';
import { IRequestContext } from '../../typings';

const requestParamsMiddleware = (ctx: IRequestContext) => {
  const options = ctx.request;

  if (!options.method) options.method = REQUEST_TYPE.POST;

  if (options.params)
    Object.keys(options.params).forEach(key => {
      options.url = options.url.replace(':key', options.params[key]);
    });

  if (options.query) options.url = `${options.url}?${new URLSearchParams(options.query).toString()}`;

  if (options.body)
    options.body =
      options.headers?.get('Content-Type') === REQUEST_BODY_TYPE.form || options.body instanceof FormData
        ? options.body
        : options.headers?.get('Content-Type') === REQUEST_BODY_TYPE.json
        ? JSON.stringify(options.body)
        : new URLSearchParams(options.body).toString();
};

export default requestParamsMiddleware;
