import type { Metadata } from "next";
import { Sora, Chakra_Petch } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "N.A.T.A.L.I.E. — An embodied AI presence for Android XR",
  description: "A concept that reimagines N.A.T.A.L.I.E., the AI assistant from Marvel's Ironheart, as a real embodied AI presence on Android XR — a companion and hands-free co-pilot that lives in your space, remembers you, and acts on your behalf.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${chakraPetch.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-sora), system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
