import { StyleSheet, View } from 'react-native';
import React from 'react';

const EventLoading = () => {
  return (
    <>
      <View className="mt-4 animate-pulse flex-col gap-3 p-2 px-4">
        {/* Top Section */}
        <View className="flex-row justify-between">
          <View className="w-52 flex-col justify-center gap-2">
            {/* Skeleton for Date */}
            <View className="h-4 w-40 rounded-md bg-gray-300" />

            {/* Skeleton for Title */}
            <View className="h-6 w-32 rounded-md bg-gray-300" />

            {/* Skeleton for Location */}
            <View className="h-4 w-28 rounded-md bg-gray-300" />
          </View>

          {/* Skeleton for Image */}
          <View className="h-28 w-44 rounded-xl bg-gray-300" />
        </View>

        {/* Bottom Section */}
        <View className="mr-6 flex-row justify-between gap-3">
          {/* Skeleton for "Going" text */}
          <View className="h-4 w-24 rounded-md bg-gray-300" />

          {/* Skeleton for Icons */}
          <View className="flex-row items-center gap-4">
            <View className="h-5 w-5 rounded-full bg-gray-300" />
            <View className="h-5 w-5 rounded-full bg-gray-300" />
          </View>
        </View>
      </View>
    </>
  );
};

export default EventLoading;

const styles = StyleSheet.create({});
