import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import FacebookLayout from '@/components/layout/FacebookLayout';
import SEOHead from '@/components/seo/SEOHead';
import { allPhilippinesRegions } from '@/data/philippinesRegions';
import { toast } from 'react-hot-toast';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  MapPin, 
  Star, 
  MessageCircle,
  Car,
  Bike,
  Clock,
  Shield,
  Phone,
  Calendar,
  TrendingUp,
  Eye,
  Plus,
  LogIn,
  SlidersHorizontal,
  X,
  ChevronDown,
  Navigation,
  Users,
  Banknote
} from 'lucide-react';

interface DriverFilters {
  serviceType?: string;
  location?: string;
  availability?: string;
  rating?: number;
  priceRange?: { min: number; max: number };
}

export default function GrabDriversPage() {
  const router = useRouter();
  const currentLanguage = 'ko';
  const [filters, setFilters] = useState<DriverFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeSubSection, setActiveSubSection] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showFindDriverModal, setShowFindDriverModal] = useState(false);
  const [isSubmittingRegistration, setIsSubmittingRegistration] = useState(false);
  const [isSubmittingFind, setIsSubmittingFind] = useState(false);


  const getLocalizedText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      title: {
        ko: '그랩 앤 앙카스 서비스',
        zh: 'Grab & Angkas 服务',
        ja: 'Grab & Angkas サービス',
        en: 'Grab & Angkas Services',
        tl: 'Mga Serbisyo ng Grab at Angkas'
      },
      subtitle: {
        ko: '필리핀 전역의 신뢰할 수 있는 드라이버들을 찾아보세요. 안전하고 편리한 이동 서비스입니다.',
        zh: '在菲律宾全境寻找值得信赖的司机。安全便捷的出行服务。',
        ja: 'フィリピン全土で信頼できるドライバーを見つけてください。安全で便利な移動サービス。',
        en: 'Find trusted drivers across the Philippines. Safe and convenient transportation services.',
        tl: 'Maghanap ng mapagkakatiwalaang mga driver sa buong Pilipinas. Ligtas at convenient na serbisyo sa transportasyon.'
      },
      joinDriver: {
        ko: '드라이버로 등록하기',
        zh: '注册成为司机',
        ja: 'ドライバー登録',
        en: 'Join as Driver',
        tl: 'Sumali bilang Driver'
      },
      findDriver: {
        ko: '드라이버 찾기',
        zh: '寻找司机',
        ja: 'ドライバーを探す',
        en: 'Find Driver',
        tl: 'Maghanap ng Driver'
      }
    };
    return texts[key]?.[currentLanguage] || texts[key]?.en || key;
  };

  const serviceTypes = [
    { id: 'all', name: '전체', nameEn: 'All', nameTl: 'Lahat', icon: '🚗' },
    { id: 'drivers', name: '드라이버 등록', nameEn: 'Driver Registration', nameTl: 'Rehistro ng Driver', icon: '🚗' },
    { id: 'passengers', name: '승객 찾기', nameEn: 'Find Ride', nameTl: 'Hanap ng Sakay', icon: '👥' },
    { id: 'grab-car', name: 'Grab Car', nameEn: 'Grab Car', nameTl: 'Grab Car', icon: '🚗' },
    { id: 'angkas', name: 'Angkas', nameEn: 'Angkas', nameTl: 'Angkas', icon: '🏍️' },
    { id: 'food-delivery', name: '음식배달', nameEn: 'Food Delivery', nameTl: 'Paghahatid ng Pagkain', icon: '🍕' },
    { id: 'package-delivery', name: '택배', nameEn: 'Package Delivery', nameTl: 'Paghahatid ng Package', icon: '📦' }
  ];

  const availabilityOptions = [
    { value: 'all', label: '전체', labelEn: 'All', labelTl: 'Lahat' },
    { value: 'available', label: '이용가능', labelEn: 'Available Now', labelTl: 'Available Ngayon' },
    { value: 'scheduled', label: '예약가능', labelEn: 'Bookable', labelTl: 'Pwedeng i-book' },
    { value: 'offline', label: '오프라인', labelEn: 'Offline', labelTl: 'Offline' }
  ];

  // 샘플 드라이버 데이터
  const sampleDrivers = [
    {
      id: '1',
      name: 'Juan Carlos Santos',
      rating: 4.8,
      reviews: 156,
      serviceType: 'drivers',
      userType: 'driver',
      vehicle: 'Toyota Vios 2020',
      plateNumber: 'ABC 1234',
      location: 'Makati, Manila',
      availability: 'available',
      rate: 150,
      experience: '3년',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      verified: true,
      completedTrips: 1247
    },
    {
      id: '2',
      name: 'Maria Teresa Cruz',
      rating: 4.9,
      reviews: 89,
      serviceType: 'drivers',
      userType: 'driver',
      vehicle: 'Yamaha Mio 2019',
      plateNumber: 'XYZ 5678',
      location: 'Quezon City',
      availability: 'available',
      rate: 80,
      experience: '2년',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      verified: true,
      completedTrips: 567
    },
    {
      id: '3',
      name: 'Roberto Kim Lee',
      rating: 4.7,
      reviews: 234,
      serviceType: 'drivers',
      userType: 'driver',
      vehicle: 'Honda Click 150i',
      plateNumber: 'DEF 9012',
      location: 'Cebu City',
      availability: 'scheduled',
      rate: 120,
      experience: '4년',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      verified: true,
      completedTrips: 890
    },
    {
      id: '4',
      name: 'Anna Michelle Reyes',
      rating: 4.6,
      reviews: 78,
      serviceType: 'drivers',
      userType: 'driver',
      vehicle: 'Suzuki Raider 150',
      plateNumber: 'GHI 3456',
      location: 'Davao City',
      availability: 'available',
      rate: 100,
      experience: '1년',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      verified: false,
      completedTrips: 234
    },
    {
      id: '5',
      name: 'Chen Wu Zhang',
      rating: 4.9,
      reviews: 312,
      serviceType: 'drivers',
      userType: 'driver',
      vehicle: 'Toyota Fortuner 2021',
      plateNumber: 'JKL 7890',
      location: 'Angeles, Pampanga',
      availability: 'scheduled',
      rate: 300,
      experience: '5년',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      verified: true,
      completedTrips: 1456
    },
    // 승객 데이터
    {
      id: '6',
      name: 'Lisa Park',
      rating: 4.7,
      reviews: 89,
      serviceType: 'passengers',
      userType: 'passenger',
      vehicle: '',
      plateNumber: '',
      location: 'BGC, Taguig',
      availability: 'available',
      rate: 0,
      experience: '',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      verified: true,
      completedTrips: 45,
      destination: 'NAIA Terminal 3',
      departureTime: '오후 3시',
      passengers: 2
    },
    {
      id: '7',
      name: 'Mark Johnson',
      rating: 4.6,
      reviews: 67,
      serviceType: 'passengers',
      userType: 'passenger',
      vehicle: '',
      plateNumber: '',
      location: 'Ortigas Center',
      availability: 'available',
      rate: 0,
      experience: '',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      verified: false,
      completedTrips: 23,
      destination: 'SM Mall of Asia',
      departureTime: '오전 10시',
      passengers: 1
    }
  ];

  // 필터링된 드라이버들
  const filteredDrivers = useMemo(() => {
    return sampleDrivers.filter(driver => {
      if (activeSubSection !== 'all' && driver.serviceType !== activeSubSection) return false;
      if (selectedLocation && !driver.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
      if (selectedAvailability !== 'all' && driver.availability !== selectedAvailability) return false;
      if (searchTerm && !driver.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !driver.vehicle.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [sampleDrivers, activeSubSection, selectedLocation, selectedAvailability, searchTerm]);

  const getServiceName = (service: any) => {
    switch ((currentLanguage as string) as string) {
      case 'ko': return service.name;
      case 'tl': return service.nameTl;
      default: return service.nameEn;
    }
  };

  const getAvailabilityLabel = (option: any) => {
    switch ((currentLanguage as string) as string) {
      case 'ko': return option.label;
      case 'tl': return option.labelTl;
      default: return option.labelEn;
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'scheduled': return 'text-yellow-600 bg-yellow-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAvailabilityText = (availability: string) => {
    const map: Record<string, Record<string, string>> = {
      available: { ko: '이용가능', en: 'Available', tl: 'Available' },
      scheduled: { ko: '예약가능', en: 'Bookable', tl: 'Pwedeng i-book' },
      offline: { ko: '오프라인', en: 'Offline', tl: 'Offline' }
    };
    return map[availability]?.[(currentLanguage as string)] || map[availability]?.en || availability;
  };

  // 드라이버 등록 제출 핸들러
  const handleDriverRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingRegistration(true);

    const formData = new FormData(e.currentTarget);
    const registrationData = {
      name: formData.get('name'),
      contact: formData.get('contact'),
      vehicleType: formData.get('vehicleType'),
      vehicleModel: formData.get('vehicleModel'),
      plateNumber: formData.get('plateNumber'),
      experience: formData.get('experience'),
      serviceArea: formData.get('serviceArea'),
      serviceTypes: {
        grabCar: formData.get('grabCar') === 'on',
        angkas: formData.get('angkas') === 'on',
        foodDelivery: formData.get('foodDelivery') === 'on',
        packageDelivery: formData.get('packageDelivery') === 'on'
      },
      hourlyRate: formData.get('hourlyRate'),
      about: formData.get('about')
    };

    try {
      const response = await fetch('/api/drivers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success((currentLanguage as string) === 'ko' ? '드라이버 등록이 완료되었습니다!' : 'Driver registration completed!');
        setShowRegistrationModal(false);
        // 등록 후 드라이버 목록 새로고침
        router.reload();
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (error) {
      toast.error((currentLanguage as string) === 'ko' ? '등록 중 오류가 발생했습니다.' : 'Error during registration.');
      console.error('Registration error:', error);
    } finally {
      setIsSubmittingRegistration(false);
    }
  };

  // 드라이버 찾기 제출 핸들러
  const handleFindDriver = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingFind(true);

    const formData = new FormData(e.currentTarget);
    const tripData = {
      pickupLocation: formData.get('pickupLocation'),
      destination: formData.get('destination'),
      date: formData.get('date'),
      time: formData.get('time'),
      vehicleType: formData.get('vehicleType'),
      passengers: formData.get('passengers'),
      specialRequests: formData.get('specialRequests')
    };

    try {
      const response = await fetch('/api/trips/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success((currentLanguage as string) === 'ko' ? '드라이버 요청이 등록되었습니다!' : 'Trip request submitted!');
        setShowFindDriverModal(false);
        // 요청 후 적절한 페이지로 이동
        router.push('/messages');
      } else {
        throw new Error(data.error || 'Request failed');
      }
    } catch (error) {
      toast.error((currentLanguage as string) === 'ko' ? '요청 중 오류가 발생했습니다.' : 'Error submitting request.');
      console.error('Trip request error:', error);
    } finally {
      setIsSubmittingFind(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Grab Drivers - Philippines Transportation Services"
        description="Find trusted Grab drivers and transportation services across the Philippines. Safe and reliable rides, food delivery, and more."
        keywords="grab drivers, philippines transportation, taxi, motorcycle, food delivery, angkas"
        type="website"
        locale={currentLanguage}
      />

      <FacebookLayout section="grab-drivers">
          <main className="py-8">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                🚗 {getLocalizedText('title')}
              </h1>
              <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
                {getLocalizedText('subtitle')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button
                  onClick={() => setShowRegistrationModal(true)}
                  className="flex items-center justify-center space-x-2 px-8 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg"
                >
                  <Plus className="h-5 w-5" />
                  <span>{getLocalizedText('joinDriver')}</span>
                </button>
                
                <button
                  onClick={() => setShowFindDriverModal(true)}
                  className="flex items-center justify-center space-x-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <Search className="h-5 w-5" />
                  <span>{getLocalizedText('findDriver')}</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>
                    {(currentLanguage as string) === 'ko' ? '인증된 드라이버' :
                     (currentLanguage as string) === 'tl' ? 'Verified na mga Driver' :
                     'Verified Drivers'}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>
                    {(currentLanguage as string) === 'ko' ? '24/7 서비스' :
                     (currentLanguage as string) === 'tl' ? '24/7 na Serbisyo' :
                     '24/7 Service'}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <span>
                    {(currentLanguage as string) === 'ko' ? '평점 시스템' :
                     (currentLanguage as string) === 'tl' ? 'Rating System' :
                     'Rating System'}
                  </span>
                </div>
              </div>
            </div>

            {/* Service Type Navigation */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-wrap gap-2">
                  {serviceTypes.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setActiveSubSection(service.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        activeSubSection === service.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>{service.icon}</span>
                      <span className="text-sm font-medium">
                        {getServiceName(service)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={
                      (currentLanguage as string) === 'ko' ? '드라이버 이름이나 차량을 검색하세요' :
                      (currentLanguage as string) === 'tl' ? 'Maghanap ng pangalan ng driver o sasakyan' :
                      'Search driver name or vehicle'
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <SlidersHorizontal className="h-5 w-5" />
                    <span>필터</span>
                    {(selectedLocation || selectedAvailability !== 'all') && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </button>
                </div>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 지역 필터 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">지역</label>
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">전체 지역</option>
                        {allPhilippinesRegions.map(region => (
                          <option key={region.id} value={region.name}>
                            {region.nameKo} ({region.name})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 상태 필터 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                      <select
                        value={selectedAvailability}
                        onChange={(e) => setSelectedAvailability(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {availabilityOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {getAvailabilityLabel(option)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 보기 옵션 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">보기 옵션</label>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 border rounded-lg ${viewMode === 'grid' ? 'bg-blue-50 border-blue-300' : 'border-gray-300'}`}
                        >
                          <Grid className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 border rounded-lg ${viewMode === 'list' ? 'bg-blue-50 border-blue-300' : 'border-gray-300'}`}
                        >
                          <List className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {activeSubSection === 'all' 
                      ? ((currentLanguage as string) === 'ko' ? '전체 드라이버' : 
                         (currentLanguage as string) === 'tl' ? 'Lahat ng Driver' : 'All Drivers')
                      : getServiceName(serviceTypes.find(s => s.id === activeSubSection))
                    }
                  </h2>
                  <p className="text-gray-600">
                    {filteredDrivers.length}명의 드라이버가 있습니다
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="rating">평점순</option>
                    <option value="price_low">낮은 요금순</option>
                    <option value="price_high">높은 요금순</option>
                    <option value="experience">경력순</option>
                  </select>
                </div>
              </div>

              {/* Drivers Grid/List */}
              {filteredDrivers.length > 0 ? (
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                  : "space-y-4"
                }>
                  {filteredDrivers.map((driver) => (
                    <div 
                      key={driver.id} 
                      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                      onClick={() => router.push(`/grab-drivers/driver/${driver.id}`)}
                    >
                      <div className={`relative ${viewMode === 'list' ? 'w-32 h-32' : 'w-full h-48'}`}>
                        <img 
                          src={driver.avatar}
                          alt={driver.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium text-white ${
                            getAvailabilityColor(driver.availability)
                          }`}>
                            {getAvailabilityText(driver.availability)}
                          </span>
                        </div>
                        {driver.verified && (
                          <div className="absolute top-2 left-2">
                            <div className="flex items-center space-x-1 bg-white rounded px-2 py-1">
                              <Shield className="h-3 w-3 text-green-600" />
                              <span className="text-xs text-green-600 font-medium">인증</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {driver.name}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{driver.rating}</span>
                            <span className="text-xs text-gray-600">({driver.reviews})</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {driver.userType === 'driver' ? (
                            <>
                              <div className="flex items-center space-x-1 mb-1">
                                <Car className="h-3 w-3" />
                                <span>{driver.vehicle}</span>
                              </div>
                              <div className="flex items-center space-x-1 mb-1">
                                <MapPin className="h-3 w-3" />
                                <span>{driver.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>경력 {driver.experience}</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center space-x-1 mb-1">
                                <MapPin className="h-3 w-3" />
                                <span>{driver.location} → {(driver as any).destination}</span>
                              </div>
                              <div className="flex items-center space-x-1 mb-1">
                                <Clock className="h-3 w-3" />
                                <span>출발: {(driver as any).departureTime}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="h-3 w-3" />
                                <span>승객 {(driver as any).passengers}명</span>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-blue-600">
                            {driver.userType === 'driver' ? `₱${driver.rate}/시간` : '라이드 요청'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {driver.completedTrips} 완주
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Car className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">드라이버가 없습니다</h3>
                  <p className="text-gray-600 mb-4">
                    선택하신 조건에 맞는 드라이버가 없습니다. 필터를 조정해보세요.
                  </p>
                </div>
              )}
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">{sampleDrivers.length}</div>
                <div className="text-sm text-gray-600">
                  {(currentLanguage as string) === 'ko' ? '등록 드라이버' : 
                   (currentLanguage as string) === 'tl' ? 'Mga Registered Driver' : 'Registered Drivers'}
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-green-600">4.8/5</div>
                <div className="text-sm text-gray-600">
                  {(currentLanguage as string) === 'ko' ? '평균 평점' : 
                   (currentLanguage as string) === 'tl' ? 'Average Rating' : 'Average Rating'}
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-purple-600">5,234</div>
                <div className="text-sm text-gray-600">
                  {(currentLanguage as string) === 'ko' ? '완료된 라이드' : 
                   (currentLanguage as string) === 'tl' ? 'Natapos na Ride' : 'Completed Rides'}
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-orange-600">24/7</div>
                <div className="text-sm text-gray-600">
                  {(currentLanguage as string) === 'ko' ? '서비스 시간' : 
                   (currentLanguage as string) === 'tl' ? 'Oras ng Serbisyo' : 'Service Hours'}
                </div>
              </div>
            </div>

            {/* Driver Registration Modal */}
            {showRegistrationModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {(currentLanguage as string) === 'ko' ? '드라이버 등록하기' :
                         (currentLanguage as string) === 'tl' ? 'Mag-register bilang Driver' :
                         'Register as Driver'}
                      </h2>
                      <button
                        onClick={() => setShowRegistrationModal(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <form className="p-6 space-y-6" onSubmit={handleDriverRegistration}>
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {(currentLanguage as string) === 'ko' ? '개인 정보' : 'Personal Information'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {(currentLanguage as string) === 'ko' ? '이름' : 'Full Name'}
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder={(currentLanguage as string) === 'ko' ? '전체 이름' : 'Enter your full name'}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {(currentLanguage as string) === 'ko' ? '연락처' : 'Contact Number'}
                          </label>
                          <input
                            type="tel"
                            name="contact"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="+63 912 345 6789"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {(currentLanguage as string) === 'ko' ? '차량 정보' : 'Vehicle Information'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {(currentLanguage as string) === 'ko' ? '차량 종류' : 'Vehicle Type'}
                          </label>
                          <select name="vehicleType" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                            <option value="">선택하세요</option>
                            <option value="car">자동차 (Car)</option>
                            <option value="motorcycle">오토바이 (Motorcycle)</option>
                            <option value="van">밴 (Van)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {(currentLanguage as string) === 'ko' ? '차량 모델' : 'Vehicle Model'}
                          </label>
                          <input
                            type="text"
                            name="vehicleModel"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="예: Toyota Vios 2020"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {(currentLanguage as string) === 'ko' ? '차량 번호' : 'Plate Number'}
                          </label>
                          <input
                            type="text"
                            name="plateNumber"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="ABC 1234"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {(currentLanguage as string) === 'ko' ? '운전 경력' : 'Driving Experience'}
                          </label>
                          <select name="experience" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                            <option value="">선택하세요</option>
                            <option value="1년 미만">1년 미만</option>
                            <option value="1-3년">1-3년</option>
                            <option value="3-5년">3-5년</option>
                            <option value="5년 이상">5년 이상</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Service Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {(currentLanguage as string) === 'ko' ? '서비스 정보' : 'Service Information'}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {(currentLanguage as string) === 'ko' ? '서비스 지역' : 'Service Area'}
                          </label>
                          <select name="serviceArea" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                            <option value="">선택하세요</option>
                            {allPhilippinesRegions.map(region => (
                              <option key={region.id} value={region.name}>
                                {region.nameKo} ({region.name})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {(currentLanguage as string) === 'ko' ? '서비스 유형' : 'Service Types'}
                          </label>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input type="checkbox" name="grabCar" className="mr-2" />
                              <span>Grab Car</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" name="angkas" className="mr-2" />
                              <span>Angkas</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" name="foodDelivery" className="mr-2" />
                              <span>음식 배달 (Food Delivery)</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" name="packageDelivery" className="mr-2" />
                              <span>택배 배달 (Package Delivery)</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {(currentLanguage as string) === 'ko' ? '시간당 요금 (₱)' : 'Hourly Rate (₱)'}
                          </label>
                          <input
                            type="number"
                            name="hourlyRate"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="150"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {(currentLanguage as string) === 'ko' ? '자기 소개' : 'About Yourself'}
                          </label>
                          <textarea
                            name="about"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            rows={4}
                            placeholder={(currentLanguage as string) === 'ko' ? '승객들에게 자신을 소개해주세요...' : 'Introduce yourself to passengers...'}
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={isSubmittingRegistration}
                        className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmittingRegistration ? 
                          ((currentLanguage as string) === 'ko' ? '등록 중...' : 'Registering...') : 
                          ((currentLanguage as string) === 'ko' ? '등록하기' : 'Register')
                        }
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowRegistrationModal(false)}
                        className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                      >
                        {(currentLanguage as string) === 'ko' ? '취소' : 'Cancel'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Find Driver Modal */}
            {showFindDriverModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {(currentLanguage as string) === 'ko' ? '드라이버 찾기' :
                         (currentLanguage as string) === 'tl' ? 'Maghanap ng Driver' :
                         'Find a Driver'}
                      </h2>
                      <button
                        onClick={() => setShowFindDriverModal(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <form className="p-6 space-y-6" onSubmit={handleFindDriver}>
                    {/* Trip Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {(currentLanguage as string) === 'ko' ? '이동 정보' : 'Trip Information'}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {(currentLanguage as string) === 'ko' ? '출발지' : 'Pickup Location'}
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              name="pickupLocation"
                              required
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder={(currentLanguage as string) === 'ko' ? '출발 위치를 입력하세요' : 'Enter pickup location'}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {(currentLanguage as string) === 'ko' ? '목적지' : 'Destination'}
                          </label>
                          <div className="relative">
                            <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              name="destination"
                              required
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder={(currentLanguage as string) === 'ko' ? '목적지를 입력하세요' : 'Enter destination'}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {(currentLanguage as string) === 'ko' ? '날짜' : 'Date'}
                            </label>
                            <input
                              type="date"
                              name="date"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {(currentLanguage as string) === 'ko' ? '시간' : 'Time'}
                            </label>
                            <input
                              type="time"
                              name="time"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {(currentLanguage as string) === 'ko' ? '추가 정보' : 'Additional Information'}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {(currentLanguage as string) === 'ko' ? '차량 유형' : 'Vehicle Type'}
                          </label>
                          <select name="vehicleType" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="">모든 유형</option>
                            <option value="car">자동차 (Car)</option>
                            <option value="motorcycle">오토바이 (Motorcycle)</option>
                            <option value="van">밴 (Van)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {(currentLanguage as string) === 'ko' ? '승객 수' : 'Number of Passengers'}
                          </label>
                          <input
                            type="number"
                            name="passengers"
                            min="1"
                            max="8"
                            defaultValue="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {(currentLanguage as string) === 'ko' ? '특별 요청사항' : 'Special Requests'}
                          </label>
                          <textarea
                            name="specialRequests"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder={(currentLanguage as string) === 'ko' ? '특별한 요청사항이 있으면 입력하세요...' : 'Enter any special requests...'}
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={isSubmittingFind}
                        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmittingFind ? 
                          ((currentLanguage as string) === 'ko' ? '요청 중...' : 'Submitting...') : 
                          ((currentLanguage as string) === 'ko' ? '드라이버 찾기' : 'Find Driver')
                        }
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowFindDriverModal(false)}
                        className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                      >
                        {(currentLanguage as string) === 'ko' ? '취소' : 'Cancel'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </main>
      </FacebookLayout>
    </>
  );
}