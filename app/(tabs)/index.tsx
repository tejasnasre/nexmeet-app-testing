import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import EventListItem from '~/components/EventListItem';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { supabase } from '~/utils/supabase';
import { eventlist } from '~/types/types';
import EventLoading from '~/components/Loaders/EventLoading';

export default function Events() {
  const [events, setEvents] = useState<eventlist[] | null>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    let { data: events, error } = await supabase.from('events').select('*');
    setEvents(events);
    setLoading(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
    // Simulate a network request or data fetch
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // Simulate a 2-second refresh
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
          headerTitleStyle: { fontFamily: 'SpaceGrotesk' },
          headerTitleAlign: 'center',
          headerShown: false,
        }}
      />
      <FlatList
        className="bg-white py-16"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        data={loading ? (Array.from({ length: 8 }) as eventlist[]) : events || []}
        keyExtractor={(_, index) => `skeleton-${index}`}
        renderItem={({ item }: { item: eventlist }) =>
          loading ? (
            <EventLoading />
          ) : events && events.length > 0 ? (
            <EventListItem event={item} />
          ) : (
            <View className="flex h-screen w-full items-center justify-center">
              <Text className="text-center font-SpaceGrotesk text-lg text-black">
                No events found
              </Text>
            </View>
          )
        }
      />
    </>
  );
}
