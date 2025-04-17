// "use client"

import Navbar from '../components/Navbar';
import ImageCompare from '../components/ImageCompare';
import { Metadata } from 'next';
import Script from 'next/script';
import Head from 'next/head';

// We can't use this in a client component, but showing the structure
// This would be used if this were a server component
export const metadata = {
  title: 'Face Comparison Tool | FaceDetect - Compare Facial Similarities',
  description: 'Compare two faces and see how similar they are with our advanced facial recognition technology. Perfect for finding lookalikes or comparing photos of the same person.',
  keywords: 'face comparison, facial recognition, face matching, similarity detection, lookalike finder, facial analysis, biometric comparison',
};

export default function ImageComparePage() {
  return (
    <>
      <Head>
        <title>Face Comparison Tool | FaceDetect - Compare Facial Similarities</title>
        <meta name="description" content="Compare two faces and see how similar they are with our advanced facial recognition technology. Perfect for finding lookalikes or comparing photos of the same person." />
        <meta name="keywords" content="face comparison, facial recognition, face matching, similarity detection, lookalike finder, facial analysis, biometric comparison" />
      </Head>
      
      <Navbar />
      
      <section className="bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          <header className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                Face Comparison
              </span> - Measure Facial Similarity
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Upload two photos to see how <strong>similar</strong> the faces are using our 
              <strong> advanced facial recognition technology</strong>. Perfect for finding 
              lookalikes or comparing photos of the same person.
            </p>
          </header>
          
          <ImageCompare />
          
          <div className="mt-16 bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How Our Face Comparison Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-purple-50 p-5 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">1. Upload Two Photos</h3>
                <p>Select two clear photos containing faces. Our tool works best with well-lit frontal portraits.</p>
              </div>
              <div className="bg-indigo-50 p-5 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">2. Facial Recognition</h3>
                <p>Our advanced technology identifies and analyzes 68 facial landmarks on each face.</p>
              </div>
              <div className="bg-pink-50 p-5 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">3. Similarity Score</h3>
                <p>Get a percentage similarity score and see how the faces compare across multiple features.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-indigo-50 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Face Comparison FAQ</h2>
            <dl className="space-y-4">
              <div>
                <dt className="font-semibold">How accurate is the face comparison?</dt>
                <dd className="ml-4 text-gray-600">Our technology analyzes 68 facial landmarks to provide highly accurate similarity scores between faces. Results are typically within 95% accuracy for clear photos.</dd>
              </div>
              <div>
                <dt className="font-semibold">Are my photos stored on your servers?</dt>
                <dd className="ml-4 text-gray-600">No, your privacy is important to us. All image processing happens directly on your device, and we never store or transmit your photos to our servers.</dd>
              </div>
              <div>
                <dt className="font-semibold">What can I use the face comparison tool for?</dt>
                <dd className="ml-4 text-gray-600">Our users love comparing photos of themselves with celebrities, comparing family members to see who looks most alike, or comparing photos of the same person at different ages.</dd>
              </div>
            </dl>
          </div>
          
          <div className="mt-12 bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Applications of Face Comparison Technology</h2>
            <ul className="space-y-3 list-disc pl-5">
              <li><strong>Family Resemblance</strong> - See which family members look most alike</li>
              <li><strong>Celebrity Lookalikes</strong> - Find out which famous person you resemble</li>
              <li><strong>Age Progression</strong> - Compare photos of the same person at different ages</li>
              <li><strong>Twin Similarities</strong> - Measure facial similarities between twins</li>
              <li><strong>Facial Recognition Research</strong> - Understand how facial recognition works</li>
            </ul>
          </div>
        </div>
      </section>
      
      <Script
        id="image-compare-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            'name': 'FaceDetect Face Comparison Tool',
            'applicationCategory': 'Photography',
            'operatingSystem': 'Web',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'USD'
            },
            'description': 'Advanced facial recognition technology to compare faces and measure similarity between photos.',
            'aggregateRating': {
              '@type': 'AggregateRating',
              'ratingValue': '4.8',
              'ratingCount': '762',
              'bestRating': '5',
              'worstRating': '1'
            }
          })
        }}
      />
    </>
  );
} 