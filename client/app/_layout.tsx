import { Stack } from "expo-router";

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

import '../i18n';

export default function RootLayout() {
  return <GluestackUIProvider>
    <Stack />
  </GluestackUIProvider>;
}
