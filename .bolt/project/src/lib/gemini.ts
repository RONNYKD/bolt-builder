// Gemini API integration for AI component generation (now using OpenAI via Azure)

export interface ComponentGenerationRequest {
  componentType: string;
  style: string;
  purpose: string;
  multiFile?: boolean;
}

export interface ComponentGenerationResponse {
  code: string;
  explanation: string;
  error?: string;
  files?: Array<{
    name: string;
    content: string;
    type: 'component' | 'style' | 'util' | 'config';
  }>;
}

function getGithubToken(): string | null {
  return localStorage.getItem('GITHUB_TOKEN');
}

export async function generateComponent({
  componentType,
  style,
  purpose,
  multiFile = false
}: ComponentGenerationRequest): Promise<ComponentGenerationResponse> {
  try {
    const token = getGithubToken();
    if (!token) {
      throw new Error('Missing GitHub token. Please enter your token in the UI.');
    }
 
    const endpoint = "https://models.github.ai/inference";
    const model = "openai/gpt-4.1";
    const prompt = multiFile 
      ? `Generate a complete React application with multiple files for a ${componentType} with ${style} style for ${purpose}. Use very simple, point-form English in all explanations. Avoid technical jargon. List steps and code in bullet points.`
      : `Generate a React component for a ${componentType} with ${style} style for ${purpose}. Use Tailwind CSS for styling and make it responsive. Explain everything in very simple, point-form English. Avoid technical jargon. List steps and code in bullet points.`;

    const response = await fetch(`${endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a helpful assistant that generates React components." },
          { role: "user", content: prompt }
        ],
        temperature: 1,
        top_p: 1,
        model: model
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to generate component');
    }

    const data = await response.json();
    const generatedContent = data.choices?.[0]?.message?.content || '';

    if (multiFile) {
      try {
        const files = JSON.parse(generatedContent);
        return {
          code: '', // Empty for multi-file mode
          explanation: 'Here are your generated files. You can make changes by describing what you want in the chat.',
          files
        };
      } catch (e) {
        console.error('Error parsing generated files:', e);
        return {
          code: generatedContent,
          explanation: 'Generated content could not be parsed as files. Showing raw content instead.',
          error: 'Failed to parse generated files'
        };
      }
    }

    return {
      code: generatedContent,
      explanation: 'Here is your generated component. You can make changes by describing what you want in the chat.'
    };
  } catch (error) {
    console.error('Error generating component:', error);
    return {
      code: '',
      explanation: 'Sorry, there was an error generating your component. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function generatePlan(userPrompt: string): Promise<string> {
  try {
    const token = localStorage.getItem('GITHUB_TOKEN');
    if (!token) {
      throw new Error('Missing GitHub token. Please enter your token in the UI.');
    }
    const endpoint = "https://models.github.ai/inference";
    const model = "openai/gpt-4.1";
    const planningPrompt = `Given this app idea: "${userPrompt}", explain how to build it in very simple, point-form English. Use bullet points. Avoid technical jargon. Make it easy for a beginner to follow.`;
    const response = await fetch(`${endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a friendly coding helper who explains things in simple terms." },
          { role: "user", content: planningPrompt }
        ],
        temperature: 0.7,
        top_p: 1,
        model: model
      })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to generate plan');
    }
    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No plan generated.';
  } catch (error) {
    console.error('Error generating plan:', error);
    return 'Sorry, something went wrong. Let me try again.';
  }
}

export async function executeCommand(command: string): Promise<{ success: boolean; output: string }> {
  try {
    // Execute the command in the sandbox environment
    const response = await fetch('/api/execute-command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command })
    });

    if (!response.ok) {
      throw new Error('Failed to execute command');
    }

    const result = await response.json();
    return {
      success: true,
      output: result.output
    };
  } catch (error: unknown) {
    return {
      success: false,
      output: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

export async function testAIResponse(): Promise<{ success: boolean; message: string }> {
  try {
    // Test with a simple prompt
    const testPrompt = "Create a simple button component";
    const response = await generateComponent({
      componentType: "Button",
      style: "modern",
      purpose: "Test AI response"
    });

    if (response.error) {
      return {
        success: false,
        message: `AI test failed: ${response.error}`
      };
    }

    // Test command execution
    const commandResult = await executeCommand('echo "Testing command execution"');
    
    return {
      success: true,
      message: `AI test successful. Component generated: ${response.code ? 'Yes' : 'No'}, Command executed: ${commandResult.success ? 'Yes' : 'No'}`
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: `AI test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}