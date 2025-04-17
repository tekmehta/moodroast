"use client"

import { FaCamera, FaComments, FaEye, FaExchangeAlt } from 'react-icons/fa';
import Navbar from './components/Navbar';
import Link from 'next/link';
import './blob-animation.css'; // We'll create this file next
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-10 md:pt-16 pb-16 md:pb-24 px-4" aria-labelledby="hero-heading">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                  FaceDetect
                </span>
                <br />
                <strong>Discover the <span className="text-pink-600">story</span> behind your photos</strong>
              </h1>
              <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-600">
                <strong>Explore your images with our AI-powered tools.</strong> Get personalized comments on your selfies
                and compare faces with precision technology.
              </p>
              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/photo-analyzer" className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:-translate-y-1" aria-label="Try Photo Analyzer">
                  Try Photo Analyzer
                </Link>
                <Link href="/image-compare" className="inline-block px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg shadow-lg hover:bg-gray-50 transition duration-300 transform hover:-translate-y-1" aria-label="Compare Images">
                  Compare Images
                </Link>
              </div>
            </div>
            <div className="relative mt-10 md:mt-0 h-[400px] md:h-auto" aria-hidden="true">
              <div className="absolute -top-6 -left-6 w-60 md:w-72 h-60 md:h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-4 -right-4 w-60 md:w-72 h-60 md:h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute -right-8 top-1/2 w-60 md:w-72 h-60 md:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>
              <div className="relative">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <figure className="h-48 md:h-64 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition duration-500 bg-white p-2">
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <FaCamera className="text-4xl md:text-5xl text-indigo-500 opacity-80" aria-label="Photo Analysis Icon" />
                    </div>
                  </figure>
                  <figure className="h-48 md:h-64 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition duration-500 bg-white p-2 mt-6 md:mt-8">
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <FaComments className="text-4xl md:text-5xl text-pink-500 opacity-80" aria-label="AI Comments Icon" />
                    </div>
                  </figure>
                  <figure className="h-48 md:h-64 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition duration-500 bg-white p-2 mt-3 md:mt-4">
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <FaExchangeAlt className="text-4xl md:text-5xl text-purple-500 opacity-80" aria-label="Face Comparison Icon" />
                    </div>
                  </figure>
                  <figure className="h-48 md:h-64 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition duration-500 bg-white p-2 mt-9 md:mt-12">
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <FaEye className="text-4xl md:text-5xl text-indigo-500 opacity-80" aria-label="Private Analysis Icon" />
                    </div>
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-white" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto px-4">
          <h2 id="features-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10 md:mb-16">
            Discover What Makes Us <span className="text-indigo-600">Special</span>
          </h2>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            <article className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 md:p-8 rounded-xl shadow-lg transform transition duration-500 hover:scale-105">
              <header>
                <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 md:mb-6">
                  <FaCamera className="text-xl md:text-2xl text-indigo-600" aria-hidden="true" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Analyze Your Photos</h3>
              </header>
              <p className="text-sm md:text-base text-gray-600">
                Get <strong>personality insights</strong>, style analysis, mood interpretations, and fun observations about your selfies and portraits.
              </p>
            </article>
            
            <article className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 md:p-8 rounded-xl shadow-lg transform transition duration-500 hover:scale-105">
              <header>
                <div className="w-12 h-12 md:w-16 md:h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4 md:mb-6">
                  <FaExchangeAlt className="text-xl md:text-2xl text-pink-600" aria-hidden="true" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Compare Faces</h3>
              </header>
              <p className="text-sm md:text-base text-gray-600">
                See how similar two photos are with our <strong>advanced face comparison technology</strong>. Perfect for finding your celebrity lookalike!
              </p>
            </article>
            
            <article className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 md:p-8 rounded-xl shadow-lg transform transition duration-500 hover:scale-105 sm:col-span-2 md:col-span-1 mx-auto sm:mx-0 max-w-md sm:max-w-none">
              <header>
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 md:mb-6">
                  <FaEye className="text-xl md:text-2xl text-blue-600" aria-hidden="true" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Private Analysis</h3>
              </header>
              <p className="text-sm md:text-base text-gray-600">
                Our analysis happens right on your device. Your <strong>photos stay private</strong> and are never stored on our servers.
              </p>
            </article>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section (Added for SEO) */}
      <section className="py-12 md:py-20 bg-gray-50" aria-labelledby="testimonials-heading">
        <div className="max-w-6xl mx-auto px-4">
          <h2 id="testimonials-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10 md:mb-16">
            What Our Users <span className="text-indigo-600">Say</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <blockquote className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-gray-600 italic mb-4">"I've been amazed at how accurate the face comparison is! It correctly identified photos of me from 10 years apart with 92% similarity."</p>
              <footer className="flex items-center">
                <div className="w-10 h-10 bg-indigo-100 rounded-full mr-3"></div>
                <cite className="not-italic">
                  <span className="font-semibold text-gray-900 block">Sarah Johnson</span>
                  <span className="text-sm text-gray-500">Photographer</span>
                </cite>
              </footer>
            </blockquote>
            
            <blockquote className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-gray-600 italic mb-4">"The personality insights are spot on! FaceDetect gave me comments about my photos that made me laugh because they were so accurate."</p>
              <footer className="flex items-center">
                <div className="w-10 h-10 bg-pink-100 rounded-full mr-3"></div>
                <cite className="not-italic">
                  <span className="font-semibold text-gray-900 block">Michael Chen</span>
                  <span className="text-sm text-gray-500">Social Media Manager</span>
                </cite>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>
      
      {/* FAQ Section (Added for SEO) */}
      <section className="py-12 md:py-20 bg-white" aria-labelledby="faq-heading">
        <div className="max-w-4xl mx-auto px-4">
          <h2 id="faq-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10 md:mb-16">
            Frequently Asked <span className="text-indigo-600">Questions</span>
          </h2>
          
          <dl className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <dt className="text-lg font-semibold text-gray-900 mb-2">How accurate is the face comparison?</dt>
              <dd className="text-gray-600">Our face comparison technology uses advanced facial recognition algorithms to analyze over 68 facial landmarks, providing highly accurate similarity scores between faces.</dd>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <dt className="text-lg font-semibold text-gray-900 mb-2">Is my data secure?</dt>
              <dd className="text-gray-600">Yes! Your privacy is our priority. All image processing happens directly on your device, and we never store your photos on our servers.</dd>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <dt className="text-lg font-semibold text-gray-900 mb-2">How does the photo analyzer work?</dt>
              <dd className="text-gray-600">Our AI-powered photo analyzer uses facial detection to identify and analyze your facial expressions, features, and characteristics to generate personalized, fun comments about your photos.</dd>
            </div>
          </dl>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white" aria-labelledby="cta-heading">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 id="cta-heading" className="text-2xl sm:text-3xl font-bold mb-4 md:mb-6">Ready to Discover the Story Behind Your Photos?</h2>
          <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6 md:mb-8">
            Join thousands of users who are already unlocking insights about their images with our cutting-edge technology.
          </p>
          <Link href="/photo-analyzer" className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-white text-indigo-600 font-medium rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 transform hover:-translate-y-1" aria-label="Get Started with FaceDetect">
            Get Started Now
          </Link>
        </div>
      </section>
    </>
  );
} 