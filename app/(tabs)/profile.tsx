import { useState, useEffect } from 'react';
import { supabase } from '~/utils/supabase';
import { Text, View, Alert, Pressable } from 'react-native';
import React from 'react';
import { Link, Stack } from 'expo-router';
import { useAuth } from '~/contexts/AuthProvider';
import ProfileLoading from '~/components/Loaders/ProfileLoading';
import Avatar from '~/components/Avatar';
import { Toast } from 'toastify-react-native';
import CustomToast from '~/components/CustomToast';

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

      // console.log(data);
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

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Profile',
          headerTitleStyle: { fontFamily: 'SpaceGrotesk' },
          headerTitleAlign: 'center',
          headerShown: false,
        }}
      />

      {loading ? (
        <ProfileLoading />
      ) : (
        <View className="h-screen w-full items-center justify-around bg-white">
          <CustomToast />
          <View>
            <Text className="text-center font-SpaceGrotesk text-3xl">Profile</Text>
          </View>

          <View className="w-full items-center gap-8">
            <Avatar url={avatarUrl} />

            <Text className="font-SpaceGrotesk text-xl">{session?.user?.email}</Text>
            <Text className="font-SpaceGrotesk text-xl">{username}</Text>
            <Text className="font-SpaceGrotesk text-xl">{website}</Text>
          </View>

          <View className="flex-row gap-4">
            <Link
              className="flex-row items-center gap-4 rounded-full bg-black p-4 font-SpaceGrotesk text-sm  text-white"
              href={'/(profile)/updateprofile'}>
              Update Profile
            </Link>
            <Pressable
              className="flex-row items-center gap-4 rounded-full bg-black p-4"
              onPress={() => supabase.auth.signOut()}>
              <Text className="font-SpaceGrotesk text-sm text-white">Sign Out</Text>
            </Pressable>
          </View>
        </View>
      )}
    </>
  );
}
