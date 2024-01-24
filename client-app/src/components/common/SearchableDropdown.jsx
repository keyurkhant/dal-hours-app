import React, {useState, useEffect} from 'react';
import {Input, Box, FlatList, Pressable, Text} from 'native-base';
import InputType from './Input';

const SearchableDropdown = ({onItemSelect, fetchData, placeholder}) => {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (query.length > 0 && isFocused) {
      fetchData(query).then(data => {
        setItems(data);
        setVisible(true);
      });
    } else {
      setItems([]);
      setVisible(false);
    }
  }, [query, fetchData, isFocused]);

  return (
    <Box>
      <InputType
        placeholder={placeholder}
        value={query}
        onChangeText={setQuery}
        onFocus={() => {
          setIsFocused(true);
          setVisible(true);
        }}
      />
      {visible && (
        <Box
          maxH="200px"
          borderWidth="1"
          borderColor="coolGray.300"
          borderRadius="md"
          overflow="hidden">
          <FlatList
            data={items}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <Pressable
                onPress={() => {
                  onItemSelect(item);
                  setQuery(item.label);
                  setVisible(false);
                  setIsFocused(false);
                }}
                py="2"
                px="4"
                borderBottomWidth="1"
                borderColor="white">
                <Text color="white">{item.label}</Text>
              </Pressable>
            )}
          />
        </Box>
      )}
    </Box>
  );
};

export default SearchableDropdown;
