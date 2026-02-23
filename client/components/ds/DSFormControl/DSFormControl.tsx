import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { AlertCircleIcon } from '@/components/ui/icon/index';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

export type DsFormControlProps = {
  label: string;
  isRequired?: boolean;
  error?:
    | string
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined;
  children?: React.ReactNode;
};

export function DsFormControl({
  label,
  isRequired,
  error,
  children,
}: DsFormControlProps) {
  return (
    <FormControl
      isInvalid={!!error}
      isRequired={isRequired}
    >
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>
      {children}
      {(error as FieldError)?.message && (
        <FormControlError>
          <FormControlErrorIcon
            as={AlertCircleIcon}
            className="text-error-text"
          />
          <FormControlErrorText className="text-error-text">
            {String((error as FieldError).message)}
          </FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
}
