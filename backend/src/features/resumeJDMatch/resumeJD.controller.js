import { runResumeJDMatch } from "./resumeJD.service.js";

export async function matchResumeWithJD(req, res) {
  try {
    const { resumeText, jdText } = req.body;

    if (!resumeText || !jdText) {
      return res.status(400).json({
        error: "Resume text and Job Description are required"
      });
    }

    const rawOutput = await runResumeJDMatch(resumeText, jdText);

    // Remove ```json ``` wrappers
    const cleaned = rawOutput
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

    const parsedResult = JSON.parse(cleaned);

    res.json({
      success: true,
      result: parsedResult
    });
  } catch (err) {
    console.error("Resume JD Match Error:", err);
    res.status(500).json({ error: "Failed to match resume with JD" });
  }
}
