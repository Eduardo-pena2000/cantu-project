import { Geist, Geist_Mono, Oswald } from "next/font/google";

import "./globals.css";

import { AuthProvider } from "@/context/AuthProvider";
import { QueryProvider } from "@/context/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata = {
  title: "El Ofertón de Cantú — Gestión",
  description: "Sistema de administración de sucursales El Ofertón de Cantú. Gestiona empleados, turnos, actividades, equipos de trabajo y asistencia.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`bg-background ${geistSans.variable} ${geistMono.variable} ${oswald.variable} antialiased min-h-svh w-screen overflow-x-hidden font-sans`}
      >
        <AuthProvider>
          <QueryProvider>{children}</QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
