import "./globals.css";
import AuthProvider from "@/components/common/AuthProvider";
import { Toaster } from "react-hot-toast";
import FloatingAiChat from "@/components/ai/FloatingAiChat";
import { Be_Vietnam_Pro } from "next/font/google";

const vietnamFont = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={vietnamFont.className}>
        <AuthProvider>
          {children}
          <FloatingAiChat />
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}