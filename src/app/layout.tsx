import type { Metadata } from "next";
import "./globals.css";
import WalletProvider from "@/components/WalletProvider";

export const metadata: Metadata = {
  title: "Share Cloud — Decentralized File Storage on Shelby",
  description:
    "Upload, share, and sell files on the decentralized Shelby Network. Wallet-to-wallet sharing, encrypted previews, and a decentralized marketplace.",
  keywords: [
    "Shelby",
    "decentralized storage",
    "Web3",
    "Aptos",
    "file sharing",
    "dApp",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-grid min-h-screen">
        <div className="bg-glow-top" aria-hidden="true" />
        <WalletProvider>
          <div className="relative z-10">{children}</div>
        </WalletProvider>
      </body>
    </html>
  );
}
