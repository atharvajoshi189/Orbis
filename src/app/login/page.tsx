import StudentLoginForm from "@/components/auth/StudentLoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | Orbis Student Portal",
    description: "Access your student dashboard and resources.",
};

export default function LoginPage() {
    return <StudentLoginForm />;
}
