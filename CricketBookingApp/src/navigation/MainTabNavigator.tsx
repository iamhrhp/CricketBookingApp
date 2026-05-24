import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../theme/colors';
import AIStackNavigator from './AIStackNavigator';
import BookingStackNavigator from './BookingStackNavigator';
import HomeStackNavigator from './HomeStackNavigator';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const HIDDEN_TAB_ROUTES = [
  'ClubDetails',
  'CreateActivity',
  'SelectClub',
  'AllClubs',
  'ActivityDetails',
  'BookingDetails',
  'AICreateActivity',
  'Checkout',
  'Payment',
  'Confirmation',
];

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
        const hideTabBar = HIDDEN_TAB_ROUTES.includes(routeName);

        return {
          headerShown: false,
          tabBarActiveTintColor: colors.navy,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: hideTabBar
            ? { display: 'none' }
            : {
                backgroundColor: colors.white,
                borderTopColor: colors.border,
                height: 68,
                paddingBottom: 16,
                paddingTop: 8,
              },
          tabBarIcon: ({ color, size }) => {
            const icons: Record<string, string> = {
              HomeTab: 'home-outline',
              BookingTab: 'calendar-outline',
              AITab: 'sparkles-outline',
              NotificationsTab: 'notifications-outline',
              ProfileTab: 'person-outline',
            };
            return <Icon name={icons[route.name]} size={size} color={color} />;
          },
        };
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Home' }} />
      <Tab.Screen name="BookingTab" component={BookingStackNavigator} options={{ title: 'Booking' }} />
      <Tab.Screen name="AITab" component={AIStackNavigator} options={{ title: 'AI' }} />
      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsScreen}
        options={{ title: 'Notifications' }}
      />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
