import { LoginForm } from "@/components/auth/login";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Button asChild variant="outline" className="mr-auto">
          <Link href="/">
            <ArrowLeft />
            Back to home
          </Link>
        </Button>
        <LoginForm />
      </div>
    </div>
  );
}
