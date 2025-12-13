// src/MessageBubble.jsx

export default function MessageBubble({ sender, text, sources }) {
  const wrapperCls = sender === "user" ? "flex justify-end" : "flex justify-start";
  const bubbleCls =
    sender === "user" ? "user-bubble max-w-[80%]" : "bot-bubble max-w-[80%]";

  // Deduplicate sources by source name
  const uniqueSources =
    sources?.length > 0
      ? Array.from(new Map(sources.map(s => [s.source, s])).values())
      : [];

  return (
    <div className={`my-4 ${wrapperCls}`}>
      <div className={bubbleCls}>
        {text}

        {uniqueSources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-300">
            <p className="font-semibold text-sm mb-1 text-gray-700">Sources:</p>
            <ul className="text-xs text-gray-600 list-disc ml-4 space-y-1">
              {uniqueSources.map((src, i) => (
                <li key={i}>
                  📄 <b>{src.source}</b>
                  {src.pages?.length > 0 && ` (pages ${src.pages.join(", ")})`}
                  {src.preview && (
                    <p className="text-gray-500 italic mt-1">
                      “{src.preview.slice(0, 120)}...”
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
