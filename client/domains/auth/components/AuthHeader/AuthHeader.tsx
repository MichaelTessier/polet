import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Users } from "lucide-react-native";

export function AuthHeader({ label }: { label?: string }) {
  return <>
    <Center>
      <Center className="w-16 h-16 rounded-full bg-primary-background/10 mb-6">
        <Icon className="text-primary-text" as={Users} size="xl"></Icon>
      </Center>
      <Heading>Polet</Heading>
      <Text className="mt-2">{label}</Text>
    </Center>
  </>;
}