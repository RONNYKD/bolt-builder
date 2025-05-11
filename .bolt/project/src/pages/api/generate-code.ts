import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a React component generator. Generate clean, modern React components using TypeScript and Tailwind CSS. Include proper types, error handling, and comments."
        },
        {
          role: "user",
          content: `Generate a React component that: ${prompt}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const generatedCode = completion.choices[0]?.message?.content || '';

    // Extract just the code from the response (remove any explanation text)
    const codeMatch = generatedCode.match(/```(?:jsx|tsx)?\n([\s\S]*?)```/);
    const cleanCode = codeMatch ? codeMatch[1].trim() : generatedCode;

    return res.status(200).json({ code: cleanCode });
  } catch (error) {
    console.error('Error generating code:', error);
    return res.status(500).json({ error: 'Failed to generate code' });
  }
} 