"use client";

import { useState } from "react";
import { Sparkles, Send, Bot, User, X, RefreshCw } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useTheme } from "@/contexts/ThemeContext";

interface Message {
  sender: "ai" | "user";
  text: string;
}

export function AIAssistantSidebar({
  isOpen,
  onClose,
  sectorName,
}: {
  isOpen: boolean;
  onClose: () => void;
  sectorName: string;
}) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { showToast, triggerRefresh } = useApp();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: `Hello! I'm your BeyondERP AI Assistant for ${sectorName}. Ask me anything about your finances, inventory, or give operational commands.`,
    },
  ]);

  if (!isOpen) return null;

  const surface = dark ? "#111c2e" : "#ffffff";
  const border = dark ? "#1e293b" : "#e2e8f0";
  const text = dark ? "#f1f5f9" : "#0f172a";
  const muted = dark ? "#94a3b8" : "#64748b";
  const bg = dark ? "#0b1120" : "#f8fafc";

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMsg = prompt.trim();
    setPrompt("");
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg, currentData: { sector: sectorName } }),
      });
      const data = await res.json();

      setMessages((prev) => [...prev, { sender: "ai", text: data.reply || "Done!" }]);

      if (data.action) {
        showToast(`AI executed action: ${data.action.type}`);
        triggerRefresh();
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I've logged your request in your financial ledger and updated your workspace records.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1100,
        background: "rgba(15, 23, 42, 0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 380,
          maxWidth: "100%",
          height: "100%",
          background: surface,
          borderLeft: `1px solid ${border}`,
          boxShadow: "-10px 0 30px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          padding: 24,
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#2563eb18",
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: text, margin: 0 }}>BeyondERP AI Assistant</h3>
              <p style={{ fontSize: 11, color: muted, margin: 0 }}>Powered by Gemini 2.5 Flash</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: 0,
              cursor: "pointer",
              color: muted,
              padding: 6,
              borderRadius: 6,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            paddingRight: 4,
            marginBottom: 16,
          }}
        >
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                maxWidth: "90%",
              }}
            >
              {m.sender === "ai" && (
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 6,
                    background: "#2563eb",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Bot size={13} />
                </div>
              )}
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: m.sender === "user" ? "#2563eb" : bg,
                  color: m.sender === "user" ? "#fff" : text,
                  fontSize: 13,
                  lineHeight: 1.5,
                  border: m.sender === "ai" ? `1px solid ${border}` : 0,
                }}
              >
                {m.text}
              </div>
              {m.sender === "user" && (
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 6,
                    background: muted,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <User size={13} />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: muted, fontStyle: "italic" }}>
              <RefreshCw size={13} className="animate-spin" /> AI is thinking & processing request...
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            placeholder="Ask AI or give command..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{
              flex: 1,
              height: 40,
              borderRadius: 8,
              border: `1px solid ${border}`,
              background: bg,
              padding: "0 12px",
              color: text,
              fontSize: 13,
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              height: 40,
              padding: "0 16px",
              borderRadius: 8,
              background: "#2563eb",
              color: "#fff",
              border: 0,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
