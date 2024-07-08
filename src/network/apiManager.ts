import axios from 'axios';
import {REQUEST_METHODS} from './constants';

type RequestParams = {
  url: string;
  method: (typeof REQUEST_METHODS)[keyof typeof REQUEST_METHODS];
  data?: object;
};

type Response = {
  success: boolean;
  data?: object;
};

export const request = async ({
  url,
  method,
  data,
}: RequestParams): Promise<Response> => {
  try {
    const response = await axios({
      url,
      method,
      data,
    });
    const output: Response = response?.data;
    return output;
  } catch (err) {
    console.log('error is', err);
    return {success: false};
  }
};
