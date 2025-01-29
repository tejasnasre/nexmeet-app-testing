import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';

interface Location {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

interface EventLocation {
  latitude: number;
  longitude: number;
  display_name: string;
}

interface AutocompleteProps {
  locationData: Location[];
  onSelectLocation: (location: EventLocation) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ locationData, onSelectLocation }) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState<Location[]>([]);

  const fetchlocation = useCallback(async () => {
    if (query.length <= 2) {
      setLocation([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.locationiq.com/v1/autocomplete?key=${process.env.EXPO_PUBLIC_LOCATION_IQ}&q=${encodeURIComponent(query)}&limit=5&dedupe=1`
      );
      const data = await response.json();
      setLocation(data);
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  }, [query]);

  useEffect(() => {
    fetchlocation();
  }, [fetchlocation, query]);

  const handleSelectSuggestion = (suggestion: Location) => {
    setQuery(suggestion.display_name);
    setLocation([]);
    const eventLocation: EventLocation = {
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon),
      display_name: suggestion.display_name,
    };
    onSelectLocation(eventLocation); // Call the callback function
  };

  return (
    <View className="w-full">
      <TextInput
        className="w-full flex-row items-center gap-2 border-2 border-black px-4 font-SpaceGrotesk"
        placeholder="Search for a location"
        value={query}
        onChangeText={setQuery}
      />
      {location.length > 0 && (
        <View className="mt-2 rounded border-2 border-black">
          <FlatList
            data={location}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="border-b-2 border-black"
                onPress={() => handleSelectSuggestion(item)}>
                <Text className="p-2 font-SpaceGrotesk text-sm">{item.display_name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default Autocomplete;
