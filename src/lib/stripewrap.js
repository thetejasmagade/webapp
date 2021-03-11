import { 
  sleep
} from '@/lib/sleep.js';

import {
  startSubscriptionPlanCheckout
} from '@/lib/cloudClient.js';

import { loadStripe } from '@stripe/stripe-js';

import { 
  gtmEventBeginCheckout
} from '@/lib/gtm.js';

export const publicKey = 'pk_live_fbxxM4d9vtfIeSClZwjRtBCs00IzxS2rqu';

export async function checkout(subscriptionPlan, price){
  gtmEventBeginCheckout(price.UnitAmount / 100, subscriptionPlan.ID, subscriptionPlan.Name);
  // arbitrary - how long does it take to propogate to GTM consistently
  await sleep(1000);
  const checkoutSession = await startSubscriptionPlanCheckout(
    price.ID, window.Rewardful.referral);
  const stripe = await loadStripe(publicKey);
  await stripe.redirectToCheckout({
    sessionId: checkoutSession.id
  });
}
