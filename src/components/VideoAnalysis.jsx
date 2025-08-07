import { useState } from 'react';
import { Youtube, Download, Eye, ThumbsUp, Calendar, Clock, FileText, MessageCircle, TrendingUp, BarChart3, Plus, X, ArrowUp, ArrowDown } from 'lucide-react';
import api from '../services/api';
import { downloadCSV } from '../utils/helpers';

const VideoAnalysis = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoData, setVideoData] = useState(null);
  const [comparisonUrls, setComparisonUrls] = useState(['']);
  const [comparisonData, setComparisonData] = useState([]);
  const [activeTab, setActiveTab] = useState('single'); // 'single' or 'comparison'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a YouTube video URL');
      return;
    }

    setLoading(true);
    setError('');
    setVideoData(null);

    try {
      const response = await api.post('/videos/info', { videoUrl: url });
      setVideoData(response.data.video); // Extract video object from response
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch video information');
    } finally {
      setLoading(false);
    }
  };

  const handleComparisonSubmit = async (e) => {
    e.preventDefault();
    const validUrls = comparisonUrls.filter(url => url.trim());
    if (validUrls.length < 2) {
      setError('Please enter at least 2 video URLs for comparison');
      return;
    }

    setLoading(true);
    setError('');
    setComparisonData([]);

    try {
      const response = await api.post('/videos/compare', { videoUrls: validUrls });
      setComparisonData(response.data.videos);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to compare videos');
    } finally {
      setLoading(false);
    }
  };

  const addComparisonUrl = () => {
    setComparisonUrls([...comparisonUrls, '']);
  };

  const removeComparisonUrl = (index) => {
    setComparisonUrls(comparisonUrls.filter((_, i) => i !== index));
  };

  const updateComparisonUrl = (index, value) => {
    const newUrls = [...comparisonUrls];
    newUrls[index] = value;
    setComparisonUrls(newUrls);
  };

  const handleCSVDownload = async (data = videoData, isComparison = false) => {
    if (!data) return;

    try {
      setLoading(true);
      
      if (isComparison && Array.isArray(data)) {
        // Handle multiple videos for comparison
        const csvRows = data.map(video => ({
          videoId: video.id,
          title: video.title,
          channelTitle: video.channelTitle,
          viewCount: video.viewCount,
          likeCount: video.likeCount,
          commentCount: video.commentCount,
          likeRatio: video.metrics?.likeRatio,
          commentRatio: video.metrics?.commentRatio,
          viewsPerHour: video.metrics?.viewsPerHour,
          performanceCategory: video.metrics?.performanceCategory,
          genre: video.genre,
          uploadDate: new Date(video.publishedAt).toLocaleDateString(),
          duration: formatDuration(video.duration)
        }));
        
        const headers = Object.keys(csvRows[0]).join(',');
        const values = csvRows.map(row => 
          Object.values(row).map(value => `"${value}"`).join(',')
        ).join('\n');
        const csvContent = `${headers}\n${values}`;
        
        const filename = `video-comparison_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`;
        downloadCSV(csvContent, filename);
      } else {
        // Handle single video
        const csvData = {
          videoId: data.id,
          title: data.title,
          channelTitle: data.channelTitle,
          viewCount: data.viewCount,
          likeCount: data.likeCount,
          commentCount: data.commentCount,
          likeRatio: data.metrics?.likeRatio,
          commentRatio: data.metrics?.commentRatio,
          viewsPerHour: data.metrics?.viewsPerHour,
          performanceCategory: data.metrics?.performanceCategory,
          channelAvgViews: data.channelComparison?.avgViews,
          channelAvgLikeRatio: data.channelComparison?.avgLikeRatio,
          channelAvgCommentRatio: data.channelComparison?.avgCommentRatio,
          viewsDifference: data.channelComparison?.viewsDifference,
          likeRatioDifference: data.channelComparison?.likeRatioDifference,
          commentRatioDifference: data.channelComparison?.commentRatioDifference,
          genre: data.genre,
          uploadDate: new Date(data.publishedAt).toLocaleDateString(),
          duration: formatDuration(data.duration),
          description: data.description
        };
        
        const headers = Object.keys(csvData).join(',');
        const values = Object.values(csvData).map(value => `"${value}"`).join(',');
        const csvContent = `${headers}\n${values}`;
        
        const filename = `video-analysis_${data.title?.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`;
        downloadCSV(csvContent, filename);
      }
    } catch (err) {
      setError('Failed to download CSV');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num) return '0'
    return new Intl.NumberFormat().format(num)
  }

  const formatDuration = (duration) => {
    if (!duration) return 'Unknown'
    // Convert ISO 8601 duration to readable format
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!match) return duration
    
    const [, hours, minutes, seconds] = match.map(x => parseInt(x || '0', 10))
    const parts = []
    if (hours > 0) parts.push(`${hours}h`)
    if (minutes > 0) parts.push(`${minutes}m`)
    if (seconds > 0) parts.push(`${seconds}s`)
    
    return parts.join(' ') || '0s'
  }

  const formatDifference = (value, isPercentage = false) => {
    const sign = value >= 0 ? '+' : '';
    const suffix = isPercentage ? '%' : '';
    return `${sign}${formatNumber(Math.round(value))}${suffix}`;
  };

  const DifferenceIndicator = ({ value, isPercentage = false }) => {
    const isPositive = value >= 0;
    const Icon = isPositive ? ArrowUp : ArrowDown;
    const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
    
    return (
      <div className={`flex items-center space-x-1 ${colorClass}`}>
        <Icon className="h-4 w-4" />
        <span className="text-sm font-medium" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>
          {formatDifference(value, isPercentage)}
        </span>
      </div>
    );
  };

  const PerformanceBadge = ({ category }) => {
    const colors = {
      'Rapid Growth': 'bg-green-100 text-green-800',
      'Strong Start': 'bg-blue-100 text-blue-800',
      'Standard': 'bg-gray-100 text-gray-800',
      'Slow Start': 'bg-orange-100 text-orange-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[category] || colors['Standard']}`} style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>
        {category}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>動画分析</h1>
        <p className="text-gray-600" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>任意のYouTube動画の詳細情報を取得</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setActiveTab('single')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'single'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}
        >
          単一動画分析
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'comparison'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}
        >
          動画比較
        </button>
      </div>

      {activeTab === 'single' && (
        <>
          {/* Input Form */}
          <div className="card mb-8">
            <div className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>
                  YouTube動画のURL
                </label>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="input-field"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary w-full md:w-auto"
                style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}
              >
                {loading ? '分析中...' : '動画を分析'}
              </button>
            </div>
          </div>

          {/* Results */}
          {videoData && (
            <div className="space-y-6">
              {/* Video Info Card */}
              <div className="card">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>{videoData.title}</h2>
                  <button
                    onClick={() => handleCSVDownload()}
                    disabled={loading}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>CSVをエクスポート</span>
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Youtube className="h-5 w-5 text-red-600" />
                      <span className="font-medium" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>{videoData.channelTitle}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Eye className="h-5 w-5 text-indigo-600" />
                      <span className="font-medium" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>{formatNumber(videoData.viewCount)} 回視聴</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <ThumbsUp className="h-5 w-5 text-green-600" />
                      <span className="font-medium" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>{formatNumber(videoData.likeCount)} いいね</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MessageCircle className="h-5 w-5 text-purple-600" />
                      <span className="font-medium" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>{formatNumber(videoData.commentCount)} コメント</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <span className="font-medium" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>
                        {new Date(videoData.publishedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <span className="font-medium" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>{formatDuration(videoData.duration)}</span>
                    </div>
                  </div>

                  {/* Engagement Metrics */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>エンゲージメント指標</h3>
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>👍 いいね率</span>
                        <span className="font-bold text-blue-700" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>{videoData.metrics?.likeRatio}%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>どれだけ好まれたか</p>
                    </div>

                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>💬 コメント率</span>
                        <span className="font-bold text-purple-700" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>{videoData.metrics?.commentRatio}%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>どれだけ会話を生んだか</p>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>⚡ 時間あたり視聴回数</span>
                        <span className="font-bold text-green-700" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>{formatNumber(videoData.metrics?.viewsPerHour)}</span>
                      </div>
                      <div className="mt-2">
                        <PerformanceBadge category={videoData.metrics?.performanceCategory} />
                      </div>
                    </div>

                    {videoData.genre && (
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>🎬 ジャンル</span>
                          <span className="font-bold text-yellow-700" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>{videoData.genre}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Channel Comparison */}
                  {videoData.channelComparison && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>チャンネル平均との比較</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>視聴回数</span>
                          <div className="text-right">
                            <div className="font-medium" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>{formatNumber(videoData.viewCount)}</div>
                            <div className="text-xs text-gray-500" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>平均: {formatNumber(videoData.channelComparison.avgViews)}</div>
                            <DifferenceIndicator value={videoData.channelComparison.viewsDifference} />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>いいね率</span>
                          <div className="text-right">
                            <div className="font-medium" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>{videoData.metrics?.likeRatio}%</div>
                            <div className="text-xs text-gray-500" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>平均: {videoData.channelComparison.avgLikeRatio}%</div>
                            <DifferenceIndicator value={videoData.channelComparison.likeRatioDifference} isPercentage={true} />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>コメント率</span>
                          <div className="text-right">
                            <div className="font-medium" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>{videoData.metrics?.commentRatio}%</div>
                            <div className="text-xs text-gray-500" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>平均: {videoData.channelComparison.avgCommentRatio}%</div>
                            <DifferenceIndicator value={videoData.channelComparison.commentRatioDifference} isPercentage={true} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video ID */}
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-2" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>動画ID</h3>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>{videoData.id}</code>
                </div>
              </div>

              {/* Description */}
              {videoData.description && (
                <div className="card">
                  <div className="flex items-center space-x-2 mb-4">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>説明文</h3>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>{videoData.description}</p>
                </div>
              )}

              {/* Tags */}
              {videoData.tags && videoData.tags.length > 0 && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>タグ</h3>
                  <div className="flex flex-wrap gap-2">
                    {videoData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Video Comparison Tab */}
      {activeTab === 'comparison' && (
        <>
          <div className="card mb-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>
                  比較する動画のURL（最低2つ）
                </label>
                {comparisonUrls.map((url, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => updateComparisonUrl(index, e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="input-field flex-1"
                    />
                    {comparisonUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeComparisonUrl(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addComparisonUrl}
                  className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 mt-2"
                >
                  <Plus className="h-4 w-4" />
                  <span style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>URL追加</span>
                </button>
              </div>
              <button
                onClick={handleComparisonSubmit}
                disabled={loading}
                className="btn-primary w-full md:w-auto"
                style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}
              >
                {loading ? '比較中...' : '動画を比較'}
              </button>
            </div>
          </div>

          {comparisonData.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>動画比較結果</h2>
                <button
                  onClick={() => handleCSVDownload(comparisonData, true)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>比較データをエクスポート</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-900" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>動画タイトル</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>視聴回数</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>いいね率</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>コメント率</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>時間あたり視聴回数</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>パフォーマンス</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>ジャンル</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((video, index) => (
                      <tr key={video.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-3 px-4">
                          <div className="max-w-xs">
                            <div className="font-medium text-gray-900 truncate" title={video.title} style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>
                              {video.title}
                            </div>
                            <div className="text-sm text-gray-500" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>{video.channelTitle}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-medium" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>
                          {formatNumber(video.viewCount)}
                        </td>
                        <td className="py-3 px-4 text-right font-medium" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>
                          {video.metrics?.likeRatio}%
                        </td>
                        <td className="py-3 px-4 text-right font-medium" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>
                          {video.metrics?.commentRatio}%
                        </td>
                        <td className="py-3 px-4 text-right font-medium" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>
                          {formatNumber(video.metrics?.viewsPerHour)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <PerformanceBadge category={video.metrics?.performanceCategory} />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs" style={{ fontFamily: 'Noto Sans JP, Hiragino Kaku Gothic ProN, Hiragino Sans, Yu Gothic, Meiryo, Takao, sans-serif' }}>
                            {video.genre}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
        </>
      )}  

     
  
    </div>
  ) 
}

export default VideoAnalysis