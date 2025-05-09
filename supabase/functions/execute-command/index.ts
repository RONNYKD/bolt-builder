import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { exec } from 'https://deno.land/x/exec/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { command } = await req.json();

    if (!command) {
      throw new Error('No command provided');
    }

    // Execute the command in a safe environment
    const { stdout, stderr } = await exec(command);

    return new Response(
      JSON.stringify({
        success: true,
        output: stdout || stderr
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        output: error instanceof Error ? error.message : 'An unknown error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
}); 