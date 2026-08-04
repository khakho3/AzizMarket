import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/common/auth-shell";
import { LoginForm } from "@/components/common/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your AzizMarket account.",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to your account"
      description="Access your orders, messages, saved products and marketplace tools."
    >
      <LoginForm />
      <p className="mt-7 text-center text-sm text-slate-500">
        New to AzizMarket?{" "}
        <Link href="/register" className="font-extrabold text-emerald-700 hover:text-emerald-800">Create an account</Link>
      </p>
    </AuthShell>
  );
}
