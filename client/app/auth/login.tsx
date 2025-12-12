import { Center } from "@/components/ui/center";
import LoginForm from "@/domains/auth/components/LoginForm/LoginForm";

export default function Login() {
  return (
    <Center className="flex-1 p-4">
      <LoginForm />
    </Center>
  );
}
