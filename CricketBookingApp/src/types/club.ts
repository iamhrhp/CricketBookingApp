export interface Club {
  id: string;
  name: string;
  image: string;
  location: string;
  openTime: string;
  closeTime: string;
  cricketType: string;
  rating: number;
  pricePerHour: number;
  facilities: string[];
  nearby?: boolean;
}
