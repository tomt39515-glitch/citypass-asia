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
  const [topups, setTopups] = useState([]);

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
      console.log("LOAD START");

      const clients = await safeFetch(
        `${SUPABASE_URL}/rest/v1/clients?select=id`
      );

      console.log("CLIENTS", clients);

      const partnersData = await safeFetch(
        `${SUPABASE_URL}/rest/v1/partners?select=*`
      );

      console.log("PARTNERS", partnersData);

      const applicationsData = await safeFetch(
        `${SUPABASE_URL}/rest/v1/partner_applications?select=*`
      );

      console.log("APPLICATIONS", applicationsData);

      const topupsData = await safeFetch(
        `${SUPABASE_URL}/rest/v1/deposit_topups?select=*`
      );

      console.log("TOPUPS DATA:", topupsData);

      setStats({
        clients: clients?.length || 0,
        partners: partnersData?.length || 0,
        turnover: 0,
        fees: 0,
      });

      setPartners(partnersData || []);

      setTopups(
        (topupsData || []).filter(
          (topup) =>
            String(topup.status)
              .trim()
              .toLowerCase() === "pending"
        )
      );

      setApplications(
        (applicationsData || []).filter(
          (app) =>
            app.status !== "approved" &&
            app.status !== "rejected"
        )
      );
    } catch (e) {
      console.error("LOAD ERROR:", e);

      alert(
        e?.message ||
          JSON.stringify(e) ||
          "Ошибка загрузки"
      );
    }
  }

  async function approveApplication(app) {
    try {
      console.log("APP:", app);

      await safeFetch(
        `${SUPABASE_URL}/rest/v1/partner_applications?id=eq.${encodeURIComponent(
          app.id
        )}`,
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

      const partnerPayload = {
        telegram_id: String(app.telegram_id || ""),
        business_name: String(
          app.business_name || ""
        ),
        category: String(app.category || ""),
        status: "approved",
        is_active: true,
        contact_person:
          app.contact_name || null,
        phone: app.phone || null,
        address: app.address || null,
        deposit_balance: 0,
        bonus_balance: 0,
      };

      console.log(
        "PARTNER PAYLOAD:",
        partnerPayload
      );

      await safeFetch(
        `${SUPABASE_URL}/rest/v1/partners`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify(
            partnerPayload
          ),
        }
      );

      await loadData();

      alert("Партнёр одобрен");
    } catch (e) {
      console.error(
        "APPROVE ERROR:",
        e
      );

      alert(
        e.message ||
          JSON.stringify(e)
      );
    }
  }

  async function rejectApplication(app) {
    try {
      await safeFetch(
        `${SUPABASE_URL}/rest/v1/partner_applications?id=eq.${app.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
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
  async function approveTopup(topup) {
    try {
      console.log("TOPUP ID:", topup.id);
      console.log("TOPUP:", topup);

      const topupData = await safeFetch(
        `${SUPABASE_URL}/rest/v1/deposit_topups?id=eq.${topup.id}&select=*`
      );

      if (!topupData?.length) {
        throw new Error("Заявка не найдена");
      }

      if (
        String(topupData[0].status)
          .trim()
          .toLowerCase() !== "pending"
      ) {
        throw new Error("Заявка уже обработана");
      }

      const partnerData = await safeFetch(
        `${SUPABASE_URL}/rest/v1/partners?id=eq.${topup.partner_id}&select=*`
      );

      if (!partnerData?.length) {
        throw new Error("Партнёр не найден");
      }

      const partner = partnerData[0];

      const balanceBefore = Number(
        partner.deposit_balance || 0
      );

      const amount = Number(
        topup.amount || 0
      );

      const balanceAfter =
        balanceBefore + amount;

      await safeFetch(
        `${SUPABASE_URL}/rest/v1/partners?id=eq.${partner.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            deposit_balance:
              balanceAfter,
          }),
        }
      );

      await safeFetch(
        `${SUPABASE_URL}/rest/v1/deposit_transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Prefer:
              "return=representation",
          },
          body: JSON.stringify({
            partner_id: partner.id,
            type: "topup",
            amount: amount,
            balance_before:
              balanceBefore,
            balance_after:
              balanceAfter,
            description:
              "Пополнение депозита",
            reference_id:
              topup.id,
          }),
        }
      );

      const response =
        await fetch(
          `${SUPABASE_URL}/rest/v1/deposit_topups?id=eq.${topup.id}`,
          {
            method: "PATCH",
            headers: {
              apikey:
                SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
              "Content-Type":
                "application/json",
              Prefer:
                "return=representation",
            },
            body: JSON.stringify({
              status:
                "approved",
              approved_at:
                new Date().toISOString(),
            }),
          }
        );

      const responseText =
        await response.text();

      if (!response.ok) {
        throw new Error(
          `PATCH ERROR ${response.status}: ${responseText}`
        );
      }

      setTopups((prev) =>
        prev.filter(
          (item) =>
            item.id !== topup.id
        )
      );

      alert(
        "Депозит начислен и записан в историю"
      );
    } catch (e) {
      console.error(
        "APPROVE TOPUP ERROR:",
        e
      );

      alert(
        e.message ||
          JSON.stringify(e)
      );
    }
  }

  async function rejectTopup(
    topup
  ) {
    try {
      await safeFetch(
        `${SUPABASE_URL}/rest/v1/deposit_topups?id=eq.${topup.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status:
              "rejected",
          }),
        }
      );

      setTopups((prev) =>
        prev.filter(
          (item) =>
            item.id !==
            topup.id
        )
      );

      alert(
        "Заявка отклонена"
      );
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Админ панель</h1>

      <div>
        Клиенты: {stats.clients}
      </div>

      <div>
        Партнёры: {stats.partners}
      </div>

      <h2>Новые заявки</h2>

      {applications.map(
        (app) => (
          <div key={app.id}>
            <h3>
              {
                app.business_name
              }
            </h3>

            <button
              onClick={() =>
                approveApplication(
                  app
                )
              }
            >
              Одобрить
            </button>

            <button
              onClick={() =>
                rejectApplication(
                  app
                )
              }
            >
              Отклонить
            </button>
          </div>
        )
      )}

      <h2>
        Заявки на пополнение
      </h2>

      {topups.length === 0 && (
        <div>
          Нет заявок на
          пополнение
        </div>
      )}

      {topups.map(
        (topup) => (
          <div
            key={topup.id}
            style={{
              border:
                "1px solid #ddd",
              padding: 12,
              marginBottom: 12,
              borderRadius: 8,
            }}
          >
            <div>
              Партнёр ID:{" "}
              {
                topup.partner_id
              }
            </div>

            <div>
              Сумма:{" "}
              {Number(
                topup.amount
              ).toLocaleString()}{" "}
              VND
            </div>

            <div>
              Код:{" "}
              {
                topup.payment_code
              }
            </div>

            {topup.screenshot_url && (
              <div>
                <a
                  href={
                    topup.screenshot_url
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  Открыть чек
                </a>
              </div>
            )}

            <div
              style={{
                display:
                  "flex",
                gap: 10,
                marginTop: 10,
              }}
            >
              <button
                onClick={() =>
                  approveTopup(
                    topup
                  )
                }
              >
                Одобрить
              </button>

              <button
                onClick={() =>
                  rejectTopup(
                    topup
                  )
                }
              >
                Отклонить
              </button>
            </div>
          </div>
        )
      )}

      <h2>Партнёры</h2>

      {partners.map(
        (partner) => (
          <div
            key={partner.id}
          >
            <h3>
              {partner.business_name ||
                `Партнёр #${partner.id}`}
            </h3>

            <div>
              Депозит:{" "}
              {Number(
                partner.deposit_balance ||
                  0
              ).toLocaleString()}{" "}
              VND
            </div>

            <div>
              Бонусы:{" "}
              {Number(
                partner.bonus_balance ||
                  0
              ).toLocaleString()}{" "}
              VND
            </div>

            <button
              onClick={() =>
                onOpenPartner(
                  partner
                )
              }
            >
              Открыть
            </button>
          </div>
        )
      )}
    </div>
  );
}