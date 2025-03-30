import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MaterialColor, useTheme } from '../context/theme';

const NetworkBanner = () => {
  const theme = useTheme();
  const styles = style(theme);
  const [isConnected, setIsConnected] = useState(true);
  const translateY = new Animated.Value(-60);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected === true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isConnected) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: -60,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isConnected]);

  if (isConnected) {
    return null;
  }

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY }] }
      ]}
    >
      <Icon name="wifi-off" size={24} color={theme.onError} />
      <Text style={styles.text}>No internet connection</Text>
    </Animated.View>
  );
};

const style = (theme: MaterialColor) => StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: theme.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    zIndex: 1000,
  },
  text: {
    color: theme.onError,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default NetworkBanner;
