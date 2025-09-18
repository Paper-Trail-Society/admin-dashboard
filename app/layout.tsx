import { AuthProvider } from "@/lib/contexts/auth-context";
import ReactQueryProviders from "@/lib/react-query/provider";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DeSci NG",
  description: "Decentralized Science Nigeria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.className} antialiased`}>
        <ReactQueryProviders>
          <AuthProvider>{children}</AuthProvider>
        </ReactQueryProviders>
        <Toaster richColors />
      </body>
    </html>
  );
}
