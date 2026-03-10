import { Geist, Geist_Mono } from "next/font/google";
import PageLoader from "./components/Loading";
import SanookBot from "./components/SanookBot";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ShopSanook - ช้อปสนุก",
  description: "แหล่งรวมสินค้าคุณภาพดี",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PageLoader>
          {children}
        </PageLoader>
        <SanookBot />
      </body>
    </html>
  );
}