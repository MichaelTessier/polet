import { Stack } from "expo-router";

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

import '../i18n';
import '@/domains/auth/init';
import AuthProvider from "@/domains/auth/providers/AuthProvider";
import { SplashScreenController } from "@/domains/auth/components/SplashScreen/SplashScreen";
import { StatusBar } from "expo-status-bar";


function RootNavigator() {
  return (
    <Stack>

      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="auth"
        options={{
          headerShown: false,
        }}
      />
      {/* <Stack.Screen name="+not-found" /> */}
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <GluestackUIProvider>
      <AuthProvider>
        <SplashScreenController />
        <RootNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </GluestackUIProvider>
  );
}
