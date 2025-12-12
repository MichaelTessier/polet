import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { supabase } from "@/services/supabase";
import { Session } from "@supabase/supabase-js";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Fetch session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for changes to auth state
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [])

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box className="p-5">
        <Text>Welcome to Polet!</Text>
        <Link href="/auth/login">Go to Auth</Link>

        {session && session.user && <Text>{session.user.id}</Text>}

        <Button className="mt-4" onPress={() => alert("Button Pressed!")}>
          <ButtonText>Press Me</ButtonText>
        </Button>
      </Box>
    </View>
  );
}
