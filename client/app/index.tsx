import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
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
        <Link href="/auth">Go to Auth</Link>

        <Button className="mt-4" onPress={() => alert("Button Pressed!")}>
          <ButtonText>Press Me</ButtonText>
        </Button>
      </Box>
    </View>
  );
}
