import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';
import { DsButton } from '@/components/ds/DsButton/DsButton';
import { VStack } from '@/components/ui/vstack';
import { AuthHeader } from '../AuthHeader/AuthHeader';
import { useAuthForm } from '../../hooks/useAuthForm';
import { Controller } from 'react-hook-form';
import { DsFormInput } from '@/components/ds/DsFormInput/DsFormInput';

export default function ResetPasswordForm() {
  const { t } = useTranslation('auth');

  const { resetPasswordForm, resetPassword, isLoading, errorMessage } =
    useAuthForm();

  return (
    <Card
      className="w-full"
      size="lg"
    >
      <AuthHeader label={t('resetPassword')} />

      <Controller
        control={resetPasswordForm.control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <DsFormInput
            isRequired
            label={t('password')}
            placeholder={t('passwordPlaceholder') || undefined}
            value={value}
            type="password"
            onChange={onChange}
            onBlur={onBlur}
            error={resetPasswordForm.formState.errors.password}
          />
        )}
      />

      <Controller
        control={resetPasswordForm.control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <DsFormInput
            isRequired
            label={t('confirmPassword')}
            placeholder={t('confirmPasswordPlaceholder') || undefined}
            value={value}
            type="password"
            onChange={onChange}
            onBlur={onBlur}
            error={resetPasswordForm.formState.errors.confirmPassword}
          />
        )}
      />

      <VStack className="my-5 gap-2">
        {errorMessage && (
          <Text className="text-error-text">{errorMessage}</Text>
        )}
        <DsButton
          label={t('resetPasswordAction')}
          onPress={resetPassword}
          isLoading={isLoading}
        />
      </VStack>
    </Card>
  );
}
