import { NextApiRequest, NextApiResponse } from 'next';
import type { ApiResponse, ApiErrorResponse, WeatherData } from '@/types/api';
import { ErrorCodes, createSuccessResponse, createErrorResponse, ApiError } from '@/types/api';
import { logError, logApiCall } from '@/utils/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    const error = new ApiError(
      'Method not allowed',
      ErrorCodes.VALIDATION_ERROR,
      405
    );
    return res.status(405).json(
      createErrorResponse(error, req.url || '/api/weather/current')
    );
  }

  try {
    const { city = 'manila' } = req.query;

    // 도시명 검증
    const validCities = ['manila', 'cebu', 'davao', 'angeles', 'baguio', 'boracay', 'iloilo', 'bacolod', 'cagayan-de-oro', 'zamboanga'];
    if (!validCities.includes(city as string)) {
      const error = new ApiError(
        'Invalid city parameter',
        ErrorCodes.VALIDATION_ERROR,
        400,
        { validCities }
      );
      return res.status(400).json(
        createErrorResponse(error, req.url || '/api/weather/current')
      );
    }

    // 실제 날씨 데이터 가져오기 (현재는 모의 데이터)
    const weatherData = await getCurrentWeather(city as string);

    const response = createSuccessResponse(
      weatherData,
      `Weather data retrieved for ${city}`,
      {
        total: 1,
        page: 1,
        limit: 1,
        hasNext: false,
        hasPrev: false
      }
    );
    
    res.status(200).json(response);

  } catch (error) {
    logError('Error fetching weather data', error, { 
      method: req.method, 
      path: req.url,
      city: req.query.city as string
    });
    
    const apiError = error instanceof ApiError 
      ? error 
      : new ApiError(
          'Failed to fetch weather data',
          ErrorCodes.INTERNAL_SERVER_ERROR,
          500
        );
    
    return res.status(apiError.statusCode).json(
      createErrorResponse(apiError, req.url || '/api/weather/current')
    );
  }
}

// 현재 날씨 데이터 가져오기
async function getCurrentWeather(city: string): Promise<WeatherData> {
  // 실제 환경에서는 OpenWeatherMap API 등 사용
  // const apiKey = process.env.OPENWEATHER_API_KEY;
  // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},PH&appid=${apiKey}&units=metric`);
  
  // 현재는 현실적인 모의 데이터 제공
  const cityData = getCityWeatherData(city);
  const now = new Date();
  
  return {
    location: cityData.name,
    temperature: getRandomTemp(cityData.tempRange),
    humidity: getRandomRange(70, 90),
    windSpeed: getRandomRange(5, 15),
    windDirection: getRandomDirection(),
    pressure: getRandomRange(1008, 1020),
    description: getWeatherDescription(),
    icon: getWeatherIcon(),
    uvIndex: getRandomRange(8, 12),
    visibility: getRandomRange(8, 15),
    forecast: generateForecast(),
    alerts: generateAlerts(city)
  };
}

// 도시별 기본 데이터
function getCityWeatherData(city: string) {
  const cityMap: Record<string, { name: string; tempRange: [number, number] }> = {
    manila: { name: 'Manila', tempRange: [26, 35] },
    cebu: { name: 'Cebu City', tempRange: [25, 33] },
    davao: { name: 'Davao City', tempRange: [24, 32] },
    angeles: { name: 'Angeles City', tempRange: [25, 34] },
    baguio: { name: 'Baguio City', tempRange: [18, 26] },
    boracay: { name: 'Boracay', tempRange: [26, 32] },
    iloilo: { name: 'Iloilo City', tempRange: [25, 33] },
    bacolod: { name: 'Bacolod City', tempRange: [25, 33] },
    'cagayan-de-oro': { name: 'Cagayan de Oro', tempRange: [24, 32] },
    zamboanga: { name: 'Zamboanga City', tempRange: [25, 33] }
  };
  
  return cityMap[city] || cityMap.manila;
}

// 랜덤 온도 생성
function getRandomTemp(range: [number, number]): number {
  return Math.round(Math.random() * (range[1] - range[0]) + range[0]);
}

// 랜덤 범위 생성
function getRandomRange(min: number, max: number): number {
  return Math.round(Math.random() * (max - min) + min);
}

// 랜덤 바람 방향
function getRandomDirection(): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.floor(Math.random() * directions.length)];
}

// 날씨 설명 생성
function getWeatherDescription(): string {
  const conditions = [
    'Partly cloudy with scattered showers',
    'Mostly sunny with occasional clouds', 
    'Overcast with light rain',
    'Sunny and hot',
    'Partly cloudy',
    'Light rain showers',
    'Clear skies',
    'Thunderstorms possible'
  ];
  return conditions[Math.floor(Math.random() * conditions.length)];
}

// 날씨 아이콘
function getWeatherIcon(): string {
  const icons = ['☀️', '⛅', '🌧️', '⛈️', '🌤️', '🌦️'];
  return icons[Math.floor(Math.random() * icons.length)];
}

// 7일 예보 생성
function generateForecast() {
  const forecast = [];
  const today = new Date();
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    forecast.push({
      date: date.toISOString().split('T')[0],
      high: getRandomTemp([30, 35]),
      low: getRandomTemp([24, 28]),
      description: getWeatherDescription(),
      icon: getWeatherIcon(),
      chanceOfRain: getRandomRange(20, 80)
    });
  }
  
  return forecast;
}

// 기상 경보 생성
function generateAlerts(city: string) {
  // 현재 태풍 시즌이나 특별한 상황에 따라 경보 생성
  const isRainySeasonAlert = Math.random() > 0.7;
  
  if (!isRainySeasonAlert) return [];
  
  const alerts = [
    {
      type: 'typhoon',
      level: 'signal-2',
      title: 'Typhoon Signal No. 2',
      description: `Tropical Storm approaching ${city}. Strong winds and heavy rainfall expected.`,
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  return Math.random() > 0.5 ? alerts : [];
}