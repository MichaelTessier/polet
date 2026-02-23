import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
} from '@/components/ui/select';
import { ChevronDownIcon } from '@/components/ui/icon';
import { useState } from 'react';
import {
  DsFormControl,
  DsFormControlProps,
} from '../DsFormControl/DsFormControl';

type DsFormSelectProps = Omit<DsFormControlProps, 'children'> & {
  options?: { label: string; value: string }[];
  value: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
};

export function DsFormSelect({
  options = [],
  placeholder,
  onValueChange,
  value,
  isRequired,
  error,
  label,
}: DsFormSelectProps) {
  const selectedValue = value ?? options[0]?.value ?? '';
  const selectedLabel =
    options.find(option => option.value === selectedValue)?.label ?? '';
  console.log('🚀 ~ DsFormSelect ~ selectedValue:', selectedValue);

  function handleValueChange(newValue: string) {
    console.log('🚀 ~ handleValueChange ~ newValue:', newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  }

  return (
    <DsFormControl
      error={error}
      label={label}
      isRequired={isRequired}
    >
      <Select
        selectedValue={selectedValue}
        selectedLabel={selectedLabel}
        onValueChange={handleValueChange}
      >
        <SelectTrigger
          variant="outline"
          size="md"
          className="justify-between"
        >
          <SelectInput placeholder={placeholder} />
          <SelectIcon
            className="mr-3"
            as={ChevronDownIcon}
          />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {options.map(option => (
              <SelectItem
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </SelectContent>
        </SelectPortal>
      </Select>
    </DsFormControl>
  );
}
