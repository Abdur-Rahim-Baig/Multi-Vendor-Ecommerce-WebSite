import { Footer } from "@/modules/tenants/ui/components/footer";
import { Navbar } from "@/modules/checkout/ui/components/navbar";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}
const Layout = async ({ children, params }: LayoutProps) => {
  const { slug } = await params;

  return (
    <div className="min-h-dvh bg-[#F4F4F0] flex flex-col">
        <Navbar slug={slug} />
        <main className="flex-1 pb-[calc(5rem+env(safe-area-inset-bottom))]">
          <div className="max-w-(--breakpoint-xl) mx-auto">
            {children}
          </div>
        </main>
      <Footer />
    </div>
  );
}

export default Layout;