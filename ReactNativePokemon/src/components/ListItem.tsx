import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import ImageColors from 'react-native-image-colors';

import {deviceWidth} from '../constants';

const numColumns = 2;
const itemWidth = deviceWidth / numColumns;

interface Pokemon {
  name: string;
  image: string;
}

const ListItem: React.FC<Pokemon> = ({item}) => {
  const [colors, setColors] = useState('#000000');

  useEffect(() => {
    const fetchColors = async () => {
      const imageColors = await ImageColors.getColors(item.image, {
        fallback: '#000000',
      });
      console.log('imageColors', imageColors);

      setColors(imageColors.dominant);
    };

    fetchColors();
  }, []);

  let capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <View style={[styles.item, {backgroundColor: colors}]}>
      <Image source={{uri: item.image}} style={styles.image} />
      <Text style={styles.name}>{capitalizeFirstLetter(item.name)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: itemWidth - 16,
    height: itemWidth - 16,
    resizeMode: 'contain',
  },
  name: {
    marginTop: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
});

export default ListItem;
