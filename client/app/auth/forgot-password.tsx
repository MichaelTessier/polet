import { Center } from "@/components/ui/center";
import ForgotPasswordForm from "@/domains/auth/components/ForgotPasswordForm/ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <Center className="flex-1 p-4">
      <ForgotPasswordForm />
    </Center>
  );
}
