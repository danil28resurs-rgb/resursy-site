import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ 
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "700", "900"]
});

export const metadata: Metadata = {
  title: "ООО «Ресурсы» — Бетон, щебень, песок в Кызыле",
  description: "Полный цикл: от карьера до объекта. Своё производство, своя техника, доставка по Кызылу и Республике Тыва.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={montserrat.className}>
        {children}
      </body>
    </html>
  );
}