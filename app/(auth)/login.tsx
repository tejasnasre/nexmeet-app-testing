import React, { useState } from 'react';
import { Alert, Text, View, AppState, TextInput, Pressable } from 'react-native';
import { supabase } from '../../utils/supabase';
import { Stack } from 'expo-router';

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

export default function Auth() {
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
    <View className="h-screen w-full items-center justify-center gap-28 p-2">
      <Stack.Screen
        options={{
          title: 'Login',
          headerBackVisible: true,
          headerTitleStyle: { fontFamily: 'SpaceGrotesk' },
          headerTitleAlign: 'center',
        }}
      />
      <Text className="font-SpaceGrotesk text-3xl">Sign In Here</Text>

      <View className="gap-10">
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
          className="w-72 rounded-md border-2 border-black font-SpaceGrotesk"
        />

        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
          className="w-72 rounded-md border-2 border-black font-SpaceGrotesk"
        />
      </View>

      <View className="flex-row items-start justify-center gap-4">
        <Pressable
          disabled={loading}
          onPress={() => signInWithEmail()}
          className="rounded-md bg-red-400 px-4 py-2">
          <Text className="font-SpaceGrotesk text-white">Sign in</Text>
        </Pressable>

        <Pressable
          disabled={loading}
          onPress={() => signUpWithEmail()}
          className="rounded-md bg-red-400 px-4 py-2">
          <Text className="font-SpaceGrotesk text-white">Sign up</Text>
        </Pressable>
      </View>
    </View>
  );
}
