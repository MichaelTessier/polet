import { Card } from "@/components/ui/card";
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useTranslation } from 'react-i18next';
import { DsButton } from "@/components/ds/DsButton/DsButton";
import { VStack } from "@/components/ui/vstack";
import { AuthHeader } from "../AuthHeader/AuthHeader";
import { useAuth } from "../../hooks/useAuth";

export default function ResetPasswordForm() {
  const {
    showPassword,
    setShowPassword,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isPasswordInvalid,
    isConfirmPasswordInvalid,
    loading,
    hasError,
    resetPassword,
  } = useAuth();
  
  const { t } = useTranslation('auth');

  return (
    <Card className="w-full" size="lg">
      <AuthHeader label={t('resetPassword')} />
      
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

      <FormControl isInvalid={isConfirmPasswordInvalid} isRequired={true}>
        <FormControlLabel className="mt-4">
          <FormControlLabelText>{t('confirmPassword')}</FormControlLabelText>
        </FormControlLabel>
        <Input className="my-1" size="lg" >
          <InputField
            type={showPassword ? "text" : "password"}
            placeholder={t('confirmPasswordPlaceholder')}
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
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
            {t('error.confirmPasswordMismatch', { count: 6 })}
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

      <VStack className="my-5 gap-2">
        <Text className="text-error-text">{hasError}</Text>
        <DsButton 
          label={t('resetPasswordAction')} 
          onPress={resetPassword} 
          isLoading={loading}
        />
      </VStack>
    </Card>
  );
}
