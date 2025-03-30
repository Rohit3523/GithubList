import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, ToastAndroid, FlatList } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { MaterialColor, useTheme } from '../context/theme';
import { getRepositoryContributors } from '../function/request';
import { GithubContributor } from '../types/contributor';

type RootStackParamList = {
    Contributors: { owner: string; repo: string; repoName: string };
};

type ContributorsRouteProp = RouteProp<RootStackParamList, 'Contributors'>;
type ContributorsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ContributorsScreen = () => {
    const theme = useTheme();
    const styles = useMemo(() => style(theme), [theme]);
    const route = useRoute<ContributorsRouteProp>();
    const navigation = useNavigation<ContributorsNavigationProp>();
    const { owner, repo, repoName } = route.params;

    const [contributors, setContributors] = useState<GithubContributor[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);

    useEffect(() => {
        fetchContributors();
    }, []);

    const fetchContributors = async () => {
        try {
            setLoading(true);
            const response = await getRepositoryContributors(owner, repo, 1, 20);

            if (response.status === 403) {
                ToastAndroid.show('Rate limit exceeded. Please try again later.', ToastAndroid.LONG);
                return;
            }

            setContributors(response.data);
            setHasMoreData(response.data.length === 20);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMoreContributors = useCallback(async () => {
        if (isLoadingMore || !hasMoreData) return;

        try {
            setIsLoadingMore(true);
            const nextPage = page + 1;

            const response = await getRepositoryContributors(owner, repo, nextPage, 20);

            if (response.status === 403) {
                ToastAndroid.show('Rate limit exceeded. Please try again later.', ToastAndroid.LONG);
                return;
            }

            if (response.data.length === 0) {
                setHasMoreData(false);
            } else {
                setContributors(prev => [...prev, ...response.data]);
                setPage(nextPage);
            }
        } catch (err) {
            console.error('Error fetching more contributors:', err);
        } finally {
            setIsLoadingMore(false);
        }
    }, [owner, repo, page, isLoadingMore, hasMoreData]);

    const renderItem = ({ item }: { item: GithubContributor }) => (
        <View style={styles.contributorItem}>
            <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
            <View style={styles.contributorInfo}>
                <Text style={styles.username}>{item.login}</Text>
                <Text style={styles.contributions}>
                    {item.contributions} {item.contributions === 1 ? 'contribution' : 'contributions'}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color={theme.onSurface} />
                </TouchableOpacity>
                <Text style={styles.title}>Contributors to {repoName}</Text>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            ) : contributors.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.emptyText}>No contributors found</Text>
                </View>
            ) : (
                <FlatList
                    data={contributors}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    contentContainerStyle={styles.listContainer}
                    onEndReachedThreshold={0.5}
                    onEndReached={fetchMoreContributors}
                    ListFooterComponent={isLoadingMore ? (
                        <ActivityIndicator size="small" color={theme.primary} style={styles.footerLoader} />
                    ) : null}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: theme.surfaceContainer,
        borderBottomWidth: 1,
        borderBottomColor: theme.outlineVariant,
    },
    backButton: {
        marginRight: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.onSurface,
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        color: theme.error,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        color: theme.onSurfaceVariant,
    },
    listContainer: {
        padding: 16,
    },
    contributorItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: theme.surfaceContainer,
        borderRadius: 12,
        marginBottom: 8,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    contributorInfo: {
        marginLeft: 12,
        flex: 1,
    },
    username: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.onSurface,
    },
    contributions: {
        fontSize: 14,
        color: theme.onSurfaceVariant,
        marginTop: 4,
    },
    footerLoader: {
        paddingVertical: 20,
    },
});

export default ContributorsScreen;
