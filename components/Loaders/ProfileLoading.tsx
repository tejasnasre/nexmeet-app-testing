import { ActivityIndicator, View } from 'react-native';
import React from 'react';

const ProfileLoading = () => {
  return (
    <View className="items-center gap-4 pt-10">
      <View className="h-40 w-40 rounded-full bg-gray-300" />
      <View className="h-5 w-72 rounded-md bg-gray-300" />
      <View className="h-5 w-72 rounded-md bg-gray-300" />
      <View className="h-10 w-72 rounded-md bg-gray-300" />
      <View className="h-10 w-72 rounded-md bg-gray-300" />
    </View>
  );
};

export default ProfileLoading;
