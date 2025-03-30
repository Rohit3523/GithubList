import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { RootState } from '../redux/store';
import { setTheme } from '../redux/slice/theme';
import { MaterialColor, useTheme } from '../context/theme';
import storage from '../storage';

const SettingsScreen = () => {
    const theme = useTheme();
    const styles = useMemo(() => style(theme), [theme]);
    const dispatch = useDispatch();
    const currentTheme = useSelector((state: RootState) => state.theme.theme);

    const toggleTheme = () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        dispatch(setTheme({ theme: newTheme }));

        storage.set('theme', newTheme);
    };

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Appearance</Text>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Icon name="dark-mode" size={24} color={theme.onSurfaceVariant} style={styles.settingIcon} />
                        <Text style={styles.settingLabel}>Dark Mode</Text>
                    </View>
                    <Switch
                        value={currentTheme === 'dark'}
                        onValueChange={toggleTheme}
                        trackColor={{ false: theme.surfaceContainerHighest, true: theme.primary }}
                        thumbColor={theme.surfaceContainer}
                    />
                </View>
            </View>
        </View>
    );
};

const style = (theme: MaterialColor) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.primary,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: theme.surfaceContainer,
        borderRadius: 12,
        marginBottom: 8,
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingIcon: {
        marginRight: 16,
    },
    settingLabel: {
        fontSize: 16,
        color: theme.onSurface,
    }
});

export default SettingsScreen;
