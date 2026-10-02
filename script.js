const timeline = document.querySelector('#timeline');
const template = document.querySelector('#entry-template');
const yearSidebar = document.querySelector('#year-sidebar');
const search = document.querySelector('#search');
const filters = document.querySelector('#filters');
const groups = [
  ['all', 'すべて', []], ['game', 'ゲーム', ['Game']],
  ['screen', '映画・アニメ', ['Movie', 'Anime', 'TV']],
  ['music', '音楽・ラジオ', ['Music', 'Podcast']],
  ['book', '本・マンガ', ['Book', 'Manga', 'Magazine']],
  ['life', '暮らし・その他', ['Fashion', 'Food', 'Fragrance', 'Hobby', 'Tech', 'Web', 'Memory']]
];
let entries = [];
let selected = 'all';
let observer;
const getAmazonImageUrl = (url) => {
  const match = url?.match(/(?:amazon\.[^/]+\/(?:dp|gp\/product)\/|amzn\.[^/]+\/)([A-Z0-9]{10})/i);
  return match ? `https://images-na.ssl-images-amazon.com/images/P/${match[1].toUpperCase()}.01.MZZZZZZZ.jpg` : null;
};
const safeLink = (value) => {
  try { const url = new URL(value, location.href); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; } catch { return null; }
};
const buildEntry = (entry) => {
  const node = template.content.cloneNode(true);
  const date = new Date(`${entry.date}T00:00:00`);
  node.querySelector('.date-day').textContent = String(date.getDate()).padStart(2, '0');
  node.querySelector('.date-month').textContent = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  node.querySelector('.date-year').textContent = date.getFullYear();
  node.querySelector('.tag').textContent = entry.tag || 'Memory';
  node.querySelector('.title').textContent = entry.title;
  node.querySelector('.memory').textContent = entry.memory;
  const copy = node.querySelector('.card-copy');
  if (entry.link && safeLink(entry.link)) {
    const link = document.createElement('a');
    link.className = 'entry-link'; link.href = safeLink(entry.link);
    link.target = '_blank'; link.rel = 'noopener noreferrer';
    link.textContent = '作品について読む ↗'; copy.append(link);
  }
  const media = node.querySelector('.media');
  const fallback = () => {
    media.replaceChildren(); media.classList.add('is-empty');
    media.append(document.createTextNode(entry.date.slice(0, 4)));
    const label = document.createElement('span'); label.textContent = entry.tag || 'MEMORY'; media.append(label);
  };
  const source = entry.image || getAmazonImageUrl(entry.link);
  if (source) {
    const img = document.createElement('img'); img.src = source; img.alt = entry.title;
    img.loading = 'lazy'; img.decoding = 'async'; img.addEventListener('error', fallback, { once: true }); media.append(img);
  } else fallback();
  return node;
};
const render = () => {
  observer?.disconnect();
  const query = search.value.trim().toLocaleLowerCase();
  const tags = groups.find(group => group[0] === selected)[2];
  const shown = entries.filter(entry => (!tags.length || tags.includes(entry.tag || 'Memory')) && `${entry.title} ${entry.memory} ${entry.tag || ''}`.toLocaleLowerCase().includes(query));
  document.querySelector('#result-count').textContent = `${entries.length}件の思い出のうち、${shown.length}件を表示`;
  timeline.replaceChildren(); yearSidebar.replaceChildren();
  if (!shown.length) {
    const empty = document.createElement('p'); empty.className = 'empty-state'; empty.textContent = '思い出が見つかりませんでした。別の言葉やジャンルで探してみてください。'; timeline.append(empty); return;
  }
  const fragment = document.createDocumentFragment();
  const nav = document.createElement('div'); nav.className = 'year-nav';
  const label = document.createElement('p'); label.textContent = 'YEARS'; nav.append(label);
  let year = null;
  const anchors = [];
  shown.forEach(entry => {
    const nextYear = entry.date.slice(0, 4);
    if (year !== nextYear) {
      year = nextYear;
      const heading = document.createElement('h2'); heading.className = 'year-anchor'; heading.id = `year-${year}`; heading.dataset.year = year; heading.tabIndex = -1; heading.textContent = year;
      const caption = document.createElement('span'); caption.textContent = `${year.slice(0, 3)}0s / ARCHIVE`; heading.append(caption); fragment.append(heading); anchors.push(heading);
      const link = document.createElement('a'); link.href = `#year-${year}`; link.textContent = year; link.dataset.year = year;
      link.addEventListener('click', () => { heading.focus({ preventScroll: true }); }); nav.append(link);
    }
    fragment.append(buildEntry(entry));
  });
  timeline.append(fragment); yearSidebar.append(nav);
  const links = [...nav.querySelectorAll('a')];
  const activate = (year) => links.forEach(link => {
    const active = link.dataset.year === year; link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
  });
  activate(anchors[0].dataset.year);
  observer = new IntersectionObserver(changes => {
    const visible = changes.filter(change => change.isIntersecting);
    if (visible.length) activate(visible[visible.length - 1].target.dataset.year);
  }, { rootMargin: '-10% 0px -55% 0px' });
  anchors.forEach(anchor => observer.observe(anchor));
};
groups.forEach(([key, label]) => {
  const button = document.createElement('button'); button.type = 'button'; button.className = 'filter'; button.textContent = label; button.setAttribute('aria-pressed', String(key === selected));
  button.addEventListener('click', () => { selected = key; [...filters.children].forEach(item => item.setAttribute('aria-pressed', String(item === button))); render(); }); filters.append(button);
});
search.addEventListener('input', render);
fetch('data.json').then(response => { if (!response.ok) throw new Error('load'); return response.json(); }).then(data => {
  entries = data;
  document.querySelector('#entry-count').textContent = `${entries.length} MEMORIES`;
  if (entries.length) document.querySelector('#archive-range').textContent = `${entries[0].date.slice(0, 4)} — ${entries[entries.length - 1].date.slice(0, 4)}`;
  render();
  if (/^#year-\d{4}$/.test(location.hash)) document.querySelector(location.hash)?.scrollIntoView();
}).catch(() => {
  timeline.textContent = '思い出を読み込めませんでした。時間をおいて再読み込みしてください。';
  document.querySelector('#result-count').textContent = '読み込みに失敗しました';
});
