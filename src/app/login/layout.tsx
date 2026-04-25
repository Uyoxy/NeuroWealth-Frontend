import { Suspense } from "react";
import { AuthProvider } from "@/contexts";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Suspense>{children}</Suspense>
    </AuthProvider>
  );
}
