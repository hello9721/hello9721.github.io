(() => {
  const header = document.getElementById("site-header");
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("nav-toggle");
  const year = document.getElementById("year");
  const pageSnap = document.querySelector(".page-snap");
  const panels = Array.from(document.querySelectorAll(".snap-panel"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobileMq = window.matchMedia("(max-width: 900px)");
  const isMobileLayout = () => mobileMq.matches;
  const scrollRoot = () => (isMobileLayout() || !pageSnap ? window : pageSnap);

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  /* Sticky header state */
  const onScroll = () => {
    if (!header) return;
    const root = scrollRoot();
    const y = root === window ? window.scrollY : root.scrollTop;
    header.classList.toggle("is-scrolled", y > 24);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  pageSnap?.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile nav */
  const setNavOpen = (open) => {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    document.body.style.overflow = open ? "hidden" : "";
    if (!isMobileLayout() && pageSnap) {
      pageSnap.style.overflowY = open ? "hidden" : "";
    }
  };

  toggle?.addEventListener("click", () => {
    setNavOpen(!nav.classList.contains("is-open"));
  });

  const scrollToPanel = (id) => {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href") || "";
      if (href.startsWith("#")) {
        event.preventDefault();
        scrollToPanel(href.slice(1));
      }
      setNavOpen(false);
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    if (nav?.contains(link)) return;
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href") || "";
      const id = href.slice(1);
      if (!id || !document.getElementById(id)) return;
      event.preventDefault();
      scrollToPanel(id);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setNavOpen(false);
  });

  /* Inner scroll end → snap to next/prev panel (desktop snap layout only) */
  let snapLock = false;
  const WHEEL_THRESHOLD = 12; // smaller = easier snap
  let wheelAcc = 0;

  const unlockSnap = () => {
    window.setTimeout(() => {
      snapLock = false;
      wheelAcc = 0;
    }, reduceMotion ? 40 : 360);
  };

  panels.forEach((panel, index) => {
    const scroller = panel.querySelector(".snap-panel__scroll");
    if (!scroller) return;

    scroller.addEventListener(
      "wheel",
      (event) => {
        if (isMobileLayout()) return;

        if (snapLock) {
          event.preventDefault();
          return;
        }

        const maxScroll = Math.max(scroller.scrollHeight - scroller.clientHeight, 0);
        const atTop = scroller.scrollTop <= 2;
        const atBottom = maxScroll <= 0 || scroller.scrollTop >= maxScroll - 2;
        const goingDown = event.deltaY > 0;
        const goingUp = event.deltaY < 0;

        const canSnapDown = goingDown && atBottom && index < panels.length - 1;
        const canSnapUp = goingUp && atTop && index > 0;

        if (!canSnapDown && !canSnapUp) {
          wheelAcc = 0;
          return;
        }

        event.preventDefault();
        wheelAcc += event.deltaY;

        if (Math.abs(wheelAcc) < WHEEL_THRESHOLD) return;

        snapLock = true;
        wheelAcc = 0;
        const next = goingDown ? panels[index + 1] : panels[index - 1];
        next?.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
        unlockSnap();
      },
      { passive: false }
    );
  });

  /* Active section highlight */
  const sections = ["about", "skills", "projects", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const navLinks = Array.from(nav?.querySelectorAll('a[href^="#"]') || []);

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
  };

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      {
        root: isMobileLayout() ? null : pageSnap || null,
        rootMargin: "-40% 0px -50% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  if (location.hash.length > 1) {
    const id = location.hash.slice(1);
    requestAnimationFrame(() => scrollToPanel(id));
  }

  /* Logo ↔ GIF crossfade loop
     GIF has no ended event, so duration is parsed from the file (or data-gif-ms). */
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const readGifDurationMs = (buffer) => {
    const bytes = new Uint8Array(buffer);
    if (bytes.length < 6 || bytes[0] !== 0x47 || bytes[1] !== 0x49 || bytes[2] !== 0x46) {
      return null;
    }

    let i = 13;
    const packed = bytes[10];
    if (packed & 0x80) {
      i += 3 * (1 << ((packed & 7) + 1));
    }

    let total = 0;
    let frames = 0;

    while (i < bytes.length) {
      const marker = bytes[i++];
      if (marker === 0x3b) break;

      if (marker === 0x21) {
        const label = bytes[i++];
        if (label === 0xf9) {
          const blockSize = bytes[i++];
          if (blockSize >= 4 && i + 3 < bytes.length) {
            const delayCs = bytes[i] | (bytes[i + 1] << 8);
            total += (delayCs === 0 ? 10 : delayCs) * 10;
            frames += 1;
          }
          i += blockSize;
          while (i < bytes.length && bytes[i] !== 0) {
            i += bytes[i] + 1;
          }
          i += 1;
          continue;
        }

        if (label === 0xff || label === 0xfe || label === 0x01) {
          while (i < bytes.length && bytes[i] !== 0) {
            i += bytes[i] + 1;
          }
          i += 1;
          continue;
        }

        while (i < bytes.length && bytes[i] !== 0) {
          i += bytes[i] + 1;
        }
        i += 1;
        continue;
      }

      if (marker === 0x2c) {
        if (i + 9 >= bytes.length) break;
        const localPacked = bytes[i + 8];
        i += 9;
        if (localPacked & 0x80) {
          i += 3 * (1 << ((localPacked & 7) + 1));
        }
        i += 1;
        while (i < bytes.length && bytes[i] !== 0) {
          i += bytes[i] + 1;
        }
        i += 1;
        continue;
      }

      break;
    }

    if (!frames) return null;
    return Math.max(total, 1200);
  };

  const restartGif = (gif) =>
    new Promise((resolve) => {
      const src = gif.getAttribute("src");
      if (!src) {
        resolve();
        return;
      }

      const done = () => {
        gif.removeEventListener("load", done);
        gif.removeEventListener("error", done);
        resolve();
      };

      gif.addEventListener("load", done, { once: true });
      gif.addEventListener("error", done, { once: true });
      gif.src = `${src.split("?")[0]}?t=${Date.now()}`;
    });

  const crossfade = async (showEl, hideEl, fadeMs) => {
    showEl.classList.add("is-active");
    hideEl.classList.remove("is-active");
    await wait(fadeMs);
  };

  const initMediaSwap = async (root, motionOff) => {
    const logo = root.querySelector(".swap-logo");
    const gif = root.querySelector(".swap-gif");
    if (!logo || !gif) return;

    const logoMs = Number(root.dataset.logoMs || 2000);
    const fadeMs = Number(root.dataset.fadeMs || 800);
    let gifMs = Number(root.dataset.gifMs || 0);

    if (motionOff) {
      logo.classList.add("is-active");
      gif.classList.remove("is-active");
      return;
    }

    if (!gifMs) gifMs = 4000;

    let alive = true;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          alive = entry.isIntersecting;
        });
      },
      { threshold: 0.2 }
    );
    io.observe(root);

    logo.classList.add("is-active");
    gif.classList.remove("is-active");

    const loop = async () => {
      while (true) {
        if (!alive) {
          await wait(400);
          continue;
        }

        // Hold logo
        if (!logo.classList.contains("is-active")) {
          await crossfade(logo, gif, fadeMs);
        }
        await wait(logoMs);
        if (!alive) continue;

        // Prepare gif under the logo, then crossfade
        await restartGif(gif);
        if (!alive) continue;
        await crossfade(gif, logo, fadeMs);
        if (!alive) continue;

        // Play gif (duration minus fade overlap feels closer to one full play)
        await wait(Math.max(gifMs - fadeMs, 500));
        if (!alive) continue;

        // Crossfade back to logo
        await crossfade(logo, gif, fadeMs);
      }
    };

    loop();
  };

  document.querySelectorAll("[data-media-swap]").forEach((el) => {
    initMediaSwap(el, reduceMotion);
  });

  /* Scroll reveal — GPU friendly (opacity + transform) */
  const reveals = document.querySelectorAll("[data-reveal]");

  if (reduceMotion) {
    reveals.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    reveals.forEach((el) => revealObserver.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }
})();
