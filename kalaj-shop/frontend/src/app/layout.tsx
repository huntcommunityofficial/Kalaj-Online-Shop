import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToastProvider from "@/contexts/ToastContext";
import ThemeProvider from "@/contexts/ThemeContext";
import CartDrawer from "@/components/CartDrawer";
import CustomCursor from "@/components/CustomCursor";
import SupportWidget from "@/components/SupportWidget";

export const metadata: Metadata = {
  title: "کالاژ | فروشگاه اینترنتی",
  description: "خرید آنلاین انواع کالا با بهترین قیمت",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className="h-full">
      <body className="min-h-full flex flex-col antialiased custom-cursor-active">
        <ThemeProvider>
          <ToastProvider>
            <CustomCursor />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <SupportWidget />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
