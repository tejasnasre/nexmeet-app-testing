import React, { useState } from 'react';
import { Alert, Text, View, AppState, TextInput, Pressable, Image } from 'react-native';
import { supabase } from '../../utils/supabase';
import { Stack } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Link } from 'expo-router';

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session) Alert.alert('Please check your inbox for email verification!');
    setLoading(false);
  }

  return (
    <View className="h-full w-full items-center justify-center gap-10 bg-white p-2">
      <Stack.Screen
        options={{
          title: 'Sigin',
          headerBackVisible: true,
          headerTitleStyle: { fontFamily: 'SpaceGrotesk' },
          headerTitleAlign: 'center',
          headerShown: false,
        }}
      />

      <Image
        style={{ height: 40, width: 150, resizeMode: 'contain' }}
        source={require('../../assets/nexmeet_logo.png')}
      />
      <Text className="font-SpaceGrotesk text-2xl text-gray-700">SignIn To Account</Text>

      <View className="gap-10">
        <View className="w-80 flex-row items-center gap-2 rounded-full border-2 border-black px-4">
          <MaterialIcons name="email" size={24} color="black" />
          <TextInput
            className="flex-1 font-SpaceGrotesk"
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View className="w-80 flex-row items-center gap-2 rounded-full border-2 border-black px-4">
          <MaterialIcons name="password" size={24} color="black" />
          <TextInput
            className="flex-1 font-SpaceGrotesk"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="password"
            autoCapitalize="none"
          />
        </View>
      </View>

      <View className="items-center justify-center gap-6">
        <Pressable
          disabled={loading}
          onPress={() => signInWithEmail()}
          className="flex-row items-center gap-4 rounded-full bg-black p-4">
          <Text className="font-SpaceGrotesk text-sm text-white">SignIn</Text>
        </Pressable>

        {/* <Text className="font-SpaceGrotesk text-sm">OR</Text> */}
        {/* <Pressable className="flex-row items-center gap-4 rounded-full bg-black p-4">
          <AntDesign name="google" size={15} color="white" />
          <Text className="font-SpaceGrotesk text-sm text-white">SignIn With Google</Text>
        </Pressable> */}
      </View>
      <Text className="font-SpaceGrotesk">
        Don't Have Account?{' '}
        <Link href="/signup" className="text-blue-500">
          Sign Up
        </Link>
      </Text>
    </View>
  );
}
