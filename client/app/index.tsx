import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
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

        <Button className="mt-4" onPress={() => alert("Button Pressed!")}>
          <ButtonText>Press Me</ButtonText>
        </Button>
      </Box>
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
