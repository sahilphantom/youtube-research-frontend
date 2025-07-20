import { useAuth } from '../context/AuthContext';
import SubscriptionStatus from './SubscriptionStatus';

export default function Home() {
  const { token, isSubscribed } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Welcome to YouTube Research Tool
      </h1>

      {token && <SubscriptionStatus />}

      <div className="prose max-w-none">
        <h2>Analyze YouTube Content Like Never Before</h2>
        <p>
          Our powerful tool helps you research and analyze YouTube videos, channels,
          and trends with detailed insights and data exports.
        </p>

        {!token && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-blue-700">
              Please log in to access our research tools.
            </p>
          </div>
        )}

        {token && !isSubscribed && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
            <p className="text-yellow-700">
              Subscribe to unlock all research features.
            </p>
          </div>
        )}

        {token && isSubscribed && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
            <p className="text-green-700">
              You have full access to all features. Start analyzing!
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 