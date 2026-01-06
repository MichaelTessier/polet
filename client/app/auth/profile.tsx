import { Center } from "@/components/ui/center";
import ProfileForm from "@/domains/auth/components/ProfileForm/ProfileForm";

export default function Profile() {

  return (
    <Center className="flex-1 p-4">
      <ProfileForm />
    </Center>
  );
}
