import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { getCuratedVideosForAthlete, YouTubeVideo } from '../services/youtube';
import { fetchAthleteNews, NewsArticle } from '../services/news';

// TODO: Replace with real data from backend based on user's content, social media, and athlete profile
const discoveryTrends = [
  {
    id: 1,
    title: 'Local brand sponsors are showing more interest in football players',
    subtitle: "We've seen a 12% spike compared to League Average",
    data: [40, 60, 80, 100],
    color: 'emerald',
    bgImage: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=600&h=400&fit=crop&q=80' // Football stadium
  },
  {
    id: 2,
    title: 'Your social media engagement is up this week',
    subtitle: 'Followers went up 14%',
    data: [50, 65, 85, 100],
    color: 'blue',
    bgImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop&q=80' // Social media/phone
  },
  {
    id: 3,
    title: 'NIL collectives in your conference are increasing payouts',
    subtitle: 'Average deals up 18% since last quarter',
    data: [30, 55, 75, 95],
    color: 'purple',
    bgImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&h=400&fit=crop&q=80' // Money/finance
  },
  {
    id: 4,
    title: 'Athletes in your sport are signing more apparel deals',
    subtitle: 'Apparel partnerships up 22% this month',
    data: [45, 70, 85, 100],
    color: 'orange',
    bgImage: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=400&fit=crop&q=80' // Athletic apparel
  }
];

// TODO: Replace with real data showing what similar athletes (same sport, position, school, etc.) are doing
const athletesTrends = [
  {
    id: 1,
    badge: '4 · football sophomores',
    title: 'recently signed apparel content',
    subtitle: 'Average deal value: $8,500',
    data: [50, 60, 55, 70, 65, 75, 70, 80],
    color: 'emerald'
  },
  {
    id: 2,
    title: 'Athletes at your school are increasing paid social content',
    subtitle: 'Posts and shares up 14%',
    data: [45, 50, 55, 60, 65, 70, 75, 80],
    color: 'blue'
  },
  {
    id: 3,
    badge: '8 · running backs',
    title: 'launched personal merchandise stores',
    subtitle: 'Average monthly revenue: $3,200',
    data: [55, 65, 60, 75, 70, 80, 75, 85],
    color: 'purple'
  },
  {
    id: 4,
    title: 'Athletes in your conference are partnering with local restaurants',
    subtitle: 'Restaurant deals up 28%',
    data: [40, 55, 50, 65, 60, 70, 75, 85],
    color: 'orange'
  }
];

const getColorClasses = (color: string) => {
  const colors = {
    emerald: {
      gradient: 'from-emerald-500/10 to-emerald-600/10',
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      bar: 'from-emerald-500 to-emerald-400',
      text: 'text-emerald-400'
    },
    blue: {
      gradient: 'from-blue-500/10 to-blue-600/10',
      border: 'border-blue-500/20 hover:border-blue-500/40',
      bar: 'from-blue-500 to-blue-400',
      text: 'text-blue-400'
    },
    purple: {
      gradient: 'from-purple-500/10 to-purple-600/10',
      border: 'border-purple-500/20 hover:border-purple-500/40',
      bar: 'from-purple-500 to-purple-400',
      text: 'text-purple-400'
    },
    orange: {
      gradient: 'from-orange-500/10 to-orange-600/10',
      border: 'border-orange-500/20 hover:border-orange-500/40',
      bar: 'from-orange-500 to-orange-400',
      text: 'text-orange-400'
    }
  };
  return colors[color as keyof typeof colors] || colors.emerald;
};

interface MarketTrendsPageProps {
  onAIClick?: (initialMessage?: string) => void;
}

