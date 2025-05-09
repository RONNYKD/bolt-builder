import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const STRIPE_SECRET = Deno.env.get("STRIPE_SECRET_KEY");
    
    if (!STRIPE_SECRET) {
      throw new Error("Missing Stripe secret key");
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse the request body
    const { userId, priceId, successUrl, cancelUrl } = await req.json();
    
    if (!userId || !priceId || !successUrl || !cancelUrl) {
      throw new Error("Missing required parameters");
    }

    // Get the user from Supabase
    const { data: user, error: userError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("firebase_uid", userId)
      .single();
    
    if (userError) {
      throw new Error(`Error fetching user: ${userError.message}`);
    }

    // Initialize Stripe
    const stripe = new (await import("npm:stripe@12.18.0")).default(STRIPE_SECRET);

    // Check if the user already has a Stripe customer ID
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();
    
    let customerId;
    
    if (subscriptionError && subscriptionError.code !== "PGRST116") { // PGRST116 is "no rows returned"
      throw new Error(`Error fetching subscription: ${subscriptionError.message}`);
    }
    
    if (subscription?.stripe_customer_id) {
      customerId = subscription.stripe_customer_id;
    } else {
      // Create a new customer in Stripe
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.display_name,
        metadata: {
          firebase_uid: userId,
        },
      });
      
      customerId = customer.id;
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`Error creating checkout session: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});