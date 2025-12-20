import { Card } from "@/components/ui/card";
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { AlertCircleIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useTranslation } from 'react-i18next';
import { DsButton } from "@/components/ds/ds-button/DsButton";
import { VStack } from "@/components/ui/vstack";
import { AuthHeader } from "../AuthHeader/AuthHeader";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "expo-router";


export default function ForgotPasswordForm() {
  const {
    email,
    setEmail,
    isEmailInvalid,
    loading,
    hasError,
    forgotPassword,
  } = useAuth();
  
  const { t } = useTranslation('auth');

  const router = useRouter();

  return (
    <Card className="w-full" size="lg">
      <AuthHeader label={t('forgotPassword')} />
      <FormControl 
        isInvalid={isEmailInvalid} 
        className="mt-6" 
        isRequired={true}
      >
        <FormControlLabel className="mt-4">
          <FormControlLabelText>{t('email')}</FormControlLabelText>
        </FormControlLabel>
        <Input className="my-1" size="lg">
          <InputField
            type="text"
            placeholder={t('emailPlaceholder')}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </Input>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} className="text-error-text" />
          <FormControlErrorText className="text-error-text">
            {t('error.requiredField')}
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

      <VStack className="my-5 gap-2">
        <Text className="text-error-text">{hasError}</Text>
        <DsButton 
          label={t('forgotPasswordAction')} 
          onPress={forgotPassword} 
          isLoading={loading}
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
    </Card>
  );
}
