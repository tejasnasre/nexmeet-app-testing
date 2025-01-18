import { TextInput, Text, Button, SafeAreaView, View, Pressable } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack } from 'expo-router';
import { supabase } from '~/utils/supabase';
import { useAuth } from '~/contexts/AuthProvider';
import Toast from 'react-native-toast-message';
import toastConfig from '~/utils/toastConfig';

const createevent = () => {
  const { user }: any = useAuth();

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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
    console.log(title, description, date);

    const { data, error } = await supabase
      .from('events')
      .insert([{ title, description, datetime: date.toISOString(), user_id: user.id }]);

    if (error) {
      console.error(error);
    }

    setTitle('');
    setDescription('');
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
      <SafeAreaView className="h-full w-full items-center  gap-10 bg-white p-4 pt-28">
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
              secureTextEntry={true}
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
        <Pressable
          onPress={createEvent}
          className="w-full items-center gap-4 rounded-full bg-black p-4">
          <Text className="font-SpaceGrotesk text-sm text-white">Create Event</Text>
        </Pressable>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Button
            title="Show Success Toast"
            onPress={() =>
              Toast.show({
                type: 'success',
                text1: 'Success!',
                text2: 'Your item has been saved successfully.',
              })
            }
          />
          <Button
            title="Show Error Toast"
            onPress={() =>
              Toast.show({
                type: 'error',
                text1: 'Error!',
                text2: 'An error occurred while saving your item.',
              })
            }
          />
          <Toast config={toastConfig} />
        </View>
      </SafeAreaView>
    </>
  );
};

export default createevent;
