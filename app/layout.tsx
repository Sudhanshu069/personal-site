import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { GlobalHotkeys } from "@/components/GlobalHotkeys";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-ibm-plex-mono",
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
      <body
        className={`${ibmPlexMono.variable} bg-mocha-base text-mocha-text h-screen w-full overflow-hidden`}
      >
        <GlobalHotkeys />
        {children}
      </body>
    </html>
  );
}
