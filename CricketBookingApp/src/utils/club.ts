import { Club } from '../types/club';

export function formatClubTiming(club: Club): string {
  return `${club.openTime} – ${club.closeTime}`;
}

export function calculateClubAmount(durationMinutes: number, pricePerHour: number): number {
  return Math.round((durationMinutes / 60) * pricePerHour);
}

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018',
  'https://images.unsplash.com/photo-1517649763962-0c623066013b',
  'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972',
  'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6',
  'https://images.unsplash.com/photo-1551958219-acbc608c6377',
];

export function getClubGalleryImages(club: Club): string[] {
  const index = Number.parseInt(club.id, 10) || 0;
  return [
    club.image,
    GALLERY_IMAGES[index % GALLERY_IMAGES.length],
    GALLERY_IMAGES[(index + 1) % GALLERY_IMAGES.length],
  ];
}
