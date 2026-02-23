import { Center } from '@/components/ui/center';
import SignUpForm from '@/domains/auth/components/SignUpForm/SignUpForm';

export default function SignUp() {
  return (
    <Center className="flex-1 p-4">
      <SignUpForm />
    </Center>
  );
}
