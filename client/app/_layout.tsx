import { Stack } from "expo-router";

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

import '../i18n';
import '@/domains/auth/init';
import '@/domains/workspace/init';
import AuthProvider from "@/domains/auth/providers/AuthProvider";
import { SplashScreenController } from "@/domains/auth/components/SplashScreen/SplashScreen";
import { StatusBar } from "expo-status-bar";
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { makeZodI18nMap } from "@/zod/errorMap";

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
  const { t } = useTranslation(); 

  z.config({
    customError: makeZodI18nMap({ t, handlePath: { ns: ["common", "errors", "custom", "zod",] } }),
  });
      
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
