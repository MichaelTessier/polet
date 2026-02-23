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

interface DsSelectProps {
  options?: { label: string; value: string }[];
  placeholder?: string;
  onValueChange?: (value: string) => void;
}

export function DsSelect({
  options = [],
  placeholder,
  onValueChange,
}: DsSelectProps) {
  return (
    <Select onValueChange={onValueChange}>
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
  );
}
