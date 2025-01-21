import { TextInput, Text, SafeAreaView, View, Pressable, ScrollView } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, Stack } from 'expo-router';
import { supabase } from '~/utils/supabase';
import { useAuth } from '~/contexts/AuthProvider';
import { Toast } from 'toastify-react-native';
import CustomToast from '~/components/CustomToast';
import EventImage from '~/components/EventImage';

const createevent = () => {
  const { user }: any = useAuth();

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventImageUrl, setEventImageUrl] = useState('');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const createEvent = async () => {
    // console.log(title, description, date);
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          title,
          description,
          datetime: date.toISOString(),
          image_uri: eventImageUrl,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      Toast.error('Error creating event');
      setLoading(false);
    }

    setTitle('');
    setDescription('');
    setDate(new Date());
    setEventImageUrl('');

    if (data) {
      Toast.success('Successfully created event');
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push(`/event/${data.id}`);
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Create Event',
          headerTitleStyle: { fontFamily: 'SpaceGrotesk' },
          headerTitleAlign: 'center',
          headerShown: false,
        }}
      />
      <SafeAreaView className="flex-1 items-center gap-10 bg-white pt-28">
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={true}>
          <CustomToast />

          <View>
            <Text className="text-center font-SpaceGrotesk text-3xl">Create Event</Text>
          </View>

          <View className="gap-10">
            <View className="w-full flex-row items-center gap-2  border-2 border-black px-4">
              <TextInput
                className="flex-1 font-SpaceGrotesk"
                placeholder="Event Title"
                autoCapitalize="none"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View className="w-full flex-row items-center gap-2  border-2 border-black px-4">
              <TextInput
                className="flex-1 font-SpaceGrotesk"
                placeholder="Description"
                multiline={true}
                numberOfLines={8}
                autoCapitalize="none"
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <View className="w-full flex-row gap-4">
              <Pressable
                onPress={showDatepicker}
                className="w-auto items-center gap-4 rounded-full bg-black p-4">
                <Text className="font-SpaceGrotesk text-sm text-white">{date.toDateString()}</Text>
              </Pressable>
              <Pressable
                onPress={showTimepicker}
                className="w-auto items-center gap-4 rounded-full bg-black p-4">
                <Text className="font-SpaceGrotesk text-sm text-white">{date.toTimeString()}</Text>
              </Pressable>
            </View>

            <View className="h-80 w-80">
              <EventImage
                url={eventImageUrl}
                onUpload={(url: string) => {
                  setEventImageUrl(url);
                }}
              />
            </View>

            <View>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  minimumDate={new Date()}
                  is24Hour={true}
                  onChange={onChange}
                />
              )}
            </View>
          </View>

          <View>
            <Pressable
              disabled={loading}
              onPress={createEvent}
              className="w-full items-center gap-4 rounded-full bg-black p-4">
              <Text className="font-SpaceGrotesk text-sm text-white">Create Event</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default createevent;
