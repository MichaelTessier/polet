import { Stack } from "expo-router";

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

import '../i18n';
import '@/domains/auth/init';

export default function RootLayout() {
  return <GluestackUIProvider>
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="auth/login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="auth/sign-up"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="auth/forgot-password"
        options={{
          headerShown: false,
        }}
      />
    </Stack>  
  </GluestackUIProvider>;
}
