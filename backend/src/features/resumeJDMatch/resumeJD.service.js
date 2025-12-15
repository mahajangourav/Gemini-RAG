import { getGeminiAnswer } from "../../gemini.js";
import { resumeJDPrompt } from "./resumeJD.prompt.js";

export async function runResumeJDMatch(resumeText, jdText) {
  const prompt = resumeJDPrompt(resumeText, jdText);

  const answer = await getGeminiAnswer(prompt);
  return answer;
}
