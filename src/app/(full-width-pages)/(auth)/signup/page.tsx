import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content Dashboard",
  description: "This is Next.js SignUp Page TailAdmin Dashboard Template",
};

export default function SignUp() {
  return <SignUpForm />;
}
