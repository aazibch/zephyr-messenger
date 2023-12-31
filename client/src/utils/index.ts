import { HttpMethods, FormDataObj, HttpResponseDataObj } from '../types';

interface HttpConfigArguments {
  url: string;
  method: HttpMethods;
  allowCredentials: boolean;
  body?: FormDataObj | FormData;
  headers?: {
    [index: string]: string;
  };
}

export const generateHttpConfig = ({
  url,
  method,
  allowCredentials,
  body,
  headers
}: HttpConfigArguments) => {
  let requestBody: BodyInit | undefined;

  if (body instanceof FormData) {
    requestBody = body;
  } else if (body !== undefined) {
    requestBody = JSON.stringify(body);
  }

  return {
    url,
    method,
    credentials: allowCredentials ? 'include' : undefined,
    withCredentials: allowCredentials,
    headers,
    body: requestBody
  };
};

export const convertFormDataToObject = (data: FormData) => {
  const dataObj: FormDataObj = {};

  data.forEach((value, key) => (dataObj[key] = value));

  return dataObj;
};

type RequestConfig = {
  url: string;
  method: HttpMethods;
  withCredentials?: boolean;
  headers?: {
    [key: string]: string;
  };
  body?: BodyInit;
};

export const sendHttpRequest = async (requestConfig: RequestConfig) => {
  let response = await fetch(requestConfig.url, {
    method: requestConfig.method,
    credentials: requestConfig.withCredentials ? 'include' : undefined,
    headers: requestConfig.headers ? requestConfig.headers : {},
    body: requestConfig.body ? requestConfig.body : null
  });

  let prettierResponse: HttpResponseDataObj;

  if (response.status === 204) {
    prettierResponse = {
      status: response.status,
      statusText: 'success'
    };

    return prettierResponse;
  }

  const parsedResponse = await response.json();

  prettierResponse = {
    status: response.status,
    statusText: parsedResponse.status
  };

  if (parsedResponse.message) {
    prettierResponse.message = parsedResponse.message;
  }

  if (parsedResponse.data) {
    prettierResponse.data = parsedResponse.data;
  }

  return prettierResponse;
};
