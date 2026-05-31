"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import UserSidebar from "@/components/user/UserSidebar";
import { Menu, X, UserCircle } from "lucide-react";

export default function UserLayout({ children }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-gray-50">
      <Header />

      {/* MOBILE USER TOP BAR */}
      <div className="sticky top-0 z-30 border-b border-gray-100 bg-white px-4 py-3 shadow-sm lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600"
            aria-label="Mở menu người dùng"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex min-w-0 items-center gap-2 text-sm font-bold text-gray-800">
            <UserCircle className="h-5 w-5 shrink-0 text-emerald-600" />
            <span className="truncate">Tài khoản của tôi</span>
          </div>

          <div className="h-10 w-10" />
        </div>
      </div>

      {/* MOBILE SIDEBAR DRAWER */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileSidebarOpen(false)}
          />

          <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-white shadow-2xl">
            <div className="flex h-14 items-center justify-between border-b border-gray-100 px-4">
              <div>
                <h2 className="text-sm font-bold text-emerald-600">
                  JOBCONNECT
                </h2>
                <p className="text-xs text-gray-400">User Menu</p>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100"
                aria-label="Đóng menu người dùng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              onClick={() => setIsMobileSidebarOpen(false)}
              className="h-[calc(100vh-56px)] overflow-y-auto"
            >
              <UserSidebar isMobile />
            </div>
          </div>
        </div>
      )}

      {/* CONTENT AREA */}
      <main className="w-full flex-1">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[auto_minmax(0,1fr)]">
            {/* DESKTOP SIDEBAR */}
            <aside className="hidden lg:block">
              <div className="sticky top-20 z-20">
                <UserSidebar />
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <section className="min-w-0">{children}</section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}