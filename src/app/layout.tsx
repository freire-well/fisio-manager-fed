import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import { AppProvider } from "@/contexts/AppContext";
import "./global.css";

const workSans = Work_Sans({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-work-sans',
});

export const metadata: Metadata = {
  title: "FisioManager",
  description: "Gestor de Fisioterapia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="pt-BR">
      <body className={workSans.className}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}