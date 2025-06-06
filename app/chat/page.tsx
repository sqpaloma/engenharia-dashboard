"use client";

import { useAuth } from "@/lib/auth-context";
import { LoginForm } from "@/components/login-form";
import { ChatPage } from "@/components/chat-page";
import { Header } from "@/components/header";

export default function Chat() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <ChatPage />
    </div>
  );
}