export function MarketTrendsPage({ onAIClick }: MarketTrendsPageProps) {
  // TODO: Get user data from props or context - this should come from user profile/state/context
  const userSport = 'Football'; // Should come from user profile
  const userInterests = ['NIL', 'Tax Planning', 'Social Media']; // Should come from user profile

  // TODO: Pass in actual user data for AI recommendations
  const userDeals = [
    { type: 'Brand Deal', amount: 5000 },
    { type: 'Social Media', amount: 2000 }
  ]; // Should come from user's deals

  const recentActivity = [
    { source: 'Social Media', amount: 500 },
    { source: 'Brand Deal', amount: 3000 }
  ]; // Should come from user's recent transactions

  const taxStatus = 'on-track'; // Should come from tax vault status: 'on-track' | 'behind' | 'ahead'

  // State for videos and pagination
  const [curatedVideos, setCuratedVideos] = useState<YouTubeVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  const [videoPage, setVideoPage] = useState(0);
  const [isVideoHovered, setIsVideoHovered] = useState(false);

  // State for news articles and pagination
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [newsPage, setNewsPage] = useState(0);

  // Fetch curated videos on component mount
  useEffect(() => {
    async function fetchVideos() {
      setIsLoadingVideos(true);
      const videos = await getCuratedVideosForAthlete(
        userSport,
        userInterests,
        userDeals,
        recentActivity,
        taxStatus
      );
      setCuratedVideos(videos);
      setIsLoadingVideos(false);
    }

    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only fetch once on mount

  // Fetch news articles on component mount
  useEffect(() => {
    async function fetchNews() {
      setIsLoadingNews(true);
      const articles = await fetchAthleteNews();
      setNewsArticles(articles);
      setIsLoadingNews(false);
    }

    fetchNews();
  }, []);

  // Refs for scrolling
  const discoveryScrollRef = useRef<HTMLDivElement>(null);
  const athletesScrollRef = useRef<HTMLDivElement>(null);

  // Scroll functions
  const scrollDiscovery = () => {
    if (discoveryScrollRef.current) {
      discoveryScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollAthletes = () => {
    if (athletesScrollRef.current) {
      athletesScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const showNextVideos = () => {
    setVideoPage((prev) => (prev + 1) % 2); // Cycle through 2 pages (6 videos / 3 per page)
  };

  // Auto-rotate videos every 12 seconds (2 at a time), pause on hover
  useEffect(() => {
    if (curatedVideos.length === 0 || isLoadingVideos || isVideoHovered) return;

    const interval = setInterval(() => {
      setVideoPage((prev) => (prev + 1) % 3); // 6 videos / 2 per page = 3 pages
    }, 12000); // Rotate every 12 seconds

    return () => clearInterval(interval);
  }, [curatedVideos.length, isLoadingVideos, isVideoHovered]);

  // Auto-rotate news articles every 12 seconds
  useEffect(() => {
    if (newsArticles.length === 0 || isLoadingNews) return;

    const interval = setInterval(() => {
      setNewsPage((prev) => (prev + 1) % 4);
    }, 12000); // Rotate every 12 seconds

    return () => clearInterval(interval);
  }, [newsArticles.length, isLoadingNews]);

  // Show 2 videos at a time based on current page (6 total videos / 2 per page = 3 pages)
  const currentVideos = curatedVideos.slice(videoPage * 2, (videoPage * 2) + 2);
  
  // Show 2 news articles at a time based on current page
  const currentNews = newsArticles.slice(newsPage * 2, (newsPage * 2) + 2);

  return (
    <div className="px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">My Future Money</h1>
        <p className="mt-1 text-base text-neutral-400">Discover personalized trends and opportunities in NIL</p>
      </div>

      {/* Your Discovery Station */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Discovery Station</h2>
          <ChevronRight
            className="h-5 w-5 text-neutral-400 hover:text-neutral-100 cursor-pointer"
            onClick={scrollDiscovery}
          />
        </div>
        <p className="text-sm text-neutral-400 mb-4">Drill local news, top headlines and AI-generated key sport insights</p>

         {/* Horizontally scrollable cards */}
         <div ref={discoveryScrollRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {discoveryTrends.map((trend) => {
            const colorClasses = getColorClasses(trend.color);
            return (
              <div
                key={trend.id}
                className={`min-w-[300px] rounded-xl p-6 flex-shrink-0 border ${colorClasses.border} hover:border-opacity-60 transition-all cursor-pointer shadow-lg hover:shadow-xl hover:scale-[1.02] duration-300 relative overflow-hidden group`}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${trend.bgImage})` }}
                />
                
                {/* Gradient Overlay for readability */}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  trend.color === 'emerald' ? 'from-emerald-900/95 via-emerald-950/90 to-black/95' :
                  trend.color === 'blue' ? 'from-blue-900/95 via-blue-950/90 to-black/95' :
                  trend.color === 'purple' ? 'from-purple-900/95 via-purple-950/90 to-black/95' :
                  'from-orange-900/95 via-orange-950/90 to-black/95'
                } backdrop-blur-sm`} />
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-base font-semibold text-white mb-2 leading-tight drop-shadow-lg">{trend.title}</h3>
                  <p className={`text-xs ${colorClasses.text} font-medium mb-4 drop-shadow-md`}>{trend.subtitle}</p>
                  
                  {/* Enhanced bar chart with glow effects */}
                  <div className="h-20 bg-black/30 backdrop-blur-md rounded-lg flex items-end justify-around px-3 py-3 gap-1 border border-white/10">
                    {trend.data.map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center relative">
                        <div
                          className={`w-full bg-gradient-to-t ${colorClasses.bar} rounded-t transition-all duration-500`}
                          style={{
                            height: `${height}%`,
                            boxShadow: `0 0 20px ${trend.color === 'emerald' ? 'rgba(16, 185, 129, 0.5)' : 
                                                    trend.color === 'blue' ? 'rgba(59, 130, 246, 0.5)' : 
                                                    trend.color === 'purple' ? 'rgba(168, 85, 247, 0.5)' : 
                                                    'rgba(249, 115, 22, 0.5)'}`
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <button 
            onClick={scrollDiscovery}
            className="h-1.5 w-6 bg-emerald-500 rounded-full hover:bg-emerald-400 transition-colors cursor-pointer"
          />
          <button 
            onClick={scrollDiscovery}
            className="h-1.5 w-1.5 bg-neutral-600 rounded-full hover:bg-neutral-500 transition-colors cursor-pointer"
          />
          <button 
            onClick={scrollDiscovery}
            className="h-1.5 w-1.5 bg-neutral-600 rounded-full hover:bg-neutral-500 transition-colors cursor-pointer"
          />
          <button 
            onClick={scrollDiscovery}
            className="h-1.5 w-1.5 bg-neutral-600 rounded-full hover:bg-neutral-500 transition-colors cursor-pointer"
          />
        </div>
      </div>

      {/* Trending News - Separate section */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Trending News</h2>
          
          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setNewsPage((prev) => (prev - 1 + 4) % 4)}
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
              aria-label="Previous articles"
            >
              <svg className="w-5 h-5 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setNewsPage((prev) => (prev + 1) % 4)}
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
              aria-label="Next articles"
            >
              <svg className="w-5 h-5 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* News Articles Side by Side */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {isLoadingNews ? (
            // Loading state
            <>
              <div className="h-56 bg-neutral-800 rounded-lg animate-pulse" />
              <div className="h-56 bg-neutral-800 rounded-lg animate-pulse" />
            </>
          ) : currentNews.length > 0 ? (
            currentNews.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-neutral-900/60 p-5 border border-neutral-700 hover:border-neutral-600 hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col animate-fade-slide-in"
              >
                {/* Thumbnail */}
                <div
                  className="w-full h-32 bg-neutral-800 rounded-lg mb-3 bg-cover bg-center"
                  style={{ backgroundImage: `url(${article.imageUrl})` }}
                />

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-neutral-100 mb-2 line-clamp-2 leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    {article.description}
                  </p>
                </div>

                {/* Source */}
                <div className="text-xs text-neutral-400 mt-3">
                  {article.source}
                </div>
              </a>
            ))
          ) : (
            // No news found
            <div className="col-span-2 text-center py-12 text-neutral-400">
              No news articles available at this time.
            </div>
          )}
        </div>

        {/* Carousel Dots - Show which pair of articles is displayed */}
        {!isLoadingNews && currentNews.length > 0 && (
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setNewsPage(page)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  page === newsPage 
                    ? 'w-6 bg-purple-500 hover:bg-purple-400' 
                    : 'w-1.5 bg-neutral-600 hover:bg-neutral-500'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* My Assets Portfolio */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">My Assets</h2>
          <button className="text-sm text-neutral-400 hover:text-neutral-100">View All →</button>
        </div>

        {/* Portfolio Returns Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6 p-5 bg-neutral-950/50 rounded-lg border border-neutral-800">
          <div>
            <div className="text-xs text-neutral-400 mb-1">Total Value</div>
            <div className="text-2xl font-semibold text-neutral-100">$19,056</div>
          </div>
          <div>
            <div className="text-xs text-neutral-400 mb-1">Today's Return</div>
            <div className="text-xl font-semibold text-emerald-400">+$4.04</div>
            <div className="text-xs text-emerald-400">+0.02%</div>
          </div>
          <div>
            <div className="text-xs text-neutral-400 mb-1">Total Return</div>
            <div className="text-xl font-semibold text-emerald-400">+$1,256</div>
            <div className="text-xs text-emerald-400">+7.06%</div>
          </div>
          <div>
            <div className="text-xs text-neutral-400 mb-1">Annual Return</div>
            <div className="text-xl font-semibold text-emerald-400">+12.8%</div>
            <div className="text-xs text-neutral-400">vs S&P 500: +15.2%</div>
          </div>
        </div>

        {/* Asset Holdings */}
        <div className="grid grid-cols-4 gap-6">
          {[
            { ticker: 'AAPL', name: 'Apple Inc.', allocation: '30%', value: 7518.00, change: 12.04, changePercent: 0.16, logo: '🍎', bgColor: 'bg-neutral-800' },
            { ticker: 'AIRBNB', name: 'Airbnb Inc.', allocation: '25%', value: 5102.00, change: 15, changePercent: 0.15, logo: '🏠', bgColor: 'bg-red-500' },
            { ticker: 'NVDA', name: 'NVIDIA Corp.', allocation: '25%', value: 3918.00, change: -23, changePercent: -0.023, logo: '💚', bgColor: 'bg-emerald-600' },
            { ticker: 'AMZN', name: 'Amazon.com', allocation: '20%', value: 2518.00, change: 8.50, changePercent: 0.034, logo: '📦', bgColor: 'bg-neutral-700' }
          ].map((asset, index) => (
            <div key={index} className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 hover:border-neutral-700 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 ${asset.bgColor} rounded-lg flex items-center justify-center text-xl`}>
                  {asset.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-neutral-100 truncate">{asset.ticker}</div>
                  <div className="text-xs text-neutral-400 truncate">{asset.name}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400">Value</span>
                  <span className="text-sm font-semibold text-neutral-100">${asset.value.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400">Allocation</span>
                  <span className="text-sm font-semibold text-neutral-100">{asset.allocation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400">Today</span>
                  <div className={`text-sm font-semibold ${asset.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {asset.change >= 0 ? '▲' : '▼'} {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)} ({(asset.changePercent * 100).toFixed(2)}%)
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Athletes Like You Are Exploring */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Athletes Like You Are Exploring</h2>
          <ChevronRight
            className="h-5 w-5 text-neutral-400 hover:text-neutral-100 cursor-pointer"
            onClick={scrollAthletes}
          />
        </div>

         {/* Horizontally scrollable cards - showing 2 at a time */}
         <div ref={athletesScrollRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide mb-4">
          {athletesTrends.map((trend) => {
            const colorClasses = getColorClasses(trend.color);
            return (
              <div
                key={trend.id}
                className={`min-w-[calc(50%-8px)] rounded-lg bg-gradient-to-br ${colorClasses.gradient} p-5 flex-shrink-0 border ${colorClasses.border} transition-all cursor-pointer`}
              >
                {trend.badge && (
                  <div className={`text-xs font-semibold ${colorClasses.text} mb-2`}>{trend.badge}</div>
                )}
                <h3 className="text-sm font-semibold text-neutral-100 mb-2">{trend.title}</h3>
                <p className="text-xs text-neutral-400 mb-3">{trend.subtitle}</p>
                <div className="h-12 bg-neutral-800/30 rounded-lg flex items-end justify-around px-2 py-2">
                  {trend.data.map((height, i) => (
                    <div
                      key={i}
                      className={`flex-1 mx-0.5 bg-gradient-to-t ${colorClasses.bar} rounded-t`}
                      style={{height: `${height}%`}}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <button 
            onClick={scrollAthletes}
            className="h-1.5 w-6 bg-emerald-500 rounded-full hover:bg-emerald-400 transition-colors cursor-pointer"
          />
          <button 
            onClick={scrollAthletes}
            className="h-1.5 w-1.5 bg-neutral-600 rounded-full hover:bg-neutral-500 transition-colors cursor-pointer"
          />
          <button 
            onClick={scrollAthletes}
            className="h-1.5 w-1.5 bg-neutral-600 rounded-full hover:bg-neutral-500 transition-colors cursor-pointer"
          />
        </div>
      </div>

      {/* Curated for You - Auto-cycling Videos (2 at a time) */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Curated for You</h2>
          
          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setVideoPage((prev) => (prev - 1 + 3) % 3);
                setIsVideoHovered(true);
                setTimeout(() => setIsVideoHovered(false), 100);
              }}
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
              aria-label="Previous videos"
            >
              <svg className="w-5 h-5 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => {
                setVideoPage((prev) => (prev + 1) % 3);
                setIsVideoHovered(true);
                setTimeout(() => setIsVideoHovered(false), 100);
              }}
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
              aria-label="Next videos"
            >
              <svg className="w-5 h-5 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Videos - 2 at a time with animations (50% height) */}
        <div 
          className="grid grid-cols-2 gap-4 mb-4"
          onMouseEnter={() => setIsVideoHovered(true)}
          onMouseLeave={() => setIsVideoHovered(false)}
        >
          {isLoadingVideos ? (
            // Loading state
            <>
              <div className="h-[250px] bg-neutral-800 rounded-xl animate-pulse" />
              <div className="h-[250px] bg-neutral-800 rounded-xl animate-pulse" />
            </>
          ) : currentVideos.length > 0 ? (
            currentVideos.map((video, index) => (
              <div
                key={`${video.videoId}-${videoPage}`}
                className="relative h-[250px] w-full rounded-xl overflow-hidden bg-black shadow-2xl animate-fade-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${video.videoId}?autoplay=0&controls=1&rel=0&modestbranding=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                />
                
                {/* Video Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent pointer-events-none z-10">
                  <div className="text-sm font-semibold text-white line-clamp-2 leading-tight mb-1">
                    {video.title}
                  </div>
                  <div className="text-xs text-neutral-300">
                    {video.channelTitle}
                  </div>
                </div>
              </div>
            ))
          ) : (
            // No videos found
            <div className="col-span-2 text-center py-12 text-neutral-400">
              No videos found. Configure your YouTube API key to see personalized content.
            </div>
          )}
        </div>
        
        {/* Carousel Dots */}
        {!isLoadingVideos && currentVideos.length > 0 && (
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map((page) => (
              <button
                key={page}
                onClick={() => setVideoPage(page)}
                onMouseEnter={() => setIsVideoHovered(true)}
                onMouseLeave={() => setIsVideoHovered(false)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  page === videoPage 
                    ? 'w-6 bg-orange-500 hover:bg-orange-400' 
                    : 'w-1.5 bg-neutral-600 hover:bg-neutral-500'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
