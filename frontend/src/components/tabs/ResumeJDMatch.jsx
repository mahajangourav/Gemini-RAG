import { useState } from "react";
import axios from "axios";
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

export default function ResumeJDMatch() {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // Handle file upload and extract text
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeFile(file);

    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = async function () {
        const typedArray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(item => item.str).join(' ') + '\n';
        }
        setResumeText(text);
      };
      reader.readAsArrayBuffer(file);
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      // Optionally handle DOCX
      // Skipping implementation for simplicity; can use 'docx' or 'mammoth'
      setResumeText('');
      alert('DOCX upload not implemented yet. Please use PDF.');
    } else {
      alert('Unsupported file type. Please upload PDF.');
    }
  };

  const handleMatch = async () => {
    if (!resumeText.trim() || !jdText.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post(`${API_BASE}/api/resume-jd-match`, {
        resumeText,
        jdText,
      });
      setResult(res.data);
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
        Resume vs Job Description Match
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Resume Upload */}
        <div className="flex flex-col">
          <label className="font-semibold mb-2 text-gray-700">Upload Resume (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="p-2 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
          />
          {resumeFile && <p className="mt-2 text-gray-600">Selected: {resumeFile.name}</p>}
        </div>

        {/* JD Text */}
        <div className="flex flex-col">
          <label className="font-semibold mb-2 text-gray-700">Job Description</label>
          <textarea
            rows={10}
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste job description here..."
            className="p-4 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none resize-none"
          />
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={handleMatch}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Match"}
        </button>
      </div>

      {/* Result */}
      {result && !result.error && (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
          {/* Match Percentage */}
          <div>
            <p className="font-semibold text-gray-700 mb-2">Match Percentage</p>
            <div className="w-full bg-gray-200 rounded-full h-6">
              <div
                className="bg-purple-600 h-6 rounded-full text-white text-center font-bold"
                style={{ width: `${result.matchPercentage}%` }}
              >
                {result.matchPercentage}%
              </div>
            </div>
          </div>

          {/* Strengths */}
          <div>
            <p className="font-semibold text-gray-700 mb-2">Strengths</p>
            <ul className="list-disc ml-5 text-gray-600 space-y-1">
              {result.strengths?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Missing Skills */}
          <div>
            <p className="font-semibold text-gray-700 mb-2">Missing Skills</p>
            <ul className="list-disc ml-5 text-gray-600 space-y-1">
              {result.missingSkills?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Suggestions */}
          <div>
            <p className="font-semibold text-gray-700 mb-2">Improvement Suggestions</p>
            <p className="text-gray-600 whitespace-pre-line">{result.suggestions}</p>
          </div>
        </div>
      )}

      {result?.error && (
        <p className="text-red-500 text-center mt-4">{result.error}</p>
      )}
    </div>
  );
}
