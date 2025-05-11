import React, { useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { generateComponent } from '../../lib/gemini';

interface AIComponentGeneratorProps {
  onComponentGenerated: (code: string) => void;
}

export const AIComponentGenerator: React.FC<AIComponentGeneratorProps> = ({ 
  onComponentGenerated 
}) => {
  const [componentType, setComponentType] = useState('');
  const [style, setStyle] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await generateComponent({
        componentType,
        style,
        purpose
      });

      if (result.error) {
        setError(result.error);
      } else {
        onComponentGenerated(result.code);
        // Reset form
        setComponentType('');
        setStyle('');
        setPurpose('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate component');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
        <h2 className="text-lg font-semibold">AI Component Generator</h2>
      </div>

      {error && (
        <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Component Type"
          placeholder="e.g., Button, Card, Navbar, Hero Section"
          value={componentType}
          onChange={(e) => setComponentType(e.target.value)}
          required
          fullWidth
        />
        
        <Input
          label="Style"
          placeholder="e.g., Minimalist, Colorful, Corporate, Playful"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          required
          fullWidth
        />
        
        <Input
          label="Purpose"
          placeholder="e.g., E-commerce product display, Blog post, Contact form"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          required
          fullWidth
        />

        <Button
          type="submit"
          isLoading={isLoading}
          leftIcon={<Sparkles className="h-4 w-4" />}
          fullWidth
        >
          Generate Component
        </Button>
      </form>

      <p className="mt-4 text-xs text-gray-500">
        Powered by Google Gemini. Generate custom React components with Tailwind CSS styling.
      </p>
    </div>
  );
};