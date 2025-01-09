import { useState, useEffect } from 'react';
import { supabase } from '~/utils/supabase';
import { Button, TextInput, Text, View, Alert, Image } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '~/contexts/AuthProvider';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const { session }: any = useAuth();

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string;
    website: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <View className="h-screen w-full items-center gap-10 bg-white py-10">
        <Stack.Screen
          options={{
            title: 'Profile',
            headerTitleStyle: { fontFamily: 'SpaceGrotesk' },
            headerTitleAlign: 'center',
          }}
        />

        <Image
          className="h-40 w-40 rounded-full"
          source={{
            uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          }}
        />

        <Text className="font-SpaceGrotesk text-2xl">{session?.user?.email}</Text>
        <Text className="font-SpaceGrotesk text-2xl">{username}</Text>
        <Text className="font-SpaceGrotesk text-2xl">{website}</Text>

        <TextInput
          onChangeText={(text) => setUsername(text)}
          value={username || ''}
          placeholder="username"
          autoCapitalize={'none'}
          className="w-72 rounded-md border-2 border-black font-SpaceGrotesk"
        />

        <View>
          <TextInput
            onChangeText={(text) => setWebsite(text)}
            value={website || ''}
            placeholder="website"
            autoCapitalize={'none'}
            className="w-72 rounded-md border-2 border-black font-SpaceGrotesk"
          />
        </View>

        <View>
          <Button
            title={loading ? 'Loading ...' : 'Update'}
            onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })}
            disabled={loading}
          />
        </View>

        <View>
          <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
        </View>
      </View>
    </>
  );
}
