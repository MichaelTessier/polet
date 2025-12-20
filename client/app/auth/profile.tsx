import { DsButton } from "@/components/ds/ds-button/DsButton";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { useAuthContext } from "@/domains/auth/hooks/useAuthContext";
import { router } from "expo-router";

export default function Profile() {

  const { profile } = useAuthContext()
  // TODO: Profile form
  return (
    <Center className="flex-1 p-4">
      <Text>Username: {profile?.username}</Text>
      <Text>Email: {profile?.email}</Text>
        <DsButton
          label="go home"
          variant="link"
          onPress={() => router.push('/')}
        />
    </Center>
  );
}
