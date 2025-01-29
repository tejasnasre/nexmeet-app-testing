import React, { useEffect } from 'react';
import { Keyboard, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const useKeyboardTabsHandler = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const defaultTabBarStyle = {
      display: 'flex',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      elevation: 0,
      backgroundColor: 'white',
      borderTopWidth: 1,
      borderTopColor: '#f4f4f4',
      height: 60,
    };

    // Handle keyboard show event
    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        navigation.setOptions({
          tabBarStyle: {
            ...defaultTabBarStyle,
            display: 'none',
          },
        });
      }
    );

    // Handle keyboard hide event
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        navigation.setOptions({
          tabBarStyle: {
            ...defaultTabBarStyle,
            display: 'flex',
          },
        });
      }
    );

    // Set initial tab bar style
    navigation.setOptions({
      tabBarStyle: defaultTabBarStyle,
    });

    // Cleanup subscriptions
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [navigation]);
};

export default useKeyboardTabsHandler;
