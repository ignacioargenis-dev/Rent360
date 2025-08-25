import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rent360 - Plataforma Líder en Arriendos de Chile",
  description: "Gestiona, arrienda y encuentra propiedades con la seguridad y transparencia que mereces. La plataforma completa para propietarios, inquilinos y corredores.",
  keywords: ["Rent360", "arriendo", "propiedades", "Chile", "casas", "departamentos", "corredores", "propietarios", "inquilinos"],
  authors: [{ name: "Rent360 Team" }],
  openGraph: {
    title: "Rent360 - Plataforma Líder en Arriendos",
    description: "La plataforma completa para gestionar arriendos en Chile con seguridad y transparencia.",
    url: "https://rent360.cl",
    siteName: "Rent360",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rent360 - Plataforma Líder en Arriendos",
    description: "La plataforma completa para gestionar arriendos en Chile con seguridad y transparencia.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
