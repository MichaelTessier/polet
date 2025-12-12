import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";

type Props = {
  className?: string;
  label: string;
  variant?: "link" | "outline" | "solid"
  onPress?: () => void;
  isLoading?: boolean;
}

export function DsButton({label, variant = 'solid', onPress, className, isLoading}: Props) {
  const isLink = variant === "link";
  return (
    <Button variant={variant} size="lg" onPress={onPress} className={className}>
      {isLoading && <ButtonSpinner color="white" />}
      <ButtonText className={isLink ? "underline underline-offset-2" : ""}>
        {label}
      </ButtonText>
    </Button>
  )
}