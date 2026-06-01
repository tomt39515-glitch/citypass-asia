import React, { useEffect, useState } from "react";

const SUPABASE_URL = "https://doswzyuumcwxjmltcgeh.supabase.co";
const SUPABASE_KEY = "sb_publishable_5_sw0Rk7sPg-SMTgI1aTkA_Vb5QAZRP";

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

export default function AdminDashboard({
  currentTab,
  onOpenPartner,
}) {
  const [stats, setStats] = useState({
    clients: 0,
    partners: 0,
    turnover: 0,
    fees: 0,
  });

  const [partners, setPartners] = useState([]);
  const [applications, setApplications] = useState([]);
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
      <p>Управление партнёрами</p>
    </div>
  );
}

if (currentTab === "clients") {
  return (
    <div style={{ padding: 20 }}>
      <h1>Клиенты</h1>
      <p>Список клиентов</p>
    </div>
  );
}

if (currentTab === "transactions") {
  return (
    <div style={{ padding: 20 }}>
      <h1>Транзакции</h1>
      <p>История транзакций</p>
    </div>
  );
}

  async function safeFetch(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Ошибка");
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  async function loadData() {
    try {
      const clients = await safeFetch(
        `${SUPABASE_URL}/rest/v1/clients?select=id`
      );

      const partnersData = await safeFetch(
        `${SUPABASE_URL}/rest/v1/partners?select=*`
      );

      const applicationsData = await safeFetch(
        `${SUPABASE_URL}/rest/v1/partner_applications?select=*`
      );
const transactions = await safeFetch(
  `${SUPABASE_URL}/rest/v1/transactions?select=*`
);

const turnover = 0;

const fees = 0;

      setStats({
        clients: clients.length,
        partners: partnersData.length,
        turnover,
        fees,
      });

      setPartners(partnersData || []);

      setApplications(
        (applicationsData || []).filter(
          (app) =>
            app.status !== "approved" &&
            app.status !== "rejected"
        )
      );
    } catch (e) {
      alert(e.message);
    }
  }
async function approveApplication(app) {
  try {
    await safeFetch(
      `${SUPABASE_URL}/rest/v1/partner_applications?id=eq.${app.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "approved",
        }),
      }
    );

    await loadData();

    alert("Партнёр одобрен");
  } catch (e) {
    alert(e.message);
  }
}

  async function rejectApplication(app) {
    try {
      await safeFetch(
        `${SUPABASE_URL}/rest/v1/partner_applications?id=eq.${app.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "rejected",
          }),
        }
      );

      await loadData();
      alert("Заявка отклонена");
    } catch (e) {
      alert(e.message);
    }
  }

  async function addBonus(partner) {
    const amount = prompt("Введите сумму бонусов");
    if (!amount) return;

    const bonusAmount = Number(amount);

    if (!bonusAmount || bonusAmount <= 0) {
      alert("Некорректная сумма");
      return;
    }

    try {
      await safeFetch(
        `${SUPABASE_URL}/rest/v1/partners?id=eq.${partner.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bonus_balance:
              Number(partner.bonus_balance || 0) + bonusAmount,
          }),
        }
      );

      await loadData();
    } catch (e) {
      alert(e.message);
    }
  }

  async function addDeposit(partner) {
    const amount = prompt("Введите сумму депозита");
    if (!amount) return;

    const depositAmount = Number(amount);

    if (!depositAmount || depositAmount <= 0) {
      alert("Некорректная сумма");
      return;
    }

    try {
      await safeFetch(
        `${SUPABASE_URL}/rest/v1/partners?id=eq.${partner.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deposit_balance:
              Number(partner.deposit_balance || 0) + depositAmount,
          }),
        }
      );

      await loadData();
    } catch (e) {
      alert(e.message);
    }
  }

  async function toggleStatus(partner) {
    const newStatus =
      partner.status === "blocked" ? "active" : "blocked";

    try {
      await safeFetch(
        `${SUPABASE_URL}/rest/v1/partners?id=eq.${partner.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      await loadData();
    } catch (e) {
      alert(e.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Админ панель</h1>

      <div>Клиенты: {stats.clients}</div>
      <div>Партнёры: {stats.partners}</div>
      <div>Оборот: {stats.turnover} VND</div>
      <div>Комиссии: {stats.fees} VND</div>

      <h2>Новые заявки</h2>

      {applications.map((app) => (
        <div key={app.id}>
          <h3>{app.business_name}</h3>
          <button onClick={() => approveApplication(app)}>Одобрить</button>
          <button onClick={() => rejectApplication(app)}>Отклонить</button>
        </div>
      ))}

      <h2>Партнёры</h2>

      {partners.map((partner) => (
        <div key={partner.id}>
          <h3>{partner.name || `Партнёр #${partner.id}`}</h3>
          <button onClick={() => onOpenPartner(partner)}>Открыть</button>
        </div>
      ))}
    </div>
  );
}