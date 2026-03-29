(function () {
  const THEME_KEY = "box125-theme";
  const darkMQ = window.matchMedia("(prefers-color-scheme: dark)");

  const savedTheme = localStorage.getItem(THEME_KEY);
  const initialTheme =
    savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : darkMQ.matches
        ? "dark"
        : "light";

  document.body.classList.toggle("theme-dark", initialTheme === "dark");

  const nav = document.querySelector(".nav");
  let themeToggle = null;
  let mobileThemeToggle = null;

  const updateToggleLabels = (dark) => {
    const label = dark ? "Светлая тема" : "Тёмная тема";
    if (themeToggle) {
      themeToggle.textContent = label;
      themeToggle.setAttribute("aria-pressed", String(dark));
    }
    if (mobileThemeToggle) {
      mobileThemeToggle.textContent = label;
    }
  };

  const applyTheme = (theme, saveToStorage = true) => {
    const dark = theme === "dark";
    document.body.classList.toggle("theme-dark", dark);
    if (saveToStorage) {
      localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
    }
    updateToggleLabels(dark);
  };

  /* Реагируем на изменение темы ОС (день/ночь) в реальном времени */
  darkMQ.addEventListener("change", (e) => {
    const userOverride = localStorage.getItem(THEME_KEY);
    if (!userOverride) {
      applyTheme(e.matches ? "dark" : "light", false);
    }
  });

  if (nav) {
    themeToggle = document.createElement("button");
    themeToggle.type = "button";
    themeToggle.className = "theme-toggle";
    themeToggle.addEventListener("click", () => {
      applyTheme(document.body.classList.contains("theme-dark") ? "light" : "dark");
    });
    nav.appendChild(themeToggle);
    applyTheme(document.body.classList.contains("theme-dark") ? "dark" : "light", !!savedTheme);
  }

  const buildMobileNav = () => {
    if (!nav || document.querySelector(".mobile-nav")) return;

    const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    const links = Array.from(nav.querySelectorAll("nav a[href]"));

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "mobile-menu-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "mobile-nav");
    toggle.textContent = "Меню";
    nav.appendChild(toggle);

    const backdrop = document.createElement("div");
    backdrop.className = "mobile-nav-backdrop";

    const mobile = document.createElement("aside");
    mobile.className = "mobile-nav";
    mobile.id = "mobile-nav";

    const header = document.createElement("div");
    header.className = "mobile-nav-header";
    header.innerHTML = '<div class="mobile-nav-title">Меню</div>';
    const close = document.createElement("button");
    close.type = "button";
    close.className = "mobile-nav-close";
    close.setAttribute("aria-label", "Закрыть меню");
    close.textContent = "×";
    header.appendChild(close);

    mobile.appendChild(header);

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || !href.endsWith(".html")) return;
      const item = document.createElement("a");
      item.className = "mobile-nav-link";
      item.href = href;
      item.textContent = (link.textContent || "").trim();
      if (href.toLowerCase() === page || (page === "" && href === "index.html")) {
        item.classList.add("active");
      }
      mobile.appendChild(item);
      item.addEventListener("click", () => {
        document.body.classList.remove("mobile-nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    /* Кнопка темы в мобильном меню */
    mobileThemeToggle = document.createElement("button");
    mobileThemeToggle.type = "button";
    mobileThemeToggle.className = "mobile-theme-toggle";
    mobileThemeToggle.textContent = document.body.classList.contains("theme-dark") ? "Светлая тема" : "Тёмная тема";
    mobileThemeToggle.addEventListener("click", () => {
      applyTheme(document.body.classList.contains("theme-dark") ? "light" : "dark");
    });
    mobile.appendChild(mobileThemeToggle);

    document.body.appendChild(backdrop);
    document.body.appendChild(mobile);

    const openMenu = () => {
      document.body.classList.add("mobile-nav-open");
      toggle.setAttribute("aria-expanded", "true");
    };

    const closeMenu = () => {
      document.body.classList.remove("mobile-nav-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      document.body.classList.contains("mobile-nav-open") ? closeMenu() : openMenu();
    });

    close.addEventListener("click", closeMenu);
    backdrop.addEventListener("click", closeMenu);
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) closeMenu();
    });
  };

  buildMobileNav();

  const buildQuickContactDock = () => {
    if (document.querySelector(".quick-contact-fab")) return;

    const fab = document.createElement("button");
    fab.type = "button";
    fab.className = "quick-contact-fab";
    fab.textContent = "Контакты";
    fab.setAttribute("aria-expanded", "false");

    const panel = document.createElement("aside");
    panel.className = "quick-contact-panel";
    panel.innerHTML = `
      <div class="quick-contact-panel-title">Бокс 125</div>
      <a class="quick-contact-panel-link" href="tel:+79940057901">Телефон: +7 994 005 79 01</a>
      <a class="quick-contact-panel-link" href="https://t.me/Welika_00" target="_blank" rel="noopener noreferrer">Телеграм: @Welika_00</a>
      <a class="quick-contact-panel-link" href="mailto:box125@gmail.com">Почта: box125@gmail.com</a>
      <a class="quick-contact-panel-link" href="contact.html">Адрес: г. Владивосток, ул. Луговая, д. 74</a>
      <a class="quick-contact-panel-link" href="work.html">Услуги и цены</a>
    `;

    const backdrop = document.createElement("div");
    backdrop.className = "quick-contact-backdrop";

    const closeDock = () => {
      document.body.classList.remove("quick-contact-open");
      fab.setAttribute("aria-expanded", "false");
    };

    const openDock = () => {
      document.body.classList.add("quick-contact-open");
      fab.setAttribute("aria-expanded", "true");
    };

    fab.addEventListener("click", () => {
      document.body.classList.contains("quick-contact-open") ? closeDock() : openDock();
    });
    backdrop.addEventListener("click", closeDock);
    panel.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeDock));

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeDock();
    });

    document.body.appendChild(backdrop);
    document.body.appendChild(panel);
    document.body.appendChild(fab);
  };

  buildQuickContactDock();

  const PHONE_WA = "79940057901";
  const TG_USER = "Welika_00";

  const bookingForms = Array.from(document.querySelectorAll("[data-booking-form]"));

  bookingForms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const fd = new FormData(form);
      const name = String(fd.get("name") || "").trim();
      const phone = String(fd.get("phone") || "").trim();
      const service = String(fd.get("service") || "").trim();
      const date = String(fd.get("date") || "").trim();
      const comment = String(fd.get("comment") || "").trim();

      if (!name || !phone) {
        const firstEmpty = form.querySelector("input[name='name']") || form.querySelector("input[name='phone']");
        if (firstEmpty) firstEmpty.focus();
        return;
      }

      const msgLines = [
        `Заявка с сайта Бокс 125`,
        `Имя: ${name}`,
        `Телефон: ${phone}`,
        `Услуга: ${service || "Не указана"}`,
        `Дата: ${date || "Не указана"}`,
        comment ? `Комментарий: ${comment}` : ""
      ].filter(Boolean).join("\n");

      const submitter = event.submitter;
      const target = (submitter && submitter.value) || "whatsapp";

      let url;
      if (target === "telegram") {
        url = `https://t.me/${TG_USER}?text=${encodeURIComponent(msgLines)}`;
      } else {
        url = `https://wa.me/${PHONE_WA}?text=${encodeURIComponent(msgLines)}`;
      }

      window.open(url, "_blank", "noopener,noreferrer");
    });
  });

  const showPhoneBtn = document.getElementById("show-phone");
  const phoneLink = document.getElementById("phone-link");
  if (showPhoneBtn && phoneLink) {
    showPhoneBtn.addEventListener("click", () => {
      phoneLink.hidden = false;
      showPhoneBtn.hidden = true;
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view");
        });
      },
      { threshold: 0.12 }
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("in-view"));
  }

  window.addEventListener("load", () => {
    document.body.classList.add("page-ready");
  });

  /* ── Cookie banner ── */
  const COOKIE_KEY = "box125-cookies-ok";
  const cookieBanner = document.getElementById("cookie-banner");
  const cookieAccept = document.getElementById("cookie-accept");

  if (cookieBanner && !localStorage.getItem(COOKIE_KEY)) {
    cookieBanner.style.display = "flex";
  }

  if (cookieAccept) {
    cookieAccept.addEventListener("click", () => {
      localStorage.setItem(COOKIE_KEY, "1");
      cookieBanner.style.display = "none";
    });
  }

})();
