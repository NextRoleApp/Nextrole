requestAnimationFrame(() => document.body.classList.add("loaded"));

const progress = document.getElementById("progress");
if (progress) {
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");
if (toggle && links) {
  const setOpen = (open) => {
    links.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.textContent = open ? "Close" : "Menu";
  };
  toggle.addEventListener("click", () => setOpen(!links.classList.contains("open")));
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const tocLinks = [...document.querySelectorAll(".toc a")];
if (tocLinks.length) {
  const byId = new Map(tocLinks.map((a) => [a.getAttribute("href").slice(1), a]));
  const setActive = (id) => {
    tocLinks.forEach((a) => a.classList.toggle("active", a === byId.get(id)));
    const active = byId.get(id);
    if (active && window.matchMedia("(max-width: 960px)").matches) {
      active.scrollIntoView({ block: "nearest", inline: "center" });
    }
  };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: "-25% 0px -65% 0px" });
  byId.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) sectionObserver.observe(section);
  });
}

const search = document.getElementById("faqSearch");
if (search) {
  const items = [...document.querySelectorAll(".faq-group details")];
  const groups = [...document.querySelectorAll(".faq-group")];
  const empty = document.getElementById("faqEmpty");
  search.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    items.forEach((item) => {
      const match = !q || item.textContent.toLowerCase().includes(q);
      item.hidden = !match;
      if (match) shown++;
      if (q && match && shown === 1) item.open = true;
    });
    groups.forEach((group) => {
      group.hidden = ![...group.querySelectorAll("details")].some((d) => !d.hidden);
    });
    empty.classList.toggle("show", shown === 0);
  });
}
