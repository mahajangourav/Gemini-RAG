import { useEffect, useRef, useState } from "react";
import axios from "axios";
import MessageBubble from "./MessageBubble";
import FileUploader from "./FileUploader";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef();

  useEffect(() => {
    messagesRef.current?.scrollTo(0, messagesRef.current.scrollHeight);
  }, [messages]);

  const sendQuery = async () => {
    const text = q.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setQ("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/query", { question: text });
      const replyObj = res.data.reply;
      const botText = replyObj?.answer ?? JSON.stringify(replyObj);
      const sources = replyObj?.sources ?? [];
      setMessages((prev) => [...prev, { sender: "bot", text: botText, sources }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: " + (err?.response?.data?.error || err.message) },
      ]);
    } finally {
      setLoading(false);
    }
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
            {messages.map((m, i) => (
              <MessageBubble key={i} {...m} />
            ))}
            {loading && (
              <div className="bubble bot-bubble animate-pulse">AI is typing...</div>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ask the documents..."
              className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              onKeyDown={(e) => e.key === "Enter" && sendQuery()}
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
          <FileUploader onIndexed={(d) => console.log("indexed", d)} />
          <div className="small text-gray-500 text-sm">
            Uploaded docs are indexed and searchable immediately.
          </div>
          <div className="small text-gray-500 text-sm">Supported: .txt, .pdf</div>
        </div>
      </div>
    </div>
  );
}
