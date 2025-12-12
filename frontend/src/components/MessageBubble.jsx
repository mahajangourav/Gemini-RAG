// src/MessageBubble.jsx

export default function MessageBubble({ sender, text, sources }) {
  // ⭐️ FIX: Use flex and justify utilities for explicit alignment
  const wrapperCls = sender === "user" ? "flex justify-end" : "flex justify-start";
  
  // ⭐️ Added clear margin-bottom for message separation
  const bubbleCls = sender === "user" 
    ? "user-bubble max-w-[80%]" 
    : "bot-bubble max-w-[80%]";

  return (
    <div className={`my-4 ${wrapperCls}`}>
      <div className={bubbleCls}>
        {text}
        {sources && sources.length > 0 && (
          // ⭐️ FIX: Use Tailwind classes for simple list styling
          <div className="mt-3 pt-3 border-t border-gray-300"> 
            <p className="font-semibold text-sm mb-1 text-gray-700">Sources:</p>
            <ul className="text-xs text-gray-600 list-disc ml-4 space-y-1">
              {sources.map((src, i) => (
                <li key={i}>{src}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}