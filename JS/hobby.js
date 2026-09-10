(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const links = [...document.querySelectorAll(".hz-toc a[data-toc], .hz-toc-panel a[data-toc]")];
  const sections = [
    ...new Map(
      links
        .map((link) => [link.dataset.toc, document.getElementById(link.dataset.toc)])
        .filter(([, el]) => el)
    ).values(),
  ];

  const setActive = (id) => {
    links.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.toc === id);
    });
  };

  if (links.length && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.08, 0.2, 0.4],
      }
    );

    sections.forEach((section) => observer.observe(section));

    if (location.hash) {
      const id = location.hash.slice(1);
      if (document.getElementById(id)) setActive(id);
    } else {
      setActive(sections[0].id);
    }
  }

  const toggle = document.querySelector(".hz-toc-toggle");
  const panel = document.getElementById("hz-toc-panel");
  const closeBtn = document.querySelector(".hz-toc-close");

  const openPanel = () => {
    if (!panel || !toggle) return;
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("hz-toc-open");
  };

  const closePanel = () => {
    if (!panel || !toggle) return;
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("hz-toc-open");
  };

  toggle?.addEventListener("click", () => {
    if (panel?.hidden) openPanel();
    else closePanel();
  });

  closeBtn?.addEventListener("click", closePanel);

  panel?.querySelectorAll("a[data-toc]").forEach((link) => {
    link.addEventListener("click", () => {
      setActive(link.dataset.toc);
      closePanel();
    });
  });

  document.querySelectorAll(".hz-toc a[data-toc]").forEach((link) => {
    link.addEventListener("click", () => setActive(link.dataset.toc));
  });
})();
