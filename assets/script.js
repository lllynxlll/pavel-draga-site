document.addEventListener("DOMContentLoaded", () => {
  // Cases carousel arrows
  const carousel = document.getElementById("cases-carousel");
  if (carousel) {
    const wrap = carousel.closest(".cases-carousel-wrap");
    const prevBtn = wrap.querySelector(".carousel-arrow.prev");
    const nextBtn = wrap.querySelector(".carousel-arrow.next");
    const scrollByCard = (dir) => {
      const card = carousel.querySelector(".case-card");
      const gap = 20;
      const amount = (card ? card.getBoundingClientRect().width + gap : 300) * dir;
      carousel.scrollBy({ left: amount, behavior: "smooth" });
    };
    prevBtn && prevBtn.addEventListener("click", () => scrollByCard(-1));
    nextBtn && nextBtn.addEventListener("click", () => scrollByCard(1));
  }

  // Pricing tier CTA — prefill the lead form message with the chosen tier
  document.querySelectorAll(".tier-cta").forEach((el) => {
    el.addEventListener("click", () => {
      const tier = el.getAttribute("data-tier");
      const msg = document.getElementById("message");
      if (msg && tier) {
        msg.value = `Интересует: ${tier}`;
      }
    });
  });

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
