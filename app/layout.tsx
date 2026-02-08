import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TerminalWindow } from "@/components/Terminal/Window";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "sudhanshu@dev:~",
  description: "Senior Frontend Engineer & Terminal Enthusiast",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} antialiased bg-mocha-base text-mocha-text min-h-screen flex flex-col items-center justify-center p-4 md:p-8 overscroll-none`}>
        <TerminalWindow>
          {children}
        </TerminalWindow>
      </body>
    </html>
  );
}
