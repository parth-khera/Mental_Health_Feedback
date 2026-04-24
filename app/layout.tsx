import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://klinixy-a-medical-therepy-website.vercel.app'),
  title: {
    default: 'Klinixy — Medical Therapy Feedback',
    template: '%s | Klinixy',
  },
  description: 'Share your Klinixy therapy session experience. Help us improve our medical therapy services with your honest, confidential feedback.',
  keywords: ['Klinixy', 'medical therapy', 'therapy feedback', 'patient feedback', 'mental health', 'holistic care', 'therapy review'],
  authors: [{ name: 'Klinixy' }],
  creator: 'Klinixy',
  publisher: 'Klinixy',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://klinixy-a-medical-therepy-website.vercel.app',
    siteName: 'Klinixy',
    title: 'Klinixy — Medical Therapy Feedback',
    description: 'Share your Klinixy therapy session experience. Help us improve our medical therapy services.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Klinixy - Medical Therapy Feedback',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Klinixy — Medical Therapy Feedback',
    description: 'Share your Klinixy therapy session experience. Confidential and secure.',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'your-google-site-verification',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RS6FZVBLKS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RS6FZVBLKS');
          `}
        </Script>
      </body>
    </html>
  )
}
