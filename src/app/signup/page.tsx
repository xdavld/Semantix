import { SignupForm } from "@/components/signup/signup-form";

export default function SignupPage() {
    return (
    <div className="flex min-h-svh flex-col items-center justify-items-center p-6 md:p-16">
        <div className="w-full max-w-sm md:max-w-3xl">
            <SignupForm />
        </div>
    </div>
    );
}