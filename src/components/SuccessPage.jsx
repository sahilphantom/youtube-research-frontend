import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login, refreshUser } = useAuth();
  const intervalRef = useRef(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 10;
  const pollingRef = useRef(false); // 🔐 Prevent overlapping checks

  const clearCheckInterval = () => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const checkStatus = useCallback(async (sessionId) => {
    if (!sessionId || status !== 'loading' || pollingRef.current) return false;

    pollingRef.current = true;
    try {
      console.log('🔁 決済ステータスを確認中...');
      const response = await api.get(`/stripe/session-status?sessionId=${sessionId}`);
      console.log('✅ 決済ステータスの応答:', response.data);

      if (response.data.paymentStatus === 'paid') {
        clearCheckInterval();
        setStatus('success');
        await refreshUser();
        setTimeout(() => navigate('/dashboard'), 3000);
        return true;
      }

      retryCountRef.current += 1;
      if (retryCountRef.current >= MAX_RETRIES) {
        clearCheckInterval();
        setStatus('error');
        setError('決済の確認に時間がかかっています。サポートにご連絡ください。');
        return false;
      }

      return false;
    } catch (err) {
      console.error('❌ 決済確認エラー:', err);

      retryCountRef.current += 1;
      if (retryCountRef.current >= MAX_RETRIES) {
        clearCheckInterval();
        setStatus('error');
        setError('複数回確認に失敗しました。サポートにご連絡ください。');
      } else {
        setError(err.response?.data?.message || '決済の確認に失敗しました');
      }

      return false;
    } finally {
      pollingRef.current = false;
    }
  }, [navigate, refreshUser, status]);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const token = searchParams.get('token');

    if (!sessionId || !token) {
      setStatus('error');
      setError('セッション情報が不足しています');
      return;
    }

    if (token) {
      login(token);
    }

    const poll = async () => {
      const success = await checkStatus(sessionId);
      if (!success && retryCountRef.current < MAX_RETRIES && status === 'loading') {
        intervalRef.current = setTimeout(poll, 5000);
      }
    };

    poll(); // 🔁 Start initial check

    return () => {
      clearCheckInterval(); // Cleanup
    };
  }, [searchParams, login, checkStatus, status]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {status === 'loading' && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">お支払いを処理中</h2>
            <p className="text-gray-600">決済の確認中です。しばらくお待ちください...</p>
          </div>
        )}
        {status === 'success' && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">お支払いが完了しました！</h2>
            <p className="text-gray-600">ダッシュボードへリダイレクト中です...</p>
          </div>
        )}
        {status === 'error' && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">お支払いエラー</h2>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              ダッシュボードに戻る
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;
