import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import {Nav} from "@/components/Nav";

export const metadata: Metadata = {
  title: 'Content Crafter',
  description: 'Generate high-quality content in Myanmar with AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-black">
        <Nav/>
        {children}
        <Toaster />
        <footer className="text-center text-sm text-muted-foreground bg-black p-4">
            <p>Copyright &copy; 2025 Myanmar Online Technology</p>
        </footer>
      </body>

    </html>

  );
}
