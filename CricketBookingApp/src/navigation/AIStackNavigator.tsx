import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AICreateActivityScreen from '../screens/AICreateActivityScreen';
import AIScreen from '../screens/AIScreen';
import { AIStackParamList } from './types';

const Stack = createNativeStackNavigator<AIStackParamList>();

export default function AIStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AIHome" component={AIScreen} />
      <Stack.Screen name="AICreateActivity" component={AICreateActivityScreen} />
    </Stack.Navigator>
  );
}
