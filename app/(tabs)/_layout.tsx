import { Link, Redirect, Tabs } from 'expo-router';
import { HeaderButton } from '../../components/HeaderButton';
import { TabBarIcon } from '../../components/TabBarIcon';
import { useAuth } from '~/contexts/AuthProvider';

export default function TabLayout() {
  const { isAuthenticated }: any = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/welcomepage" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black', // Modern blue for active tab
        tabBarInactiveTintColor: 'gray', // Soft gray for inactive tabs
        tabBarStyle: {
          backgroundColor: '#ffffff', // White background for the tab bar
          height: 60, // Increased height for better accessibility
          borderRadius: 50, // Rounded corner
          position: 'absolute', // Floating tab bar effect
          // marginHorizontal: 10, // Space on the sides for floating effect
          // marginBottom: 10,
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
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
