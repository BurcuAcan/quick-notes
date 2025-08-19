"use client";
import type { Metadata } from "next";
import "./globals.css";
import React, { useEffect, useState } from "react";



import ThemeToggleButton from '../components/atoms/ThemeToggleButton';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
  {children}
      </body>
    </html>
  );
}
