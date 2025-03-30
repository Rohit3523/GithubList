import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GithubRepo } from '../../types/github';
import storage from '../../storage';

interface FavoritesState {
  items: GithubRepo[];
}

const STORAGE_KEY = 'favorites';

const loadFavoritesFromStorage = (): GithubRepo[] => {
  const storedFavorites = storage.getString(STORAGE_KEY);
  if (storedFavorites) {
    return JSON.parse(storedFavorites);
  }
  return [];
};

const initialState: FavoritesState = {
  items: loadFavoritesFromStorage(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<GithubRepo>) => {
      const exists = state.items.some(item => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
        storage.set(STORAGE_KEY, JSON.stringify(state.items));
      }
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      storage.set(STORAGE_KEY, JSON.stringify(state.items));
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
