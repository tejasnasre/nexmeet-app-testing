import { Stack } from 'expo-router';
import React from 'react';
import EventListItem from '~/components/EventListItem';
import events from '~/assets/events.json';
import { FlatList } from 'react-native';

export default function Events() {
  return (
    <>
      <Stack.Screen options={{ title: 'Events' }} />
      <FlatList data={events} renderItem={({ item }) => <EventListItem event={item} />} />
    </>
  );
}
