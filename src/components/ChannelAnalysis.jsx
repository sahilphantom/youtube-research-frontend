import { useState } from 'react';
import { BarChart3, Download, Users, Eye, Clock, TrendingUp, Star, AlertTriangle } from 'lucide-react';
import api from '../services/api';
import { downloadCSV } from '../utils/helpers';

const ChannelAnalysis = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [channelData, setChannelData] = useState(null);

  const handleSubmit = async () => {
    if (!url.trim()) {
      setError('Please enter a YouTube channel URL');
      return;
    }

    setLoading(true);
    setError('');
    setChannelData(null);

    try {
      const response = await api.post('/videos/channel-analysis', { channelUrl: url });
      setChannelData(response.data.analysis); // Updated to match backend response structure
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch channel information');
    } finally {
      setLoading(false);
    }
  };

  const handleCSVDownload = async () => {
    if (!channelData) return;

    try {
      setLoading(true);
      // Prepare channel overview data
      const channelOverview = {
        channelId: channelData.channel.id,
        channelTitle: channelData.channel.title,
        subscribers: channelData.statistics.subscriberCount,
        totalVideos: channelData.statistics.totalVideoCount,
        totalViews: channelData.statistics.totalViewCount,
        avgViews: channelData.videoMetrics.avgViews,
        avgLikes: channelData.videoMetrics.avgLikes,
        avgComments: channelData.videoMetrics.avgComments,
        engagementRate: channelData.performanceMetrics.engagementRate,
        analyzedVideos: channelData.statistics.analyzedVideoCount
      };
      
      // Prepare top videos data
      const topVideosData = channelData.topPerformingVideos.top10MostViewed.map((video, index) => ({
        rank: index + 1,
        videoId: video.id,
        title: video.title,
        views: video.viewCount,
        likes: video.likeCount,
        comments: video.commentCount,
        duration: video.duration,
        viewsAboveAverage: video.viewsAboveAverage,
        publishedAt: new Date(video.publishedAt).toLocaleDateString()
      }));

      // Prepare viral videos data
      const viralVideosData = channelData.topPerformingVideos.viralVideos.videos.map((video, index) => ({
        rank: index + 1,
        videoId: video.id,
        title: video.title,
        views: video.viewCount,
        likes: video.likeCount,
        comments: video.commentCount,
        viewsAboveAverage: video.viewsAboveAverage,
        publishedAt: new Date(video.publishedAt).toLocaleDateString()
      }));

      // Create CSV content
      let csvContent = '';
      
      // Channel overview section
      csvContent += 'Channel Overview\n';
      csvContent += Object.keys(channelOverview).join(',') + '\n';
      csvContent += Object.values(channelOverview).map(value => `"${value}"`).join(',') + '\n\n';
      
      // Top 10 videos section
      csvContent += 'Top 10 Most Viewed Videos\n';
      if (topVideosData.length > 0) {
        const topHeaders = Object.keys(topVideosData[0]);
        csvContent += topHeaders.join(',') + '\n';
        csvContent += topVideosData.map(video => 
          Object.values(video).map(value => `"${value}"`).join(',')
        ).join('\n') + '\n\n';
      }
      
      // Viral videos section
      if (viralVideosData.length > 0) {
        csvContent += 'Viral Videos\n';
        const viralHeaders = Object.keys(viralVideosData[0]);
        csvContent += viralHeaders.join(',') + '\n';
        csvContent += viralVideosData.map(video => 
          Object.values(video).map(value => `"${value}"`).join(',')
        ).join('\n');
      }
      
      const filename = `channel-analysis_${channelData.channel.title?.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`;
      downloadCSV(csvContent, filename);
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

  const formatDuration = (seconds) => {
    if (!seconds) return '0s'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    const parts = []
    if (hours > 0) parts.push(`${hours}h`)
    if (minutes > 0) parts.push(`${minutes}m`)
    if (secs > 0) parts.push(`${secs}s`)
    
    return parts.join(' ') || '0s'
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
       <h1 className="text-3xl font-bold text-gray-900 mb-2">チャンネル分析</h1>
<p className="text-gray-600">YouTubeチャンネルの包括的な分析</p>

      </div>

      {/* Input Form */}
      <div className="card mb-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
           YouTubeチャンネルのURL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/@channel or https://www.youtube.com/channel/..."
              className="input-field"
              required
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full md:w-auto"
          >
            {loading ? '分析中...' : 'チャンネルを分析'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Results */}
      {channelData && (
        <div className="space-y-6">
          {/* Channel Overview */}
          <div className="card">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{channelData.channel.title}</h2>
                <p className="text-gray-600">Channel ID: {channelData.channel.id}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Created: {new Date(channelData.channel.publishedAt).toLocaleDateString()} • 
                  Country: {channelData.channel.country}
                </p>
              </div>
              <button
                onClick={handleCSVDownload}
                disabled={loading}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>CSVをエクスポート</span>
              </button>
            </div>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{formatNumber(channelData.statistics.subscriberCount)}</h3>
                <p className="text-sm text-gray-600">Subscribers</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{formatNumber(channelData.videoMetrics.avgViews)}</h3>
                <p className="text-sm text-gray-600">Avg Views</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{formatNumber(channelData.statistics.totalVideoCount)}</h3>
                <p className="text-sm text-gray-600">Total Videos</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{formatNumber(channelData.statistics.totalViewCount)}</h3>
                <p className="text-sm text-gray-600">Total Views</p>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
              <div className="text-center">
                <h4 className="font-semibold text-gray-900">{channelData.performanceMetrics.engagementRate}%</h4>
                <p className="text-sm text-gray-600">Engagement Rate</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-gray-900">{channelData.performanceMetrics.likesToViewsRatio}%</h4>
                <p className="text-sm text-gray-600">Like Rate</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-gray-900">{channelData.videoMetrics.avgDuration.formatted}</h4>
                <p className="text-sm text-gray-600">Avg Duration</p>
              </div>
            </div>
          </div>

          {/* Top 10 Most Viewed Videos */}
          {channelData.topPerformingVideos.top10MostViewed && channelData.topPerformingVideos.top10MostViewed.length > 0 && (
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <Star className="h-5 w-5 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-900">Top 10 Most Viewed Videos</h3>
              </div>
              <div className="space-y-3">
                {channelData.topPerformingVideos.top10MostViewed.map((video, index) => (
                  <div key={video.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-600">#{index + 1}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{video.title}</h4>
                        <p className="text-sm text-gray-600">
                          {formatNumber(video.viewCount)} views • {formatDuration(video.duration)} • {video.viewsAboveAverage} avg • {new Date(video.publishedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 text-sm"
                    >
                      Watch
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Viral Videos */}
          {channelData.topPerformingVideos.viralVideos.videos && channelData.topPerformingVideos.viralVideos.videos.length > 0 && (
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Viral Videos ({channelData.topPerformingVideos.viralVideos.count})
                </h3>
                <span className="text-sm text-gray-500">
                  ({channelData.topPerformingVideos.viralVideos.threshold})
                </span>
              </div>
              <div className="space-y-3">
                {channelData.topPerformingVideos.viralVideos.videos.map((video) => (
                  <div key={video.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{video.title}</h4>
                        <p className="text-sm text-gray-600">
                          {formatNumber(video.viewCount)} views • {video.viewsAboveAverage} average • {new Date(video.publishedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 text-sm"
                    >
                      Watch
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Analysis */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Duration Distribution */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Duration Distribution</h3>
              <div className="space-y-2">
                {Object.entries(channelData.contentAnalysis.durationDistribution).map(([range, count]) => (
                  <div key={range} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 capitalize">{range.replace(/([a-z])([A-Z])/g, '$1 $2')}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload Analysis */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Insights</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Videos Analyzed</span>
                  <span className="font-medium">{channelData.statistics.analyzedVideoCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg Days Between Uploads</span>
                  <span className="font-medium">{channelData.contentAnalysis.videoFrequency.avgDaysBetweenUploads}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Analysis Period</span>
                  <span className="font-medium capitalize">{channelData.analysisMetadata.analyzedPeriod}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Tags */}
          {channelData.contentAnalysis.topTags && channelData.contentAnalysis.topTags.length > 0 && (
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Most Used Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {channelData.contentAnalysis.topTags.slice(0, 20).map(({ tag, count }) => (
                  <span
                    key={tag}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag} ({count})
                  </span>
                ))}
              </div>
            </div>
          )}



          {/* Analysis Metadata */}
          <div className="card bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Analysis Summary</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Analyzed at:</span>
                <p className="font-medium">{new Date(channelData.analysisMetadata.analyzedAt).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-600">Videos processed:</span>
                <p className="font-medium">{channelData.analysisMetadata.totalVideosAnalyzed}</p>
              </div>
              <div>
                <span className="text-gray-600">API calls used:</span>
                <p className="font-medium">{channelData.analysisMetadata.apiCallsUsed}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChannelAnalysis