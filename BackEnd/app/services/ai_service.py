import json
import re

import google.generativeai as genai

from app.database.config import settings


genai.configure(
    api_key=settings.GEMINI_API_KEY
)

model = genai.GenerativeModel(
    "gemini-flash-latest"
)

def fallback_score(job_description, resume_text):
    job_words = set(job_description.lower().split())
    resume_words = set(resume_text.lower().split())

    matched = list(job_words.intersection(resume_words))
    missing = list(job_words - resume_words)

    score = int(
        (len(matched) / max(len(job_words), 1)) * 100
    )

    return {
        "score": score,
        "matching_skills": matched[:10],
        "missing_skills": missing[:10],
        "summary": "Keyword-based fallback scoring."
    }


def score_candidate(
    job_description: str,
    resume_text: str
) -> dict:
    prompt = f"""
You are an ATS Resume Scoring System.

Compare the candidate resume against the job description.

Return ONLY valid JSON.

Job Description:
{job_description}

Resume:
{resume_text}

Required JSON format:

{{
    "score": 85,
    "matching_skills": [
        "React",
        "TypeScript"
    ],
    "missing_skills": [
        "Docker"
    ],
    "summary": "Strong frontend candidate with relevant experience."
}}
"""

    try:
        response = model.generate_content(prompt)
        print(f"Gemini response: {response.text}")

        result_text = response.text.strip()

        # Remove markdown code blocks if Gemini returns them
        result_text = re.sub(
            r"^```json\s*|\s*```$",
            "",
            result_text,
            flags=re.MULTILINE
        ).strip()

        return json.loads(result_text)

    except Exception as e:
        print(f"Gemini failed: {e}")

    return fallback_score(
        job_description,
        resume_text
    )