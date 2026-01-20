const timeline = document.querySelector("#timeline");
const template = document.querySelector("#entry-template");
const yearSidebar = document.querySelector("#year-sidebar");

const getAmazonImageUrl = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:amazon\.[^/]+\/(?:dp|gp\/product)\/|amzn\.[^/]+\/)([A-Z0-9]{10})/i
  );
  if (!match) return null;
  const asin = match[1].toUpperCase();
  return `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.MZZZZZZZ.jpg`;
};

const formatDateParts = (dateString) => {
  const date = new Date(`${dateString}T00:00:00`);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return { day, month, year };
};

const buildEntry = (entry) => {
  const node = template.content.cloneNode(true);
  const { day, month, year } = formatDateParts(entry.date);

  node.querySelector(".date-day").textContent = day;
  node.querySelector(".date-month").textContent = month;
  node.querySelector(".date-year").textContent = year;

  const tag = node.querySelector(".tag");
  tag.textContent = entry.tag || "Memory";

  node.querySelector(".title").textContent = entry.title;
  node.querySelector(".memory").textContent = entry.memory;

  const card = node.querySelector(".card");
  const media = node.querySelector(".media");
  if (entry.link) {
    const link = document.createElement("a");
    link.className = "entry-link";
    link.href = entry.link;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "公式サイト";
    card.insertBefore(link, media);
  }
  const imageSource = entry.image || getAmazonImageUrl(entry.link);
  if (imageSource) {
    const img = document.createElement("img");
    img.src = imageSource;
    img.alt = entry.title;
    img.loading = "lazy";
    media.appendChild(img);
  }

  return node;
};

const buildYearAnchor = (year) => {
  const heading = document.createElement("h2");
  heading.className = "year-anchor";
  heading.id = `year-${year}`;
  heading.dataset.year = String(year);
  heading.textContent = year;
  heading.tabIndex = -1;
  return heading;
};

const buildYearNav = (years) => {
  if (!yearSidebar) return;
  const nav = document.createElement("nav");
  nav.className = "year-nav";
  nav.setAttribute("aria-label", "年で移動");

  const list = document.createElement("ul");
  years.forEach((year) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#year-${year}`;
    link.textContent = year;
    link.dataset.year = String(year);
    item.appendChild(link);
    list.appendChild(item);
  });

  nav.appendChild(list);
  yearSidebar.innerHTML = "";
  yearSidebar.appendChild(nav);
};

const setupYearScrollSpy = (anchors) => {
  if (!anchors.length || !yearSidebar) return;
  const links = Array.from(yearSidebar.querySelectorAll("a"));
  const linkByYear = new Map(
    links.map((link) => [link.dataset.year, link])
  );

  const visibleAnchors = new Set();

  const setActiveYear = (year) => {
    links.forEach((link) => {
      link.classList.toggle("active", link.dataset.year === year);
    });
  };

  const updateActiveFromVisible = () => {
    if (!visibleAnchors.size) return;
    let best = null;
    let bestTop = Infinity;
    visibleAnchors.forEach((anchor) => {
      const top = anchor.getBoundingClientRect().top;
      if (top < bestTop) {
        bestTop = top;
        best = anchor;
      }
    });
    if (best) {
      setActiveYear(best.dataset.year);
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleAnchors.add(entry.target);
        } else {
          visibleAnchors.delete(entry.target);
        }
      });
      updateActiveFromVisible();
    },
    {
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    }
  );

  anchors.forEach((anchor) => observer.observe(anchor));
  setActiveYear(anchors[0].dataset.year);

  yearSidebar.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    target.focus({ preventScroll: true });
    setActiveYear(link.dataset.year);
  });

  yearSidebar.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const link = event.target.closest("a");
    if (link) {
      link.click();
    }
  });
};

fetch("data.json")
  .then((response) => response.json())
  .then((entries) => {
    const years = Array.from(
      new Set(entries.map((entry) => formatDateParts(entry.date).year))
    ).sort((a, b) => a - b);
    buildYearNav(years);

    let currentYear = null;
    const anchors = [];
    entries.forEach((entry) => {
      const entryYear = formatDateParts(entry.date).year;
      if (entryYear !== currentYear) {
        currentYear = entryYear;
        const anchor = buildYearAnchor(entryYear);
        anchors.push(anchor);
        timeline.appendChild(anchor);
      }
      timeline.appendChild(buildEntry(entry));
    });
    setupYearScrollSpy(anchors);
  })
  .catch(() => {
    timeline.innerHTML =
      "<p>データの読み込みに失敗しました。`data.json` を確認してください。</p>";
  });
