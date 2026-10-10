(async function () {
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
    } else {
      document.getElementById('grid').appendChild(card);
    }
  }

  status.remove();

  function setPlaceholder(hero, title) {
    hero.innerHTML = '';
    hero.classList.add('placeholder');
    hero.textContent = (title || '?').trim().charAt(0).toUpperCase();
  }
})();
