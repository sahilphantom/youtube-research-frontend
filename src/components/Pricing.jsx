import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
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
      // console.log(response.data.plans)
      
    } catch (err) {
      setError('Failed to load subscription plans');
      console.error('Error fetching plans:', err);
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

  // Helper function to get plan description
  const getPlanDescription = (planId) => {
    const descriptions = {
      'start': 'YouTubeリサーチの入門に最適',
'basic': '本格的なクリエイター向けの高度な機能',
    };
    return descriptions[planId] || 'Access to YouTube research tools';
  };

  // Helper function to format interval display
  const formatInterval = (interval) => {
    if (!interval) return '/month';
    return `/${interval}`;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="py-12  px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h2 
          className="text-3xl font-extrabold text-gray-900 sm:text-4xl"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Choose Your Plan
        </motion.h2>
        <motion.p 
          className="mt-4 text-xl text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
        '強力なYouTubeリサーチツールにアクセスしましょう
        </motion.p>
      </motion.div>

      {error && (
        <motion.div 
          className="max-w-lg mx-auto mt-6"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
          <div className="bg-red-50 text-red-500 p-3 rounded-lg">
            {error}
          </div>
        </motion.div>
      )}

      <motion.div 
        className="mt-12   max-w-lg mx-auto grid gap-8 lg:grid-cols-2 lg:max-w-4xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            className="bg-white rounded-lg shadow-lg divide-y divide-gray-200"
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.2,
              type: "spring",
              stiffness: 80,
              damping: 15
            }}
            whileHover={{ 
              scale: 1.02, 
              y: -5,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div 
              className="p-6 text-center  border-indigo-500 border-2 rounded-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
            >
              <motion.h3 
                className="text-2xl font-bold text-gray-900"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 + 0.5 }}
              >
                {plan.name}
              </motion.h3>
              <motion.p 
                className="mt-4 text-gray-500"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 + 0.6 }}
              >
                {getPlanDescription(plan.id)}
              </motion.p>
              <motion.p 
                className="mt-8"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2 + 0.7,
                  type: "spring",
                  stiffness: 120
                }}
              >
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-base font-medium text-gray-500">{formatInterval(plan.interval)}</span>
              </motion.p>
              
              {/* Display additional plan info if available */}
              {plan.currency && plan.currency !== 'jpy' && (
                <motion.p 
                  className="mt-2 text-sm text-gray-400"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.2 + 0.8 }}
                >
                  Currency: {plan.currency.toUpperCase()}
                </motion.p>
              )}

              <motion.button
                onClick={() => handleSubscribe(plan.priceId)}
                disabled={subscribing || (user?.isSubscribed && user?.subscriptionPlan === plan.id)}
                className={`mt-8 w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${
                  subscribing || (user?.isSubscribed && user?.subscriptionPlan === plan.id)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : user?.isSubscribed && user?.subscriptionPlan !== plan.id
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : 'bg-indigo-500 hover:bg-indigo-600'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.2 + 0.8,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={!(subscribing || (user?.isSubscribed && user?.subscriptionPlan === plan.id)) ? { 
                  scale: 1.05,
                  boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)"
                } : {}}
                whileTap={!(subscribing || (user?.isSubscribed && user?.subscriptionPlan === plan.id)) ? { scale: 0.98 } : {}}
              >
                {user?.isSubscribed && user?.subscriptionPlan === plan.id
                  ? 'Current Plan'
                  : user?.isSubscribed && user?.subscriptionPlan !== plan.id
                    ? `Switch to ${plan.name}`
                    : subscribing 
                      ? 'Processing...' 
                      : `Subscribe to ${plan.name}`}
              </motion.button>

              {/* Show current plan indicator */}
              {user?.isSubscribed && user?.subscriptionPlan === plan.id && (
                <motion.div
                  className="mt-3 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.2 + 1 }}
                >
                  <div className="flex items-center space-x-1 text-green-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Active</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {plans.length === 0 && !loading && (
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gray-500">現在、利用可能なサブスクリプションプランはありません。</p>
        </motion.div>
      )}
    </motion.div>
  );
}