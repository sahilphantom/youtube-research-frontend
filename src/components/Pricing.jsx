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
          Get access to powerful YouTube research tools
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
                {plan.description}
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
                <span className="text-base font-medium text-gray-500">/month</span>
              </motion.p>
              <motion.button
                onClick={() => handleSubscribe(plan.priceId)}
                disabled={subscribing || (user?.isSubscribed)}
                className={`mt-8 w-full py-3 px-4 rounded-lg text-white font-medium ${
                  subscribing || (user?.isSubscribed)
                    ? 'bg-gray-400 cursor-not-allowed'
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
                whileHover={!(subscribing || (user?.isSubscribed)) ? { 
                  scale: 1.05,
                  boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)"
                } : {}}
                whileTap={!(subscribing || (user?.isSubscribed)) ? { scale: 0.98 } : {}}
              >
                {user?.isSubscribed 
                  ? 'Currently Subscribed'
                  : subscribing 
                    ? 'Processing...' 
                    : `Subscribe to ${plan.name}`}
              </motion.button>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}