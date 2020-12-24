import { 
  sleep
} from '@/lib/sleep.js';

import {
  startProductCheckout
} from '@/lib/cloudClient.js';

import { loadStripe } from '@stripe/stripe-js';

import { 
  gtmEventBeginCheckout
} from '@/lib/gtm.js';

export const publicKey = 'pk_live_fbxxM4d9vtfIeSClZwjRtBCs00IzxS2rqu';

export async function checkout(product){
  gtmEventBeginCheckout(product.Price.UnitAmount / 100, product.ID, product.Name);
  // arbitrary - how long does it take to propogate to GTM consistently
  await sleep(1000);
  const checkoutSession = await startProductCheckout(product.ID);
  const stripe = await loadStripe(publicKey);
  await stripe.redirectToCheckout({
    sessionId: checkoutSession.id
  });
}
