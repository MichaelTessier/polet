import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useTranslation } from 'react-i18next';
import { DsButton } from "@/components/ds/DsButton/DsButton";
import { VStack } from "@/components/ui/vstack";
import { AuthHeader } from "../AuthHeader/AuthHeader";
import { useRouter } from "expo-router";
import { Controller } from "react-hook-form";
import { DsFormControl } from "@/components/ds/DSFormControl/DSFormControl";
import { useAuthForm } from "../../hooks/useAuthForm";


export default function ForgotPasswordForm() {
  const { t } = useTranslation('auth');
  const { forgotPasswordForm, forgotPassword, isLoading, errorMessage } = useAuthForm();

  const router = useRouter();

  return (
    <Card className="w-full" size="lg">
      <AuthHeader label={t('forgotPassword')} />
      
      <VStack space="md">
        <Controller
          control={forgotPasswordForm.control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <DsFormControl 
              label={t('email')}
              placeholder={t('emailPlaceholder') || undefined}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={forgotPasswordForm.formState.errors.email}
            />
          )}
        />

        <VStack className="my-5 gap-2">
          { errorMessage && <Text className="text-error-text">{errorMessage}</Text> }
          <DsButton 
            label={t('forgotPasswordAction')} 
            onPress={forgotPassword} 
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
