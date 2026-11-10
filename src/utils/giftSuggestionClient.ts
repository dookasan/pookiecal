import { BirthdayPerson } from '../types/birthday';
import { calculateUpcomingAge } from './birthdayUtils';

export interface PersonalizedGiftSuggestion {
  title: string;
  reason: string;
  priceRange: string;
  matchedInterest: string;
  searchQuery: string;
}

export async function fetchPersonalizedGiftSuggestion(
  person: BirthdayPerson
): Promise<PersonalizedGiftSuggestion> {
  const age = calculateUpcomingAge(person.birthDate);

  const response = await fetch('/api/suggest-gift', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: person.name,
      relationship: person.relationship,
      age,
      favoriteThings: person.favoriteThings || [],
      notes: person.notes || ''
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.error ||
        `Gift suggestion request failed (${response.status}). Check your Gemini API key in Settings > Secrets.`
    );
  }

  if (!data?.suggestion || !data.suggestion.title) {
    throw new Error('Received an empty gift suggestion from the server.');
  }

  return data.suggestion as PersonalizedGiftSuggestion;
}
