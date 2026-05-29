import React, { useEffect, useState } from "react";

const SUPABASE_URL = "https://doswzyuumcwxjmltcgeh.supabase.co";
const SUPABASE_KEY = "sb_publishable_5_sw0Rk7sPg-SMTgI1aTkA_Vb5QAZRP";

const defaultHeaders = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

export default function SupportChatPage({ partner, onBack }) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  async function safeFetch(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  async function loadConversation() {
    try {
      let conversations = await safeFetch(
        `${SUPABASE_URL}/rest/v1/support_conversations?partner_id=eq.${partner.id}&status=eq.open&select=*`
      );

      let currentConversation = conversations[0];

      if (!currentConversation) {
        const created = await safeFetch(
          `${SUPABASE_URL}/rest/v1/support_conversations`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Prefer: "return=representation",
            },
            body: JSON.stringify([
              {
                partner_id: partner.id,
                status: "open",
              },
            ]),
          }
        );

        currentConversation = created[0];
      }

      setConversation(currentConversation);

      const msgs = await safeFetch(
        `${SUPABASE_URL}/rest/v1/support_messages?conversation_id=eq.${currentConversation.id}&select=*&order=created_at.asc`
      );

      setMessages(msgs || []);
    } catch (e) {
      alert(e.message);
    }
  }

  useEffect(() => {
    if (partner) {
      loadConversation();
    }
  }, [partner]);

  useEffect(() => {
    if (!conversation) return;

    const interval = setInterval(() => {
      loadConversation();
    }, 3000);

    return () => clearInterval(interval);
  }, [conversation]);

  async function sendMessage() {
    if (!messageText.trim()) {
      return;
    }

    try {
      await safeFetch(`${SUPABASE_URL}/rest/v1/support_messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify([
          {
            conversation_id: conversation.id,
            sender_type: "partner",
            message: messageText.trim(),
          },
        ]),
      });

      await safeFetch(
        `${SUPABASE_URL}/rest/v1/support_conversations?id=eq.${conversation.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            updated_at: new Date().toISOString(),
          }),
        }
      );

      setMessageText("");
      loadConversation();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div
      style={{
        padding: 20,
        minHeight: "100vh",
        background: "#f3f4f6",
      }}
    >
      <button
        onClick={onBack}
        style={{
          marginBottom: 16,
          padding: 10,
          border: "none",
          borderRadius: 10,
          background: "#111827",
          color: "white",
          cursor: "pointer",
        }}
      >
        Назад
      </button>

      <h1>Поддержка</h1>

      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 16,
          minHeight: 400,
          marginBottom: 16,
          overflowY: "auto",
        }}
      >
        {messages.length === 0 && (
          <div>Здравствуйте, чем можем помочь?</div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: 12,
              textAlign:
                msg.sender_type === "partner"
                  ? "right"
                  : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: 12,
                borderRadius: 14,
                background:
                  msg.sender_type === "partner"
                    ? "#2563eb"
                    : "#e5e7eb",
                color:
                  msg.sender_type === "partner"
                    ? "white"
                    : "black",
                maxWidth: "80%",
              }}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Введите сообщение"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 12,
          border: "1px solid #d1d5db",
          marginBottom: 12,
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={sendMessage}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 14,
          border: "none",
          background: "#16a34a",
          color: "white",
          cursor: "pointer",
        }}
      >
        Отправить
      </button>
    </div>
  );
}