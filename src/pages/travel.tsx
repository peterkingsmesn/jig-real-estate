import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import FacebookLayout from '@/components/layout/FacebookLayout';
import SEOHead from '@/components/seo/SEOHead';
import { 
  MapPin, 
  Calendar, 
  Camera,
  Star,
  Users,
  Clock,
  Heart,
  Share2,
  Eye,
  Search,
  Filter,
  Plane,
  Car,
  Hotel,
  Utensils,
  Mountain,
  Waves,
  Sun,
  Palmtree,
  Navigation,
  Info,
  Shield,
  Smartphone,
  CreditCard,
  Globe,
  Phone
} from 'lucide-react';

interface TravelDestination {
  id: string;
  name: string;
  nameKo: string;
  nameTl: string;
  region: string;
  description: string;
  descriptionKo: string;
  descriptionTl: string;
  highlights: string[];
  image: string;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  bestTimeToVisit: string;
  estimatedCost: {
    budget: number;
    midrange: number;
    luxury: number;
  };
  duration: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  activities: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  isFeatured: boolean;
  isPopular: boolean;
}

interface TravelGuide {
  id: string;
  title: string;
  titleKo: string;
  titleTl: string;
  category: string;
  description: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: string;
  image: string;
  tags: string[];
  views: number;
  likes: number;
}

