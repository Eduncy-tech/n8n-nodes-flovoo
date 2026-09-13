import type {
  IExecuteFunctions,
  IHttpRequestMethods,
  IDataObject,
} from 'n8n-workflow';

export async function flovooApiRequest(
  this: IExecuteFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  qs: IDataObject = {},
): Promise<any> {
  const credentials = await this.getCredentials('flovooApi');
  const baseUrl = (credentials.baseUrl as string).replace(/\/+$/, '');

  const options = {
    method,
    url: `${baseUrl}${endpoint}`,
    body,
    qs,
    json: true,
  };

  if (Object.keys(body).length === 0) delete (options as IDataObject).body;
  if (Object.keys(qs).length === 0) delete (options as IDataObject).qs;

  return this.helpers.httpRequestWithAuthentication.call(this, 'flovooApi', options);
}

export function cleanObject(obj: IDataObject): IDataObject {
  const result: IDataObject = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === '' || value === null) continue;
    result[key] = value;
  }
  return result;
}
