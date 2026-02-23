import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { VStack } from '@/components/ui/vstack';

import { Text } from '@/components/ui/text';
import HubFormCreate from './HubFormCreate';
import { useState } from 'react';
import HubFormAddFamilies from './HubFormAddFamilies';

const STATES = {
  CREATE_HUB: 'create_hub',
  ADD_FAMILIES: 'add_families',
  ADD_NURSES: 'add_nurses',
} as const;

type State = (typeof STATES)[keyof typeof STATES];

export default function HubForm() {
  const { t } = useTranslation('hub');

  const [state, setState] = useState<State>(STATES.CREATE_HUB);
  const [familyNumber, setFamilyNumber] = useState<number>(0);
  const [hubId, setHubId] = useState<string>('');

  function handleHubCreate(hubId: string, familyNumber: number) {
    console.log(
      '🚀 ~ handleHubCreate ~ hubId, familyNumber:',
      hubId,
      familyNumber
    );

    setFamilyNumber(familyNumber);
    setHubId(hubId);
    setState(STATES.ADD_FAMILIES);
  }

  function handleAddFamilies() {
    setState(STATES.ADD_NURSES);
  }

  return (
    <Card
      className="w-full"
      size="lg"
    >
      <VStack space="md">
        <Text>{t('create.title')}</Text>
        {state === STATES.CREATE_HUB && (
          <HubFormCreate onHubCreate={handleHubCreate} />
        )}
        {state === STATES.ADD_FAMILIES && (
          <HubFormAddFamilies
            hubId={hubId}
            familyNumber={familyNumber}
            onAddFamilies={handleAddFamilies}
          />
        )}
        {state === STATES.ADD_NURSES && <Text>Nurses</Text>}
        {/* { state === STATES.ADD_NURSES && <HubFormAddNurses hubId={hubId} /> } */}
      </VStack>
    </Card>
  );
}
