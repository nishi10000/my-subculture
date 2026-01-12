const timeline = document.querySelector("#timeline");
const template = document.querySelector("#entry-template");

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

  const media = node.querySelector(".media");
  if (entry.image) {
    const img = document.createElement("img");
    img.src = entry.image;
    img.alt = entry.title;
    img.loading = "lazy";
    media.appendChild(img);
  }

  return node;
};

fetch("data.json")
  .then((response) => response.json())
  .then((entries) => {
    entries.forEach((entry) => {
      timeline.appendChild(buildEntry(entry));
    });
  })
  .catch(() => {
    timeline.innerHTML =
      "<p>データの読み込みに失敗しました。`data.json` を確認してください。</p>";
  });
