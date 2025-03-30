import { useState, useEffect, createContext, useContext } from "react";
import materialDynamicColors from "material-dynamic-colors";
import { StatusBar, Platform, useColorScheme, ColorSchemeName } from "react-native";
import { IMaterialDynamicColorsTheme, IMaterialDynamicColorsThemeColor } from "material-dynamic-colors/src/cdn/interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

type MaterialColor = IMaterialDynamicColorsThemeColor;

interface state {
    theme: IMaterialDynamicColorsThemeColor;
    themeSource: string;
}

const defaultStyle = { "background": "#f2f7ff", "error": "#ba1a1a", "errorContainer": "#ffdad6", "inputContainer": "#f5f5f5", "inverseOnSurface": "#f2f0f4", "inversePrimary": "#acc7ff", "inverseSurface": "#2f3033", "onBackground": "#1b1b1f", "onError": "#ffffff", "onErrorContainer": "#410002", "onPrimary": "#ffffff", "onPrimaryContainer": "#001a40", "onSecondary": "#ffffff", "onSecondaryContainer": "#131c2c", "onSurface": "#1b1b1f", "onSurfaceVariant": "#44474f", "onTertiary": "#ffffff", "onTertiaryContainer": "#29132e", "outline": "#e0e0e0", "outlineVariant": "#c4c6d0", "primary": "#005bbf", "primaryContainer": "#d7e2ff", "scrim": "#000000", "secondary": "#565e71", "secondaryContainer": "#dae2f9", "shadow": "#000000", "surface": "#faf9fd", "surfaceBright": "#faf9fd", "surfaceContainer": "#ffffff", "surfaceContainerHigh": "#e9e7ec", "surfaceContainerHighest": "#e3e2e6", "surfaceContainerLow": "#f5f3f7", "surfaceContainerLowest": "#ffffff", "surfaceDim": "#dbd9dd", "surfaceVariant": "#e1e2ec", "tertiary": "#715574", "tertiaryContainer": "#fbd7fc" }

async function createTheme(sourceColor: string, currentTheme: ColorSchemeName) {
    const colors = await materialDynamicColors(sourceColor) as unknown as IMaterialDynamicColorsTheme;

    colors.light = {
        ...colors.light,
        background: "#f2f7ff",
        surfaceContainer: "#ffffff",
        outline: "#e0e0e0",
        surface: "#faf9fd"
    }

    colors.dark = {
        ...colors.dark,
        surfaceContainer: "#2b2d31",
        outline: "#3c3e44",
        background: "#1c1d22"
    }

    return {
        theme: colors[currentTheme || 'light'],
        sourceColor
    }
}

const ThemeContext = createContext<state>({
    theme: defaultStyle,
    themeSource: "light"
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const sourceColor = "#007CFF";
    const currentTheme = useSelector((state: RootState) => state.theme.theme, (prev, next) => prev === next) as 'light' | 'dark';

    const [theme, setTheme] = useState<state>({
        theme: defaultStyle,
        themeSource: "light"
    });
    const currentSystemTheme = useColorScheme();

    useEffect(() => {
        createTheme(sourceColor, currentTheme).then((res) => {
            setTheme({
                theme: res.theme,
                themeSource: currentTheme
            });
        });
    }, [sourceColor, currentTheme, currentSystemTheme]);

    useEffect(() => {
        if (theme.theme && Platform.OS === 'android') {
            StatusBar.setBackgroundColor(theme.theme?.background);
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={theme}>
            <StatusBar backgroundColor={theme.theme?.surface} barStyle={currentTheme === 'light' ? 'dark-content' : 'light-content'} />
            {
                (theme.theme !== undefined) ? children : null
            }
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const theme = useContext(ThemeContext);

    return theme.theme
};

export const currentThemeSource = () => {
    const theme = useContext(ThemeContext);

    if (!theme.themeSource) {
        throw new Error('ThemeSource is null');
    }

    return theme.themeSource;
};

export type { MaterialColor };