import React, { useState, useEffect } from 'react';
import { supabase } from '~/utils/supabase';
import { View, Alert, Text, Image, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface Props {
  url: string | null;
  onUpload?: (filePath: string) => void;
}

export default function EventImage({ url, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [eventImageUrl, setEventImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('event_image').download(path);

      if (error) {
        throw error;
      }

      // console.log(data);
      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setEventImageUrl(fr.result as string);
      };
    } catch (error) {
      if (error instanceof Error) {
        // console.log('Error downloading image: ', error.message);
      }
    }
  }

  async function uploadEventImage() {
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
        .from('event_image')
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
    <>
      <View className="flex-col gap-4">
        {onUpload && (
          <Pressable
            onPress={uploadEventImage}
            disabled={uploading}
            className="flex-row items-center justify-center rounded-full bg-black p-3">
            <Text className="font-SpaceGrotesk text-white">
              {uploading ? 'Uploading ...' : 'Upload'}
            </Text>
          </Pressable>
        )}

        {eventImageUrl ? (
          <View className="h-full w-full">
            <Image
              source={{ uri: eventImageUrl }}
              accessibilityLabel="Event Image"
              className="h-full w-full"
              resizeMode="contain"
            />
          </View>
        ) : (
          <View className="mt-4 animate-pulse flex-col gap-3 p-2 px-4">
            {/* Top Section */}
            <View className="flex-row justify-between">
              {/* Skeleton for Image */}
              <View className="h-28 w-full rounded-xl bg-gray-300" />
            </View>
          </View>
        )}
      </View>
    </>
  );
}
