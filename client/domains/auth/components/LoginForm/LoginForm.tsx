import { Card } from "@/components/ui/card";
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useTranslation } from 'react-i18next';
import { DsButton } from "@/components/ds/DsButton/DsButton";
import { VStack } from "@/components/ui/vstack";
import { AuthHeader } from "../AuthHeader/AuthHeader";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "expo-router";

export default function LoginForm() {
  const {
    showPassword,
    setShowPassword,
    email,
    setEmail,
    password,
    setPassword,
    isEmailInvalid,
    isPasswordInvalid,
    loading,
    hasError,
    signIn,
  } = useAuth();

  
  const { t } = useTranslation('auth');

  const router = useRouter();

  return (
    <Card className="w-full" size="lg">
      <AuthHeader label={t('login')} />
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

      <FormControl isInvalid={isPasswordInvalid} isRequired={true}>
        <FormControlLabel className="mt-4">
          <FormControlLabelText>{t('password')}</FormControlLabelText>
        </FormControlLabel>
        <Input className="my-1" size="lg" >
          <InputField
            type={showPassword ? "text" : "password"}
            placeholder={t('passwordPlaceholder')}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <InputSlot
            onPress={() => setShowPassword(!showPassword)}
            className="mr-3"
          >
            <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
          </InputSlot>
        </Input>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} className="text-error-text" />
          <FormControlErrorText className="text-error-text">
            {t('error.fieldLength', { count: 6 })}
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

      <VStack className="my-5 gap-2">
        <Text className="text-error-text">{hasError}</Text>
        <DsButton 
          label={t('loginAction')} 
          onPress={signIn} 
          isLoading={loading}
        />
      </VStack>

      <VStack className="justify-end">
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
