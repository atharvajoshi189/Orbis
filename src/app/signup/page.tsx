import StudentSignupForm from "@/components/auth/StudentSignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up | Orbis Student Portal",
    description: "Join the Orbis community and unlock your potential.",
};

export default function SignupPage() {
    return <StudentSignupForm />;
}
