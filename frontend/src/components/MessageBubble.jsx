// src/MessageBubble.jsx

export default function MessageBubble({ sender, text, sources = [] }) {
  const wrapperCls =
    sender === "user" ? "flex justify-end" : "flex justify-start";

  const bubbleCls =
    sender === "user"
      ? "user-bubble max-w-[80%]"
      : "bot-bubble max-w-[80%]";

  return (
    <div className={`my-4 ${wrapperCls}`}>
      <div className={bubbleCls}>
        <div>{text}</div>

        {sender === "bot" && sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-300">
            <p className="font-semibold text-sm mb-1 text-gray-700">
              Sources:
            </p>

            <ul className="text-xs text-gray-600 space-y-2">
              {sources.map((src, i) => (
                <li key={i}>
                  📄 <b>{src.source}</b>
                  {src.page !== undefined && ` (page ${src.page})`}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
