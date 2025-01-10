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
        tabBarActiveTintColor: 'black',
        tabBarLabelStyle: { fontFamily: 'SpaceGrotesk' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Events',
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <HeaderButton />
            </Link>
          ),
          tabBarLabelStyle: { fontFamily: 'SpaceGrotesk' },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          tabBarLabelStyle: { fontFamily: 'SpaceGrotesk' },
        }}
      />
    </Tabs>
  );
}
