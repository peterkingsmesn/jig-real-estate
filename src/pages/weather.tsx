import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import FacebookLayout from '@/components/layout/FacebookLayout';
import SEOHead from '@/components/seo/SEOHead';
import type { WeatherData, ApiResponse, ApiErrorResponse, ErrorCode } from '@/types/api';
import { ErrorCodes } from '@/types/api';
import { logError, logApiCall } from '@/utils/logger';

export default function WeatherPage() {
  const router = useRouter();
  const currentLanguage = 'ko';
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>({});
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('manila');


  // 날씨 데이터 가져오기
  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        const cities = ['manila', 'cebu', 'davao', 'angeles', 'baguio', 'iloilo', 'bacolod', 'cagayan-de-oro'];
        
        const weatherPromises = cities.map(async (city) => {
          try {
            const response = await fetch(`/api/weather/current?city=${city}`);
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result: ApiResponse<WeatherData> | ApiErrorResponse = await response.json();
            
            if (result.success) {
              return { city, data: result.data, error: null };
            } else {
              logError(`Weather API error for ${city}`, result.error, { city, component: 'weather' });
              return { city, data: null, error: result.error };
            }
          } catch (error) {
            logError(`Network error for ${city}`, error, { city, component: 'weather' });
            return { 
              city, 
              data: null, 
              error: {
                code: ErrorCodes.NETWORK_ERROR,
                message: error instanceof Error ? error.message : 'Unknown network error'
              }
            };
          }
        });

        const results = await Promise.all(weatherPromises);
        const weatherMap: Record<string, WeatherData> = {};
        
        results.forEach(({ city, data, error }) => {
          if (data) {
            weatherMap[city] = data;
          } else if (error) {
            // 에러 로깅은 이미 위에서 했으므로 여기서는 사용자에게 표시할 수 있는 처리만
          }
        });

        setWeatherData(weatherMap);
      } catch (error) {
        logError('Failed to fetch weather data', error, { component: 'weather' });
        // 전체적인 네트워크 실패 시에도 빈 객체로 설정하여 UI가 깨지지 않도록 함
        setWeatherData({});
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  // 현재 선택된 도시의 날씨 데이터
  const currentWeather = weatherData[selectedCity];

  const weatherServices = [
    { id: 'current', name: '현재 날씨', nameEn: 'Current Weather', nameTl: 'Kasalukuyang Panahon', icon: '☀️', description: 'Manila, Cebu, Davao' },
    { id: 'forecast', name: '7일 예보', nameEn: '7-Day Forecast', nameTl: '7 Araw na Forecast', icon: '📅', description: 'Weekly outlook' },
    { id: 'typhoon', name: '태풍 경보', nameEn: 'Typhoon Alert', nameTl: 'Typhoon Alert', icon: '🌪️', description: 'PAGASA warnings' },
    { id: 'radar', name: '레이더', nameEn: 'Weather Radar', nameTl: 'Weather Radar', icon: '📡', description: 'Real-time imagery' },
    { id: 'satellite', name: '위성 영상', nameEn: 'Satellite', nameTl: 'Satellite', icon: '🛰️', description: 'Cloud coverage' },
    { id: 'marine', name: '해상 날씨', nameEn: 'Marine Weather', nameTl: 'Panahon sa Dagat', icon: '🌊', description: 'Sea conditions' },
    { id: 'agriculture', name: '농업 날씨', nameEn: 'Agricultural Weather', nameTl: 'Panahon para sa Agrikultura', icon: '🌾', description: 'Farming conditions' },
    { id: 'uv', name: 'UV 지수', nameEn: 'UV Index', nameTl: 'UV Index', icon: '☀️', description: 'Sun protection guide' }
  ];

  const regions = [
    { 
      id: 'luzon', 
      name: '루손', 
      nameEn: 'Luzon', 
      nameTl: 'Luzon', 
      cities: [
        { name: 'Manila', key: 'manila' },
        { name: 'Angeles', key: 'angeles' },
        { name: 'Baguio', key: 'baguio' }
      ]
    },
    { 
      id: 'visayas', 
      name: '비사야', 
      nameEn: 'Visayas', 
      nameTl: 'Visayas', 
      cities: [
        { name: 'Cebu', key: 'cebu' },
        { name: 'Iloilo', key: 'iloilo' },
        { name: 'Bacolod', key: 'bacolod' }
      ]
    },
    { 
      id: 'mindanao', 
      name: '민다나오', 
      nameEn: 'Mindanao', 
      nameTl: 'Mindanao', 
      cities: [
        { name: 'Davao', key: 'davao' },
        { name: 'Cagayan de Oro', key: 'cagayan-de-oro' }
      ]
    }
  ];

  const alertLevels = [
    { level: 'low', name: '낮음', nameEn: 'Low', nameTl: 'Mababa', color: 'green', description: 'Normal conditions' },
    { level: 'moderate', name: '보통', nameEn: 'Moderate', nameTl: 'Katamtaman', color: 'yellow', description: 'Watch conditions' },
    { level: 'high', name: '높음', nameEn: 'High', nameTl: 'Mataas', color: 'orange', description: 'Warning issued' },
    { level: 'extreme', name: '극심', nameEn: 'Extreme', nameTl: 'Matindi', color: 'red', description: 'Emergency level' }
  ];

  return (
    <>
      <SEOHead
        title="Weather/Typhoon - 필직"
        description="Real-time weather forecasts, typhoon tracking, and weather alerts for the Philippines"
        keywords="weather, typhoon, philippines, forecast, PAGASA, alerts, radar"
        type="website"
        locale={currentLanguage}
      />

      <FacebookLayout section="weather">
          <main className="py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                🌪️ {currentLanguage === 'ko' ? '날씨/태풍 정보' :
                     currentLanguage === 'tl' ? 'Panahon at Bagyo' :
                     'Weather & Typhoon'}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {currentLanguage === 'ko' ? '필리핀 전역의 실시간 날씨 정보와 태풍 경보를 확인하세요' :
                 currentLanguage === 'tl' ? 'Tingnan ang real-time na panahon at typhoon alerts sa buong Pilipinas' :
                 'Get real-time weather information and typhoon alerts across the Philippines'}
              </p>
            </div>

            {/* Current Weather Alert */}
            {currentWeather?.alerts && currentWeather.alerts.length > 0 && (
              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-8 rounded-r-lg">
                <div className="flex items-center">
                  <div className="text-orange-400 mr-3">⚠️</div>
                  <div>
                    <h3 className="text-lg font-semibold text-orange-800">
                      {currentLanguage === 'ko' ? '현재 기상 경보' :
                       currentLanguage === 'tl' ? 'Kasalukuyang Weather Alert' :
                       'Current Weather Alert'}
                    </h3>
                    <p className="text-orange-700">
                      {currentWeather.alerts[0].title} - {currentWeather.alerts[0].description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Current Weather Summary */}
            {currentWeather && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-blue-900 mb-2">
                      {currentWeather.location}
                    </h3>
                    <p className="text-blue-700 mb-4">{currentWeather.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-blue-600">습도:</span>
                        <span className="ml-1 font-medium">{currentWeather.humidity}%</span>
                      </div>
                      <div>
                        <span className="text-blue-600">바람:</span>
                        <span className="ml-1 font-medium">{currentWeather.windSpeed}km/h {currentWeather.windDirection}</span>
                      </div>
                      <div>
                        <span className="text-blue-600">기압:</span>
                        <span className="ml-1 font-medium">{currentWeather.pressure}hPa</span>
                      </div>
                      <div>
                        <span className="text-blue-600">UV지수:</span>
                        <span className="ml-1 font-medium">{currentWeather.uvIndex}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-6xl mb-2">{currentWeather.icon}</div>
                    <div className="text-4xl font-bold text-blue-900">{currentWeather.temperature}°C</div>
                  </div>
                </div>
              </div>
            )}

            {/* City Selector */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {currentLanguage === 'ko' ? '도시 선택' :
                 currentLanguage === 'tl' ? 'Pumili ng Lungsod' :
                 'Select City'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(weatherData).map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCity === city
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {weatherData[city]?.location}
                  </button>
                ))}
              </div>
            </div>

            {/* Weather Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {weatherServices.map((service) => (
                <div key={service.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-center">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {currentLanguage === 'ko' ? service.name :
                       currentLanguage === 'tl' ? service.nameTl :
                       service.nameEn}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      {currentLanguage === 'ko' ? '확인하기' :
                       currentLanguage === 'tl' ? 'Tingnan' :
                       'View'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Regional Weather */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {currentLanguage === 'ko' ? '지역별 날씨' :
                 currentLanguage === 'tl' ? 'Panahon ayon sa Rehiyon' :
                 'Regional Weather'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {regions.map((region) => (
                  <div key={region.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {currentLanguage === 'ko' ? region.name :
                       currentLanguage === 'tl' ? region.nameTl :
                       region.nameEn}
                    </h3>
                    <div className="space-y-3">
                      {region.cities.map((city) => {
                        const cityWeather = weatherData[city.key];
                        return (
                          <div 
                            key={city.key} 
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                            onClick={() => setSelectedCity(city.key)}
                          >
                            <span className="font-medium">{city.name}</span>
                            <div className="flex items-center space-x-2">
                              {loading ? (
                                <div className="text-gray-400">로딩중...</div>
                              ) : cityWeather ? (
                                <>
                                  <span className="text-2xl">{cityWeather.icon}</span>
                                  <span className="text-lg font-semibold">{cityWeather.temperature}°C</span>
                                </>
                              ) : (
                                <span className="text-gray-400">--°C</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7-Day Forecast */}
            {currentWeather?.forecast && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {currentLanguage === 'ko' ? '7일 예보' :
                   currentLanguage === 'tl' ? '7 Araw na Forecast' :
                   '7-Day Forecast'} - {currentWeather.location}
                </h2>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                    {currentWeather.forecast.map((day, index) => (
                      <div key={day.date} className="text-center p-4 rounded-lg bg-gray-50">
                        <div className="font-medium text-gray-900 mb-2">
                          {index === 0 ? (
                            currentLanguage === 'ko' ? '내일' :
                            currentLanguage === 'tl' ? 'Bukas' : 'Tomorrow'
                          ) : new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                        </div>
                        <div className="text-3xl mb-2">{day.icon}</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {day.high}° / {day.low}°
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                          {day.chanceOfRain}% 강수
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Alert Levels Guide */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {currentLanguage === 'ko' ? '경보 단계 안내' :
                 currentLanguage === 'tl' ? 'Gabay sa Alert Levels' :
                 'Alert Levels Guide'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {alertLevels.map((alert) => (
                  <div key={alert.level} className={`bg-white rounded-xl p-4 shadow-sm border-l-4 border-${alert.color}-500`}>
                    <div className="flex items-center mb-2">
                      <div className={`w-4 h-4 rounded-full bg-${alert.color}-500 mr-2`}></div>
                      <h3 className="font-semibold">
                        {currentLanguage === 'ko' ? alert.name :
                         currentLanguage === 'tl' ? alert.nameTl :
                         alert.nameEn}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">{alert.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Weather Map */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {currentLanguage === 'ko' ? '필리핀 날씨 지도' :
                 currentLanguage === 'tl' ? 'Weather Map ng Pilipinas' :
                 'Philippines Weather Map'}
              </h3>
              <div className="bg-blue-50 h-64 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🗺️</div>
                  <p className="text-gray-600">
                    {currentLanguage === 'ko' ? '대화형 날씨 지도' :
                     currentLanguage === 'tl' ? 'Interactive Weather Map' :
                     'Interactive Weather Map'}
                  </p>
                  <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    {currentLanguage === 'ko' ? '전체 지도 보기' :
                     currentLanguage === 'tl' ? 'Tingnan ang Buong Mapa' :
                     'View Full Map'}
                  </button>
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                🚨 {currentLanguage === 'ko' ? '긴급 연락처' :
                    currentLanguage === 'tl' ? 'Emergency Contacts' :
                    'Emergency Contacts'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium text-red-800">PAGASA</div>
                  <div className="text-red-700">(02) 8284-0800</div>
                </div>
                <div>
                  <div className="font-medium text-red-800">NDRRMC</div>
                  <div className="text-red-700">(02) 8911-1406</div>
                </div>
                <div>
                  <div className="font-medium text-red-800">Emergency Hotline</div>
                  <div className="text-red-700">911</div>
                </div>
              </div>
            </div>
          </main>
      </FacebookLayout>
    </>
  );
}