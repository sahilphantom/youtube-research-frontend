import { useState } from 'react';
import { Youtube, Download, Eye, ThumbsUp, Calendar, Clock, FileText } from 'lucide-react';
import api from '../services/api';
import { downloadCSV } from '../utils/helpers';

const VideoAnalysis = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoData, setVideoData] = useState(null);

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

  const handleCSVDownload = async () => {
    if (!videoData) return;

    try {
      setLoading(true);
      const csvData = {
        videoId: videoData.id,
        title: videoData.title,
        channelTitle: videoData.channelTitle,
        viewCount: videoData.viewCount,
        likeCount: videoData.likeCount,
        uploadDate: new Date(videoData.publishedAt).toLocaleDateString(),
        duration: formatDuration(videoData.duration),
        description: videoData.description
      };
      
      const headers = Object.keys(csvData).join(',');
      const values = Object.values(csvData).map(value => `"${value}"`).join(',');
      const csvContent = `${headers}\n${values}`;
      
      const filename = `video-analysis_${videoData.title?.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`;
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Analysis</h1>
        <p className="text-gray-600">Get detailed information about any YouTube video</p>
      </div>

      {/* Input Form */}
      <div className="card mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              YouTube Video URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="input-field"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full md:w-auto"
          >
            {loading ? 'Analyzing...' : 'Analyze Video'}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Results */}
      {videoData && (
        <div className="space-y-6">
          {/* Video Info Card */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{videoData.title}</h2>
              <button
                onClick={handleCSVDownload}
                disabled={loading}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Youtube className="h-5 w-5 text-red-600" />
                  <span className="font-medium">{videoData.channelTitle}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Eye className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">{formatNumber(videoData.viewCount)} views</span>
                </div>

                <div className="flex items-center space-x-3">
                  <ThumbsUp className="h-5 w-5 text-green-600" />
                  <span className="font-medium">{formatNumber(videoData.likeCount)} likes</span>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">
                    {new Date(videoData.publishedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span className="font-medium">{formatDuration(videoData.duration)}</span>
                </div>
              </div>

              {/* Video ID */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Video ID</h3>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">{videoData.id}</code>
              </div>
            </div>
          </div>

          {/* Description */}
          {videoData.description && (
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Description</h3>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{videoData.description}</p>
            </div>
          )}

          {/* Tags */}
          {videoData.tags && videoData.tags.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {videoData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default VideoAnalysis 