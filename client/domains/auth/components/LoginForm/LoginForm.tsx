import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DsButton } from "@/components/ds/DsButton/DsButton";
import { VStack } from "@/components/ui/vstack";
import { AuthHeader } from "../AuthHeader/AuthHeader";
import { useRouter } from "expo-router";
import { useAuthForm } from "../../hooks/useAuthForm";
import { DsFormControl } from "@/components/ds/DSFormControl/DSFormControl";

export default function LoginForm() {
  const { t } = useTranslation('auth');

  const { loginForm, signIn, isLoading, errorMessage } = useAuthForm();

  const router = useRouter();

  return (
    <Card className="w-full" size="lg">
      
      <AuthHeader label={t('login')} />

      <VStack space="md">
        <Controller
          control={loginForm.control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <DsFormControl 
              label={t('email')}
              placeholder={t('emailPlaceholder') || undefined}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={loginForm.formState.errors.email}
            />
          )}
        />

        <Controller
          control={loginForm.control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <DsFormControl 
              label={t('password')}
              placeholder={t('passwordPlaceholder') || undefined}
              value={value}
              type="password"
              onChange={onChange}
              onBlur={onBlur}
              error={loginForm.formState.errors.password}
            />
          )}
        />
      
        <VStack className="my-5 gap-2">
          { errorMessage && <Text className="text-error-text">{errorMessage}</Text> } 
          <DsButton 
            label={t('loginAction')} 
            onPress={signIn} 
            isLoading={isLoading}
          />
        </VStack>

        <HStack className="justify-center items-center">
          <Text size="lg">{t('noAccount')}</Text>
          <DsButton 
            label={t('createAccount')} 
            variant="link"
            onPress={() => router.push('/auth/sign-up')}
          />
        </HStack>

        <DsButton 
          label={t('forgotPassword')} 
          variant="link"
          onPress={() => router.push('/auth/forgot-password')}
        />

      </VStack>
    </Card>
  );
}
