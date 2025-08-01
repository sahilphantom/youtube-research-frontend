import { Link } from 'react-router-dom';

export default function CancelledPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
  <div className="text-center">
    <div className="w-12 h-12 rounded-full bg-yellow-100 p-2 flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
    </div>
    <h2 className="text-2xl font-bold text-gray-900 mb-2">
      サブスクリプションはキャンセルされました
    </h2>
    <p className="text-gray-600 mb-8">
      サブスクリプション処理はキャンセルされました。料金は発生していません。
    </p>
    <div className="space-x-4">
      <Link
        to="/pricing"
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
      >
        もう一度試す
      </Link>
      <Link
        to="/dashboard"
        className="text-blue-500 hover:text-blue-600"
      >
        ダッシュボードに戻る
      </Link>
    </div>
  </div>
</div>

  );
} 