import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

// Mock components for demo




export default function Dashboard() {
  const { user } = useAuth();
  // Add this to your Dashboard component to check the token
useEffect(() => {
  console.log('Current user:', user);
  console.log('Token in storage:', localStorage.getItem('token'));
}, [user]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="mb-12">
          <h1 className="text-4xl font-light text-gray-800 mb-2">
            おかえりなさい、{user?.email}さん
          </h1>
      

          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Video Search Tool */}
          <div className="group bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:border-blue-200/50">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                動画検索
              </h2>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              あなたの条件に基づいてYouTube動画を検索・分析します。
            </p>
            <Link
              to="/video-search"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              検索を開始
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Video Analysis */}
          <div className="group bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:border-purple-200/50">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                動画分析
              </h2>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              特定の動画の詳細な分析とインサイトを取得します。
            </p>
            <Link
              to="/video-analysis"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              動画を分析
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Channel Analysis */}
          <div className="group bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:border-indigo-200/50">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                チャンネル分析
              </h2>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              YouTubeチャンネルとそのパフォーマンスを調査・分析します。
            </p>
            <Link
              to="/channel-analysis"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              チャンネル調査
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Subscription Status */}
          <div className="group bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:border-green-200/50">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                サブスクリプション状況
              </h2>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">プラン:</span>
                <span className="font-medium text-gray-800">
                  {user?.subscriptionPlan || '有効なプランなし'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">ステータス:</span>
                <span className="font-medium text-gray-800">
                  {user?.subscriptionStatus || '未加入'}
                </span>
              </div>
              {user?.subscriptionEndsAt && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">更新日:</span>
                  <span className="font-medium text-gray-800">
                    {new Date(user.subscriptionEndsAt).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              )}
            </div>
            <Link
              to="/account"
              className="inline-flex items-center px-6 py-3 border-2 border-green-500 text-green-600 rounded-xl hover:bg-green-50 transition-all duration-200 font-medium w-full justify-center"
            >
              サブスクリプション管理
            </Link>
          </div>

          {/* Quick Links */}
          <div className="group bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:border-orange-200/50 lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                クイックリンク
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/account"
                className="flex items-center p-4 bg-white/50 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200"
              >
                <svg className="w-7 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-700 font-medium">アカウント設定</span>
              </Link>
             {user?.role === 'admin' &&  (
  <Link
    to="/admin/users"
    className="flex items-center p-4 bg-white/50 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all duration-200"
  >
    <svg className="w-7 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
    <span className="text-gray-700 font-medium">管理者パネル</span>
  </Link>
)}

              <Link
                to="/pricing"
                className="flex items-center p-4 bg-white/50 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-all duration-200"
              >
                <svg className="w-7 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
                <span className="text-gray-700 font-medium">プランをアップグレード</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}