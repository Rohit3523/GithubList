import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSelector } from 'react-redux';

import { MaterialColor, useTheme } from '../context/theme';
import { RootState } from '../redux/store';
import RepositoryItem from '../components/RepositoryItem';

const FavoritesScreen = () => {
    const theme = useTheme();
    const styles = useMemo(() => style(theme), [theme]);
    const favorites = useSelector((state: RootState) => state.favorites.items);

    return (
        <View style={styles.container}>
            {
                (favorites.length === 0) ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            No favorite repositories yet
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={favorites}
                        renderItem={({ item }) => <RepositoryItem repo={item} />}
                        keyExtractor={(item, index) => `${item.id}-${index}`}
                        contentContainerStyle={styles.listContainer}
                        keyboardDismissMode='on-drag'
                    />
                )
            }
        </View>
    );
};

const style = (theme: MaterialColor) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    listContainer: {
        padding: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
        color: theme.onSurfaceVariant,
    }
});

export default FavoritesScreen;
