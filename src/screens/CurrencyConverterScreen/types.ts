export type CurrencyObject = {
  source_currency_code: String;
  destination_currency_code: String;
  source_currency_name: String;
  destination_currency_name: String;
};

export type CurrencyList = {
  [key: string]: CurrencyObject[];
};

export type SimplifiedCurrencyObject = {
  displayName: String;
  value: String;
  flag?: String;
};
