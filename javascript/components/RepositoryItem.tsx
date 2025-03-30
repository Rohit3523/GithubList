import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { GithubRepo } from '../types/github';
import { addFavorite, removeFavorite } from '../redux/slice/favorites';
import { RootState } from '../redux/store';
import { MaterialColor, useTheme } from '../context/theme';

type RootStackParamList = {
  RepositoryDetail: { repo: GithubRepo };
};

type RepositoryDetailNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface RepositoryItemProps {
  repo: GithubRepo;
}

const RepositoryItem: React.FC<RepositoryItemProps> = ({ repo }) => {
  const theme = useTheme();
  const styles = useMemo(() => style(theme), [theme]);
  const navigation = useNavigation<RepositoryDetailNavigationProp>();
  
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const isFavorite = favorites.some(item => item.id === repo.id);

  const toggleFavorite = (event: any) => {
    event.stopPropagation();
    if (isFavorite) {
      dispatch(removeFavorite(repo.id));
    } else {
      dispatch(addFavorite(repo));
    }
  };

  const handlePress = () => {
    navigation.navigate('RepositoryDetail', { repo });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Image source={{ uri: repo.owner.avatar_url }} style={styles.avatar} />
        <View style={styles.titleContainer}>
          <Text style={styles.name} numberOfLines={1}>{repo.name}</Text>
          <Text style={styles.owner}>{repo.owner.login}</Text>
        </View>
        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
          <Icon 
            name={isFavorite ? 'star' : 'star-border'} 
            size={24} 
            color={isFavorite ? theme.primary : theme.onSurfaceVariant} 
          />
        </TouchableOpacity>
      </View>
      
      {repo.description && (
        <Text style={styles.description} numberOfLines={2}>
          {repo.description}
        </Text>
      )}
      
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Icon name="star-outline" size={16} color={theme.onSurfaceVariant} />
          <Text style={styles.statText}>
            {repo.stargazers_count.toLocaleString()}
          </Text>
        </View>
        
        <View style={styles.stat}>
          <Icon name="call-split" size={16} color={theme.onSurfaceVariant} />
          <Text style={styles.statText}>
            {repo.forks_count.toLocaleString()}
          </Text>
        </View>
        
        {repo.language && (
          <View style={styles.stat}>
            <Icon name="code" size={16} color={theme.onSurfaceVariant} />
            <Text style={styles.statText}>
              {repo.language}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const style = (theme: MaterialColor) => StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    backgroundColor: theme.surfaceContainer,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.onSurface,
  },
  owner: {
    fontSize: 14,
    color: theme.onSurfaceVariant,
  },
  favoriteButton: {
    padding: 4,
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: theme.onSurfaceVariant,
  },
  stats: {
    flexDirection: 'row',
    marginTop: 12,
    flexWrap: 'wrap',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  statText: {
    fontSize: 14,
    marginLeft: 4,
    color: theme.onSurfaceVariant,
  },
});

export default RepositoryItem;
