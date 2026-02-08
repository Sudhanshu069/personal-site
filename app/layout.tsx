import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GlobalHotkeys } from "@/components/GlobalHotkeys";

const ibmPlexMono = localFont({
  src: [
    {
      path: "../public/fonts/ibm-plex-mono-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
  ],
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
