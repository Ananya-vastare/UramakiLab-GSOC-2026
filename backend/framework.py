import os
import hashlib
import logging
from datetime import datetime, timezone
from typing import List
from pydantic import BaseModel, Field
from crewai import Agent, Task, Crew, Process, LLM

# --- Configuration & Setup ---
FRAMEWORK_VERSION = "1.0.0"

class UXFindings(BaseModel):
    challenges: List[str] = Field(..., min_length=3, max_length=3)
    version: str = Field(default=FRAMEWORK_VERSION)
    timestamp: str = Field(default="")
    trace_id: str = Field(default="")
    ui_context: str = Field(default="")

    def model_post_init(self, __context) -> None:
        self.timestamp = datetime.now(timezone.utc).isoformat()
        fingerprint = "".join(self.challenges) + self.ui_context + self.version
        self.trace_id = hashlib.sha256(fingerprint.encode()).hexdigest()[:12]

# Initialize LLMs (Ensure GEMINI_API_KEY is in your .env)
researcher_llm = LLM(model="gemini/gemini-2.5-flash", temperature=0.6)
architect_llm = LLM(model="gemini/gemini-2.5-flash", temperature=0.4)

def run_evaluation(ui_context: str) -> str:
    """The main entry point called by the Flask API."""
    
    researcher = Agent(
        role="Senior UX Researcher",
        goal=f"Identify exactly 3 critical UX challenges for {ui_context}.",
        backstory="Expert in usability heuristics and RUXAILAB standards.",
        llm=researcher_llm
    )

    architect = Agent(
        role="UX Evaluation Prompt Architect",
        goal="Transform findings into a Markdown system prompt.",
        backstory="Senior prompt engineer specializing in RUXAILAB templates.",
        llm=architect_llm
    )

    analysis_task = Task(
        description=f"Analyze the UI context: {ui_context}. Return UXFindings JSON.",
        expected_output="A valid UXFindings JSON object.",
        output_json=UXFindings,
        agent=researcher,
    )

    prompt_task = Task(
        description="Write a professional Markdown System Prompt based on the research.",
        expected_output="A complete Markdown-formatted System Prompt.",
        context=[analysis_task],
        agent=architect,
    )

    crew = Crew(
        agents=[researcher, architect],
        tasks=[analysis_task, prompt_task],
        process=Process.sequential
    )

    result = crew.kickoff(inputs={"ui_context": ui_context})
    # Returns the raw text from the final task
    return result.raw