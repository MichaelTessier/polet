import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useTranslation } from 'react-i18next';
import { DsButton } from "@/components/ds/DsButton/DsButton";
import { VStack } from "@/components/ui/vstack";
import { AuthHeader } from "../AuthHeader/AuthHeader";
import { useRouter } from "expo-router";
import { useAuthForm } from "../../hooks/useAuthForm";
import { Controller } from "react-hook-form";
import { DsFormControl } from "@/components/ds/DSFormControl/DSFormControl";


export default function SignUpForm() {
  const { t } = useTranslation('auth');

  const router = useRouter();
  const { signUpForm, signUp, isLoading, errorMessage } = useAuthForm();

  return (
    <Card className="w-full" size="lg">
      <AuthHeader label={t('signUp')} />

      <VStack space="md">
        
        <Controller
          control={signUpForm.control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <DsFormControl 
              label={t('email')}
              placeholder={t('emailPlaceholder') || undefined}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={signUpForm.formState.errors.email}
            />
          )}
        />

        <Controller
          control={signUpForm.control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <DsFormControl 
              label={t('password')}
              placeholder={t('passwordPlaceholder') || undefined}
              value={value}
              type="password"
              onChange={onChange}
              onBlur={onBlur}
              error={signUpForm.formState.errors.password}
            />
          )}
        />

        <Controller
          control={signUpForm.control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <DsFormControl 
              label={t('confirmPassword')}
              placeholder={t('confirmPasswordPlaceholder') || undefined}
              value={value}
              type="password"
              onChange={onChange}
              onBlur={onBlur}
              error={signUpForm.formState.errors.confirmPassword}
            />
          )}
        />

        <VStack className="my-5 gap-2">
          { errorMessage && <Text className="text-error-text">{errorMessage}</Text>} 
          <DsButton 
            label={t('signUpAction')} 
            onPress={signUp} 
            isLoading={isLoading}
          />
        </VStack>

        <VStack className="justify-end">
          <HStack className="justify-center items-center">
            <Text size="lg">{t('alreadyHaveAccount')}</Text>
            <DsButton 
              label={t('login')} 
              variant="link"
              onPress={() => router.push('/auth/login')}
            />
          </HStack>
        </VStack>

      </VStack>
    </Card>
  );
}
