import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Center } from "@/components/ui/center";
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
// import { Checkbox, CheckboxIndicator, CheckboxIcon, CheckboxLabel } from "@/components/ui/checkbox";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { AlertCircleIcon, EyeIcon, EyeOffIcon, Icon } from "@/components/ui/icon";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useState } from "react";
import {
  Users,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function Index() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);

  
  const { t } = useTranslation('auth');

  function submitHandler() {  

    if(email === '') {
      setIsEmailInvalid(true);
      return;
    }

      if(password === '') {
      setIsPasswordInvalid(true);
      return;
    }

    setIsEmailInvalid(false);
    setIsPasswordInvalid(false);
  }

  return (
    <Center className="flex-1 p-6">

      <Card className="w-full max-w-[336px]" size="lg">


        <Center>
        
        <Center className="w-16 h-16 rounded-full bg-primary-0 mb-5">
          <Icon className="text-primary-500" as={Users} size="xl"></Icon>
        </Center>

          <Heading>Polet</Heading>
          <Text className="mt-2">{t('login')}</Text>
        </Center>

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
          <FormControlErrorIcon as={AlertCircleIcon} className="text-error-500" />
          <FormControlErrorText className="text-error-500">
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
          <FormControlErrorIcon as={AlertCircleIcon} className="text-error-500" />
          <FormControlErrorText className="text-error-500">
            {t('error.fieldLength', { count: 6 })}
          </FormControlErrorText>
        </FormControlError>
      </FormControl>


        <Button className="w-full my-5" size="sm" onPress={submitHandler}>
          <ButtonText>{t('loginAction')}</ButtonText>
        </Button>

        <HStack className="justify-end">
          <Button variant="link" size="sm">
            <ButtonText className="underline underline-offset-1">
              {t('forgotPassword')}
            </ButtonText>
          </Button>
        </HStack>
      </Card>
    </Center>
  );
}
