import type { Metadata } from 'next';
import './globals.css';
import {Nav} from "@/components/Nav";
import {Toaster} from "@/components/Toaster";
import Providers from "@/app/Providers";

export const metadata: Metadata = {
    title: 'GENIUS AUTOWRITER',
    description: 'Generate high-quality content in Myanmar with AI.',
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning className={'bg-black'}>
        <head>
            <link rel="icon" href="/icon.ico" sizes="32*32"/>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
                href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap"
                rel="stylesheet"
            />
        </head>
        <body className="font-body antialiased bg-gradient-to-b from-black via-black to-red-950">
            <Providers>
                    <Nav/>
                    <main>{children}</main>
                    <Toaster />

                    <footer className="text-center text-xs text-muted-foreground p-4">
                        <p>Copyright &copy; Powered By 2025 Myanmar Online Technology</p>
                    </footer>
            </Providers>
        </body>

        </html>

    );
}
