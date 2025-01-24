import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { eventlist } from '../types/types';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import { supabase } from '~/utils/supabase';
import EventImage from './EventImage';

export interface EventListItemProps {
  event: eventlist;
}

const EventListItem: React.FC<EventListItemProps> = ({ event }) => {
  const [attendees, setAttendees] = useState(0);

  useEffect(() => {
    const fetchAttendees = async () => {
      const { count, error } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event.id);

      setAttendees(count ?? 0);
    };

    fetchAttendees();
  }, [event.id]);

  return (
    <>
      <Link href={`/event/${event.id}`} asChild>
        <Pressable className="mt-4 flex-col gap-8 p-2 px-4">
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
              <View className="h-28 w-44 rounded-xl">
                <EventImage url={event.image_uri} />
              </View>
            </View>
          </View>
          <View className="mr-6 flex-row justify-between gap-3">
            <Text className="font-SpaceGrotesk text-gray-400 ">
              {attendees} Going {'  '} ✈ {Math.round((event.dist_meters ?? 0) / 1000)} km away{' '}
            </Text>

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
