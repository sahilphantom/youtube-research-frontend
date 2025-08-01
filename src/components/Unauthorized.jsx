import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
   <div className="min-h-[60vh] flex items-center justify-center">
  <div className="text-center">
    <h1 className="text-6xl font-bold text-gray-900 mb-4">401</h1>
    <p className="text-xl text-gray-600 mb-8">認証されていないアクセス</p>
    <p className="text-gray-500 mb-8">このページにアクセスする権限がありません</p>
    <Link 
      to="/dashboard" 
      className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
    >
      ダッシュボードに戻る
    </Link>
  </div>
</div>

  );
} 