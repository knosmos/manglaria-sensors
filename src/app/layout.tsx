import type { Metadata } from "next";
import { Geist, Geist_Mono, Open_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const WWFFont = localFont({
  src: "../../public/WWF.otf",
  variable: "--font-wwf",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ManglarIA Sensor Inventory",
  description: "Visualization of sensor locations for the ManglarIA project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${WWFFont.variable} ${openSans} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
