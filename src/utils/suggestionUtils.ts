import { BirthdayPerson, WishlistItem } from '../types/birthday';

export interface SmartGiftSuggestion {
  id: string;
  title: string;
  estimatedCost: number;
  reason: string;
  category: 'music' | 'hobbies' | 'lifestyle' | 'food';
}

/**
 * Generates tailored gift and celebration suggestions based on the person's
 * connected Google/YouTube interests, favorite things, and notes.
 */
export function generateSmartGiftSuggestions(person: BirthdayPerson): SmartGiftSuggestion[] {
  const suggestions: SmartGiftSuggestion[] = [];
  const interests = [
    ...(person.favoriteThings || []),
    person.notes || '',
    person.googleProfile?.youtubeChannel?.channelTitle || ''
  ].join(' ').toLowerCase();

  if (interests.includes('music') || interests.includes('guitar') || interests.includes('acoustic') || interests.includes('vinyl')) {
    suggestions.push({
      id: `sug-music-1`,
      title: 'Audiophile Vinyl Record Care Kit & Cleaning Brush',
      estimatedCost: 35,
      reason: 'Matches their love for vinyl records and acoustic sessions',
      category: 'music'
    });
    suggestions.push({
      id: `sug-music-2`,
      title: 'Walnut Hardwood Guitar Wall Mount & Leather Strap',
      estimatedCost: 45,
      reason: 'Perfect for displaying their acoustic gear in the studio',
      category: 'music'
    });
  }

  if (interests.includes('pottery') || interests.includes('ceramic') || interests.includes('books') || interests.includes('matcha')) {
    suggestions.push({
      id: `sug-hobby-1`,
      title: 'Ceremonial Grade Uji Matcha Set with Chasen Whisk',
      estimatedCost: 48,
      reason: 'Inspired by their morning ritual & artisan tea interest',
      category: 'food'
    });
    suggestions.push({
      id: `sug-hobby-2`,
      title: 'Artisan Pottery Tool Carving Set & Studio Apron',
      estimatedCost: 40,
      reason: 'Matches their YouTube ceramics vlog and handmade craft hobbies',
      category: 'hobbies'
    });
  }

  if (interests.includes('garden') || interests.includes('flower') || interests.includes('watercolor') || interests.includes('cooking')) {
    suggestions.push({
      id: `sug-garden-1`,
      title: 'Handcrafted Brass Mist Sprayer & Heirloom Seed Pack',
      estimatedCost: 32,
      reason: 'Ideal companion for indoor plant care and garden balcony',
      category: 'lifestyle'
    });
  }

  if (interests.includes('tech') || interests.includes('gadgets') || interests.includes('espresso') || interests.includes('coffee')) {
    suggestions.push({
      id: `sug-tech-1`,
      title: 'Precision Temperature Control Electric Pour-Over Kettle',
      estimatedCost: 89,
      reason: 'Elevates their daily specialty coffee brewing workflow',
      category: 'lifestyle'
    });
  }

  // Universal high-quality default if fewer suggestions
  if (suggestions.length < 2) {
    suggestions.push({
      id: `sug-uni-1`,
      title: 'Custom Hardcover Memory Photobook with Friends',
      estimatedCost: 55,
      reason: 'Preserves your shared Google Photos memories forever',
      category: 'lifestyle'
    });
    suggestions.push({
      id: `sug-uni-2`,
      title: 'Gourmet French Bakery Macaron & Artisan Truffle Box',
      estimatedCost: 38,
      reason: 'Delightful birthday treat for celebrating with family',
      category: 'food'
    });
  }

  return suggestions;
}
