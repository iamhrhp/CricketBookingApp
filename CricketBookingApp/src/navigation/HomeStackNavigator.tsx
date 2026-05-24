import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ActivityDetailsScreen from '../screens/ActivityDetailsScreen';
import AllClubsScreen from '../screens/AllClubsScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import ClubDetailsScreen from '../screens/ClubDetailsScreen';
import ConfirmationScreen from '../screens/ConfirmationScreen';
import CreateActivityScreen from '../screens/CreateActivityScreen';
import HomeScreen from '../screens/HomeScreen';
import PaymentScreen from '../screens/PaymentScreen';
import SelectClubScreen from '../screens/SelectClubScreen';
import { HomeStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ClubDetails" component={ClubDetailsScreen} />
      <Stack.Screen name="CreateActivity" component={CreateActivityScreen} />
      <Stack.Screen name="SelectClub" component={SelectClubScreen} />
      <Stack.Screen name="AllClubs" component={AllClubsScreen} />
      <Stack.Screen name="ActivityDetails" component={ActivityDetailsScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
    </Stack.Navigator>
  );
}
