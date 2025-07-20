import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/stripe/plans');
      setPlans(response.data.plans);
    } catch (err) {
      setError('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (priceId) => {
    if (!user) {
      return navigate('/login', { 
        state: { from: { pathname: '/pricing' } }
      });
    }

    setSubscribing(true);
    try {
      const response = await api.post('/stripe/create-checkout-session', { priceId });
      window.location.href = response.data.url;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start checkout');
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Choose Your Plan
        </h2>
        <p className="mt-4 text-xl text-gray-600">
          Get access to powerful YouTube research tools
        </p>
      </div>

      {error && (
        <div className="max-w-lg mx-auto mt-6">
          <div className="bg-red-50 text-red-500 p-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      <div className="mt-12 max-w-lg mx-auto grid gap-8 lg:grid-cols-2 lg:max-w-4xl">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-lg shadow-lg divide-y divide-gray-200"
          >
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
              <p className="mt-4 text-gray-500">{plan.description}</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-base font-medium text-gray-500">/month</span>
              </p>
              <button
                onClick={() => handleSubscribe(plan.priceId)}
                disabled={subscribing || (user?.isSubscribed)}
                className={`mt-8 w-full py-3 px-4 rounded-lg text-white font-medium ${
                  subscribing || (user?.isSubscribed)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {user?.isSubscribed 
                  ? 'Currently Subscribed'
                  : subscribing 
                    ? 'Processing...' 
                    : `Subscribe to ${plan.name}`}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 