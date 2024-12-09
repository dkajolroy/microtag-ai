import TopHeader from "@/components/heading/topHeader";
import ToastProvider from "@/provider/toastProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});
export const metadata: Metadata = {
  title: "Microtag AI",
  description:
    "Free Photo tag generate with Microtag AI. Enhance your microstock profile, photo tagging and any other work just simple.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ToastProvider>
          <TopHeader />
          {children}
          <div className="h-20 flex justify-center flex-col items-center p-2 bg-gray-200 dark:bg-gray-800">
            <p className="text-sm">
              © Copyright {new Date().getFullYear()}. All Rights Reserved.{" "}
              <a
                target="_blank"
                href="https://www.facebook.com/dkajolroy"
                className="text-blue-500 hover:text-blue-700 underline"
              >
                Developer
              </a>
            </p>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
