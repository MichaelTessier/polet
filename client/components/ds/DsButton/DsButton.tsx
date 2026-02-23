import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';

type Props = {
  className?: string;
  label: string;
  variant?: 'link' | 'outline' | 'solid';
  onPress?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
};

export function DsButton({
  label,
  variant = 'solid',
  onPress,
  className,
  isLoading,
  disabled,
}: Props) {
  const isLink = variant === 'link';
  return (
    <Button
      variant={variant}
      size="lg"
      onPress={onPress}
      disabled={disabled}
      className={`${className} ${disabled ? 'opacity-70' : ''}`}
    >
      {isLoading && <ButtonSpinner color="white" />}
      <ButtonText className={isLink ? 'underline underline-offset-2' : ''}>
        {label}
      </ButtonText>
    </Button>
  );
}
