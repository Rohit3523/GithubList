import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, ToastAndroid, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { MaterialColor, useTheme } from '../context/theme';
import { useDebounce } from '../hooks/useDebounce';
import { searchRepositories } from '../function/request';
import { GithubRepo } from '../types/github';
import RepositoryItem from '../components/RepositoryItem';

const HomeScreen = () => {
    const theme = useTheme();
    const styles = useMemo(() => style(theme), [theme]);

    const [searchQuery, setSearchQuery] = useState('');
    const [repositories, setRepositories] = useState<GithubRepo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    useEffect(() => {
        const fetchRepositories = async () => {
            if (!debouncedSearchQuery.trim()) {
                setRepositories([]);
                setPage(1);
                setIsLoadingMore(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await searchRepositories(debouncedSearchQuery);
                if (response.status === 403) {
                    ToastAndroid.show('Rate limit exceeded', ToastAndroid.LONG);
                    return;
                }

                setRepositories(response.data.items);
            } catch (err) {
                setError('Failed to fetch repositories');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRepositories();
    }, [debouncedSearchQuery]);

    const fetchMore = useCallback(async (page: number) => {
        if (!debouncedSearchQuery.trim() || !hasMoreData) return;

        try {
            setIsLoadingMore(true);
            const nextPage = page + 1;

            const response = await searchRepositories(debouncedSearchQuery, nextPage);

            if (response.status === 403) {
                ToastAndroid.show('Rate limit exceeded', ToastAndroid.LONG);
                return;
            }

            if (response.data.items.length === 0) {
                setHasMoreData(false);
            } else {
                setRepositories(prev => [...prev, ...response.data.items]);
                setPage(nextPage);
            }
            setIsLoadingMore(false);
        } catch (err) {
            console.error('Error fetching more repositories:', err);
        } finally {
            setIsLoadingMore(false);
        }
    }, [debouncedSearchQuery, page, isLoadingMore, hasMoreData]);

    const renderItem = ({ item }: { item: GithubRepo }) => (
        <RepositoryItem repo={item} />
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Icon name="search" size={24} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search GitHub repositories..."
                    placeholderTextColor={theme.onSurfaceVariant}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <Icon
                        name="close"
                        size={24}
                        style={styles.clearIcon}
                        onPress={() => setSearchQuery('')}
                    />
                )}
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            ) : error ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : repositories.length === 0 && debouncedSearchQuery.trim() ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.emptyText}>
                        No repositories found
                    </Text>
                </View>
            ) : repositories.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.emptyText}>
                        Search for GitHub repositories
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={repositories}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    contentContainerStyle={styles.listContainer}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        fetchMore(page + 1);
                    }}
                    ListFooterComponent={isLoadingMore ? <ActivityIndicator size="small" color={theme.primary} /> : null}
                    keyboardDismissMode='on-drag'
                />
            )}
        </View>
    );
};

const style = (theme: MaterialColor) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 16,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 56,
        backgroundColor: theme.surfaceContainer,
    },
    searchIcon: {
        marginRight: 8,
        color: theme.onSurfaceVariant,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        height: '100%',
        color: theme.onSurface,
    },
    clearIcon: {
        padding: 4,
        color: theme.onSurfaceVariant,
    },
    listContainer: {
        padding: 16,
        paddingTop: 0,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        color: theme.onSurfaceVariant,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        color: theme.error,
    },
});

export default HomeScreen;
