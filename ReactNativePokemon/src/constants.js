import {Dimensions} from 'react-native';

export const API_URL =
  'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';
export const IMAGE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';
export const deviceWidth = Dimensions.get('window').width;
export const deviceHeight = Dimensions.get('window').height;
