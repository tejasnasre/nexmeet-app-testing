import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import EventListItem from '~/components/EventListItem';
import { FlatList } from 'react-native';
import { supabase } from '~/utils/supabase';
import { eventlist } from '~/types/types';

export default function Events() {
  let [events, setEvents] = useState<eventlist[] | null>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      let { data: events, error } = await supabase.from('events').select('*');
      setEvents(events);
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
        }}
      />
      <FlatList
        className="bg-white"
        data={events}
        renderItem={({ item }) => <EventListItem event={item} />}
      />
    </>
  );
}
