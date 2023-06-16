import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {API_URL, IMAGE_URL, deviceWidth} from './constants';
import {getColors} from 'react-native-image-colors';

const numColumns = 2;
const itemWidth = deviceWidth / numColumns;

interface Pokemon {
  name: string;
  image: string;
}

const App: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadPokemonList();
  }, []);

  const loadPokemonList = async () => {
    setLoading(true);
    const response = await fetch(API_URL);
    const data = await response.json();
    const results = data.results || [];
    const pokemonData = await Promise.all(
      results.map(async (pokemon: {name: string; url: string}) => {
        const index = pokemon.url.split('/').slice(-2, -1)[0];
        const image = `${IMAGE_URL}/${index}.png`;
        return {
          name: pokemon.name,
          image,
        };
      }),
    );
    setPokemonList(prevList => [...prevList, ...pokemonData]);
    setLoading(false);
    setPage(prevPage => prevPage + 1);
  };

  const renderItem = async ({item}: {item: Pokemon}) => (
    <View
      style={[
        styles.item,
        {
          backgroundColor: '#000',
        },
      ]}>
      <Image source={{uri: item.image}} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Text>Pokedex</Text>
      </View>
    );
  };

  const keyExtractor = (_: any, index: number) => index.toString();

  const getImageColor = (item: Pokemon) => {
    return getColors(item.image, {
      fallback: '#228B22',
      cache: true,
      key: item.image,
    }).then(colors => {
      // console.log('colors', colors);
      return colors.vibrant;
    });
    // return '#000000';
  };

  const onEndReached = () => {
    loadPokemonList();
  };

  return (
    <FlatList
      data={pokemonList}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={numColumns}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListHeaderComponent={renderHeader}
    />
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
  },
  loadingContainer: {
    paddingVertical: 20,
  },
  headerContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default App;
