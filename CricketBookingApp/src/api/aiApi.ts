import aiData from './data/ai.json';
import { apiDelay } from './utils';
import { AiAction, AiSuggestion, ClubPromotion, PaymentMethod } from '../types/ai';

const data = aiData as {
  actions: AiAction[];
  suggestions: AiSuggestion[];
  promotions: ClubPromotion[];
  paymentMethods: PaymentMethod[];
};

/** GET /ai/actions */
export async function fetchAiActions(): Promise<AiAction[]> {
  await apiDelay();
  return data.actions;
}

/** GET /ai/suggestions */
export async function fetchAiSuggestions(): Promise<AiSuggestion[]> {
  await apiDelay();
  return data.suggestions;
}

/** GET /ai/promotions */
export async function fetchAiPromotions(): Promise<ClubPromotion[]> {
  await apiDelay();
  return data.promotions;
}

/** GET /payment-methods */
export async function fetchPaymentMethods(): Promise<PaymentMethod[]> {
  await apiDelay();
  return data.paymentMethods;
}

/** GET /ai/suggest-clubs */
export async function suggestClubs(): Promise<AiSuggestion> {
  await apiDelay();
  return data.suggestions[0];
}

/** GET /ai/suggest-slots */
export async function suggestSlots(): Promise<AiSuggestion> {
  await apiDelay();
  return data.suggestions[1];
}
