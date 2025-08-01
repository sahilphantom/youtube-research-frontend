import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Download, Plus, Edit2, Trash2, Shield, ShieldOff, Calendar, Eye, EyeOff } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterSubscription, setFilterSubscription] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchUsers();
    } else {
      setError('No authentication token found');
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, filterRole, filterSubscription, sortBy, sortOrder]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Fetch users error:', err);
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // Subscription filter
    if (filterSubscription !== 'all') {
      if (filterSubscription === 'subscribed') {
        filtered = filtered.filter(user => user.isSubscribed);
      } else if (filterSubscription === 'unsubscribed') {
        filtered = filtered.filter(user => !user.isSubscribed);
      } else {
        filtered = filtered.filter(user => user.subscriptionStatus === filterSubscription);
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'createdAt' || sortBy === 'subscriptionEndsAt') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user role');
      }

      const data = await response.json();
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      
      // Optional: Show success message
      // alert(data.message);
    } catch (err) {
      console.error('Update role error:', err);
      alert('Failed to update user role: ' + err.message);
    }
  };

  const toggleUserStatus = async (userId, suspend) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ suspended: suspend })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user status');
      }

      const data = await response.json();
      setUsers(users.map(user => 
        user._id === userId ? { ...user, suspended: suspend } : user
      ));
      
      // Optional: Show success message
      // alert(data.message);
    } catch (err) {
      console.error('Toggle status error:', err);
      alert('Failed to update user status: ' + err.message);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      setUsers(users.filter(user => user._id !== userId));
      
      // Optional: Show success message
      // const data = await response.json();
      // alert(data.message);
    } catch (err) {
      console.error('Delete user error:', err);
      alert('Failed to delete user: ' + err.message);
    }
  };

  const bulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      alert('Please select users first');
      return;
    }

    if (!confirm(`Are you sure you want to ${action} ${selectedUsers.length} user(s)?`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/users/bulk', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          userIds: selectedUsers, 
          action: action 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${action} users`);
      }

      // Refresh the users list after bulk operation
      fetchUsers();
      setSelectedUsers([]);
      
      // Optional: Show success message
      // const data = await response.json();
      // alert(data.message);
    } catch (err) {
      console.error('Bulk action error:', err);
      alert(`Failed to ${action} users: ` + err.message);
    }
  };

  const exportUsers = () => {
    const csvData = filteredUsers.map(user => ({
      Name: user.name || '',
      Email: user.email,
      Role: user.role || 'user',
      Subscribed: user.isSubscribed ? 'Yes' : 'No',
      Status: user.subscriptionStatus || 'None',
      Plan: user.subscriptionPlan || 'No Plan',
      'Renewal Date': user.subscriptionEndsAt ? new Date(user.subscriptionEndsAt).toLocaleDateString() : '',
      'Join Date': user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const sendEmail = async (userId, subject, message) => {
    // Email functionality removed as requested
    alert('Email functionality has been removed');
  };

  const viewUserDetails = (user) => {
    setModalUser(user);
    setShowUserModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status, suspended) => {
    if (suspended) return 'bg-red-100 text-red-800';
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

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'moderator':
        return 'bg-indigo-100 text-indigo-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg max-w-2xl">
          <h3 className="font-medium mb-2">Error Loading Users</h3>
          <p className="text-sm mb-4">{error}</p>
          <button 
            onClick={fetchUsers}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage users, roles, and subscriptions</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportUsers}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="user">User</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subscription</label>
              <select
                value={filterSubscription}
                onChange={(e) => setFilterSubscription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Users</option>
                <option value="subscribed">Subscribed</option>
                <option value="unsubscribed">Not Subscribed</option>
                <option value="active">Active Subscription</option>
                <option value="canceled">Canceled</option>
                <option value="past_due">Past Due</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="createdAt">Join Date</option>
                  <option value="email">Email</option>
                  <option value="name">Name</option>
                  <option value="subscriptionEndsAt">Renewal Date</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              {selectedUsers.length} user(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => bulkAction('suspend')}
                className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
              >
                Suspend
              </button>
              <button
                onClick={() => bulkAction('activate')}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                Activate
              </button>
              <button
                onClick={() => bulkAction('delete')}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-blue-600">{filteredUsers.length}</div>
          <div className="text-sm text-gray-600">Total Users</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-600">
            {filteredUsers.filter(u => u.isSubscribed).length}
          </div>
          <div className="text-sm text-gray-600">Subscribed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-purple-600">
            {filteredUsers.filter(u => u.role === 'admin').length}
          </div>
          <div className="text-sm text-gray-600">Admins</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-red-600">
            {filteredUsers.filter(u => u.suspended).length}
          </div>
          <div className="text-sm text-gray-600">Suspended</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(filteredUsers.map(u => u._id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    className="rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className={`hover:bg-gray-50 ${user.suspended ? 'bg-red-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user._id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user._id));
                          }
                        }}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {(user.name || user.email).charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || 'No Name'}
                            {user.suspended && <span className="ml-2 text-red-500">(Suspended)</span>}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role || 'user'}
                        onChange={(e) => updateUserRole(user._id, e.target.value)}
                        className={`px-2 py-1 text-xs font-semibold rounded-full border-0 ${getRoleColor(user.role)}`}
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-gray-900">
                          {user.isSubscribed ? 'Yes' : 'No'}
                        </div>
                        {user.subscriptionPlan && (
                          <div className="text-gray-500 text-xs">{user.subscriptionPlan}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.subscriptionStatus, user.suspended)}`}>
                        {user.suspended ? 'Suspended' : (user.subscriptionStatus || 'None')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => viewUserDetails(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleUserStatus(user._id, !user.suspended)}
                          className={`${user.suspended ? 'text-green-600 hover:text-green-900' : 'text-yellow-600 hover:text-yellow-900'}`}
                          title={user.suspended ? 'Activate User' : 'Suspend User'}
                        >
                          {user.suspended ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && modalUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">User Details</h2>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{modalUser.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{modalUser.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <p className="text-sm text-gray-900">{modalUser.role || 'user'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="text-sm text-gray-900">
                      {modalUser.suspended ? 'Suspended' : 'Active'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subscription</label>
                    <p className="text-sm text-gray-900">
                      {modalUser.isSubscribed ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Plan</label>
                    <p className="text-sm text-gray-900">{modalUser.subscriptionPlan || 'None'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Joined</label>
                    <p className="text-sm text-gray-900">{formatDate(modalUser.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Login</label>
                    <p className="text-sm text-gray-900">{formatDate(modalUser.lastLogin)}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => toggleUserStatus(modalUser._id, !modalUser.suspended)}
                    className={`flex items-center gap-2 px-4 py-2 rounded text-white ${
                      modalUser.suspended 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-yellow-600 hover:bg-yellow-700'
                    }`}
                  >
                    {modalUser.suspended ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                    {modalUser.suspended ? 'Activate' : 'Suspend'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}