export default function TravelPage() {
  const router = useRouter();
  const currentLanguage = 'ko';
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [destinations, setDestinations] = useState<TravelDestination[]>([]);
  const [travelGuides, setTravelGuides] = useState<TravelGuide[]>([]);
  const [loading, setLoading] = useState(true);


  // 데이터 가져오기
  useEffect(() => {
    const fetchTravelData = async () => {
      setLoading(true);
      try {
        const [destinationsRes, guidesRes] = await Promise.all([
          fetch('/api/travel/destinations'),
          fetch('/api/travel/guides')
        ]);

        const destinationsResult = await destinationsRes.json();
        const guidesResult = await guidesRes.json();

        if (destinationsResult.success) {
          setDestinations(destinationsResult.data);
        }
        if (guidesResult.success) {
          console.log('Travel guides data:', guidesResult.data);
          setTravelGuides(guidesResult.data);
        }
      } catch (error) {
        console.error('Failed to fetch travel data:', error);
        // 폴백 데이터 사용
        setDestinations(sampleDestinations);
        setTravelGuides(sampleGuides);
      } finally {
        setLoading(false);
      }
    };

    fetchTravelData();
  }, []);

  const categories = [
    { id: 'all', name: '전체', nameEn: 'All', nameTl: 'Lahat', icon: '🏝️' },
    { id: 'beaches', name: '해변', nameEn: 'Beaches', nameTl: 'Mga Beach', icon: '🏖️' },
    { id: 'mountains', name: '산', nameEn: 'Mountains', nameTl: 'Mga Bundok', icon: '⛰️' },
    { id: 'cities', name: '도시', nameEn: 'Cities', nameTl: 'Mga Lungsod', icon: '🏙️' },
    { id: 'islands', name: '섬', nameEn: 'Islands', nameTl: 'Mga Isla', icon: '🏝️' },
    { id: 'heritage', name: '문화유산', nameEn: 'Heritage', nameTl: 'Pamana', icon: '🏛️' },
    { id: 'adventure', name: '어드벤처', nameEn: 'Adventure', nameTl: 'Adventure', icon: '🎒' }
  ];

  const regions = [
    { id: 'luzon', name: '루손', nameEn: 'Luzon', nameTl: 'Luzon' },
    { id: 'visayas', name: '비사야', nameEn: 'Visayas', nameTl: 'Visayas' },
    { id: 'mindanao', name: '민다나오', nameEn: 'Mindanao', nameTl: 'Mindanao' }
  ];

  // 샘플 데이터 (API 연동 실패 시 폴백)
  const sampleDestinations: TravelDestination[] = [
    {
      id: '1',
      name: 'Boracay Island',
      nameKo: '보라카이 섬',
      nameTl: 'Boracay Island',
      region: 'Visayas',
      description: 'World-famous white sand beach paradise with crystal clear waters and vibrant nightlife.',
      descriptionKo: '수정처럼 맑은 바다와 활기찬 밤문화를 자랑하는 세계적으로 유명한 화이트 샌드 비치 천국입니다.',
      descriptionTl: 'World-famous white sand beach paradise na may crystal clear waters at vibrant nightlife.',
      highlights: ['White Beach', 'Water Sports', 'Sunset Sailing', 'D\'Mall Shopping'],
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop'
      ],
      category: 'beaches',
      rating: 4.8,
      reviewCount: 1245,
      bestTimeToVisit: 'November to April',
      estimatedCost: {
        budget: 2500,
        midrange: 5000,
        luxury: 12000
      },
      duration: '3-5 days',
      difficulty: 'easy',
      activities: ['Swimming', 'Diving', 'Parasailing', 'Island Hopping', 'Nightlife'],
      coordinates: { lat: 11.9674, lng: 121.9248 },
      isFeatured: true,
      isPopular: true
    },
    {
      id: '2',
      name: 'Baguio City',
      nameKo: '바기오 시티',
      nameTl: 'Baguio City',
      region: 'Luzon',
      description: 'Summer capital of the Philippines known for its cool climate, pine trees, and beautiful parks.',
      descriptionKo: '시원한 기후, 소나무, 아름다운 공원으로 유명한 필리핀의 여름 수도입니다.',
      descriptionTl: 'Summer capital ng Pilipinas na kilala sa cool climate, pine trees, at magagandang parks.',
      highlights: ['Burnham Park', 'Session Road', 'Mines View Park', 'Camp John Hay'],
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop'
      ],
      category: 'cities',
      rating: 4.5,
      reviewCount: 892,
      bestTimeToVisit: 'December to February',
      estimatedCost: {
        budget: 1500,
        midrange: 3000,
        luxury: 7000
      },
      duration: '2-3 days',
      difficulty: 'easy',
      activities: ['Sightseeing', 'Shopping', 'Photography', 'Hiking', 'Food Tours'],
      coordinates: { lat: 16.4023, lng: 120.5960 },
      isFeatured: false,
      isPopular: true
    },
    {
      id: '3',
      name: 'Palawan',
      nameKo: '팔라완',
      nameTl: 'Palawan',
      region: 'Luzon',
      description: 'Last frontier of the Philippines with pristine beaches, underground rivers, and diverse wildlife.',
      descriptionKo: '깨끗한 해변, 지하강, 다양한 야생동물을 보유한 필리핀의 마지막 개척지입니다.',
      descriptionTl: 'Last frontier ng Pilipinas na may pristine beaches, underground rivers, at diverse wildlife.',
      highlights: ['El Nido', 'Coron', 'Puerto Princesa Underground River', 'Big Lagoon'],
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=500&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1544273813-6e8b31b8e0bb?w=500&h=300&fit=crop'
      ],
      category: 'islands',
      rating: 4.9,
      reviewCount: 2156,
      bestTimeToVisit: 'November to May',
      estimatedCost: {
        budget: 4000,
        midrange: 8000,
        luxury: 18000
      },
      duration: '5-7 days',
      difficulty: 'moderate',
      activities: ['Island Hopping', 'Diving', 'Snorkeling', 'Cave Exploration', 'Wildlife Watching'],
      coordinates: { lat: 9.8349, lng: 118.7384 },
      isFeatured: true,
      isPopular: true
    }
  ];

  const sampleGuides: TravelGuide[] = [
    {
      id: '1',
      title: 'Ultimate Philippines Travel Guide for First-Time Visitors',
      titleKo: '첫 방문자를 위한 완벽한 필리핀 여행 가이드',
      titleTl: 'Ultimate Philippines Travel Guide para sa First-Time Visitors',
      category: 'planning',
      description: 'Everything you need to know for your first trip to the Philippines',
      content: 'Comprehensive guide covering visa requirements, best destinations, budget planning, and cultural tips.',
      author: 'Travel Philippines Team',
      publishDate: '2024-01-15',
      readTime: '12 min',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=250&fit=crop',
      tags: ['planning', 'first-time', 'visa', 'budget'],
      views: 15420,
      likes: 1245
    },
    {
      id: '2',
      title: 'Best Food to Try in the Philippines',
      titleKo: '필리핀에서 꼭 먹어봐야 할 최고의 음식들',
      titleTl: 'Best Food na Dapat Tikman sa Pilipinas',
      category: 'food',
      description: 'A culinary journey through Philippine cuisine',
      content: 'Discover the must-try dishes, street food, and regional specialties across the Philippines.',
      author: 'FoodiesPH',
      publishDate: '2024-01-10',
      readTime: '8 min',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop',
      tags: ['food', 'cuisine', 'street-food', 'local'],
      views: 9876,
      likes: 892
    }
  ];

  const filteredDestinations = destinations.filter(destination => {
    if (activeCategory !== 'all' && destination.category !== activeCategory) return false;
    if (selectedRegion && destination.region !== selectedRegion) return false;
    if (searchTerm && !destination.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getCategoryName = (category: any) => {
    return category.name;
  };

  const getDestinationName = (destination: TravelDestination) => {
    return destination.nameKo;
  };

  const getDestinationDescription = (destination: TravelDestination) => {
    return destination.descriptionKo;
  };

  return (
    <>
      <SEOHead
        title="Travel Philippines - Discover Amazing Destinations"
        description="Explore the beautiful Philippines with our comprehensive travel guide. Discover beaches, mountains, cities, and cultural heritage sites."
        keywords="travel, philippines, tourism, destinations, beaches, mountains, islands"
        type="website"
        locale={currentLanguage}
      />

      <FacebookLayout section="travel">
          <main className="py-8">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                ✈️ 필리핀 여행
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                7,640개의 아름다운 섬으로 이루어진 열대 천국을 발견하세요
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">7,640</div>
                  <div className="text-sm text-gray-600">
                    {(currentLanguage as string) === 'ko' ? '섬들' : (currentLanguage as string) === 'tl' ? 'Mga Isla' : 'Islands'}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-2xl font-bold text-green-600">300+</div>
                  <div className="text-sm text-gray-600">
                    {(currentLanguage as string) === 'ko' ? '관광지' : (currentLanguage as string) === 'tl' ? 'Destinations' : 'Destinations'}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">25°C</div>
                  <div className="text-sm text-gray-600">
                    {(currentLanguage as string) === 'ko' ? '평균 기온' : (currentLanguage as string) === 'tl' ? 'Avg Temp' : 'Avg Temp'}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-2xl font-bold text-orange-600">181</div>
                  <div className="text-sm text-gray-600">
                    {(currentLanguage as string) === 'ko' ? '언어' : (currentLanguage as string) === 'tl' ? 'Languages' : 'Languages'}
                  </div>
                </div>
              </div>
            </div>

            {/* Category Navigation */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        activeCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>{category.icon}</span>
                      <span className="text-sm font-medium">
                        {getCategoryName(category)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={
                      (currentLanguage as string) === 'ko' ? '여행지나 활동을 검색하세요...' :
                      (currentLanguage as string) === 'tl' ? 'Maghanap ng destination o activity...' :
                      'Search destinations or activities...'
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    {(currentLanguage as string) === 'ko' ? '모든 지역' : (currentLanguage as string) === 'tl' ? 'Lahat ng Region' : 'All Regions'}
                  </option>
                  {regions.map(region => (
                    <option key={region.id} value={region.nameEn}>
                      {(currentLanguage as string) === 'ko' ? region.name : region.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Featured Destinations */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🌟 {(currentLanguage as string) === 'ko' ? '추천 여행지' :
                    (currentLanguage as string) === 'tl' ? 'Featured Destinations' :
                    'Featured Destinations'}
              </h2>
              
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDestinations.slice(0, 6).map((destination) => (
                    <div 
                      key={destination.id} 
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => router.push(`/travel/destination/${destination.id}`)}
                    >
                      <div className="relative h-48">
                        <img 
                          src={destination.image} 
                          alt={getDestinationName(destination)}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 flex space-x-2">
                          {destination.isFeatured && (
                            <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded">
                              Featured
                            </span>
                          )}
                          {destination.isPopular && (
                            <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-sm rounded">
                            {destination.region}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {getDestinationName(destination)}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {getDestinationDescription(destination)}
                        </p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{destination.rating}</span>
                            <span className="text-sm text-gray-500">({destination.reviewCount})</span>
                          </div>
                          <span className="text-sm text-gray-500">{destination.duration}</span>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="text-sm">
                            <span className="text-gray-500">From </span>
                            <span className="font-semibold text-blue-600">₱{destination.estimatedCost.budget.toLocaleString()}</span>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            destination.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                            destination.difficulty === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {destination.difficulty}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {destination.activities.slice(0, 3).map((activity, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                            >
                              {activity}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>{destination.bestTimeToVisit}</span>
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                              <Heart className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                              <Share2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Travel Guides */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📚 {(currentLanguage as string) === 'ko' ? '여행 가이드' :
                    (currentLanguage as string) === 'tl' ? 'Travel Guides' :
                    'Travel Guides'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {travelGuides.map((guide) => (
                  <div 
                    key={guide.id} 
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => router.push(`/travel/guide/${guide.id}`)}
                  >
                    <div className="flex">
                      <div className="w-1/3">
                        <img 
                          src={guide.image} 
                          alt={guide.title}
                          className="w-full h-32 object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {(currentLanguage as string) === 'ko' ? guide.titleKo : guide.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {guide.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-3">
                            <span>{guide.author}</span>
                            <span>{guide.readTime} read</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Eye className="h-3 w-3" />
                            <span>{guide.views.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plane className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {(currentLanguage as string) === 'ko' ? '항공편' : 'Flights'}
                </h3>
                <p className="text-sm text-gray-600">
                  {(currentLanguage as string) === 'ko' ? '최저가 항공료 검색' : 'Find best flight deals'}
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Hotel className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {(currentLanguage as string) === 'ko' ? '숙소' : 'Accommodation'}
                </h3>
                <p className="text-sm text-gray-600">
                  {(currentLanguage as string) === 'ko' ? '완벽한 숙소 찾기' : 'Book perfect stays'}
                </p>
              </div>

              <div className="bg-orange-50 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {(currentLanguage as string) === 'ko' ? '교통' : 'Transportation'}
                </h3>
                <p className="text-sm text-gray-600">
                  {(currentLanguage as string) === 'ko' ? '렌터카 및 투어' : 'Rent cars & tours'}
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {(currentLanguage as string) === 'ko' ? '음식' : 'Food'}
                </h3>
                <p className="text-sm text-gray-600">
                  {(currentLanguage as string) === 'ko' ? '현지 맛집 발견' : 'Discover local cuisine'}
                </p>
              </div>
            </div>

            {/* Travel Essentials */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">
                  {(currentLanguage as string) === 'ko' ? '🎒 여행 필수 정보' :
                   (currentLanguage as string) === 'tl' ? '🎒 Travel Essentials' :
                   '🎒 Travel Essentials'}
                </h2>
                <p className="text-blue-100">
                  {(currentLanguage as string) === 'ko' ? '필리핀 여행을 위한 필수 준비 사항들' :
                   (currentLanguage as string) === 'tl' ? 'Essential preparations para sa Philippines travel' :
                   'Essential preparations for your Philippines trip'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">
                    {(currentLanguage as string) === 'ko' ? '비자 요구사항' : 'Visa Requirements'}
                  </h3>
                  <p className="text-sm text-blue-100">
                    {(currentLanguage as string) === 'ko' ? '대부분의 국가는 30일 무비자 입국 가능' : 'Visa-free entry for most countries up to 30 days'}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">
                    {(currentLanguage as string) === 'ko' ? '화폐' : 'Currency'}
                  </h3>
                  <p className="text-sm text-blue-100">
                    {(currentLanguage as string) === 'ko' ? 'PHP (페소) - 현금 사용 권장' : 'PHP (Peso) - Cash is recommended'}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">
                    {(currentLanguage as string) === 'ko' ? '통신' : 'Connectivity'}
                  </h3>
                  <p className="text-sm text-blue-100">
                    {(currentLanguage as string) === 'ko' ? '공항에서 SIM 카드 구매 가능' : 'SIM cards available at airports'}
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                🚨 {(currentLanguage as string) === 'ko' ? '긴급 연락처' :
                    (currentLanguage as string) === 'tl' ? 'Emergency Contacts' :
                    'Emergency Contacts'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium text-red-800">Emergency Hotline</div>
                  <div className="text-red-700">911</div>
                </div>
                <div>
                  <div className="font-medium text-red-800">Tourist Hotline</div>
                  <div className="text-red-700">(02) 8524-1728</div>
                </div>
                <div>
                  <div className="font-medium text-red-800">DOT Emergency</div>
                  <div className="text-red-700">(02) 8459-5200</div>
                </div>
              </div>
            </div>
          </main>
      </FacebookLayout>
    </>
  );
}