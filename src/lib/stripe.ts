import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export async function createCheckoutSession(userId: string, priceId: string) {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        userId,
        priceId,
        successUrl: `${window.location.origin}/dashboard?checkout=success`,
        cancelUrl: `${window.location.origin}/pricing?checkout=canceled`
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const { url } = await response.json();
    
    // Redirect to Stripe Checkout
    window.location.href = url;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return { success: false, error };
  }
}

export async function createPortalSession(userId: string) {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-portal-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        userId,
        returnUrl: `${window.location.origin}/dashboard`
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const { url } = await response.json();
    
    // Redirect to Stripe Customer Portal
    window.location.href = url;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error creating portal session:', error);
    return { success: false, error };
  }
}