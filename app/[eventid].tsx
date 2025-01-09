import { Text, View, Image, Pressable } from 'react-native';
import React from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import events from '~/assets/events.json';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import dayjs from 'dayjs';

const eventPage = () => {
  const { eventid } = useLocalSearchParams();

  const event = events.find((e) => e.id === eventid);

  if (!event) {
    return <Text>Event Not Found</Text>;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: event.title,
          headerBackVisible: true,
          headerTitleStyle: { fontFamily: 'SpaceGrotesk' },
          headerTitleAlign: 'center',
        }}
      />
      <View className="gap-4 p-4 font-SpaceGrotesk">
        <Image className="aspect-video w-full rounded-md" source={{ uri: event.image }} />
        <Text className="font-SpaceGrotesk text-3xl">{event.title}</Text>
        <Text className="font-SpaceGrotesk text-xl">{event.description}</Text>
        <View className="flex-row items-start gap-4">
          <AntDesign name="calendar" size={24} color="gray" />
          <View className="flex-col gap-1">
            <Text className="font-SpaceGrotesk text-xl text-gray-500">
              {dayjs(event.datetime).format('ddd, D MMMM YYYY h:mm A')}
            </Text>
          </View>
        </View>
        <View className="flex-row gap-4">
          <Entypo name="location-pin" size={28} color="gray" />
          <Text className="font-SpaceGrotesk text-xl text-gray-500">{event.location}</Text>
        </View>
      </View>

      {/* Footer */}
      <View className="border-t-1 absolute bottom-0 left-0 right-0 flex-row items-center justify-between border border-gray-300 px-6 py-8">
        <Text className="font-SpaceGrotesk text-xl">Free</Text>
        <Pressable className="h-14 w-48 items-center justify-center rounded-xl bg-red-400 px-3">
          <Text className="font-SpaceGrotesk text-xl text-white">Join And RSVP</Text>
        </Pressable>
      </View>
    </>
  );
};

export default eventPage;
