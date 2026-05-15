import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import UserSidebar from '@/components/user/UserSidebar';

export default function UserLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-row gap-6 items-start">
          
          <aside className="hidden lg:block sticky top-24 z-20 transition-all duration-500 ease-in-out">
            <UserSidebar />
          </aside>

          <section className="flex-grow min-w-0">
            {children}
          </section>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
}