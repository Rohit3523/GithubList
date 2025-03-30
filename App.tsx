import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './javascript/context/theme';
import { Provider as ReduxProvider } from 'react-redux';
import store from './javascript/redux/store';
import Main from './Main';
import NetworkBanner from './javascript/components/Network';

function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ReduxProvider store={store}>
                <ThemeProvider>
                    <Main />
                    <NetworkBanner />
                </ThemeProvider>
            </ReduxProvider>
        </GestureHandlerRootView>
    )
}

export default App;