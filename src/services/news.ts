// News API Integration for NIL and Tax Articles
// Using NewsAPI.org (free tier: 100 requests/day)
// Get your API key from: https://newsapi.org/register

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || '';
const NEWS_API_BASE = 'https://newsapi.org/v2';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
}

// Fetch NIL and tax-related news articles for athletes
export async function fetchAthleteNews(): Promise<NewsArticle[]> {
  try {
    if (!NEWS_API_KEY) {
      console.warn('News API key not configured. Using fallback articles.');
      return getFallbackArticles();
    }

    // Search for NIL and athlete-related news
    const queries = [
      'NIL college athletes',
      'student athlete taxes',
      'NCAA NIL deals'
    ];

    const allArticles: NewsArticle[] = [];

    for (const query of queries) {
      const url = `${NEWS_API_BASE}/everything?` + new URLSearchParams({
        q: query,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: '3',
        apiKey: NEWS_API_KEY
      });

      const response = await fetch(url);

      if (!response.ok) {
        console.error(`News API error: ${response.statusText}`);
        continue;
      }

      const data = await response.json();

      const articles = data.articles.map((article: any, index: number) => ({
        id: `${query}-${index}`,
        title: article.title,
        description: article.description || article.content?.substring(0, 150) + '...' || '',
        url: article.url,
        imageUrl: article.urlToImage || 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=200&h=100&fit=crop',
        source: article.source.name,
        publishedAt: article.publishedAt
      }));

      allArticles.push(...articles);

      // Stop if we have enough articles
      if (allArticles.length >= 8) break;
    }

    // Remove duplicates by URL
    const uniqueArticles = Array.from(
      new Map(allArticles.map(a => [a.url, a])).values()
    );

    // Return top 8 most recent
    return uniqueArticles
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 8);
  } catch (error) {
    console.error('Error fetching news:', error);
    return getFallbackArticles();
  }
}

// Fallback articles when API is not configured or fails
// These are REAL articles with REAL URLs that work
function getFallbackArticles(): NewsArticle[] {
  return [
    {
      id: '1',
      title: 'NCAA Revenue Sharing & NIL: Complete 2025 Guide',
      description: 'College athletes can now earn revenue from schools plus NIL deals...',
      url: 'https://studbud.org/ncaa-revenue-sharing-nil-the-complete-2025-guide-for-college-athletes-schools-and-recruiters/',
      imageUrl: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=400&h=300&fit=crop',
      source: 'StudBud',
      publishedAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Tax Tips for NIL Athletes - What You Need to Know',
      description: 'Essential tax guidance for college athletes earning NIL income...',
      url: 'https://nilassist.ncaa.org/tax-tips-for-nil-athletes/',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
      source: 'NCAA',
      publishedAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'How NIL Income Affects College Athlete Taxes',
      description: 'Understanding tax implications and deductions for student athletes...',
      url: 'https://jasonfintips.com/financial-planning-for-college-athletes-blog/how-nil-income-affects-college-athlete-taxes-what-you-need-to-know/',
      imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop',
      source: 'Financial Planning',
      publishedAt: new Date().toISOString()
    },
    {
      id: '4',
      title: 'Student Athletes & NIL Tax Obligations',
      description: 'IRS guidance on tax responsibilities for NIL agreements...',
      url: 'https://www.taxpayeradvocate.irs.gov/news/nta-blog/nta-blog-student-athletes-involved-in-nil-agreements-should-be-aware-of-their-tax-obligations/2023/12/',
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop',
      source: 'IRS',
      publishedAt: new Date().toISOString()
    },
    {
      id: '5',
      title: 'NIL Deals: Best Campaigns for College Athletes in 2025',
      description: 'Top NIL opportunities and brand partnerships for student athletes...',
      url: 'https://nilclub.com/blog/best-nil-deals-for-college-athletes-in-2025-top-campaigns-to-know',
      imageUrl: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400&h=300&fit=crop',
      source: 'NIL Club',
      publishedAt: new Date().toISOString()
    },
    {
      id: '6',
      title: 'Financial Tips for College Athletes with NIL Deals',
      description: 'Expert advice on managing NIL income and building wealth...',
      url: 'https://www.mgocpa.com/perspective/3-game-changing-financial-tips-for-young-athletes-scoring-nil-deals/',
      imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop',
      source: 'MGO CPAs',
      publishedAt: new Date().toISOString()
    },
    {
      id: '7',
      title: 'Should Athletes Form an LLC for NIL Income?',
      description: 'Exploring business structure options and tax benefits for NIL athletes...',
      url: 'https://www.claconnect.com/en/resources/articles/25/should-athletes-form-an-llc-for-nil-income',
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop',
      source: 'CLA',
      publishedAt: new Date().toISOString()
    },
    {
      id: '8',
      title: 'Building Your Personal Brand as a College Athlete',
      description: 'Strategies for maximizing your NIL potential through personal branding...',
      url: 'https://nilassist.ncaa.org/three-steps-to-start-building-your-brand/',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      source: 'NCAA',
      publishedAt: new Date().toISOString()
    }
  ];
}
