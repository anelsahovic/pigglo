import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={` ${plusJakartaSans.variable} antialiased relative`}>
          <Navbar />
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
