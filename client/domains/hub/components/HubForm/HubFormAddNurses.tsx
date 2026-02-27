import { useTranslation } from 'react-i18next';
import { DsButton } from '@/components/ds/DsButton/DsButton';
import { HStack } from '@/components/ui/hstack';
import { Controller, useForm } from 'react-hook-form';
import { DsFormInput } from '@/components/ds/DsFormInput/DsFormInput';
import { nurseSchema, NurseSchema } from '../../schemas/hub.schema';
import { zodResolver } from '@/zod/resolver';
import { useState } from 'react';

type Props = {
  hubId: string;
  nurseCount: number;
  onAddNurses: () => void;
};

export default function HubFormAddNurses({ nurseCount, onAddNurses }: Props) {
  const { t } = useTranslation('hub');
  const [step, setStep] = useState<number>(1);

  const form = useForm({
    resolver: zodResolver(nurseSchema),
    defaultValues: {
      name: '',
      email: '',
    } satisfies NurseSchema,
    mode: 'onChange',
  });

  function handleFormSubmit(data: NurseSchema) {
    console.log('🚀 ~ handleFormSubmit ~ nurse data:', data);

    if (step < nurseCount) {
      setStep(prev => prev + 1);
      form.reset({ name: '', email: '' });
      return;
    }

    onAddNurses();
  }

  return (
    <>
      <Controller
        control={form.control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <DsFormInput
            isRequired
            label={t('addNurses.name', { count: step })}
            placeholder={t('addNurses.namePlaceholder') || undefined}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={form.formState.errors.name}
          />
        )}
      />

      <Controller
        control={form.control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <DsFormInput
            isRequired
            label={t('addNurses.email', { count: step })}
            placeholder={t('addNurses.emailPlaceholder') || undefined}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={form.formState.errors.email}
            inputMode="email"
          />
        )}
      />

      <HStack space="md">
        <DsButton
          label={t('addNurses.cancel')}
          onPress={() => form.reset()}
        />
        <DsButton
          label={t('addNurses.submit')}
          onPress={form.handleSubmit(handleFormSubmit)}
          disabled={!form.formState.isValid}
        />
      </HStack>
    </>
  );
}
