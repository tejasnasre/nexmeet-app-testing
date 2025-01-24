import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import EventListItem from '~/components/EventListItem';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { supabase } from '~/utils/supabase';
import { eventlist } from '~/types/types';
import EventLoading from '~/components/Loaders/EventLoading';
import * as Location from 'expo-location';
import ToastManager, { Toast } from 'toastify-react-native';

export default function Events() {
  const [events, setEvents] = useState<eventlist[] | null>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  // const fetchAllEvents = async () => {
  //   setLoading(true);
  //   let { data: events, error } = await supabase.from('events').select('*');
  //   setEvents(events);
  //   setLoading(false);
  // };

  const fetchNearbyEvents = async () => {
    if (!location) {
      return;
    }
    setLoading(true);
    const { data: events, error } = await supabase.rpc('nearby_events', {
      lat: location.coords.latitude,
      long: location.coords.longitude,
    });

    setEvents(events);
    setLoading(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNearbyEvents();
    // Simulate a network request or data fetch
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // Simulate a 2-second refresh
  };

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Toast.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  useEffect(() => {
    fetchNearbyEvents();
  }, [location]);

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
      <ToastManager />
      {loading ? (
        <FlatList
          className="bg-white py-16"
          data={Array.from({ length: 8 })}
          keyExtractor={(_, index) => `skeleton-${index}`}
          renderItem={() => <EventLoading />}
        />
      ) : events && events.length > 0 ? (
        <FlatList
          className="bg-white py-16"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <EventListItem event={item} />}
        />
      ) : (
        <View className="flex h-screen w-full items-center justify-center bg-white">
          <Text className="text-center font-SpaceGrotesk text-lg text-black">
            No events found near you
          </Text>
        </View>
      )}
    </>
  );
}
