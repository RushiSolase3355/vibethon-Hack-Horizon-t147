import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

type PlatformShellProps = {
  children: React.ReactNode;
};

export function PlatformShell({ children }: PlatformShellProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-radial-grid">
      <Navbar />
      <div className="px-4 pb-20 pt-28 sm:px-6 lg:px-8">{children}</div>
      <Footer />
    </main>
  );
}
