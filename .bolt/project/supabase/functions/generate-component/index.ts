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
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }
    
    if (!geminiApiKey) {
      throw new Error("Missing Gemini API key");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse the request body
    const { componentType, style, purpose, userId } = await req.json();
    
    if (!componentType || !style || !purpose || !userId) {
      throw new Error("Missing required parameters");
    }

    // Check user's subscription tier and usage limits
    const { data: user, error: userError } = await supabase
      .from("user_profiles")
      .select("subscription_tier")
      .eq("firebase_uid", userId)
      .single();
    
    if (userError) {
      throw new Error(`Error fetching user: ${userError.message}`);
    }
    
    // Check if the user has reached their generation limit
    // This would be implemented with a counter in a real application
    
    // Call the Gemini API
    const prompt = `Generate a React component for a ${componentType} with ${style} style for ${purpose}. 
    Use Tailwind CSS for styling and make it responsive. Return only the JSX code.`;
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${geminiApiKey}`
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the code from the response
    const generatedCode = data.candidates[0].content.parts[0].text;
    
    // Log the generation for tracking usage
    await supabase
      .from("ai_generations")
      .insert({
        user_id: userId,
        prompt,
        created_at: new Date().toISOString(),
      });

    return new Response(
      JSON.stringify({
        code: generatedCode,
        explanation: 'Component generated successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(`Error generating component: ${error.message}`);
    return new Response(
      JSON.stringify({
        code: '',
        explanation: '',
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});