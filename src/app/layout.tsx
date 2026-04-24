import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";
import Header from "@/components/Header";
import { ToastProvider } from "@/components/molecules/Toast";

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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,300..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-default text-text-neutral font-sans">
        <AuthProvider>
          <ToastProvider>
            <Header />
            <main className="flex-1 flex flex-col">{children}</main>
            <footer className="flex items-center justify-center px-6 py-4 border-t border-border-muted">
              <p className="text-xs text-text-neutral-subtle">
                MildFist &middot; Powered by Gemini AI
              </p>
            </footer>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
