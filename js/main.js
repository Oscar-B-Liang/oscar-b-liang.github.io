document.getElementById('year').textContent = new Date().getFullYear();

const MY_NAME = 'Boyuan Liang';

async function loadList(url, containerId, render, noun) {
  const container = document.getElementById(containerId);
  if (!container) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    const items = await res.json();

    if (!Array.isArray(items) || items.length === 0) {
      container.innerHTML = `<p class="placeholder-note">${noun} coming soon.</p>`;
      return;
    }

    container.innerHTML = render(items);
  } catch (err) {
    container.innerHTML =
      `<p class="placeholder-note">Could not load ${noun.toLowerCase()}. ` +
      'If you are viewing this file locally, run a local server ' +
      '(e.g. <code>python -m http.server</code>) instead of opening the HTML file directly.</p>';
    console.error(err);
  }
}

function renderProjectCard(project) {
  const title = escapeHtml(project.title || 'Untitled Project');
  const period = project.period ? `<p class="project-period">${escapeHtml(project.period)}</p>` : '';
  const description = project.description ? `<p class="project-description">${escapeHtml(project.description)}</p>` : '';
  const image = project.image || 'images/project-placeholder.svg';
  const tags = Array.isArray(project.tags) && project.tags.length
    ? `<div class="project-tags">${project.tags.map(t => `<span class="project-tag">${escapeHtml(t)}</span>`).join('')}</div>`
    : '';
  const link = project.link
    ? `<a class="project-link" href="${escapeHtml(project.link)}" target="_blank" rel="noopener">Learn more &rarr;</a>`
    : '';

  const imageTag = `<img src="${escapeHtml(image)}" alt="${title}" />`;
  const titleTag = `<h3 class="project-title">${title}</h3>`;

  const imageHtml = project.link
    ? `<a class="project-image-link" href="${escapeHtml(project.link)}" target="_blank" rel="noopener">${imageTag}</a>`
    : imageTag;
  const titleHtml = project.link
    ? `<a class="project-title-link" href="${escapeHtml(project.link)}" target="_blank" rel="noopener">${titleTag}</a>`
    : titleTag;

  return `
    <div class="project-card">
      ${imageHtml}
      <div class="project-card-body">
        ${titleHtml}
        ${period}
        ${description}
        ${tags}
        ${link}
      </div>
    </div>
  `;
}

// Groups publications by year (newest first), keeping the JSON order within a year.
function renderPublications(pubs) {
  const byYear = new Map();
  [...pubs]
    .sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0))
    .forEach(pub => {
      const year = pub.year || 'Other';
      if (!byYear.has(year)) byYear.set(year, []);
      byYear.get(year).push(pub);
    });

  return [...byYear].map(([year, items]) => `
    <div class="pub-year"><h2>${escapeHtml(year)}</h2></div>
    ${items.map(renderPublication).join('')}
  `).join('');
}

function renderPublication(pub) {
  const title = escapeHtml(pub.title || 'Untitled');
  const image = pub.image || 'images/project-placeholder.svg';

  const authors = pub.authors
    ? escapeHtml(pub.authors).split(MY_NAME).join(`<strong>${MY_NAME}</strong>`)
    : '<span class="pub-missing">Authors to be added</span>';
  const venue = pub.venue ? `<p class="pub-venue">${escapeHtml(pub.venue)}</p>` : '';

  // Links with an empty field in data/publications.json are left out entirely.
  const links = [
    pubLink('paper', pub.paper),
    pubLink('poster', pub.poster),
    pubLink('video', pub.video),
    pubLink('project website', pub.website),
    pub.abstract
      ? '<button type="button" class="pub-abstract-toggle" aria-expanded="false">abstract (+)</button>'
      : '',
  ].filter(Boolean).join(' / ');
  const linksHtml = links ? `<p class="pub-links">${links}</p>` : '';
  const abstract = pub.abstract ? `<p class="pub-abstract" hidden>${escapeHtml(pub.abstract)}</p>` : '';

  return `
    <div class="pub${pub.first_author ? ' pub-first-author' : ''}">
      <div class="pub-thumb">
        <img src="${escapeHtml(image)}" alt="${title}" loading="lazy" />
      </div>
      <div class="pub-content">
        <h3 class="pub-title">${title}</h3>
        <p class="pub-authors">${authors}</p>
        ${venue}
        ${linksHtml}
        ${abstract}
      </div>
    </div>
  `;
}

function pubLink(label, url) {
  return url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${label}</a>` : '';
}

document.addEventListener('click', e => {
  const toggle = e.target.closest('.pub-abstract-toggle');
  if (!toggle) return;
  const abstract = toggle.closest('.pub').querySelector('.pub-abstract');
  const opening = abstract.hidden;
  abstract.hidden = !opening;
  toggle.setAttribute('aria-expanded', String(opening));
  toggle.textContent = opening ? 'abstract (-)' : 'abstract (+)';
});

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML.replace(/"/g, '&quot;');
}

loadList('data/projects.json', 'projects-container', items => items.map(renderProjectCard).join(''), 'Research projects');
loadList('data/publications.json', 'publications-container', renderPublications, 'Publications');
