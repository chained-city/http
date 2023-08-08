import { RESPONSE_BODY_TYPE } from '../constants/response';
import { IRequestContext, IResponseBodyType } from '../typings';
import HTTP from '../core/http';

export class Fetch<Body extends object | void = void, BodyDataKey extends string = ''> extends HTTP<
  Response,
  Body,
  BodyDataKey
> {
  protected async core(requestContext: IRequestContext) {
    return fetch(requestContext.request.url, requestContext.request);
  }

  protected async transform<B>(response: Response, bodyType: RESPONSE_BODY_TYPE) {
    let body: IResponseBodyType<B>;

    switch (bodyType) {
      case RESPONSE_BODY_TYPE.text:
        body = await response.text();
        break;
      case RESPONSE_BODY_TYPE.json:
        body = await response.json();
        break;
      case RESPONSE_BODY_TYPE.blob:
        body = await response.blob();
        break;
      case RESPONSE_BODY_TYPE.arrayBuffer:
        body = await response.arrayBuffer();
        break;
      case RESPONSE_BODY_TYPE.formData:
        body = await response.formData();
        break;
    }

    return {
      response: {
        headers: response.headers,
        redirected: response.redirected,
        status: response.status,
        statusText: response.statusText,
        type: response.type,
        url: response.url
      },
      body
    };
  }
}
