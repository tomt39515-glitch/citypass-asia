import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminDashboard({ currentTab }) {
  const [requests, setRequests] = useState([]);

  async function loadRequests() {
    const { data, error } = await supabase
      .from("admin_topup_requests_view")
      .select("*");

    if (!error) {
      setRequests(data || []);
    }
  }

  async function approveRequest(id) {
    await fetch(
      "https://doswzyuumcwxjmltcgeh.supabase.co/functions/v1/approve-topup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          request_id: id,
          admin_id: 1,
        }),
      }
    );

    loadRequests();
  }

  useEffect(() => {
    loadRequests();
  }, []);

  if (currentTab === "dashboard") {
    return (
      <div style={{ padding: 20 }}>
        <h1>Dashboard</h1>
        <p>Главная панель администратора</p>
      </div>
    );
  }

  if (currentTab === "partners") {
    return (
      <div style={{ padding: 20 }}>
        <h1>Партнёры</h1>
        <p>Список партнёров будет отображаться здесь</p>
      </div>
    );
  }

  if (currentTab === "clients") {
    return (
      <div style={{ padding: 20 }}>
        <h1>Клиенты</h1>
        <p>Список клиентов будет отображаться здесь</p>
      </div>
    );
  }

  if (currentTab === "transactions") {
    return (
      <div style={{ padding: 20 }}>
        <h1>Транзакции</h1>
        <p>История транзакций будет отображаться здесь</p>
      </div>
    );
  }

  if (currentTab === "topups") {
    return (
      <div style={{ padding: 20 }}>
        <h1>Пополнения депозитов</h1>

        {requests.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              padding: 15,
              marginBottom: 15,
              borderRadius: 10,
            }}
          >
            <h3>{item.partner_name}</h3>

            <p>Сумма: {item.amount} VND</p>

            <p>Статус: {item.status}</p>

            <p>Баланс: {item.deposit_balance}</p>

            <button
              onClick={() => approveRequest(item.id)}
              disabled={item.status !== "pending"}
            >
              Одобрить
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Админ панель</h1>
    </div>
  );
}