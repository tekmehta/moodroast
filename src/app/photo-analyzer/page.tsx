// "use client"

import Navbar from '../components/Navbar';
import PhotoAnalyzer from '../components/PhotoAnalyzer';
import { Metadata } from 'next';
import Script from 'next/script';
import Head from 'next/head';

// We can't use this in a client component, but showing the structure
// This would be used if this were a server component
export const metadata = {
  title: 'Photo Facial Analysis | FaceDetect - AI-Powered Visual Insights',
  description: 'Get personalized insights, style analysis, and mood interpretations from your selfies with our advanced AI photo analyzer. Try our free facial analysis tool now!',
  keywords: 'facial analysis, selfie analyzer, photo insights, personality from photos, AI facial recognition, mood detection, face reading technology',
};

export default function PhotoAnalyzerPage() {
  return (
    <>
      <Head>
        <title>Photo Facial Analysis | FaceDetect - AI-Powered Visual Insights</title>
        <meta name="description" content="Get personalized insights, style analysis, and mood interpretations from your selfies with our advanced AI photo analyzer. Try our free facial analysis tool now!" />
        <meta name="keywords" content="facial analysis, selfie analyzer, photo insights, personality from photos, AI facial recognition, mood detection, face reading technology" />
      </Head>

      <Navbar />
      
      <section className="bg-gradient-to-b from-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          <header className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                Facial Analysis
              </span> - Discover Your Photo's Story
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Upload your <strong>selfie</strong> or <strong>portrait</strong> and our advanced 
              <strong> facial analysis technology</strong> will provide personalized insights about your 
              expression, style, mood, and more.
            </p>
          </header>
          
          <PhotoAnalyzer />
          
          <div className="mt-16 bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How Our Facial Analysis Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-indigo-50 p-5 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">1. Upload Your Photo</h3>
                <p>Select a clear photo of your face. Our tool works best with well-lit frontal images.</p>
              </div>
              <div className="bg-purple-50 p-5 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">2. AI Analysis</h3>
                <p>Our advanced facial detection technology analyzes facial landmarks and expressions.</p>
              </div>
              <div className="bg-pink-50 p-5 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">3. Get Insights</h3>
                <p>Receive personalized observations about your expression, style, mood, and overall vibe.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-indigo-50 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Facial Analysis FAQ</h2>
            <dl className="space-y-4">
              <div>
                <dt className="font-semibold">Is my photo data secure?</dt>
                <dd className="ml-4 text-gray-600">Yes! We process your photo locally and never store your images on our servers.</dd>
              </div>
              <div>
                <dt className="font-semibold">What kind of insights will I receive?</dt>
                <dd className="ml-4 text-gray-600">Our analysis provides fun comments about your expression, personality traits, style assessment, mood interpretation, and overall vibe.</dd>
              </div>
              <div>
                <dt className="font-semibold">How accurate is the facial analysis?</dt>
                <dd className="ml-4 text-gray-600">Our tool uses advanced facial detection technology to provide engaging insights, though results are meant to be entertaining rather than scientific.</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
      
      <Script
        id="photo-analyzer-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            'name': 'FaceDetect Photo Analysis Tool',
            'applicationCategory': 'Photography',
            'operatingSystem': 'Web',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'USD'
            },
            'description': 'AI-powered tool for analyzing facial expressions, style, and mood in photos.',
            'aggregateRating': {
              '@type': 'AggregateRating',
              'ratingValue': '4.9',
              'ratingCount': '835',
              'bestRating': '5',
              'worstRating': '1'
            }
          })
        }}
      />
    </>
  );
} 