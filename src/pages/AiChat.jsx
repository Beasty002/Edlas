import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function AiChat() {
  const [messages, setMessages] = useState([
    { type: "ai", text: "Hello! How can I Beasty help you today  😊" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "Beasty dont want to respond now try later . OK." },
      ]);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex max-w-[70%]">
              {" "}
              <div className="relative w-full">
                <div
                  className={`w-full px-4 py-3 rounded-2xl break-words ${
                    msg.type === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {msg.text}
                </div>
                <div
                  className={`absolute top-2 w-0 h-0 ${
                    msg.type === "user"
                      ? "right-[3px] translate-x-full border-l-[8px] border-l-blue-500 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"
                      : "left-[3px] -translate-x-full border-r-[8px] border-r-gray-200 dark:border-r-gray-800 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"
                  }`}
                />
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="relative">
              <div className="bg-gray-200 dark:bg-gray-800 px-4 py-3 rounded-2xl flex space-x-1">
                <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce delay-300"></span>
              </div>
              <div className="absolute top-2 left-0 -translate-x-full w-0 h-0 border-r-[8px] border-r-gray-200 dark:border-r-gray-800 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="relative flex items-center">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 h-12 pr-14 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={sendMessage}
            className="absolute right-2 h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Send className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </Button>
        </div>
      </div>
    </div>
  );
}
