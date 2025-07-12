import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin,
  AlertCircle, 
  CheckCircle, 
  Facebook, 
  Shield,
  Check,
  X
} from 'lucide-react';
import { SignUpData } from '@/types/user';
import { allPhilippinesRegions } from '@/data/philippinesRegions';

export default function SignUpPage() {
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignUpData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    nationality: '',
    currentRegion: '',
    agreedToTerms: false,
    agreedToPrivacy: false,
    marketingConsent: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  // 비밀번호 강도 검사
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleInputChange = (field: keyof SignUpData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (field === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
    
    setError('');
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (!formData.email || !formData.password || !formData.confirmPassword) {
          setError('모든 필수 필드를 입력해주세요.');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('비밀번호가 일치하지 않습니다.');
          return false;
        }
        if (passwordStrength < 3) {
          setError('비밀번호를 더 강력하게 만들어주세요.');
          return false;
        }
        break;
      case 2:
        if (!formData.firstName || !formData.lastName || !formData.phoneNumber) {
          setError('모든 필수 필드를 입력해주세요.');
          return false;
        }
        break;
      case 3:
        if (!formData.nationality || !formData.currentRegion) {
          setError('국적과 현재 거주지역을 선택해주세요.');
          return false;
        }
        break;
      case 4:
        if (!formData.agreedToTerms || !formData.agreedToPrivacy) {
          setError('이용약관과 개인정보처리방침에 동의해주세요.');
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // 실제로는 API 호출
      console.log('Sign up attempt:', formData);
      
      // 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess('회원가입이 완료되었습니다! 이메일 인증을 확인해주세요.');
      
      // 로그인 페이지로 리다이렉트
      setTimeout(() => {
        router.push('/auth/login?message=signup_success');
      }, 2000);
      
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider: 'google' | 'facebook') => {
    console.log(`${provider} signup clicked`);
    // 소셜 회원가입 구현 예정
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return { text: '매우 약함', color: 'text-red-600' };
      case 2: return { text: '약함', color: 'text-orange-600' };
      case 3: return { text: '보통', color: 'text-yellow-600' };
      case 4: return { text: '강함', color: 'text-green-600' };
      case 5: return { text: '매우 강함', color: 'text-green-700' };
      default: return { text: '', color: '' };
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">계정 정보</h3>
              <p className="text-sm text-gray-600">이메일과 비밀번호를 설정해주세요</p>
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일 주소 *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="8자리 이상 입력하세요"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              
              {/* 비밀번호 강도 */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength <= 2 ? 'bg-red-500' :
                          passwordStrength === 3 ? 'bg-yellow-500' :
                          passwordStrength === 4 ? 'bg-green-500' :
                          'bg-green-600'
                        }`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${getPasswordStrengthText().color}`}>
                      {getPasswordStrengthText().text}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    <p>비밀번호는 다음을 포함해야 합니다:</p>
                    <ul className="mt-1 space-y-1">
                      <li className={`flex items-center space-x-1 ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                        {formData.password.length >= 8 ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        <span>8자리 이상</span>
                      </li>
                      <li className={`flex items-center space-x-1 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                        {/[A-Z]/.test(formData.password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        <span>대문자</span>
                      </li>
                      <li className={`flex items-center space-x-1 ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                        {/[a-z]/.test(formData.password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        <span>소문자</span>
                      </li>
                      <li className={`flex items-center space-x-1 ${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                        {/[0-9]/.test(formData.password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        <span>숫자</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 확인 *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword 
                      ? 'border-red-300' 
                      : 'border-gray-300'
                  }`}
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">비밀번호가 일치하지 않습니다</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">개인 정보</h3>
              <p className="text-sm text-gray-600">기본 정보를 입력해주세요</p>
            </div>

            {/* 이름 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이름 *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="이름"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  성 *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="성"
                  required
                />
              </div>
            </div>

            {/* 전화번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전화번호 *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+63 912 345 6789"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                거래 시 연락을 위해 필요합니다 (SMS 인증 예정)
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">위치 정보</h3>
              <p className="text-sm text-gray-600">거래 지역 설정을 위해 필요합니다</p>
            </div>

            {/* 국적 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                국적 *
              </label>
              <select
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">국적을 선택하세요</option>
                <option value="KR">🇰🇷 대한민국</option>
                <option value="CN">🇨🇳 중국</option>
                <option value="JP">🇯🇵 일본</option>
                <option value="US">🇺🇸 미국</option>
                <option value="PH">🇵🇭 필리핀</option>
                <option value="Other">기타</option>
              </select>
            </div>

            {/* 현재 거주 지역 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                현재 거주 지역 *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={formData.currentRegion}
                  onChange={(e) => handleInputChange('currentRegion', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">거주 지역을 선택하세요</option>
                  {allPhilippinesRegions.map(region => (
                    <option key={region.id} value={region.id}>
                      {region.nameKo} ({region.name})
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                현재 거주하는 지역을 선택하면 주변 거래를 우선적으로 보여드립니다
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">약관 동의</h3>
              <p className="text-sm text-gray-600">서비스 이용을 위해 동의가 필요합니다</p>
            </div>

            <div className="space-y-4">
              {/* 이용약관 동의 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.agreedToTerms}
                    onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">
                      이용약관에 동의합니다 (필수)
                    </span>
                    <p className="text-xs text-gray-600 mt-1">
                      서비스 이용 규칙, 거래 규정, 금지 행위 등에 대한 약관입니다.
                    </p>
                    <Link href="/terms" className="text-xs text-blue-600 hover:text-blue-700">
                      전문 보기 →
                    </Link>
                  </div>
                </label>
              </div>

              {/* 개인정보처리방침 동의 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.agreedToPrivacy}
                    onChange={(e) => handleInputChange('agreedToPrivacy', e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">
                      개인정보처리방침에 동의합니다 (필수)
                    </span>
                    <p className="text-xs text-gray-600 mt-1">
                      개인정보 수집, 이용, 보관, 파기에 대한 정책입니다.
                    </p>
                    <Link href="/privacy" className="text-xs text-blue-600 hover:text-blue-700">
                      전문 보기 →
                    </Link>
                  </div>
                </label>
              </div>

              {/* 마케팅 동의 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.marketingConsent}
                    onChange={(e) => handleInputChange('marketingConsent', e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">
                      마케팅 정보 수신에 동의합니다 (선택)
                    </span>
                    <p className="text-xs text-gray-600 mt-1">
                      새로운 상품, 이벤트, 할인 혜택 등의 정보를 받아볼 수 있습니다.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            회원가입
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            안전한 거래를 위한 계정을 만들어보세요
          </p>
        </div>

        {/* 진행률 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">단계 {currentStep} / 4</span>
            <span className="text-xs text-gray-500">{Math.round((currentStep / 4) * 100)}% 완료</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* 소셜 가입 (첫 번째 단계에서만) */}
        {currentStep === 1 && (
          <>
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleSocialSignup('google')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg mr-3">🔍</span>
                Google로 가입하기
              </button>
              
              <button
                onClick={() => handleSocialSignup('facebook')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <Facebook className="h-5 w-5 mr-3" />
                Facebook으로 가입하기
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는 이메일로 가입</span>
              </div>
            </div>
          </>
        )}

        {/* 단계별 폼 */}
        <form onSubmit={currentStep === 4 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
          {renderStep()}

          {/* 에러/성공 메시지 */}
          {error && (
            <div className="mt-6 flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm text-red-800">{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-6 flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-800">{success}</span>
            </div>
          )}

          {/* 버튼들 */}
          <div className="mt-8 flex space-x-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                이전
              </button>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  처리 중...
                </div>
              ) : currentStep === 4 ? (
                '회원가입 완료'
              ) : (
                '다음'
              )}
            </button>
          </div>
        </form>

        {/* 로그인 링크 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-700">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}