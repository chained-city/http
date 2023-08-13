import { HTTP } from '../core/http';
import { HTTPConfig } from '../typings';

/**
 * RESTful API
 */
export class RESTful<Interface, Body extends object | void = void, BodyDataKey extends string = ''> {
  private prefix: string;
  private http: HTTP<any, Body, BodyDataKey>;

  static http: HTTP<any, any> | void;

  constructor(prefix: string, http?: HTTP<any, Body, BodyDataKey> | HTTPConfig) {
    this.prefix = prefix;

    this.http = http instanceof HTTP ? http : (RESTful.http as HTTP<any, Body, BodyDataKey>);

    if (!this.http) throw new Error('No http request tool found!');
  }

  /**
   * 获取
   */
  get = async (query?: Partial<Interface>) => {
    return (await this.http.get<Array<Interface>>(this.prefix, { query })).body;
  };

  /**
   * 新增
   */
  post = async (body: Partial<Interface>) => {
    return (await this.http.post<Interface>(this.prefix, { body })).body;
  };

  /**
   * 更新指定全部信息
   */
  put = async (id: number | string, body: Partial<Interface>) => {
    return (await this.http.put<boolean>(`${this.prefix}/${id}`, { body })).body;
  };

  /**
   * 更新指定部分信息
   */
  patch = async (id: number | string, body: Partial<Interface>) => {
    return (await this.http.patch<boolean>(`${this.prefix}/${id}`, { body })).body;
  };

  /**
   * 删除指定
   */
  delete = async (id: number | string) => {
    return (await this.http.delete<boolean>(`${this.prefix}/${id}`)).body;
  };
}
