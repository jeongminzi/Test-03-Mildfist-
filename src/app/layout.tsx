import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "MildFist - AI Virtual Fitting",
  description: "AI 기반 패션 가상 피팅 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-default text-text-neutral font-sans">
        <AuthProvider>
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <footer className="flex items-center justify-center px-6 py-4 border-t border-border-muted">
            <p className="text-xs text-text-neutral-subtle">
              MildFist &middot; Powered by Gemini AI
            </p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
