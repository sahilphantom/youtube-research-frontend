import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Welcome back, {user?.email}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Video Search Tool */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Video Search
          </h2>
          <p className="text-gray-600 mb-4">
            Search and analyze YouTube videos based on your criteria.
          </p>
          <Link
            to="/video-search"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Start Searching
          </Link>
        </div>

        {/* Video Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Video Analysis
          </h2>
          <p className="text-gray-600 mb-4">
            Get detailed analytics and insights for specific videos.
          </p>
          <Link
            to="/video-analysis"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Analyze Videos
          </Link>
        </div>

        {/* Channel Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Channel Analysis
          </h2>
          <p className="text-gray-600 mb-4">
            Research and analyze YouTube channels and their performance.
          </p>
          <Link
            to="/channel-analysis"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Research Channels
          </Link>
        </div>

        {/* Subscription Status */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Subscription Status
          </h2>
          <div className="space-y-2">
            <p className="text-gray-600">
              Plan: {user?.subscriptionPlan || 'No active plan'}
            </p>
            <p className="text-gray-600">
              Status: {user?.subscriptionStatus || 'Not subscribed'}
            </p>
            {user?.subscriptionEndsAt && (
              <p className="text-gray-600">
                Renews: {new Date(user.subscriptionEndsAt).toLocaleDateString()}
              </p>
            )}
          </div>
          <Link
            to="/account"
            className="mt-4 inline-flex items-center px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50"
          >
            Manage Subscription
          </Link>
        </div>

        {/* Quick Links */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Links
          </h2>
          <div className="space-y-2">
            <Link
              to="/account"
              className="block text-blue-500 hover:text-blue-600"
            >
              Account Settings
            </Link>
            {user?.isAdmin && (
              <Link
                to="/admin/users"
                className="block text-blue-500 hover:text-blue-600"
              >
                Admin Panel
              </Link>
            )}
            <Link
              to="/pricing"
              className="block text-blue-500 hover:text-blue-600"
            >
              Upgrade Plan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 