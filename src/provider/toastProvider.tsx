"use client";

import { SnackbarProvider } from "notistack";
import React from "react";

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SnackbarProvider anchorOrigin={{ horizontal: "right", vertical: "top" }}>
      {children}
    </SnackbarProvider>
  );
}
