import React from 'react';
import { View, Text, Image } from 'react-native';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { eventlist } from '../types/eventlist';

export interface EventListItemProps {
  event: eventlist;
}

const EventListItem: React.FC<EventListItemProps> = ({ event }) => {
  return (
    <>
      <View className="mt-4 flex-col gap-3 p-2">
        <View className="flex-row">
          <View className="w-52 flex-col justify-center gap-2">
            <Text className="font-semibold uppercase text-amber-600">{event.datetime}</Text>
            <Text className="text-xl font-black" numberOfLines={2}>
              {event.title}
            </Text>
            <Text className="text-gray-600" numberOfLines={1}>
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
          <Text className="text-gray-400">16 Going</Text>
          <View className="flex-row items-center justify-center gap-4">
            <EvilIcons name="share-google" size={22} color="gray" />
            <FontAwesome name="bookmark" size={22} color="gray" />
          </View>
        </View>
      </View>
    </>
  );
};

export default EventListItem;
