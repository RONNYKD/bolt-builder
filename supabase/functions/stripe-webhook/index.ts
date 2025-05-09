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
    const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!STRIPE_SECRET || !STRIPE_WEBHOOK_SECRET) {
      throw new Error("Missing Stripe environment variables");
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the signature from the headers
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      throw new Error("No signature provided");
    }

    // Get the raw body
    const body = await req.text();
    
    // Verify the webhook signature
    const stripe = new (await import("npm:stripe@12.18.0")).default(STRIPE_SECRET);
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle the event
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        const subscription = event.data.object;
        
        // Get the customer ID
        const customerId = subscription.customer;
        
        // Get the customer from Stripe to find the Firebase UID
        const customer = await stripe.customers.retrieve(customerId);
        const userId = customer.metadata.firebase_uid;
        
        if (!userId) {
          throw new Error("No Firebase UID found in customer metadata");
        }
        
        // Get the subscription details
        const status = subscription.status;
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
        const subscriptionId = subscription.id;
        
        // Get the price ID to determine the tier
        const priceId = subscription.items.data[0].price.id;
        let tier = "free";
        
        // Map price ID to tier
        if (priceId === "price_pro") {
          tier = "pro";
        } else if (priceId === "price_team") {
          tier = "team";
        }
        
        // Update or insert the subscription in Supabase
        const { data, error } = await supabase
          .from("subscriptions")
          .upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            tier,
            status,
            current_period_end: currentPeriodEnd,
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();
        
        if (error) {
          throw new Error(`Error updating subscription: ${error.message}`);
        }
        
        // Update the user's subscription tier
        const { error: userError } = await supabase
          .from("user_profiles")
          .update({ subscription_tier: tier })
          .eq("firebase_uid", userId);
        
        if (userError) {
          throw new Error(`Error updating user profile: ${userError.message}`);
        }
        
        break;
        
      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object;
        const deletedCustomerId = deletedSubscription.customer;
        
        // Get the customer from Stripe to find the Firebase UID
        const deletedCustomer = await stripe.customers.retrieve(deletedCustomerId);
        const deletedUserId = deletedCustomer.metadata.firebase_uid;
        
        if (!deletedUserId) {
          throw new Error("No Firebase UID found in customer metadata");
        }
        
        // Update the subscription status to canceled
        const { error: deleteError } = await supabase
          .from("subscriptions")
          .update({
            status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", deletedSubscription.id);
        
        if (deleteError) {
          throw new Error(`Error updating subscription: ${deleteError.message}`);
        }
        
        // Update the user's subscription tier to free
        const { error: deleteUserError } = await supabase
          .from("user_profiles")
          .update({ subscription_tier: "free" })
          .eq("firebase_uid", deletedUserId);
        
        if (deleteUserError) {
          throw new Error(`Error updating user profile: ${deleteUserError.message}`);
        }
        
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`Error processing webhook: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});