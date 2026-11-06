import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Edcode",
  description: "Platform pembelajaran SMK PPLG",
  icons: {
    icon: "/EdcodeLogoTitle.png",
    shortcut: "/EdcodeLogoTitle.png",
    apple: "/EdcodeLogoTitle.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>{children}</body>
    </html>
  );
}
