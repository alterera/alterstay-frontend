"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { DesktopLoginDialog } from "@/components/auth/desktop-login-dialog";
import { MobileLoginDialog } from "@/components/auth/mobile-login-dialog";
import { useMediaQuery } from "@/hooks/use-media-query";

export function AuthDialogs() {
  const { isLoginOpen, setLoginOpen } = useAuth();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (isDesktop) {
    return (
      <DesktopLoginDialog open={isLoginOpen} onOpenChange={setLoginOpen} />
    );
  }

  return <MobileLoginDialog open={isLoginOpen} onOpenChange={setLoginOpen} />;
}
