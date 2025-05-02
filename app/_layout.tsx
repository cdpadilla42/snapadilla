import { Stack } from 'expo-router';
import 'react-native-get-random-values';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          navigationBarHidden: true,
        }}
      />
      <Stack.Screen
        name="picture"
        options={{
          animation: 'fade',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
