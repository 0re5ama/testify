import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Questions',
    description: 'School Questions',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <nav>
                    <ul>
                        <li>
                            <Link href="/">Create</Link>
                        </li>
                        <li>
                            <Link href="/print">Print</Link>
                        </li>
                    </ul>
                </nav>
                {children}
            </body>
        </html>
    );
}
