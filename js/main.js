document.getElementById('year').textContent = new Date().getFullYear();

async function loadProjects(url, containerId) {
  const container = document.getElementById(containerId);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    const projects = await res.json();

    if (!Array.isArray(projects) || projects.length === 0) {
      container.innerHTML = '<p class="placeholder-note">Research projects coming soon.</p>';
      return;
    }

    container.innerHTML = projects.map(renderProjectCard).join('');
  } catch (err) {
    container.innerHTML =
      '<p class="placeholder-note">Could not load research projects. ' +
      'If you are viewing this file locally, run a local server ' +
      '(e.g. <code>python -m http.server</code>) instead of opening index.html directly.</p>';
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

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

loadProjects('data/projects.json', 'projects-container');
loadProjects('data/previous_projects.json', 'previous-projects-container');
