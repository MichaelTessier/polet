import { useTranslation } from 'react-i18next';
import { DsButton } from '@/components/ds/DsButton/DsButton';
import { HStack } from '@/components/ui/hstack';
import { Controller, useForm } from 'react-hook-form';
import { DsFormInput } from '@/components/ds/DsFormInput/DsFormInput';
import { useHub } from '../../hooks/useHub';
import { familySchema, FamilySchema } from '../../schemas/hub.schema';
import { zodResolver } from '@/zod/resolver';
import { Text } from '@/components/ui/text';
import { useState } from 'react';
import { AddIcon } from '@/components/ui/icon';
import { VStack } from '@/components/ui/vstack';

type Props = {
  onAddFamilies: () => void;
  hubId: string;
  familyNumber: number;
};

export default function HubFormAddFamilies({
  onAddFamilies,
  hubId,
  familyNumber,
}: Props) {
  const { t } = useTranslation('hub');
  const { createFamily, inviteToFamily, isLoading } = useHub();

  const [numberOfMembers, setNumberOfMembers] = useState<number>(1);
  const [step, setStep] = useState<number>(1);

  const form = useForm({
    resolver: zodResolver(familySchema),
    defaultValues: {
      name: '',
      members: [
        {
          name: '',
          email: '',
        },
      ],
    } satisfies FamilySchema,
    mode: 'onChange',
  });

  async function handleFormSubmit(data: FamilySchema) {
    console.log('🚀 ~ handleFormSubmit ~ data:', data);

    setStep(prevStep => prevStep + 1);

    if (step <= familyNumber) {
      const createdFamily = await createFamily({
        name: data.name,
        number_of_children: 2,
        hub_id: hubId,
      });

      if (!createdFamily) {
        console.error('Failed to create family');
        return;
      }

      const request = await Promise.all(
        data.members.map(member => inviteToFamily(createdFamily, member.email))
      );
      console.log('🚀 ~ handleFormSubmit ~ request:', request);

      if (!request) {
        console.error('Failed to invite members to family');
        return;
      }

      form.reset({
        name: '',
        members: [
          {
            name: '',
            email: '',
          },
        ],
      });

      if (step === familyNumber) {
        onAddFamilies();
      }

      return;
    }
  }

  function handleAddMember() {
    setNumberOfMembers(prev => (prev < 2 ? prev + 1 : prev));
  }

  return (
    <>
      <Controller
        control={form.control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <DsFormInput
            isRequired
            label={t('addFamilies.name', { count: step })}
            placeholder={t('addFamilies.namePlaceholder') || undefined}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={form.formState.errors.name}
          />
        )}
      />

      <HStack>
        <Text>{t('addFamilies.members')}</Text>
      </HStack>

      {[...Array(numberOfMembers)].map((_, index) => {
        return (
          <VStack
            key={index}
            space="md"
          >
            <Controller
              key={index}
              control={form.control}
              name={`members.${index}.name`}
              render={({ field: { onChange, onBlur, value } }) => (
                <DsFormInput
                  isRequired
                  label={t('addFamilies.memberName', { count: index + 1 })}
                  placeholder={t('addFamilies.memberNamePlaceholder', {
                    count: index + 1,
                  })}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={form.formState.errors.members?.[index]?.name}
                />
              )}
            />

            <Controller
              control={form.control}
              name={`members.${index}.email`}
              render={({ field: { onChange, onBlur, value } }) => (
                <DsFormInput
                  isRequired
                  label={t('addFamilies.memberEmail', { count: index + 1 })}
                  placeholder={t('addFamilies.memberEmailPlaceholder', {
                    count: index + 1,
                  })}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={form.formState.errors.members?.[index]?.email}
                  inputMode="email"
                />
              )}
            />
          </VStack>
        );
      })}

      <HStack>
        <Text>{t('addFamilies.addMember')}</Text>
        <AddIcon onPress={handleAddMember} />
      </HStack>

      {/* <Controller
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
      /> */}

      <HStack space="md">
        <DsButton
          label={t('addFamilies.cancel')}
          isLoading={isLoading}
          onPress={() => form.reset()}
        />
        <DsButton
          label={t('addFamilies.submit')}
          isLoading={isLoading}
          onPress={form.handleSubmit(handleFormSubmit)}
          disabled={!form.formState.isValid}
        />
      </HStack>
    </>
  );
}
