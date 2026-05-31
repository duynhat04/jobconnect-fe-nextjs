import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="min-w-0 flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}