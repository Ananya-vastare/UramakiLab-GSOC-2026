import React, { useState } from 'react';
import { useOutput } from './hooks/useOutput'; // Ensure this path matches your file structure

export default function App() {
  const [promptInput, setPromptInput] = useState<string>("");
  const { output, isLoading, error, generatePrompt } = useOutput();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || isLoading) return;
    
    // Using "Usability Evaluation" as the default methodology from your JD
    await generatePrompt(promptInput, "Usability Evaluation");
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output.content);
      // Optional: Add a temporary 'Copied!' state here if needed
    }
  };

  return (
    <div className="page-wrapper">
      <div className="center-container">
        <header>
          <h1 className="title">Prompt <span>Architect</span></h1>
          <h2 className="subtitle">AI-Assisted UX Evaluation</h2>
        </header>

        <main className="profile-card">
          <form className="input-bar" onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Describe your design challenge..." 
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              disabled={isLoading}
              aria-label="Design challenge input"
            />
            <button type="submit" disabled={isLoading || !promptInput.trim()}>
              {isLoading ? "Generating..." : "Generate"}
            </button>
          </form>

          {/* Error Display */}
          {error && (
            <div className="error-message" style={{ color: 'var(--color-logo-accent)', marginTop: '1rem' }}>
              {error}
            </div>
          )}

          {/* Output Display */}
          {output && (
            <section className="output-container">
              <div className="output-header">
                <span className="methodology-tag">{output.methodology}</span>
                <span className="timestamp">
                  ID: {output.id.slice(-6)} • {output.timestamp}
                </span>
              </div>
              
              <div className="prompt-result-box">
                {output.content}
              </div>
              
              <button 
                type="button"
                className="subtitle" 
                style={{ 
                  marginTop: '1.5rem', 
                  border: 'none', 
                  background: 'none', 
                  cursor: 'pointer', 
                  fontSize: '0.75rem',
                  width: '100%',
                  textAlign: 'center'
                }}
                onClick={handleCopy}
              >
                Click to copy prompt
              </button>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}