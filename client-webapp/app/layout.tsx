import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Graduate Invitation – Thiệp mời thông minh',
  description:
    'Graduate Invitation là trang web tạo thiệp mời thông minh, tích hợp chatbot AI giúp bạn tạo thiệp cho lễ tốt nghiệp, sự kiện, buổi lễ… một cách nhanh chóng và tinh tế.',
  keywords: [
    'thiệp mời',
    'thiệp mời tốt nghiệp',
    'tạo thiệp online',
    'graduate invitation',
    'thiệp mời AI',
    'chatbot tạo thiệp',
    'invitation generator',
  ],
  openGraph: {
    title: 'Graduate Invitation – Tạo Thiệp Mời Với AI',
    description:
      'Trang web thiệp mời có chatbot AI thông minh. Tạo thiệp mời lễ tốt nghiệp và các buổi lễ chỉ trong vài phút.',
    siteName: 'Graduate Invitation',
    images: [
      {
        url: '/logo.webp',
        width: 1200,
        height: 630,
        alt: 'Graduate Invitation – Thiệp mời thông minh',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Graduate Invitation – AI Invitation Creator',
    description:
      'Tạo thiệp mời cho lễ tốt nghiệp với chatbot AI thông minh, dễ dùng và nhanh chóng.',
    images: ['/logo.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
  applicationName: 'Graduate Invitation',
  category: 'Invitation, AI Tool',
  icons: {
    icon: '/logo.webp',
    shortcut: '/logo.webp',
    apple: '/logo.webp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
