import { Box } from "@/components/ui/box";
import LogOutButton from "@/domains/auth/components/LogOutButton/LogOutButton";
import { useAuthContext } from "@/domains/auth/hooks/useAuthContext";
import { supabase } from "@/services/supabase";
import { Session } from "@supabase/supabase-js";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const [session, setSession] = useState<Session | null>(null);
  const { profile, isLoggedIn } = useAuthContext()

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

        {session && session.user && <Text>{session.user.id}</Text>}

        <Text>Username: {profile?.username}</Text>
        <Text>Logged In: {isLoggedIn ? "Yes" : "No"}</Text>

        { isLoggedIn &&  <LogOutButton ></LogOutButton> }
        <Link href="/auth/login">Go to Auth</Link>
        <Link href="/auth/profile">Go to Profile</Link>
      </Box>
    </View>
  );
}
