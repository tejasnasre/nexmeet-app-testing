import {
  Text,
  View,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import dayjs from 'dayjs';
import { supabase } from '~/utils/supabase';
import { eventlist } from '~/types/types';
import { useAuth } from '~/contexts/AuthProvider';
import EventImage from '~/components/EventImage';

const eventPage = () => {
  const { eventid } = useLocalSearchParams();
  const { user }: any = useAuth();
  const [event, setEvent] = useState<eventlist[] | null>([]);
  const [attend, setAttend] = useState<{ user_id: any; event_id: any } | null>(null);
  const [loading, setLoading] = useState(false);
  const { width, height } = Dimensions.get('window');
  const isPortrait = height > width;

  useEffect(() => {
    const fetcheventid = async () => {
      setLoading(true);
      let { data: events } = await supabase.from('events').select('*').eq('id', eventid);
      setEvent(events);

      const { data: attendeData } = await supabase
        .from('attendance')
        .select('user_id,event_id')
        .eq('user_id', user.id)
        .eq('event_id', eventid)
        .single();

      setAttend(attendeData);
      setLoading(false);
    };
    fetcheventid();
  }, [eventid]);

  const joinevent = async () => {
    const { data } = await supabase
      .from('attendance')
      .insert({ user_id: user.id, event_id: eventid })
      .select()
      .single();
    setAttend(data);
  };

  if (loading) return <ActivityIndicator />;
  if (!event) return <Text>Event Not Found!</Text>;

  return (
    <SafeAreaView className="flex h-full w-full flex-col justify-evenly bg-white">
      <Stack.Screen
        options={{
          title: event[0]?.title,
          headerBackVisible: true,
          headerTitleStyle: { fontFamily: 'SpaceGrotesk' },
          headerTitleAlign: 'center',
        }}
      />
      <View className="h-96 w-full p-4">
        <EventImage url={event[0]?.image_uri} />
      </View>
      <View className="flex flex-col gap-4 p-4">
        <Text className="font-SpaceGrotesk text-xl">{event[0]?.title}</Text>
        <Text className="font-SpaceGrotesk">{event[0]?.description}</Text>
        <View className="flex flex-row gap-4">
          <AntDesign name="calendar" size={24} color="gray" />
          <Text className="font-SpaceGrotesk">
            {dayjs(event[0]?.datetime).format('ddd, D MMMM YYYY h:mm A')}
          </Text>
        </View>
        <View className="flex flex-row gap-4">
          <Entypo name="location-pin" size={28} color="gray" />
          <Text className="font-SpaceGrotesk">{event[0]?.location_name}</Text>
        </View>
      </View>
      <View className="flex w-full flex-row items-center justify-around">
        <Text className="font-SpaceGrotesk text-xl">Free</Text>
        {attend ? (
          <Text className="font-SpaceGrotesk">You Are Attending</Text>
        ) : (
          <Pressable onPress={joinevent} className="rounded-md bg-black p-4">
            <Text className="font-SpaceGrotesk text-white">Join And RSVP</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

export default eventPage;
