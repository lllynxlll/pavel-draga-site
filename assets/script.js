document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("lead-form");
  if (!form) return;

  const statusEl = document.getElementById("form-status");
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "";
    statusEl.className = "";

    const consent = form.querySelector("#consent");
    if (consent && !consent.checked) {
      statusEl.textContent = "Нужно согласие на обработку персональных данных.";
      statusEl.className = "err";
      return;
    }

    const data = {
      name: form.querySelector("#name").value.trim(),
      contact: form.querySelector("#contact").value.trim(),
      message: form.querySelector("#message").value.trim(),
    };

    if (!data.name || !data.contact) {
      statusEl.textContent = "Заполни имя и контакт.";
      statusEl.className = "err";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Отправляю...";

    try {
      const res = await fetch("/.netlify/functions/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("bad status");
      statusEl.textContent = "Заявка отправлена. Я свяжусь с тобой в ближайшее время.";
      statusEl.className = "ok";
      form.reset();
    } catch (err) {
      statusEl.textContent = "Не получилось отправить. Попробуй ещё раз или напиши напрямую в Telegram.";
      statusEl.className = "err";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Отправить заявку";
    }
  });
});
