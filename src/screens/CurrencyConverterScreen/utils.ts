import {request} from '../../network/apiManager';
import {REQUEST_METHODS} from '../../network/constants';

export const getCurrencyListHelper = async () => {
  try {
    const response = await request({
      url: 'https://www.instarem.com/api/v1/public/currency/pair?source_currency=AUD,HKD,MYR,SGD,USD,EUR,INR,GBP,CAD',
      method: REQUEST_METHODS.GET,
    });
    if (response.success && response.data) {
      return response.data;
    }
    return {};
  } catch (err) {
    return {};
  }
};
