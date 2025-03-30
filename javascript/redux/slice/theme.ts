import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
    theme: "light" | "dark";
}

const initialState: InitialState = {
    theme: "light"
};

export const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme: (state, theme: PayloadAction<InitialState>) => {
            state.theme = theme.payload.theme;

            return state;
        }
    }
});

export const { setTheme } = themeSlice.actions;

export const selectTheme = (state: InitialState) => state.theme;

export default themeSlice.reducer;