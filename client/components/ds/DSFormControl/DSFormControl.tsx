import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from "@/components/ui/icon/index";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { useState } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";


type Props = {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  type?: 'text' | 'password';
}

export function DsFormControl({label, value, placeholder, onChange, onBlur, error, type = 'text'}: Props) {
  const [showPassword, setShowPassword] = useState(false);


  return (
    <FormControl 
      isInvalid={!!error}
      isRequired={true}
    >
      <FormControlLabel >
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>
      <Input className="my-1" size="lg">
        <InputField
          type={showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
        />
        { type === 'password' && (
          <InputSlot
            onPress={() => setShowPassword(!showPassword)}
            className="mr-3"
          >
            <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
          </InputSlot>
        )}

      </Input>
        {(error as FieldError)?.message && (
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} className="text-error-text" />
          <FormControlErrorText className="text-error-text">
            { String((error as FieldError).message) } 
          </FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  )
}