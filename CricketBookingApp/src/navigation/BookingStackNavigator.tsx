import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BookingDetailsScreen from '../screens/BookingDetailsScreen';
import BookingScreen from '../screens/BookingScreen';
import { BookingStackParamList } from './types';

const Stack = createNativeStackNavigator<BookingStackParamList>();

export default function BookingStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
    </Stack.Navigator>
  );
}
