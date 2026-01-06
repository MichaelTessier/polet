import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { AlertCircleIcon } from "@/components/ui/icon/index";
import { Input, InputField } from "@/components/ui/input";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";


type Props = {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
}

export function DsFormControl({label, value, placeholder, onChange, onBlur,error}: Props) {
  return (
    <FormControl 
      isInvalid={!!error}
      className="mt-6" 
      isRequired={true}
    >
      <FormControlLabel className="mt-4">
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>
      <Input className="my-1" size="lg">
        <InputField
          type="text"
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
        />
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