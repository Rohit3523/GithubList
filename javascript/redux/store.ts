import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slice/theme";
import favoritesReducer from "./slice/favorites";

const store = configureStore({
    reducer: {
        theme: themeReducer,
        favorites: favoritesReducer
    }
});

export default store;

export type Store = typeof store;
export type RootState = ReturnType<Store["getState"]>;
export type AppDispatch = Store["dispatch"];