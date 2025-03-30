import React, { useEffect } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";

import TabNavigator from './javascript/navigation/TabNavigator';
import RepositoryDetailScreen from './javascript/screens/RepositoryDetailScreen';
import ContributorsScreen from './javascript/screens/ContributorsScreen';
import storage from './javascript/storage';
import { setTheme } from './javascript/redux/slice/theme';
import { useDispatch } from 'react-redux';

const Stack = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef();

function Main() {
    const dispatch = useDispatch();
    useEffect(() => {
        const theme = storage.getString('theme') as 'light' | 'dark';
        if (!theme) {
            storage.set('theme', 'light');
        }

        dispatch(setTheme({ theme: theme || 'light' }));
    }, []);

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Tabs" component={TabNavigator} />
                <Stack.Screen name="RepositoryDetail" component={RepositoryDetailScreen} />
                <Stack.Screen name="Contributors" component={ContributorsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Main;