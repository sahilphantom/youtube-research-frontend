import React from 'react';
import { useAuth } from '../context/AuthContext';
import SubscriptionStatus from './SubscriptionStatus';
import Hero from './Hero';
import Pricing from './Pricing';
import Feature from './Feature';
import FAQ from './FAQ';

export default function Home() {
  const { token, isSubscribed } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <Hero />
      {/* Features Section */}
      <Feature />
     
     
     <FAQ />


      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        {token && <SubscriptionStatus />}

        {!token && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Ready to unlock powerful insights?
            </h3>
            <p className="text-blue-700">
              Please log in to access our comprehensive YouTube research tools.
            </p>
          </div>
        )}

        {token && !isSubscribed && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Upgrade to Premium
            </h3>
            <p className="text-yellow-700">
              Subscribe to unlock all research features and advanced analytics.
            </p>
          </div>
        )}

        {token && isSubscribed && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Welcome back! 🎉
            </h3>
            <p className="text-green-700">
              You have full access to all features. Start analyzing and discover the next viral hit!
            </p>
          </div>
        )}

        <div className="prose max-w-none mt-12">
          <h2 className="text-3xl font-bold mb-6">Analyze YouTube Content Like Never Before</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Our powerful tool helps you research and analyze YouTube videos, channels,
            and trends with detailed insights and data exports. Discover what makes content go viral
            and optimize your strategy with data-driven decisions.
          </p>
        </div>
      </div>
    </div>
  );
}