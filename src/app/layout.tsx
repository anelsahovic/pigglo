import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Toaster } from 'sonner';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Customize as needed
  variable: '--font-plus-jakarta',
  display: 'swap',
});
export const metadata: Metadata = {
  title: 'Pigglo Balance App',
  description: 'Manage your balance across all wallets',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = getKindeServerSession();
  const hasSession = await isAuthenticated();

  return (
    <AuthProvider>
      <html lang="en">
        <body className={` ${plusJakartaSans.variable} antialiased relative`}>
          {hasSession ? (
            <SidebarProvider hasSession={hasSession}>
              <Navbar />
              <main className="relative w-full">
                <SidebarTrigger />

                <div className="p-4 sm:pt-10">{children}</div>
              </main>
            </SidebarProvider>
          ) : (
            <main>{children}</main>
          )}
          <Toaster richColors position="top-center" />
        </body>
      </html>
    </AuthProvider>
  );
}
