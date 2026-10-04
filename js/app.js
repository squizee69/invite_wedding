(function () {
  "use strict";

  const cfg = window.WEDDING_CONFIG || {};
  const eventDate = buildEventDate(cfg.event);

  const startscreen = document.getElementById("startscreen");
  const openBtn = document.getElementById("openInvite");
  const invite = document.getElementById("invite");
  const topbar = document.getElementById("topbar");
  const music = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");
  const form = document.getElementById("rsvpForm");
  const formNote = document.getElementById("formNote");
  const formSuccess = document.getElementById("formSuccess");
  const submitBtn = document.getElementById("submitBtn");
  const calLink = document.getElementById("addToCalendar");

  let musicOn = false;

  openBtn.addEventListener("click", openInvitation);
  musicToggle.addEventListener("click", toggleMusic);
  form.addEventListener("submit", onSubmit);
  setupCountdown();
  setupCalendarLink();
  setupMiniCalendar();
  setupRevealObserver();

  function openInvitation() {
    startscreen.classList.add("is-hidden");
    startscreen.setAttribute("aria-hidden", "true");
    invite.hidden = false;
    topbar.hidden = false;

    tryPlayMusic();

    requestAnimationFrame(() => {
      document.querySelectorAll(".hero .animate-in").forEach((el, i) => {
        setTimeout(() => el.classList.add("is-visible"), 80 + i * 90);
      });
      setupWaveTimetable();
    });
  }

  function tryPlayMusic() {
    if (!music) return;
    music.volume = 0.45;
    const play = music.play();
    if (play && typeof play.then === "function") {
      play
        .then(() => setMusicState(true))
        .catch(() => setMusicState(false));
    }
  }

  function toggleMusic() {
    if (!music) return;
    if (musicOn) {
      music.pause();
      setMusicState(false);
    } else {
      music
        .play()
        .then(() => setMusicState(true))
        .catch(() => setMusicState(false));
    }
  }

  function setMusicState(on) {
    musicOn = on;
    musicToggle.setAttribute("aria-pressed", on ? "true" : "false");
  }

  function buildEventDate(event) {
    const e = event || {};
    // 17.07.2027 11:40 Europe/Moscow ≈ UTC+3 → 08:40Z
    const iso = `${e.date || "2027-07-17"}T${(e.time || "11:40")}:00+03:00`;
    return new Date(iso);
  }

  function setupCountdown() {
    const nodes = {
      days: document.querySelector('[data-unit="days"]'),
      hours: document.querySelector('[data-unit="hours"]'),
      mins: document.querySelector('[data-unit="mins"]'),
      secs: document.querySelector('[data-unit="secs"]'),
    };

    function tick() {
      const now = Date.now();
      let diff = Math.max(0, eventDate.getTime() - now);
      const days = Math.floor(diff / 86400000);
      diff -= days * 86400000;
      const hours = Math.floor(diff / 3600000);
      diff -= hours * 3600000;
      const mins = Math.floor(diff / 60000);
      diff -= mins * 60000;
      const secs = Math.floor(diff / 1000);

      nodes.days.textContent = String(days);
      nodes.hours.textContent = String(hours).padStart(2, "0");
      nodes.mins.textContent = String(mins).padStart(2, "0");
      nodes.secs.textContent = String(secs).padStart(2, "0");
    }

    tick();
    setInterval(tick, 1000);
  }

  function setupCalendarLink() {
    if (!calLink) return;
    const start = eventDate;
    const end = new Date(start.getTime() + 8 * 3600000);
    const title = `${cfg.couple?.he || "Никита"} & ${cfg.couple?.she || "Маргарита"} — свадьба`;
    const location = [
      cfg.event?.place,
      cfg.event?.address,
      cfg.event?.city,
    ]
      .filter(Boolean)
      .join(", ");

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Wedding Invite//RU",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `DTSTART:${formatIcs(start)}`,
      `DTEND:${formatIcs(end)}`,
      `SUMMARY:${escapeIcs(title)}`,
      `LOCATION:${escapeIcs(location)}`,
      `DESCRIPTION:${escapeIcs("Приглашение на свадьбу")}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    calLink.href = URL.createObjectURL(blob);
  }

  function setupMiniCalendar() {
    const root = document.getElementById("miniCalDays");
    if (!root) return;

    const year = eventDate.getFullYear();
    const month = eventDate.getMonth();
    const weddingDay = eventDate.getDate();
    const first = new Date(year, month, 1);
    // Monday-first: JS Sunday=0 → convert
    let startPad = first.getDay() - 1;
    if (startPad < 0) startPad = 6;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const heartSvg =
      '<span class="mini-cal__heart" aria-hidden="true"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 21s-6.7-4.35-9.33-7.4C.8 11.4.5 8.6 2.1 6.7 3.5 5 5.9 4.6 7.7 5.8c.6.4 1.1.9 1.4 1.5.3-.6.8-1.1 1.4-1.5 1.8-1.2 4.2-.8 5.6.9 1.6 1.9 1.3 4.7-.57 6.9C18.7 16.65 12 21 12 21z"/></svg></span>';

    let html = "";
    for (let i = 0; i < startPad; i++) {
      html += '<div class="mini-cal__day mini-cal__day--empty"></div>';
    }
    for (let d = 1; d <= daysInMonth; d++) {
      if (d === weddingDay) {
        html += `<div class="mini-cal__day mini-cal__day--wedding" aria-label="День свадьбы, ${d}"><span>${d}</span>${heartSvg}</div>`;
      } else {
        html += `<div class="mini-cal__day"><span>${d}</span></div>`;
      }
    }
    root.innerHTML = html;
  }

  function setupWaveTimetable() {
    const wrap = document.getElementById("waveTt");
    const svg = document.getElementById("waveSvg");
    const spine = document.getElementById("waveSpine");
    const trail = document.getElementById("waveTrail");
    const heart = document.getElementById("waveHeart");
    if (!wrap || !svg || !spine || !trail || !heart) return null;

    const items = Array.from(wrap.querySelectorAll(".wave-tt__item"));
    let pathLen = 0;
    let raf = 0;

    function localPoint(el) {
      const wrapRect = wrap.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - wrapRect.left,
        y: r.top + r.height / 2 - wrapRect.top,
      };
    }

    function buildPath() {
      const anchors = items
        .map((item) => item.querySelector(".wave-tt__anchor"))
        .filter(Boolean);
      if (anchors.length < 2) return;

      const pts = anchors.map(localPoint);
      const h = wrap.scrollHeight;
      const w = wrap.clientWidth;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      svg.setAttribute("width", String(w));
      svg.setAttribute("height", String(h));

      // Soft S-curve through anchors (more winding)
      let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
      for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1];
        const curr = pts[i];
        const dy = curr.y - prev.y;
        const c1x = prev.x;
        const c1y = prev.y + dy * 0.45;
        const c2x = curr.x;
        const c2y = curr.y - dy * 0.45;
        d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
      }

      spine.setAttribute("d", d);
      trail.setAttribute("d", d);
      pathLen = spine.getTotalLength();
      if (pathLen > 0) {
        const dash = `${pathLen.toFixed(2)} ${pathLen.toFixed(2)}`;
        trail.setAttribute("stroke-dasharray", dash);
        trail.setAttribute("stroke-dashoffset", String(pathLen));
        spine.setAttribute("stroke-dasharray", "none");
      }
      wrap.classList.add("is-ready");
      update();
    }

    function lengthAtY(y) {
      if (!pathLen) return 0;
      const start = spine.getPointAtLength(0);
      const end = spine.getPointAtLength(pathLen);
      if (y <= start.y) return 0;
      if (y >= end.y) return pathLen;

      let lo = 0;
      let hi = pathLen;
      for (let i = 0; i < 24; i++) {
        const mid = (lo + hi) / 2;
        const p = spine.getPointAtLength(mid);
        if (p.y < y) lo = mid;
        else hi = mid;
      }
      return (lo + hi) / 2;
    }

    function update() {
      if (!pathLen) return;
      const wrapRect = wrap.getBoundingClientRect();
      const focusY = window.innerHeight * 0.48 - wrapRect.top;
      const len = lengthAtY(focusY);
      const pt = spine.getPointAtLength(len);

      heart.style.transform = `translate(${pt.x.toFixed(1)}px, ${pt.y.toFixed(1)}px)`;
      trail.setAttribute("stroke-dashoffset", String(Math.max(0, pathLen - len)));

      items.forEach((item) => {
        const anchor = item.querySelector(".wave-tt__anchor");
        if (!anchor) return;
        const p = localPoint(anchor);
        if (pt.y + 24 >= p.y) item.classList.add("is-visible");
      });
    }

    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    }

    buildPath();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      buildPath();
    });

    // fonts / images can shift layout
    setTimeout(buildPath, 120);
    setTimeout(buildPath, 500);

    return { rebuild: buildPath, update };
  }

  function formatIcs(date) {
    return date
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  }

  function escapeIcs(value) {
    return String(value || "")
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\n/g, "\\n");
  }

  function setupRevealObserver() {
    const items = document.querySelectorAll(".animate-in");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
    );

    items.forEach((el) => {
      if (!el.closest(".hero")) io.observe(el);
    });
  }

  function collectChecked(name) {
    return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`))
      .map((el) => el.value)
      .join(", ");
  }

  async function onSubmit(e) {
    e.preventDefault();
    formNote.hidden = true;
    formSuccess.hidden = true;

    if (!form.reportValidity()) return;

    const payload = {
      access_key: cfg.web3formsKey,
      subject: `RSVP: ${form.guestName.value.trim()} — ${cfg.couple?.he} & ${cfg.couple?.she}`,
      from_name: form.guestName.value.trim(),
      name: form.guestName.value.trim(),
      phone: form.guestPhone.value.trim(),
      attendance: form.attendance.value,
      transfer: collectChecked("transfer"),
      food: collectChecked("food"),
      alcohol: collectChecked("alcohol"),
      comment: form.guestComment.value.trim(),
      wedding: `${cfg.couple?.he} & ${cfg.couple?.she} — ${cfg.event?.date}`,
    };

    const key = String(cfg.web3formsKey || "");
    const customEndpoint = String(cfg.formEndpoint || "").trim();
    const isPlaceholder = !key || key.includes("YOUR_WEB3FORMS");

    if (isPlaceholder && !customEndpoint) {
      formNote.hidden = false;
      formNote.textContent =
        "Укажите web3formsKey в js/config.js (бесплатный ключ на web3forms.com), затем ответы начнут приходить на email.";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Отправка…";

    try {
      let ok = false;

      if (customEndpoint) {
        const res = await fetch(customEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });
        ok = res.ok;
      } else {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        ok = res.ok && data.success !== false;
      }

      if (!ok) throw new Error("submit failed");

      form.reset();
      formSuccess.hidden = false;
    } catch (err) {
      formNote.hidden = false;
      formNote.textContent =
        "Не удалось отправить. Проверьте ключ в config.js и интернет, затем попробуйте ещё раз.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Отправить ответ";
    }
  }
})();
