import { Link, Redirect, Tabs } from 'expo-router';
import { HeaderButton } from '../../components/HeaderButton';
import { TabBarIcon } from '../../components/TabBarIcon';
import { useAuth } from '~/contexts/AuthProvider';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function TabLayout() {
  const { isAuthenticated }: any = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/welcomepage" />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: 'black', // Modern blue for active tab
          tabBarInactiveTintColor: 'gray', // Soft gray for inactive tabs
          tabBarStyle: {
            backgroundColor: '#ffffff', // White background for the tab bar
            height: 60, // Increased height for better accessibility
            borderRadius: 50, // Rounded corner
          },
          tabBarLabelStyle: {
            fontFamily: 'SpaceGrotesk',
            fontSize: 12,
            marginBottom: 5, // Adjust label position
          },
          tabBarItemStyle: {
            marginVertical: 5, // Spacing for touch targets
          },
          animation: 'shift',
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            headerRight: () => (
              <Link href="/modal" asChild>
                <HeaderButton />
              </Link>
            ),
          }}
        />
        <Tabs.Screen
          name="createevent"
          options={{
            title: 'Add Event',
            tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          }}
        />
      </Tabs>
    </KeyboardAvoidingView>
  );
}
