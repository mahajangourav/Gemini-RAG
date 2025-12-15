export function resumeJDPrompt(resumeText, jdText) {
  return `
You are an expert technical recruiter.

Compare the RESUME and JOB DESCRIPTION.

Return ONLY valid JSON in this exact format:

{
  "matchPercentage": number,
  "strengths": string[],
  "missingSkills": string[],
  "suggestions": string
}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jdText}
`;
}
