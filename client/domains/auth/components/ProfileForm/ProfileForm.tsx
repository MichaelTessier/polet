import { Card } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';
import { useProfileForm } from "../../hooks/useProfileForm";
import { Controller } from 'react-hook-form';
import { DsButton } from "@/components/ds/DsButton/DsButton";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { DsFormControl } from "@/components/ds/DSFormControl/DSFormControl";
import { useRouter } from "expo-router";

export default function ProfileForm() {
  const { t } = useTranslation('auth');
  const { form, onSubmit, isLoading } = useProfileForm();
  const router = useRouter();

  async function handleFormSubmit() {
    await onSubmit();
    router.push('/')
  }
  
  return (
    <Card className="w-full" size="lg">
      <VStack space="md">
        <Controller
          control={form.control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <DsFormControl 
              label={t('username')}
              placeholder={t('usernamePlaceholder') || undefined}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={form.formState.errors.username}
            />
          )}
        />

        <Controller
          control={form.control}
          name="full_name"
          render={({ field: { onChange, onBlur, value } }) => (
            <DsFormControl 
              label={t('fullName')}
              placeholder={t('fullNamePlaceholder') || undefined}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={form.formState.errors.full_name}
            />
          )}
        />

        <HStack space="md">
          <DsButton 
            label={t('cancel')} 
            isLoading={isLoading}
            onPress={() => form.reset()}
          />
          <DsButton 
            label={t('submit')} 
            isLoading={isLoading}
            onPress={handleFormSubmit}
          />
        </HStack>
      </VStack>

    </Card>
  );
}
