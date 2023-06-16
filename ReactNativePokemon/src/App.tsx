import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {API_URL, IMAGE_URL} from './constants';
import ListItem from './components/ListItem';

const numColumns = 2;

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
        const imagePath = `${IMAGE_URL}/${index}.png`;
        return {
          name: pokemon.name,
          image: imagePath,
        };
      }),
    );
    setPokemonList(prevList => [...prevList, ...pokemonData]);
    setLoading(false);
    setPage(prevPage => prevPage + 1);
  };

  const renderItem = ({item}: {item: Pokemon}) => {
    return <ListItem item={item} />;
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  };

  const keyExtractor = (_: any, index: number) => index.toString();

  const onEndReached = () => {
    loadPokemonList();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Pokédex</Text>
      </View>

      <FlatList
        data={pokemonList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={numColumns}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        style={styles.listStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    backgroundColor: '#c54549',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#fff',
  },
  loadingContainer: {
    paddingVertical: 20,
  },
  listStyle: {
    backgroundColor: '#2a282a',
  },
});

export default App;
