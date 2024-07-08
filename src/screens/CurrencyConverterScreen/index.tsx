import {View, StyleSheet, Alert} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Dropdown from './components/Dropdown';
import {getCurrencyListHelper} from './utils';
import {CurrencyList, CurrencyObject, SimplifiedCurrencyObject} from './types';
import {countryFlags} from './constants';
import InterchangeArrow from './components/InterchangeArrow';

const CurrencyConverterScreen = () => {
  const [currencyList, setCurrencyList] = useState<CurrencyList>({});
  const [selectedSourceItem, setSelectedSourceItem] =
    useState<SimplifiedCurrencyObject | null>();
  const [selectedDestinationItem, setSelectedDestinationItem] =
    useState<SimplifiedCurrencyObject | null>();

  const getCurrencyList = useCallback(async () => {
    const response = (await getCurrencyListHelper()) as CurrencyList;
    if (Object.keys(response)?.length === 0) {
      Alert.alert('Something went wrong!');
    } else {
      setCurrencyList(response);
    }
  }, []);

  useEffect(() => {
    getCurrencyList();
  }, [getCurrencyList]);

  const transformedSourceList: SimplifiedCurrencyObject[] = useMemo(() => {
    const list = Object.keys(currencyList)?.map((key: string) => {
      const currencyObject = currencyList[key]?.[0];
      const newObject: SimplifiedCurrencyObject = {
        displayName: currencyObject.source_currency_name,
        value: key,
        flag: countryFlags[key] as String,
      };
      return newObject;
    });
    return list;
  }, [currencyList]);

  const onSourceCurrencyChange = useCallback(
    (item: SimplifiedCurrencyObject) => {
      setSelectedSourceItem(item);
      setSelectedDestinationItem(null);
    },
    [],
  );

  const onDestinationCurrencyChange = useCallback(
    (item: SimplifiedCurrencyObject) => {
      setSelectedDestinationItem(item);
    },
    [],
  );

  const transformedDestinationList = useMemo(() => {
    if (!selectedSourceItem) {
      return [];
    }
    const destinationCurrencyList = currencyList[selectedSourceItem?.value];
    const list = destinationCurrencyList?.map((item: CurrencyObject) => {
      return {
        displayName: item.destination_currency_name,
        value: item.destination_currency_code,
      };
    });
    return list;
  }, [currencyList, selectedSourceItem]);

  const isFlipValid = useMemo(() => {
    if (!selectedSourceItem || !selectedDestinationItem) {
      return false;
    }
    const destinationList = currencyList[selectedDestinationItem?.value];
    if (!destinationList) {
      return false;
    }
    const sourceObject = destinationList?.filter(
      (item: CurrencyObject) =>
        item.destination_currency_code === selectedSourceItem?.value,
    )?.[0];
    if (!sourceObject) {
      return false;
    }
    return true;
  }, [selectedDestinationItem, selectedSourceItem, currencyList]);

  const handleFlip = useCallback(() => {
    const destinationList: CurrencyObject[] =
      currencyList[selectedDestinationItem?.value];
    const newSourceObject: SimplifiedCurrencyObject = {
      value: destinationList[0].source_currency_code,
      displayName: destinationList[0].source_currency_name,
      flag: countryFlags[destinationList[0].source_currency_code],
    };
    const sourceObject = destinationList?.filter(
      (item: CurrencyObject) =>
        item.destination_currency_code === selectedSourceItem?.value,
    )?.[0];
    const newDestinationObject: SimplifiedCurrencyObject = {
      value: sourceObject.destination_currency_code,
      displayName: sourceObject.destination_currency_name,
    };
    setSelectedSourceItem(newSourceObject);
    setSelectedDestinationItem(newDestinationObject);
  }, [selectedDestinationItem, selectedSourceItem, currencyList]);

  return (
    <View>
      <Dropdown
        data={transformedSourceList}
        onSelect={onSourceCurrencyChange}
        allowSearch={false}
        initialSelectedItem={selectedSourceItem}
      />
      <View style={styles.container}>
        <InterchangeArrow isFlipValid={isFlipValid} handleFlip={handleFlip} />
      </View>

      <Dropdown
        data={transformedDestinationList}
        onSelect={onDestinationCurrencyChange}
        allowSearch={transformedDestinationList?.length > 10}
        initialSelectedItem={selectedDestinationItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CurrencyConverterScreen;
