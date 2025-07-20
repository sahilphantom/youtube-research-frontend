# YouTube Research Tool - Frontend

A modern React application for comprehensive YouTube analytics and research.

## Features

- **Video Analysis**: Get detailed information about any YouTube video
- **Channel Analysis**: Comprehensive channel analytics with metrics and trends
- **Video Search**: Advanced search with filters for date, views, channel size, etc.
- **CSV Export**: Download all data in CSV format for further analysis

## Setup Instructions

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   - Visit [http://localhost:3000](http://localhost:3000)

## Requirements

- Node.js 16+ 
- Backend server running on port 5000
- YouTube Data API key configured in backend

## Tech Stack

- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Home.jsx              # Landing page
│   │   ├── VideoAnalysis.jsx     # Single video analysis
│   │   ├── ChannelAnalysis.jsx   # Channel analytics
│   │   ├── VideoSearch.jsx       # Search with filters
│   │   └── Navbar.jsx            # Navigation
│   ├── services/
│   │   └── api.js                # API communication
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles
├── public/                       # Static assets
└── package.json                  # Dependencies
```

## Usage

1. **Video Analysis**: Enter a YouTube video URL to get detailed stats
2. **Channel Analysis**: Enter a channel URL for comprehensive analytics
3. **Video Search**: Use keywords and filters to find specific videos
4. **CSV Export**: Click "Export CSV" to download data for external analysis

## Development

- **Hot reload**: Changes reflect immediately in development
- **Proxy**: API calls automatically proxy to backend on port 5000
- **Responsive**: Mobile-friendly design with Tailwind CSS 