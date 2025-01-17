import { useState, useEffect } from 'react';
import { supabase } from '~/utils/supabase';
import { StyleSheet, View, Alert, Text, Image, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface Props {
  url: string | null;
  onUpload?: (filePath: string) => void;
}

export default function Avatar({ url, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);

      if (error) {
        throw error;
      }

      // console.log(data);
      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result as string);
      };
    } catch (error) {
      if (error instanceof Error) {
        // console.log('Error downloading image: ', error.message);
      }
    }
  }

  async function uploadAvatar() {
    try {
      setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict to only images
        allowsMultipleSelection: false, // Can only select one image
        allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
        quality: 1,
        exif: false, // We don't want nor need that data.
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        // console.log('User cancelled image picker.');
        return;
      }

      const image = result.assets[0];
      // console.log('Got image', image);

      if (!image.uri) {
        throw new Error('No image uri!'); // Realistically, this should never happen, but just in case...
      }

      const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());

      const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg';
      const path = `${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? 'image/jpeg',
        });

      if (uploadError) {
        throw uploadError;
      }

      if (onUpload) {
        onUpload(data.path);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <View className="flex-col gap-4">
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          accessibilityLabel="Avatar"
          //   style={[avatarSize, styles.avatar, styles.image]}
          className="h-40 w-40 rounded-full border-2 border-black"
        />
      ) : (
        <Image
          className="h-40 w-40 rounded-full border-2 border-black"
          source={require('../assets/dummy.png')}
        />
      )}

      {onUpload && (
        <Pressable
          onPress={uploadAvatar}
          disabled={uploading}
          className="flex-row items-center justify-center rounded-full bg-black p-3">
          <Text className="font-SpaceGrotesk text-white">
            {uploading ? 'Uploading ...' : 'Upload'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 5,
    overflow: 'hidden',
    maxWidth: '100%',
  },
  image: {
    objectFit: 'cover',
    paddingTop: 0,
  },
  noImage: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgb(200, 200, 200)',
    borderRadius: 5,
  },
});
