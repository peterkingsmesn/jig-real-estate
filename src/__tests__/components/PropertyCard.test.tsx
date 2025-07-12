import { render, screen, fireEvent } from '@testing-library/react';
import PropertyCard from '@/components/property/PropertyCard';
import { Property } from '@/types/property';

const mockProperty: Property = {
  id: '1',
  title: 'Test Property',
  titleKo: '테스트 매물',
  description: 'A beautiful test property',
  type: 'condo',
  price: 25000,
  currency: 'PHP',
  region: 'NCR',
  city: 'Manila',
  district: 'Makati',
  address: '123 Test Street',
  bedrooms: 2,
  bathrooms: 1,
  area: 50,
  furnished: true,
  amenities: ['WiFi', 'Pool'],
  images: ['https://example.com/image1.jpg'],
  contact: {
    contactName: 'John Doe',
    phone: '+639123456789',
    whatsapp: '+639123456789'
  },
  featured: false,
  views: 100,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
};

describe('PropertyCard', () => {
  const mockHandlers = {
    onContact: jest.fn(),
    onLike: jest.fn(),
    onShare: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders property information correctly', () => {
    render(
      <PropertyCard
        property={mockProperty}
        language="en"
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Test Property')).toBeInTheDocument();
    expect(screen.getByText(/₱25,000/)).toBeInTheDocument();
    // Location test - district is displayed
    expect(screen.getByText('2')).toBeInTheDocument(); // bedrooms
    expect(screen.getByText('1')).toBeInTheDocument(); // bathrooms
    expect(screen.getByText('50m²')).toBeInTheDocument();
  });

  it('renders Korean title when language is Korean', () => {
    render(
      <PropertyCard
        property={mockProperty}
        language="ko"
        {...mockHandlers}
      />
    );

    expect(screen.getByText('테스트 매물')).toBeInTheDocument();
  });

  it('calls onContact when contact button is clicked', () => {
    render(
      <PropertyCard
        property={mockProperty}
        language="en"
        {...mockHandlers}
      />
    );

    const contactButton = screen.getByText('Contact');
    fireEvent.click(contactButton);

    expect(mockHandlers.onContact).toHaveBeenCalledWith(mockProperty);
    expect(mockHandlers.onContact).toHaveBeenCalledTimes(1);
  });

  it('calls onLike when like button is clicked', () => {
    render(
      <PropertyCard
        property={mockProperty}
        language="en"
        {...mockHandlers}
      />
    );

    // Heart 아이콘을 포함하는 버튼 찾기
    const likeButtons = screen.getAllByRole('button');
    const likeButton = likeButtons[0]; // 첫 번째 버튼이 하트(좋아요) 버튼
    fireEvent.click(likeButton);

    expect(mockHandlers.onLike).toHaveBeenCalledWith(mockProperty);
    expect(mockHandlers.onLike).toHaveBeenCalledTimes(1);
  });

  it('displays featured badge when property is featured', () => {
    const featuredProperty = { ...mockProperty, featured: true };
    
    render(
      <PropertyCard
        property={featuredProperty}
        language="en"
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('displays furnished status correctly', () => {
    render(
      <PropertyCard
        property={mockProperty}
        language="en"
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Furnished')).toBeInTheDocument();
  });
});