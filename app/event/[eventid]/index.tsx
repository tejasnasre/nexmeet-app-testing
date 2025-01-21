import { Text, View, Image, Pressable, ActivityIndicator } from 'react-native';
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

  useEffect(() => {
    const fetcheventid = async () => {
      setLoading(true);
      let { data: events, error } = await supabase.from('events').select('*').eq('id', eventid);
      setEvent(events);

      const { data: attendeData } = await supabase
        .from('attendance')
        .select('user_id,event_id')
        .eq('user_id,', user.id)
        .eq('event_id', eventid)
        .single();

      setAttend(attendeData);
      setLoading(false);
    };
    fetcheventid();
  }, [eventid]);

  const joinevent = async () => {
    const { data, error } = await supabase
      .from('attendance')
      .insert({ user_id: user.id, event_id: eventid })
      .select()
      .single();

    setAttend(data);
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!event) {
    return <Text>Event Not Found!</Text>;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: event[0]?.title,
          headerBackVisible: true,
          headerTitleStyle: { fontFamily: 'SpaceGrotesk' },
          headerTitleAlign: 'center',
        }}
      />
      <View className="gap-4 p-4 font-SpaceGrotesk">
        <View className="h-96 w-96 rounded-md">
          <EventImage url={event[0]?.image_uri} />
        </View>
        <Text className="font-SpaceGrotesk text-3xl">{event[0]?.title}</Text>
        <Text className="font-SpaceGrotesk text-xl">{event[0]?.description}</Text>
        <View className="flex-row items-start gap-4">
          <AntDesign name="calendar" size={24} color="gray" />
          <View className="flex-col gap-1">
            <Text className="font-SpaceGrotesk text-xl text-gray-500">
              {dayjs(event[0]?.datetime).format('ddd, D MMMM YYYY h:mm A')}
            </Text>
          </View>
        </View>
        <View className="flex-row gap-4">
          <Entypo name="location-pin" size={28} color="gray" />
          <Text className="font-SpaceGrotesk text-xl text-gray-500">{event[0]?.location}</Text>
        </View>
      </View>

      {/* Footer */}
      <View className="border-t-1 absolute bottom-0 left-0 right-0 flex-row items-center justify-between border border-gray-300 px-6 py-8">
        <Text className="font-SpaceGrotesk text-xl">Free</Text>

        {attend ? (
          <>
            <Text className="font-SpaceGrotesk text-xl text-black">You Are Attending</Text>
          </>
        ) : (
          <Pressable
            onPress={() => joinevent()}
            className="h-14 w-48 items-center justify-center rounded-xl bg-red-400 px-3">
            <Text className="font-SpaceGrotesk text-xl text-white">Join And RSVP</Text>
          </Pressable>
        )}
      </View>
    </>
  );
};

export default eventPage;
