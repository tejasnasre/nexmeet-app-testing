import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import EventListItem from '~/components/EventListItem';
import { FlatList, View } from 'react-native';
import { supabase } from '~/utils/supabase';
import { eventlist } from '~/types/types';
import EventLoading from '~/components/Loaders/EventLoading';

export default function Events() {
  const [events, setEvents] = useState<eventlist[] | null>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      let { data: events, error } = await supabase.from('events').select('*');
      setEvents(events);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Events',
          headerTitleStyle: { fontFamily: 'SpaceGrotesk' },
          headerTitleAlign: 'center',
          headerShown: false,
        }}
      />
      <View className="bg-white pt-10">
        {loading ? (
          <FlatList
            className="bg-white"
            data={Array.from({ length: 8 })}
            keyExtractor={(_, index) => `skeleton-${index}`}
            renderItem={() => <EventLoading />}
          />
        ) : (
          <FlatList
            className="bg-white"
            data={events}
            renderItem={({ item }) => <EventListItem event={item} />}
          />
        )}
      </View>
    </>
  );
}
