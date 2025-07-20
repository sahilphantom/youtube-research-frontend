import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AccountPage() {
  const { user } = useAuth();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanName = (plan) => {
    switch (plan) {
      case 'start':
        return 'Start Plan';
      case 'basic':
        return 'Basic Plan';
      default:
        return 'No Plan';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription Details</h2>
        
        {user?.isSubscribed ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Current Plan</label>
              <p className="mt-1 text-lg text-gray-900">{getPlanName(user.subscriptionPlan)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Status</label>
              <span className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.subscriptionStatus)}`}>
                {user.subscriptionStatus?.charAt(0).toUpperCase() + user.subscriptionStatus?.slice(1)}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Renewal Date</label>
              <p className="mt-1 text-lg text-gray-900">{formatDate(user.subscriptionEndsAt)}</p>
            </div>

            {user.subscriptionStatus === 'active' && (
              <div className="mt-6">
                <Link
                  to="/pricing"
                  className="inline-flex items-center px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50"
                >
                  Change Plan
                </Link>
              </div>
            )}

            {user.subscriptionStatus === 'past_due' && (
              <div className="mt-6">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Your payment is past due. Please update your payment method to continue using our services.
                      </p>
                    </div>
                  </div>
                </div>
                <Link
                  to="/pricing"
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Update Payment Method
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">You don't have an active subscription.</p>
            <Link
              to="/pricing"
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              View Plans
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 