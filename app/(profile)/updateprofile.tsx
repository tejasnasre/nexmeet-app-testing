import { StyleSheet, TextInput, Button, Text, Alert, View, Pressable } from 'react-native';
import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '~/contexts/AuthProvider';
import { supabase } from '~/utils/supabase';
import { Stack } from 'expo-router';
import Avatar from '~/components/Avatar';

const updateprofile = () => {
  const { session }: any = useAuth();

  const [loading, setLoading] = useState(true);
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

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
      <Stack.Screen
        options={{
          title: '',
          headerStyle: { backgroundColor: '#ffffff' },
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />

      <View className="h-full w-full items-center gap-8 bg-white pt-5">
        <Text className="font-SpaceGrotesk text-2xl">Update Profile</Text>
        <Avatar
          url={avatarUrl}
          onUpload={(url: string) => {
            setAvatarUrl(url);
            updateProfile({ username, website, avatar_url: url });
          }}
        />
        <TextInput
          onChangeText={(text) => setUsername(text)}
          value={username || ''}
          placeholder="username"
          autoCapitalize={'none'}
          className="w-72 rounded-md border-2 border-black font-SpaceGrotesk"
        />

        <TextInput
          onChangeText={(text) => setWebsite(text)}
          value={website || ''}
          placeholder="website"
          autoCapitalize={'none'}
          className="w-72 rounded-md border-2 border-black font-SpaceGrotesk"
        />

        <Pressable
          className="flex-row items-center gap-4 rounded-full bg-black p-4"
          onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })}
          disabled={loading}>
          <Text className="font-SpaceGrotesk text-sm text-white">
            {loading ? 'Loading ...' : 'Update'}
          </Text>
        </Pressable>
      </View>
    </>
  );
};

export default updateprofile;

const styles = StyleSheet.create({});
