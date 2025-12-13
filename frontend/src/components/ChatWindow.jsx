import { useEffect, useRef, useState } from "react";
import axios from "axios";
import MessageBubble from "./MessageBubble";
import FileUploader from "./FileUploader";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const messagesRef = useRef();

  useEffect(() => {
    messagesRef.current?.scrollTo(0, messagesRef.current.scrollHeight);
  }, [messages]);

  const sendQuery = async () => {
    const text = q.trim();
    if (!text) return;

    setMessages(prev => [...prev, { sender: "user", text }]);
    setQ("");
    setLoading(true);

    try {
      const allowedFiles = uploadedFiles.map(f => f.name).filter(Boolean);
      const payload = { question: text };
      if (allowedFiles.length > 0) payload.allowedFiles = allowedFiles;

      const res = await axios.post("http://localhost:5000/query", payload);
      const { answer, sources } = res.data;

      setMessages(prev => [
        ...prev,
        { sender: "bot", text: answer, sources: sources || [] }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Error: " + (err?.response?.data?.error || err.message) }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileIndexed = (results) => {
    // results = array of { file, detail, error }
    const newFiles = results
      .filter(r => r.detail)
      .map(r => {
        const message = r.detail?.detail?.message || r.detail?.message || "";
        const match = message.match(/from (.+)$/);
        const filePath = match ? match[1] : null;
        const fileName = filePath?.split("/").pop() || r.file;
        return { filePath, name: fileName };
      });

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  return (
    <div className="app max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">RAG Chatbot</h1>
      <div className="chat-panel grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-2 flex flex-col">
        <div
            className="messages bg-white min-h-[500px] max-h-[70vh] rounded-xl shadow-md p-4 overflow-y-auto mb-4"
            ref={messagesRef}
        >
            {messages.length === 0 && !loading && (
            <div className="empty-messages text-gray-500 text-center mt-20">
                Upload documents and ask questions!
            </div>
            )}
            <div>
                {messages.map((m, i) => <MessageBubble key={i} {...m} />)}
                {loading && <div className="bubble bot-bubble animate-pulse">AI is typing...</div>}
            </div>
        </div>
        <div className="input flex gap-2">
            <input
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Ask the documents..."
            className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            onKeyDown={e => e.key === "Enter" && sendQuery()}
            disabled={loading}
            />
            <button
            onClick={sendQuery}
            disabled={loading}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 rounded-r-lg transition disabled:opacity-50"
            >
            Send
            </button>
        </div>
        </div>

        {/* Sidebar: File Upload */}
        <div className="side flex flex-col gap-4">
          <FileUploader onIndexed={handleFileIndexed} />
          <div className="small text-gray-500 text-sm">
            Uploaded docs are indexed and searchable immediately.
          </div>
          <div className="small text-gray-500 text-sm">Supported: .txt, .pdf</div>

          {uploadedFiles.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              <p className="font-semibold">Indexed Files:</p>
              <ul className="list-disc ml-4 space-y-1">
                {uploadedFiles.map((f, i) => <li key={i}>{f.name}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
