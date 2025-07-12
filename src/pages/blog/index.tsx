import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import DynamicHeader from '@/components/common/DynamicHeader';
import FloatingContactButton from '@/components/common/FloatingContactButton';
import PortalLayout from '@/components/layout/PortalLayout';
import SEOHead from '@/components/seo/SEOHead';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';
import { Calendar, User, Clock, Tag, Search, TrendingUp, Eye } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: number;
  category: string;
  tags: string[];
  image: string;
  views: number;
  featured: boolean;
}

export default function BlogIndex() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 블로그 포스트 데이터
  const blogPosts: BlogPost[] = [
    {
      id: 'ultimate-guide-manila-apartments',
      title: 'Ultimate Guide to Finding Apartments in Manila for Foreigners',
      excerpt: 'Everything you need to know about renting apartments in Manila as a foreigner, including best areas, pricing, and legal requirements.',
      content: '',
      author: 'Sarah Kim',
      publishedAt: '2024-01-15',
      readTime: 8,
      category: 'City Guides',
      tags: ['Manila', 'Apartment Hunting', 'Foreigner Guide'],
      image: '/images/blog/manila-guide.jpg',
      views: 2547,
      featured: true
    },
    {
      id: 'monthly-stay-cebu-digital-nomads',
      title: 'Monthly Stay in Cebu: Perfect for Digital Nomads',
      excerpt: 'Discover why Cebu is becoming a top destination for digital nomads and how to find the perfect monthly stay apartment.',
      content: '',
      author: 'Mike Rodriguez',
      publishedAt: '2024-01-12',
      readTime: 6,
      category: 'Digital Nomad',
      tags: ['Cebu', 'Digital Nomad', 'Monthly Stay'],
      image: '/images/blog/cebu-nomad.jpg',
      views: 1876,
      featured: true
    },
    {
      id: 'philippines-rental-legal-guide',
      title: 'Legal Guide: Rental Rights and Responsibilities in Philippines',
      excerpt: 'Understanding your rights and responsibilities as a foreign tenant in the Philippines. Essential legal information for renters.',
      content: '',
      author: 'Attorney Maria Santos',
      publishedAt: '2024-01-10',
      readTime: 12,
      category: 'Legal',
      tags: ['Legal Rights', 'Tenant Rights', 'Philippines Law'],
      image: '/images/blog/legal-guide.jpg',
      views: 1654,
      featured: false
    },
    {
      id: 'cost-living-philippines-foreigners',
      title: 'Cost of Living in Philippines: A Complete Breakdown for Foreigners',
      excerpt: 'Detailed analysis of living costs across major Philippine cities including housing, food, transportation, and entertainment.',
      content: '',
      author: 'David Chen',
      publishedAt: '2024-01-08',
      readTime: 10,
      category: 'Cost of Living',
      tags: ['Cost of Living', 'Budget Planning', 'Philippines'],
      image: '/images/blog/cost-living.jpg',
      views: 3241,
      featured: true
    },
    {
      id: 'boracay-long-term-rental-guide',
      title: 'Long-term Rentals in Boracay: Paradise Living Guide',
      excerpt: 'How to find and secure long-term rental accommodations in Boracay. Tips for island living and what to expect.',
      content: '',
      author: 'Emma Johnson',
      publishedAt: '2024-01-05',
      readTime: 7,
      category: 'Island Living',
      tags: ['Boracay', 'Island Living', 'Beach Rentals'],
      image: '/images/blog/boracay-guide.jpg',
      views: 1432,
      featured: false
    },
    {
      id: 'philippines-internet-speed-guide',
      title: 'Internet Speed and Connectivity Guide for Remote Workers',
      excerpt: 'Essential guide to internet connectivity in Philippines apartments. Best providers, speeds, and areas for remote work.',
      content: '',
      author: 'Tech Team',
      publishedAt: '2024-01-03',
      readTime: 5,
      category: 'Technology',
      tags: ['Internet', 'Remote Work', 'Connectivity'],
      image: '/images/blog/internet-guide.jpg',
      views: 2156,
      featured: false
    }
  ];

  const categories = ['all', 'City Guides', 'Digital Nomad', 'Legal', 'Cost of Living', 'Island Living', 'Technology'];

  // 필터링된 포스트
  const filteredPosts = useMemo(() => {
    let filtered = blogPosts;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return filtered;
  }, [selectedCategory, searchTerm]);

  const featuredPosts = blogPosts.filter(post => post.featured);
  const popularPosts = [...blogPosts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  // SEO 설정
  const seoConfig = {
    title: 'Philippines Rental Blog - Tips, Guides & Insights for Foreigners',
    description: 'Expert tips, city guides, and insights for foreigners renting in Philippines. From Manila apartments to Cebu monthly stays, get the latest rental advice.',
    keywords: 'Philippines rental blog, apartment rental tips, expat living Philippines, Manila rental guide, Cebu digital nomad, Philippines living tips',
    image: '/images/og-blog.jpg'
  };

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' }
  ];

  return (
    <>
      <SEOHead
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        image={seoConfig.image}
        type="website"
        locale={currentLanguage}
        alternateLocales={['en', 'ko', 'zh', 'ja']}
      />
      
      <BreadcrumbSchema items={breadcrumbs} />

      <div className="min-h-screen bg-gray-50">
        <DynamicHeader 
          currentLanguage={currentLanguage} 
          onLanguageChange={handleLanguageChange} 
        />
        
        <PortalLayout>
          <main className="py-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                📖 Philippines Rental Blog
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Expert tips, city guides, and insights for foreigners living in the Philippines. 
                From apartment hunting to local culture, we've got you covered.
              </p>

              {/* Search and Filter */}
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Featured Posts */}
            {selectedCategory === 'all' && !searchTerm && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-blue-600" />
                  Featured Articles
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {featuredPosts.slice(0, 2).map((post) => (
                    <Link key={post.id} href={`/blog/${post.id}`} className="block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                      <div>
                        <div className="relative h-48">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Featured
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(post.publishedAt)}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {post.readTime} min read
                            </div>
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {formatViews(post.views)}
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                          <p className="text-gray-600 mb-4">{post.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1 text-gray-400" />
                              <span className="text-sm text-gray-600">{post.author}</span>
                            </div>
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                              {post.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {searchTerm ? `Search Results (${filteredPosts.length})` : 
                     selectedCategory === 'all' ? 'Latest Articles' : `${selectedCategory} Articles`}
                  </h2>
                </div>

                {/* Blog Posts Grid */}
                <div className="space-y-8">
                  {filteredPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.id}`} className="block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <article>
                        <div className="md:flex">
                          <div className="md:w-1/3 relative h-48 md:h-auto">
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="md:w-2/3 p-6">
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatDate(post.publishedAt)}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {post.readTime} min read
                              </div>
                              <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {formatViews(post.views)}
                              </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-gray-600 mb-4">{post.excerpt}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1 text-gray-400" />
                                <span className="text-sm text-gray-600">{post.author}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                  {post.category}
                                </span>
                                {post.featured && (
                                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                                    Featured
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>

                {/* No Results */}
                {filteredPosts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">
                      No articles found matching your criteria.
                    </div>
                    <button 
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Show all articles
                    </button>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Popular Posts */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                    Popular Articles
                  </h3>
                  <div className="space-y-4">
                    {popularPosts.map((post, index) => (
                      <Link key={post.id} href={`/blog/${post.id}`} className="block cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1 text-sm leading-tight">
                              {post.title}
                            </h4>
                            <div className="flex items-center text-xs text-gray-500">
                              <Eye className="h-3 w-3 mr-1" />
                              {formatViews(post.views)} views
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Tag className="h-5 w-5 mr-2 text-blue-600" />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.filter(cat => cat !== 'all').map(category => {
                      const count = blogPosts.filter(post => post.category === category).length;
                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                            selectedCategory === category 
                              ? 'bg-blue-50 text-blue-700' 
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span>{category}</span>
                          <span className="text-sm">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Newsletter Signup */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
                  <p className="text-sm mb-4 opacity-90">
                    Get the latest rental tips and Philippines living guides delivered to your inbox.
                  </p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="w-full px-4 py-2 rounded-lg text-gray-900 border-0 focus:ring-2 focus:ring-white"
                    />
                    <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </PortalLayout>

        <FloatingContactButton />
      </div>
    </>
  );
}