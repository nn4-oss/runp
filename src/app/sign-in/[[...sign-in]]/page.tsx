import { SignIn } from "@clerk/nextjs";
import { AppContainer } from "@/components";

export default function Page() {
  return (
    <AppContainer className="flex align-center justify-center w-100 h-100">
      <SignIn />
    </AppContainer>
  );
}
