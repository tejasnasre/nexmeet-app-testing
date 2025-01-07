import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { eventlist } from '../types/eventlist';
import dayjs from 'dayjs';
import { Link } from 'expo-router';

export interface EventListItemProps {
  event: eventlist;
}

const EventListItem: React.FC<EventListItemProps> = ({ event }) => {
  return (
    <>
      <Link href={`/${event.id}`} asChild>
        <Pressable className="mt-4 flex-col gap-3 p-2">
          <View className="flex-row justify-between">
            <View className="w-52 flex-col justify-center gap-2">
              <Text className="font-SpaceGrotesk font-semibold uppercase text-amber-600">
                {dayjs(event.datetime).format('ddd, MMM D, YYYY h:mm A')}
              </Text>
              <Text className="font-SpaceGrotesk text-xl" numberOfLines={2}>
                {event.title}
              </Text>
              <Text className="font-SpaceGrotesk text-gray-600" numberOfLines={1}>
                {event.location}
              </Text>
            </View>
            <View className="flex-col items-center justify-center">
              <Image
                className="h-28 w-44 rounded-xl object-cover"
                source={{
                  uri: event.image,
                }}
              />
            </View>
          </View>
          <View className="mr-6 flex-row justify-between gap-3">
            <Text className="font-SpaceGrotesk text-gray-400 ">16 Going</Text>
            <View className="flex-row items-center justify-center gap-4">
              <EvilIcons name="share-google" size={22} color="gray" />
              <FontAwesome name="bookmark" size={22} color="gray" />
            </View>
          </View>
        </Pressable>
      </Link>
    </>
  );
};

export default EventListItem;
