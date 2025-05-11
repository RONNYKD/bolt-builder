interface AIResponse {
  code: string;
  error?: string;
}

export async function generateComponentCode(prompt: string): Promise<AIResponse> {
  try {
    const response = await fetch('/api/generate-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate code');
    }

    const data = await response.json();
    return {
      code: data.code,
    };
  } catch (error) {
    console.error('Error generating code:', error);
    return {
      code: '',
      error: error instanceof Error ? error.message : 'Failed to generate code',
    };
  }
} 