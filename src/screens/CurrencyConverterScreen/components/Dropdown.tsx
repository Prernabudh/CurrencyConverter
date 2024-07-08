import React, {useState, useEffect, useCallback, memo} from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
} from 'react-native';
import {SimplifiedCurrencyObject} from '../types';
import ArrowDown from '../../../../assets/images/arrow-down.png';

type DropdownProps = {
  data: SimplifiedCurrencyObject[];
  onSelect: (item: SimplifiedCurrencyObject) => void;
  placeholder?: string;
  allowSearch?: boolean;
  initialSelectedItem?: SimplifiedCurrencyObject | null;
};

const Dropdown: React.FC<DropdownProps> = ({
  data,
  onSelect,
  placeholder,
  allowSearch,
  initialSelectedItem,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [selectedItem, setSelectedItem] = useState<
    SimplifiedCurrencyObject | null | undefined
  >(null);

  useEffect(() => {
    setSelectedItem(initialSelectedItem);
  }, [initialSelectedItem]);

  useEffect(() => {
    setFilteredData(
      data.filter(item => {
        return (
          item.displayName.toLowerCase().includes(searchText.toLowerCase()) ||
          item.value.toLowerCase().includes(searchText.toLowerCase())
        );
      }),
    );
  }, [searchText, data]);

  const handleSelect = useCallback(
    (item: SimplifiedCurrencyObject) => {
      setSelectedItem(item);
      onSelect(item);
      setModalVisible(false);
      setSearchText('');
    },
    [onSelect],
  );

  const keyExtractor = useCallback((item: SimplifiedCurrencyObject) => {
    return item?.value as string;
  }, []);

  const renderItem = useCallback(
    ({item}: {item: SimplifiedCurrencyObject}) => {
      const isSelected = selectedItem?.value === item?.value;
      return (
        <TouchableOpacity
          onPress={() => handleSelect(item)}
          style={[styles.item, isSelected ? styles.selectedRow : {}]}>
          {!!item?.flag && (
            <Image
              source={{uri: item?.flag as string}}
              style={styles.flagIcon}
            />
          )}
          <Text style={styles.itemText}>{item?.value}</Text>
          <Text style={styles.currencyName}>{item?.displayName}</Text>
        </TouchableOpacity>
      );
    },
    [handleSelect, selectedItem],
  );

  const onRequestClose = useCallback(() => {
    setModalVisible(false);
    setSearchText('');
  }, []);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.dropdown}>
        {selectedItem ? (
          <View style={styles.selectedItem}>
            {!!selectedItem?.flag && (
              <Image
                source={{uri: selectedItem?.flag as string}}
                style={styles.flagIcon}
              />
            )}
            <Text style={styles.itemText}>{selectedItem?.value}</Text>
          </View>
        ) : (
          <Text>{selectedItem || placeholder || 'Select an item'}</Text>
        )}
        <Image source={ArrowDown} style={styles.downArrow} />
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.bg}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Select Currency</Text>
            {allowSearch && (
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                value={searchText}
                onChangeText={setSearchText}
              />
            )}
            <FlatList
              data={filteredData}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
            />
            <Button title="Close" onPress={onRequestClose} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalContainer: {
    flex: 1,
    marginHorizontal: 20,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 6,
    marginVertical: 60,
  },
  searchInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 5,
  },
  item: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagIcon: {
    height: 30,
    width: 30,
  },
  itemText: {
    fontSize: 16,
    marginLeft: 12,
  },
  currencyName: {
    fontSize: 14,
    marginLeft: 12,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedRow: {
    backgroundColor: '#ADD8E6',
  },
  downArrow: {
    width: 10,
    height: 10,
  },
});

export default memo(Dropdown);
