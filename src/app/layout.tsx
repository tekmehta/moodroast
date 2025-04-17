import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'FaceDetect - AI Photo Analysis and Face Comparison',
  description: 'Advanced AI-powered tool for face detection, photo analysis, and face comparison. Get fun personality insights and compare facial similarities with our cutting-edge technology.',
  keywords: 'face detection, photo analysis, AI photo tool, facial recognition, face comparison, selfie analyzer, personality insights, image analysis, face matching',
  authors: [{ name: 'LJ Service' }],
  creator: 'LJ Service',
  publisher: 'LJ Service',
  robots: 'index, follow',
  openGraph: {
    title: 'FaceDetect - AI Photo Analysis and Face Comparison',
    description: 'Advanced AI-powered tool for face detection, photo analysis, and face comparison. Get fun personality insights and compare facial similarities.',
    url: 'https://facedetect.example.com',
    siteName: 'FaceDetect',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FaceDetect AI Photo Analysis',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FaceDetect - AI Photo Analysis and Face Comparison',
    description: 'Advanced AI-powered tool for face detection, photo analysis, and face comparison.',
    images: ['/images/twitter-image.jpg'],
    creator: '@ljservice',
  },
  alternates: {
    canonical: 'https://facedetect.example.com',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#6366F1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <Script
          id="schema-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              'name': 'FaceDetect',
              'url': 'https://facedetect.example.com',
              'description': 'Advanced AI-powered tool for face detection, photo analysis, and face comparison.',
              'applicationCategory': 'Photography',
              'genre': 'AI Tool',
              'operatingSystem': 'All',
              'offers': {
                '@type': 'Offer',
                'price': '0',
                'priceCurrency': 'USD',
              },
              'author': {
                '@type': 'Organization',
                'name': 'LJ Service',
                'url': 'https://ljservice.example.com',
              },
              'aggregateRating': {
                '@type': 'AggregateRating',
                'ratingValue': '4.8',
                'ratingCount': '1250',
              },
            })
          }}
        />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-900 text-white py-4 md:py-6">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-sm md:text-base text-gray-400">
              &copy; {new Date().getFullYear()} LJ Service. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
} 