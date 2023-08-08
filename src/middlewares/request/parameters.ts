import { REQUEST_TYPE } from '../../constants/request';
import { IRequestContext } from '../../typings';

const requestParametersMiddleware = (ctx: IRequestContext) => {
  const options = ctx.request;

  if (options.parameters) {
    if (options.method === REQUEST_TYPE.GET) {
      options.query = options.query ? { ...options.query, ...options.parameters } : { ...options.parameters };
    } else if (options.body instanceof FormData) {
      Object.keys(options.parameters).forEach(key => options.body.set(key, options.parameters[key]));
    } else {
      options.body = options.body ? { ...options.body, ...options.parameters } : { ...options.parameters };
    }
  }
};

export default requestParametersMiddleware;
