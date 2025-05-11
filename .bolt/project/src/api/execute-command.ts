import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

export async function executeCommandInSandbox(command: string): Promise<{ success: boolean; output: string }> {
  try {
    // Execute the command in the sandbox environment
    const { data, error } = await supabase.functions.invoke('execute-command', {
      body: { command }
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      output: data.output
    };
  } catch (error) {
    return {
      success: false,
      output: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
} 