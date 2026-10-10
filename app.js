(async function () {
  // Dot colors, as on GitHub. Unlisted languages get a gray dot.
  const LANGUAGE_COLORS = {
    JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572a5', HTML: '#e34c26',
    CSS: '#663399', Svelte: '#ff3e00', Rust: '#dea584', Go: '#00add8', Java: '#b07219',
    'C++': '#f34b7d', C: '#555555', 'C#': '#178600', Lua: '#000080', GLSL: '#5686a5', GDScript: '#355570',
  };

  const status = document.getElementById('status');

  let config;
  try {
    const res = await fetch('projects.yaml', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    config = jsyaml.load(await res.text());
  } catch (err) {
    status.textContent = `Could not load projects.yaml: ${err.message}`;
    status.classList.add('error');
    return;
  }

  const site = config.site || {};
  if (site.title) {
    document.title = site.title;
    document.getElementById('site-title').textContent = site.title;
  }
  document.getElementById('site-tagline').textContent = site.tagline || '';
  if (site.github) document.getElementById('site-github').href = site.github;

  const template = document.getElementById('card-template');
  const projects = (config.projects || []).filter((p) => p && !p.hidden);

  for (const p of projects) {
    const card = template.content.firstElementChild.cloneNode(true);
    const hero = card.querySelector('.hero');
    const img = hero.querySelector('img');

    hero.href = p.url || p.repo;
    if (p.image) {
      img.src = p.image;
      img.alt = p.title;
      if (p.image_fit === 'contain') img.classList.add('contain');
      if (p.image_bg) hero.style.background = p.image_bg;
      img.addEventListener('error', () => setPlaceholder(hero, p.title));
    } else {
      setPlaceholder(hero, p.title);
    }

    card.querySelector('.title').textContent = p.title;
    card.querySelector('.description').textContent = (p.description || '').trim();

    const tags = card.querySelector('.tags');
    for (const t of p.tags || []) {
      const li = document.createElement('li');
      li.textContent = t;
      tags.appendChild(li);
    }

    const langs = card.querySelector('.langs');
    for (const name of p.languages || []) {
      const li = document.createElement('li');
      li.textContent = name;
      li.style.setProperty('--dot', LANGUAGE_COLORS[name] || '#8b8b96');
      langs.appendChild(li);
    }
    if (!langs.children.length) langs.remove();

    const open = card.querySelector('.open');
    const repo = card.querySelector('.repo');
    if (p.url) {
      open.href = p.url;
      if (p.repo) repo.href = p.repo;
      else repo.remove();
    } else {
      // Repo-only project: the primary button goes to GitHub.
      open.href = p.repo;
      open.textContent = 'View on GitHub ▸';
      repo.remove();
    }
    const note = p.hosted_on ? `hosted on ${p.hosted_on}` : p.url ? '' : 'source only, run locally';
    card.querySelector('.hosted').textContent = note;

    if (p.featured) {
      card.classList.add('featured');
      document.getElementById('featured').appendChild(card);
    } else if (p.section) {
      sectionGrid(p.section).appendChild(card);
    } else {
      document.getElementById('grid').appendChild(card);
    }
  }

  status.remove();

  // Named sections appear below the main grid, in order of first use.
  function sectionGrid(name) {
    const sections = document.getElementById('sections');
    for (const sec of sections.children) {
      if (sec.dataset.name === name) return sec.querySelector('.grid');
    }
    const sec = document.createElement('section');
    sec.className = 'section';
    sec.dataset.name = name;
    const h = document.createElement('h2');
    h.className = 'section-title';
    h.textContent = name;
    const grid = document.createElement('div');
    grid.className = 'grid';
    sec.append(h, grid);
    sections.appendChild(sec);
    return grid;
  }

  function setPlaceholder(hero, title) {
    hero.innerHTML = '';
    hero.classList.add('placeholder');
    hero.textContent = (title || '?').trim().charAt(0).toUpperCase();
  }
})();
