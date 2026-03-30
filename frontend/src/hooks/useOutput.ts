import { useState } from 'react';

interface GeneratedPrompt {
  id: string;
  methodology: string;
  content: string;
  timestamp: string;
}

export const useOutput = () => {
  const [output, setOutput] = useState<GeneratedPrompt | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generatePrompt = async (userInput: string, methodology: string = "General") => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: userInput,
          methodology: methodology, 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate prompt. Please try again.');
      }

      const data = await response.json();

      // Assuming API returns { content: "...", id: "..." }
      setOutput({
        id: data.id || Date.now().toString(),
        methodology: methodology,
        content: data.content,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const clearOutput = () => setOutput(null);

  return { output, isLoading, error, generatePrompt, clearOutput };
};