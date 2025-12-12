import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function SymptomChecker() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I am Medico AI. Describe your symptoms, and I will try to identify the likely disease." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/symptom-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user": localStorage.getItem("user")
        },
        body: JSON.stringify({ symptoms: userMessage.content }),
      });
      const data = await response.json();

      let aiText = "I couldn't process that.";
      if (data.success && data.analysis) {
        // Format the JSON result into a readable chat message
        const { condition, confidence, recommendation, disclaimer } = data.analysis;
        aiText = `**Possible Condition:** ${condition}\n**Confidence:** ${confidence}\n\n**Advice:** ${recommendation}\n\n_${disclaimer}_`;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: aiText }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I am having trouble connecting to the server." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-sky-600 text-white p-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <span className="text-2xl">←</span>
          <h1 className="text-xl font-bold">Medico AI Chat</h1>
        </div>
      </header>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-sm whitespace-pre-line text-lg ${msg.role === "user"
                ? "bg-sky-500 text-white rounded-br-none"
                : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-none shadow-sm">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* INPUT AREA */}
      <div className="bg-white p-4 border-t flex items-center gap-2 pb-8 md:pb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your symptoms here..."
          className="flex-1 border border-gray-300 rounded-full px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-sky-600 hover:bg-sky-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition disabled:bg-gray-300"
        >
          ➤
        </button>
      </div>
    </div>
  );
}