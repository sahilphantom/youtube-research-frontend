import { useState } from 'react';
import { Search, Download, Eye, ThumbsUp, Calendar, Clock, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
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
    viewToSubRatio: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination and sorting states
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(50);
  const [sortOption, setSortOption] = useState('relevance');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchParams.query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError('');
    setSearchResults(null);
    setCurrentPage(1);

    try {
      // Send maxResults based on resultsPerPage to get the right amount of data
      const searchPayload = {
        ...searchParams,
        maxResults: resultsPerPage
      };
      
      const response = await api.post('/videos/search', searchPayload);
      setSearchResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search videos');
    } finally {
      setLoading(false);
    }
  };

  const handleResultsPerPageChange = async (newResultsPerPage) => {
    setResultsPerPage(newResultsPerPage);
    setCurrentPage(1);
    
    // If we already have search results, trigger a new search with the new maxResults
    if (searchResults && searchParams.query) {
      setLoading(true);
      try {
        const searchPayload = {
          ...searchParams,
          maxResults: newResultsPerPage
        };
        
        const response = await api.post('/videos/search', searchPayload);
        setSearchResults(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to search videos');
      } finally {
        setLoading(false);
      }
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
      csvContent += `Max Results,${resultsPerPage}\n\n`;
      
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

  // Since backend now handles filtering, we only need client-side sorting for display
  const sortVideos = (videos) => {
    if (!videos || sortOption === 'relevance') return videos;
    
    const sorted = [...videos].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortOption) {
        case 'viewCount':
          aValue = parseInt(a.viewCount) || 0;
          bValue = parseInt(b.viewCount) || 0;
          break;
        case 'likeCount':
          aValue = parseInt(a.likeCount) || 0;
          bValue = parseInt(b.likeCount) || 0;
          break;
        case 'date':
          aValue = new Date(a.publishedAt);
          bValue = new Date(b.publishedAt);
          break;
        case 'duration':
          aValue = parseDurationToSeconds(a.duration);
          bValue = parseDurationToSeconds(b.duration);
          break;
        default:
          return 0;
      }
      
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });
    
    return sorted;
  };

  const parseDurationToSeconds = (duration) => {
    if (!duration) return 0;
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    
    const [, hours, minutes, seconds] = match.map(x => parseInt(x || '0', 10));
    return hours * 3600 + minutes * 60 + seconds;
  };

  const sortedVideos = searchResults ? sortVideos(searchResults.videos) : [];
  
  // For display purposes only - show all results since backend already filtered by maxResults
  const currentVideos = sortedVideos;

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">動画検索</h1>
        <p className="text-gray-600">高度なフィルターでYouTube動画を検索</p>
      </div>

      {/* Search Form */}
      <div className="card mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Search */}
          <div>
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
              検索クエリ
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
              <span>{showFilters ? 'Hide' : 'Show'} 高度なフィルター</span>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? '検索中...' : '動画を検索'}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t">
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  アップロード期間
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
                    並び替え
                  </label>
                  <select
                    value={searchParams.sortBy}
                    onChange={(e) => handleInputChange('sortBy', e.target.value)}
                    className="input-field"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="date">Upload Date</option>
                    <option value="viewCount">View Count</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    動画の種類
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
                  チャンネル登録者数の範囲
                </label>
                <input
                  type="text"
                  value={searchParams.channelSubscriberRange}
                  onChange={(e) => handleInputChange('channelSubscriberRange', e.target.value)}
                  placeholder="例: 10000-50000 または 10000"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  再生数と登録者数の比率
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={searchParams.viewToSubRatio}
                  onChange={(e) => handleInputChange('viewToSubRatio', e.target.value)}
                  placeholder="例: 5.0 (登録者数の5倍の再生数)"
                  className="input-field"
                />
              </div>

              {/* Results Per Page */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  取得する結果数
                </label>
                <select
                  value={resultsPerPage}
                  onChange={(e) => handleResultsPerPageChange(parseInt(e.target.value))}
                  className="input-field"
                >
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
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
          {/* Results Header with Sorting */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">検索結果</h2>
              <p className="text-gray-600">
                Found {searchResults.totalResults} videos (showing {currentVideos.length} results)
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="relevance">関連性</option>
                  <option value="viewCount">再生数</option>
                  <option value="likeCount">いいね数</option>
                  <option value="date">投稿日</option>
                  <option value="duration">動画の長さ</option>
                </select>
                
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="desc">降順</option>
                  <option value="asc">昇順</option>
                </select>
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
          </div>

          {/* Video List Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      サムネイル
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      タイトル / チャンネル
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      再生数
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      いいね数
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                      投稿日
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      長さ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentVideos.map((video, index) => (
                    <tr key={video.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <a
                            href={`https://www.youtube.com/watch?v=${video.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 line-clamp-2"
                          >
                            {video.title}
                          </a>
                          <p className="text-xs text-gray-500">{video.channelTitle}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatNumber(video.viewCount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatNumber(video.likeCount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(video.publishedAt).toLocaleDateString('ja-JP')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatDuration(video.duration)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {currentVideos.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">条件に一致する動画が見つかりませんでした</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default VideoSearch