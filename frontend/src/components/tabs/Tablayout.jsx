import { useState } from "react";
import RAGChatTab from "./RAGChatTab";
import ResumeJDMatch from "./ResumeJDMatch";

export default function TabLayout() {
  const [activeTab, setActiveTab] = useState("rag");

  return (
    <>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={() => setActiveTab("rag")}>📄 RAG Chat</button>
        <button onClick={() => setActiveTab("resume")}>📊 Resume vs JD</button>
      </div>

      {activeTab === "rag" && <RAGChatTab />}
      {activeTab === "resume" && <ResumeJDMatch />}
    </>
  );
}
