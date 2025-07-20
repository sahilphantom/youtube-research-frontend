import { useState, useEffect } from 'react';
import api from '../services/api';

export default function SubscriptionStatus() {
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await api.get('/auth/verify');
        setSubscriptionInfo(response.data);
      } catch (error) {
        console.error('Error fetching subscription status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, []);

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-20 rounded-lg"></div>;
  }

  if (!subscriptionInfo?.isSubscribed) {
    return null;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Subscription Status
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-600">
              Plan: <span className="font-medium text-gray-900">{subscriptionInfo.subscriptionPlan === 'start' ? 'Start Plan' : 'Basic Plan'}</span>
            </p>
            <p className="text-sm text-gray-600">
              Status: {' '}
              <span className={`font-medium ${
                subscriptionInfo.subscriptionStatus === 'active' 
                  ? 'text-green-600' 
                  : 'text-yellow-600'
              }`}>
                {subscriptionInfo.subscriptionStatus.charAt(0).toUpperCase() + 
                 subscriptionInfo.subscriptionStatus.slice(1)}
              </span>
            </p>
            {subscriptionInfo.subscriptionEndsAt && (
              <p className="text-sm text-gray-600">
                Next billing date: <span className="font-medium text-gray-900">{formatDate(subscriptionInfo.subscriptionEndsAt)}</span>
              </p>
            )}
          </div>
        </div>
        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
          subscriptionInfo.subscriptionStatus === 'active'
            ? 'bg-green-100 text-green-600'
            : 'bg-yellow-100 text-yellow-600'
        }`}>
          {subscriptionInfo.subscriptionStatus === 'active' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
} 