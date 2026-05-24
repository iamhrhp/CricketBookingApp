export interface AiAction {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface AiSuggestion {
  id: string;
  message: string;
}

export interface PaymentMethod {
  id: string;
  label: string;
  icon: string;
}

export interface ClubPromotion {
  id: string;
  clubId: string;
  name: string;
  image: string;
  location: string;
  tagline: string;
  rating: number;
  pricePerHour: number;
  cricketType: string;
}
