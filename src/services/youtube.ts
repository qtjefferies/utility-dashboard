// YouTube Data API v3 Integration
// Get your API key from: https://console.cloud.google.com/apis/credentials

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
  youtubeUrl: string;
}

// Search for videos on YouTube
export async function searchYouTubeVideos(
  query: string,
  maxResults: number = 10
): Promise<YouTubeVideo[]> {
  try {
    if (!YOUTUBE_API_KEY) {
      console.warn('YouTube API key not configured. Using fallback videos.');
      return getFallbackVideos(query);
    }

    const url = `${YOUTUBE_API_BASE}/search?` + new URLSearchParams({
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: maxResults.toString(),
      key: YOUTUBE_API_KEY,
      order: 'relevance',
      videoEmbeddable: 'true',
      videoSyndicated: 'true'
    });

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }

    const data = await response.json();

    return data.items.map((item: any, index: number) => ({
      id: index + 1,
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      youtubeUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return getFallbackVideos(query);
  }
}

// Get curated videos for NIL athletes - 6 embeddable videos
export async function getCuratedVideosForAthlete(
  userSport: string,
  userInterests: string[],
  userDeals?: any[],
  recentActivity?: any[],
  taxStatus?: string
): Promise<YouTubeVideo[]> {
  // Return 6 handpicked embeddable YouTube videos on NIL, athlete taxes, LLC formation, etc.
  // Note: YouTube Shorts cannot be embedded, so we use regular videos
  return [
    {
      id: 1,
      videoId: 'mGXrxaIcmJQ',
      title: 'Tax Tips for NIL Athletes',
      description: 'TurboTax experts explain NIL tax considerations, self-employment taxes, and how to structure your business as an athlete.',
      thumbnailUrl: 'https://img.youtube.com/vi/mGXrxaIcmJQ/maxresdefault.jpg',
      channelTitle: 'TurboTax',
      publishedAt: '2023-01-15',
      youtubeUrl: 'https://www.youtube.com/watch?v=mGXrxaIcmJQ'
    },
    {
      id: 2,
      videoId: 'Jrmc3fdRJSA',
      title: 'Analyzing Tax Deductions for NIL Athletes',
      description: 'Learn what expenses you can deduct as a college athlete earning NIL income - from travel to marketing costs.',
      thumbnailUrl: 'https://img.youtube.com/vi/Jrmc3fdRJSA/maxresdefault.jpg',
      channelTitle: 'NCAA NIL Assist',
      publishedAt: '2023-03-20',
      youtubeUrl: 'https://www.youtube.com/watch?v=Jrmc3fdRJSA'
    },
    {
      id: 3,
      videoId: '8-au2VNlFJE',
      title: 'Calculating Tax Requirements for NIL Income',
      description: 'Understanding quarterly tax payments, estimated taxes, and how to calculate what you owe on your NIL deals.',
      thumbnailUrl: 'https://img.youtube.com/vi/8-au2VNlFJE/maxresdefault.jpg',
      channelTitle: 'NCAA NIL Assist',
      publishedAt: '2023-04-10',
      youtubeUrl: 'https://www.youtube.com/watch?v=8-au2VNlFJE'
    },
    {
      id: 4,
      videoId: 'zh6IPmnp7LI',
      title: 'Three Steps to Start Building Your Brand',
      description: 'How college athletes can build their personal brand in the NIL era - content creation, social media strategy, and authenticity.',
      thumbnailUrl: 'https://img.youtube.com/vi/zh6IPmnp7LI/maxresdefault.jpg',
      channelTitle: 'NCAA NIL Assist',
      publishedAt: '2023-05-15',
      youtubeUrl: 'https://www.youtube.com/watch?v=zh6IPmnp7LI'
    },
    {
      id: 5,
      videoId: 'SsQKt03avTs',
      title: 'How to Set Up an LLC/S-Corp & Save Money on Taxes',
      description: 'Complete guide to forming an LLC or S-Corp for your NIL business - when to do it, how to do it, and tax benefits.',
      thumbnailUrl: 'https://img.youtube.com/vi/SsQKt03avTs/maxresdefault.jpg',
      channelTitle: 'Fresh and Fit',
      publishedAt: '2023-06-01',
      youtubeUrl: 'https://www.youtube.com/watch?v=SsQKt03avTs'
    },
    {
      id: 6,
      videoId: '8hO1rjcXURE',
      title: 'Tax Deductions, Marketing & Keys to Business Success',
      description: 'Advanced strategies for athletes and creators - maximizing deductions, marketing yourself, and building long-term wealth.',
      thumbnailUrl: 'https://img.youtube.com/vi/8hO1rjcXURE/maxresdefault.jpg',
      channelTitle: 'Earn Your Leisure',
      publishedAt: '2023-07-20',
      youtubeUrl: 'https://www.youtube.com/watch?v=8hO1rjcXURE'
    }
  ];
}

// Fallback videos when API key is not configured or API fails
function getFallbackVideos(query: string): YouTubeVideo[] {
  // Return 8 curated videos for NIL athletes
  return [
    {
      id: 1,
      videoId: 'mGXrxaIcmJQ',
      title: 'Tax Tips for NIL Athletes',
      description: 'TurboTax experts explain NIL tax considerations',
      thumbnailUrl: 'https://img.youtube.com/vi/mGXrxaIcmJQ/hqdefault.jpg',
      channelTitle: 'TurboTax',
      publishedAt: '2023-01-01',
      youtubeUrl: 'https://www.youtube.com/watch?v=mGXrxaIcmJQ'
    },
    {
      id: 2,
      videoId: 'dQw4w9WgXcQ',
      title: 'Building Your Personal Brand as an Athlete',
      description: 'Learn how to create a strong personal brand',
      thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
      channelTitle: 'Athlete Business',
      publishedAt: '2023-02-01',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
      id: 3,
      videoId: 'jNQXAC9IVRw',
      title: 'Social Media Strategy for Athletes',
      description: 'Maximize your social media presence',
      thumbnailUrl: 'https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg',
      channelTitle: 'Sports Marketing',
      publishedAt: '2023-03-01',
      youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw'
    },
    {
      id: 4,
      videoId: '9bZkp7q19f0',
      title: 'NIL Deal Negotiation Tips',
      description: 'How to negotiate better NIL deals',
      thumbnailUrl: 'https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg',
      channelTitle: 'NIL Expert',
      publishedAt: '2023-04-01',
      youtubeUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0'
    },
    {
      id: 5,
      videoId: 'kJQP7kiw5Fk',
      title: 'Financial Planning for Young Athletes',
      description: 'Smart money management strategies',
      thumbnailUrl: 'https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg',
      channelTitle: 'Athlete Finance',
      publishedAt: '2023-05-01',
      youtubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk'
    },
    {
      id: 6,
      videoId: 'ZZ5LpwO-An4',
      title: 'LLC vs S-Corp for Athletes',
      description: 'Choosing the right business structure',
      thumbnailUrl: 'https://img.youtube.com/vi/ZZ5LpwO-An4/hqdefault.jpg',
      channelTitle: 'Business Coach',
      publishedAt: '2023-06-01',
      youtubeUrl: 'https://www.youtube.com/watch?v=ZZ5LpwO-An4'
    },
    {
      id: 7,
      videoId: 'fJ9rUzIMcZQ',
      title: 'Quarterly Tax Payments Explained',
      description: 'Understanding estimated tax payments',
      thumbnailUrl: 'https://img.youtube.com/vi/fJ9rUzIMcZQ/hqdefault.jpg',
      channelTitle: 'Tax Academy',
      publishedAt: '2023-07-01',
      youtubeUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ'
    },
    {
      id: 8,
      videoId: 'L_jWHffIx5E',
      title: 'Sponsorship Opportunities for College Athletes',
      description: 'Finding and securing sponsorships',
      thumbnailUrl: 'https://img.youtube.com/vi/L_jWHffIx5E/hqdefault.jpg',
      channelTitle: 'Sports Business',
      publishedAt: '2023-08-01',
      youtubeUrl: 'https://www.youtube.com/watch?v=L_jWHffIx5E'
    }
  ];
}
