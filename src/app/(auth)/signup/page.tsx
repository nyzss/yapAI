import { SignUpForm } from "@/components/auth/signup";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <Button asChild variant="outline" className="mr-auto mb-4">
          <Link href="/">
            <ArrowLeft />
            Back to home
          </Link>
        </Button>
        <SignUpForm />
      </div>
    </div>
  );
}
