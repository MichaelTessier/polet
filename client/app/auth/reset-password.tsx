import { Center } from "@/components/ui/center";
import ResetPasswordForm from "@/domains/auth/components/ResetPasswordForm/ResetPasswordForm";

export default function ResetPassword() {
  return (
    <Center className="flex-1 p-4">
      <ResetPasswordForm />
    </Center>
  );
}
