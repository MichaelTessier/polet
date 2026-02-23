import { useTranslation } from 'react-i18next';
import { DsButton } from '@/components/ds/DsButton/DsButton';
import { HStack } from '@/components/ui/hstack';
// import { useRouter } from "expo-router";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@/zod/resolver';
// import { useEffect } from 'react';

// import { useHubForm } from "../../hooks/useHubFormCreate";
import { DsFormInput } from '@/components/ds/DsFormInput/DsFormInput';
import { DsFormSelect } from '@/components/ds/DsFormSelect/DsFormSelect';
import { useHub } from '../../hooks/useHub';
import { HubSchema, hubSchema } from '../../schemas/hub.schema';

type Props = {
  onHubCreate: (hubId: string, familyNumber: number) => void;
};

export default function HubFormCreate({ onHubCreate }: Props) {
  const { t } = useTranslation('hub');
  const { createHub, isLoading } = useHub();

  const form = useForm({
    resolver: zodResolver(hubSchema),
    defaultValues: {
      name: '',
      familyNumber: '1',
    } satisfies HubSchema,
    mode: 'onChange',
  });

  async function handleFormSubmit(data: HubSchema) {
    if (!data) return;

    try {
      const hubId = await createHub(data.name);

      if (!hubId) {
        console.error('Failed to create hub');
        return;
      }

      onHubCreate(hubId, Number(data.familyNumber));
    } catch (error) {
      console.error('Error creating hub:', error);
    }
  }

  const familyNumberOptions = [
    { label: t('create.familyOptionLabel', { count: 1 }), value: '1' },
    { label: t('create.familyOptionLabel', { count: 2 }), value: '2' },
    { label: t('create.familyOptionLabel', { count: 3 }), value: '3' },
  ];

  return (
    <>
      <Controller
        control={form.control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <DsFormInput
            isRequired
            label={t('create.name')}
            placeholder={t('create.namePlaceholder') || undefined}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={form.formState.errors.name}
          />
        )}
      />

      <Controller
        control={form.control}
        name="familyNumber"
        render={({ field: { onChange, onBlur, value } }) => (
          <DsFormSelect
            isRequired
            label={t('create.familyNumber')}
            placeholder={t('create.familyNumberPlaceholder') || undefined}
            options={familyNumberOptions}
            value={value}
            onValueChange={onChange}
            error={form.formState.errors.familyNumber}
          />
        )}
      />

      <HStack space="md">
        <DsButton
          label={t('create.cancel')}
          isLoading={isLoading}
          onPress={() => form.reset()}
        />
        <DsButton
          label={t('create.submit')}
          isLoading={isLoading}
          onPress={form.handleSubmit(handleFormSubmit)}
        />
      </HStack>
    </>
  );
}
