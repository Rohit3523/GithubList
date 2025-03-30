import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking, ToastAndroid } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';

import { GithubRepo } from '../types/github';
import { MaterialColor, useTheme } from '../context/theme';
import { addFavorite, removeFavorite } from '../redux/slice/favorites';
import { RootState } from '../redux/store';

type RootStackParamList = {
    RepositoryDetail: { repo: GithubRepo };
    Contributors: { owner: string; repo: string; repoName: string };
};

type RepositoryDetailRouteProp = RouteProp<RootStackParamList, 'RepositoryDetail'>;
type RepositoryDetailNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RepositoryDetailScreen = () => {
    const theme = useTheme();
    const styles = useMemo(() => style(theme), [theme]);
    const navigation = useNavigation<RepositoryDetailNavigationProp>();
    const route = useRoute<RepositoryDetailRouteProp>();
    const { repo } = route.params;

    const dispatch = useDispatch();
    const favorites = useSelector((state: RootState) => state.favorites.items);
    const isFavorite = favorites.some(item => item.id === repo.id);

    const toggleFavorite = () => {
        if (isFavorite) {
            dispatch(removeFavorite(repo.id));
        } else {
            dispatch(addFavorite(repo));
        }
    };

    const handleViewContributors = () => {
        navigation.navigate('Contributors', {
            owner: repo.owner.login,
            repo: repo.name,
            repoName: repo.full_name
        });
    };

    const handleOpenRepo = async () => {
        try {
            await Linking.openURL(repo.html_url);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color={theme.onSurface} />
                </TouchableOpacity>
                <Image source={{ uri: repo.owner.avatar_url }} style={styles.avatar} />
                <View style={styles.ownerInfo}>
                    <Text style={styles.ownerName}>{repo.owner.login}</Text>
                </View>
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={toggleFavorite}
                >
                    <Icon
                        name={isFavorite ? 'star' : 'star-border'}
                        size={24}
                        color={isFavorite ? theme.primary : theme.onSurfaceVariant}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.repoInfo}>
                <Text style={styles.repoName}>{repo.name}</Text>
                {repo.description && (
                    <Text style={styles.description}>{repo.description}</Text>
                )}
            </View>

            <View style={styles.infoList}>
                <View style={styles.infoItem}>
                    <View style={styles.infoIconContainer}>
                        <Icon name="star" size={24} color={theme.primary} />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Stars</Text>
                        <Text style={styles.infoValue}>{repo.stargazers_count.toLocaleString()}</Text>
                    </View>
                </View>

                <View style={styles.infoItem}>
                    <View style={styles.infoIconContainer}>
                        <Icon name="call-split" size={24} color={theme.primary} />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Forks</Text>
                        <Text style={styles.infoValue}>{repo.forks_count.toLocaleString()}</Text>
                    </View>
                </View>

                {repo.language && (
                    <>
                        <View style={styles.infoItem}>
                            <View style={styles.infoIconContainer}>
                                <Icon name="code" size={24} color={theme.primary} />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Language</Text>
                                <Text style={styles.infoValue}>{repo.language}</Text>
                            </View>
                        </View>
                    </>
                )}

                <View style={styles.infoItem}>
                    <View style={styles.infoIconContainer}>
                        <Icon name="update" size={24} color={theme.primary} />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Last Updated</Text>
                        <Text style={styles.infoValue}>
                            {new Date(repo.updated_at).toLocaleDateString()}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoItem}>
                    <View style={styles.infoIconContainer}>
                        <Icon name="link" size={24} color={theme.primary} />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Repository URL</Text>
                        <Text style={styles.infoValue} numberOfLines={1}>{repo.html_url}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={handleViewContributors}
                >
                    <Icon name="people" size={24} color={theme.onPrimary} />
                    <Text style={styles.primaryButtonText}>View Contributors</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={handleOpenRepo}
                >
                    <Icon name="open-in-browser" size={24} color={theme.onPrimary} />
                    <Text style={styles.primaryButtonText}>Open Repository</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
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
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: theme.surfaceContainer,
        borderBottomWidth: 1,
        borderBottomColor: theme.outlineVariant,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    ownerInfo: {
        marginLeft: 12,
        flex: 1,
    },
    favoriteButton: {
        padding: 8,
    },
    ownerName: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.onSurface,
    },
    repoInfo: {
        padding: 16,
    },
    repoName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.onSurface,
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: theme.onSurfaceVariant,
        lineHeight: 24,
    },
    infoList: {
        marginTop: 5,
        marginHorizontal: 16,
        overflow: 'hidden',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: theme.surfaceContainer,
        marginBottom: 10,
        borderRadius: 12,
    },
    infoIconContainer: {
        width: 40,
        alignItems: 'center',
    },
    infoContent: {
        flex: 1,
        marginLeft: 16,
    },
    infoLabel: {
        fontSize: 14,
        color: theme.onSurfaceVariant,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
        color: theme.onSurface,
        marginTop: 2,
    },
    buttonContainer: {
        margin: 16,
        gap: 12,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
    },
    primaryButton: {
        backgroundColor: theme.primary,
    },
    primaryButtonText: {
        color: theme.onPrimary,
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
});

export default RepositoryDetailScreen;
