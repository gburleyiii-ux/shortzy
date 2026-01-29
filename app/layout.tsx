import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shortzy - URL Shortener & QR Code Generator | Free Link Shortener",
  description: "Free online link shortener with QR codes and analytics. Create branded short links 3x cheaper than bit.ly. Unlimited links for $9/mo.",
  keywords: "link shortener, url shortener, short url, qr code generator, branded links, link analytics, bit.ly alternative",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
