import {
  startSubscriptionPlanCheckout
} from '@/lib/cloudClient.js';

import { loadStripe } from '@stripe/stripe-js';

import { 
  eventBeginCheckout
} from '@/lib/analytics.js';

export const publicKey = 'pk_live_fbxxM4d9vtfIeSClZwjRtBCs00IzxS2rqu';

export async function checkout(price){
  eventBeginCheckout(price.UnitAmount / 100, price.ID, price.Title);
  const checkoutSession = await startSubscriptionPlanCheckout(
    price.ID, window.Rewardful ? window.Rewardful.referral : null);
  const stripe = await loadStripe(publicKey);
  await stripe.redirectToCheckout({
    sessionId: checkoutSession.id
  });
}
