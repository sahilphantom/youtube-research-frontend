import { useState } from 'react';
import { Search, Download, Eye, ThumbsUp, Calendar, Clock, Filter } from 'lucide-react';
import api from '../services/api';
import { downloadCSV } from '../utils/helpers';

const VideoSearch = () => {
  const [searchParams, setSearchParams] = useState({
    query: '',
    uploadDateAfter: '',
    uploadDateBefore: '',
    sortBy: 'relevance',
    videoType: 'any',
    channelSubscriberRange: '',
    viewToSubRatio: '',
    maxResults: 20
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchParams.query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError('');
    setSearchResults(null);

    try {
      const response = await api.post('/videos/search', searchParams);
      setSearchResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search videos');
    } finally {
      setLoading(false);
    }
  };

  const handleCSVDownload = async () => {
    if (!searchResults) return;

    try {
      setLoading(true);
      // Prepare search results data
      const videosData = searchResults.videos.map((video, index) => ({
        rank: index + 1,
        videoId: video.id,
        title: video.title,
        channelTitle: video.channelTitle,
        views: video.viewCount,
        likes: video.likeCount,
        uploadDate: new Date(video.publishedAt).toLocaleDateString(),
        duration: formatDuration(video.duration),
        description: video.description
      }));

      // Create CSV content
      let csvContent = '';
      
      // Search parameters section
      csvContent += 'Search Parameters\n';
      csvContent += `Query,${searchParams.query}\n`;
      csvContent += `Sort By,${searchParams.sortBy}\n`;
      csvContent += `Video Type,${searchParams.videoType}\n`;
      csvContent += `Max Results,${searchParams.maxResults}\n\n`;
      
      // Results section
      csvContent += 'Search Results\n';
      const headers = Object.keys(videosData[0]);
      csvContent += headers.join(',') + '\n';
      csvContent += videosData.map(video => 
        Object.values(video).map(value => `"${value}"`).join(',')
      ).join('\n');
      
      const filename = `search-results_${searchParams.query?.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`;
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
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!match) return duration
    
    const [, hours, minutes, seconds] = match.map(x => parseInt(x || '0', 10))
    const parts = []
    if (hours > 0) parts.push(`${hours}h`)
    if (minutes > 0) parts.push(`${minutes}m`)
    if (seconds > 0) parts.push(`${seconds}s`)
    
    return parts.join(' ') || '0s'
  }

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Search</h1>
        <p className="text-gray-600">Search YouTube videos with advanced filters</p>
      </div>

      {/* Search Form */}
      <div className="card mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Search */}
          <div>
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
              Search Query
            </label>
            <input
              type="text"
              id="query"
              value={searchParams.query}
              onChange={(e) => handleInputChange('query', e.target.value)}
              placeholder="Enter keywords to search for videos..."
              className="input-field"
              required
            />
          </div>

          {/* Filters Toggle */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>{showFilters ? 'Hide' : 'Show'} Advanced Filters</span>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Searching...' : 'Search Videos'}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t">
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="datetime-local"
                    value={searchParams.uploadDateAfter}
                    onChange={(e) => handleInputChange('uploadDateAfter', e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="datetime-local"
                    value={searchParams.uploadDateBefore}
                    onChange={(e) => handleInputChange('uploadDateBefore', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Sort and Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={searchParams.sortBy}
                    onChange={(e) => handleInputChange('sortBy', e.target.value)}
                    className="input-field"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="viewCount">View Count</option>
                    <option value="rating">Rating</option>
                    <option value="date">Upload Date</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Type
                  </label>
                  <select
                    value={searchParams.videoType}
                    onChange={(e) => handleInputChange('videoType', e.target.value)}
                    className="input-field"
                  >
                    <option value="any">Any</option>
                    <option value="short">Shorts</option>
                    <option value="long">Long Form</option>
                  </select>
                </div>
              </div>

              {/* Channel Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Channel Subscriber Range
                </label>
                <input
                  type="text"
                  value={searchParams.channelSubscriberRange}
                  onChange={(e) => handleInputChange('channelSubscriberRange', e.target.value)}
                  placeholder="e.g., 10000-50000"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  View-to-Subscriber Ratio
                </label>
                <input
                  type="number"
                  value={searchParams.viewToSubRatio}
                  onChange={(e) => handleInputChange('viewToSubRatio', e.target.value)}
                  placeholder="e.g., 5 (5x subscriber count)"
                  className="input-field"
                />
              </div>

              {/* Results Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Results
                </label>
                <select
                  value={searchParams.maxResults}
                  onChange={(e) => handleInputChange('maxResults', parseInt(e.target.value))}
                  className="input-field"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Results */}
      {searchResults && (
        <div className="space-y-6">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
              <p className="text-gray-600">
                Found {searchResults.totalResults} videos (showing {searchResults.videos.length})
              </p>
            </div>
            <button
              onClick={handleCSVDownload}
              disabled={loading}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Video List */}
          <div className="space-y-4">
            {searchResults.videos.map((video) => (
              <div key={video.id} className="card p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Thumbnail */}
                  <div className="w-full md:w-64 flex-shrink-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-36 object-cover rounded-lg"
                    />
                  </div>

                  {/* Video Info */}
                  <div className="flex-grow space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">{video.title}</h3>
                    <p className="text-gray-600">{video.channelTitle}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{formatNumber(video.viewCount)} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{formatNumber(video.likeCount)} likes</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(video.duration)}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2">{video.description}</p>

                    <a
                      href={`https://www.youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
                    >
                      Watch on YouTube →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {searchResults.videos.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No videos found matching your criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default VideoSearch 