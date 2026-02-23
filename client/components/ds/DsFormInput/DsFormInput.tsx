import { EyeIcon, EyeOffIcon } from '@/components/ui/icon/index';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { useState } from 'react';
import {
  DsFormControl,
  DsFormControlProps,
} from '../DsFormControl/DsFormControl';

type Props = Omit<DsFormControlProps, 'children'> & {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: 'text' | 'password';
  inputMode?: 'text' | 'email' | 'numeric' | 'tel' | 'url';
};

export function DsFormInput({
  label,
  value,
  placeholder,
  onChange,
  onBlur,
  error,
  type = 'text',
  inputMode = 'text',
  isRequired,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <DsFormControl
      error={error}
      label={label}
      isRequired={isRequired}
    >
      <Input
        className="my-1"
        size="lg"
      >
        <InputField
          type={showPassword ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          inputMode={inputMode}
        />
        {type === 'password' && (
          <InputSlot
            onPress={() => setShowPassword(!showPassword)}
            className="mr-3"
          >
            <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
          </InputSlot>
        )}
      </Input>
    </DsFormControl>
  );
}
