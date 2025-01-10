import { Pressable, Text, View } from 'react-native';
import React from 'react';
import { Link, Stack } from 'expo-router';
import { Image } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const welcomepage = () => {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Welcome Page',
          headerBackVisible: true,
          headerTitleStyle: { fontFamily: 'SpaceGrotesk' },
          headerTitleAlign: 'center',
          headerShown: false,
        }}
      />
      <View className="h-full w-full items-center justify-center gap-8">
        <Image className="h-80 w-80" source={require('../../assets/welcome_img.png')} />
        <Image
          style={{ height: 40, width: 150, resizeMode: 'contain' }}
          source={require('../../assets/nexmeet_logo.png')}
        />
        <View className="items-center justify-center gap-6">
          <Pressable className="flex-row items-center  gap-4 rounded-full bg-black p-4">
            <AntDesign name="google" size={15} color="white" />
            <Text className="font-SpaceGrotesk text-sm text-white">Login With Google</Text>
          </Pressable>
          <Text className="font-SpaceGrotesk text-xl">OR</Text>
          <Link href="/signin" asChild>
            <Pressable className="flex-row items-center gap-4 rounded-full bg-black p-4">
              <MaterialIcons name="password" size={15} color="white" />
              <Text className="font-SpaceGrotesk text-sm text-white">Sign In With Password</Text>
            </Pressable>
          </Link>
        </View>
        <Text className="font-SpaceGrotesk">
          Don't Have Account?{' '}
          <Link href="/signup" className="text-blue-500">
            Sign Up
          </Link>
        </Text>
      </View>
    </>
  );
};

export default welcomepage;
