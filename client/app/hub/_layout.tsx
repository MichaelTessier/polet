import { useAuthContext } from '@/domains/auth/hooks/useAuthContext';
import { Redirect, Stack } from 'expo-router';

export default function WorkspaceLayout() {
  const { isLoggedIn } = useAuthContext();
  console.log('🚀 ~ WorkspaceLayout ~ isLoggedIn:', isLoggedIn);

  if (!isLoggedIn) {
    return <Redirect href="/" />;
  }

  return (
    <>
      <Stack>
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen
            name="create-hub"
            options={{
              headerShown: false,
            }}
          />
        </Stack.Protected>
        {/* <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen
            name="login"
            options={{
              headerShown: false,
            }}
          /> 
          <Stack.Screen
            name="sign-up"
            options={{
              headerShown: false,
            }}
          /> 
          <Stack.Screen
            name="forgot-password"
            options={{
              headerShown: false,
            }}
          /> 
          <Stack.Screen
            name="reset-password"
            options={{
              headerShown: false,
            }}
          /> 
        </Stack.Protected> */}
      </Stack>
    </>
  );
}
