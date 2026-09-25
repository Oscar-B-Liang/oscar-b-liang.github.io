# Boyuan Liang — Personal Website

Static site (no build step). Style inspired by https://yifan-hou.github.io/.

## Structure

- `index.html` — home page (About + Active / Previous Research Projects sections)
- `css/style.css` — site styling
- `js/main.js` — loads `data/projects.json` and `data/previous_projects.json` and renders the research project sections
- `data/projects.json` — edit this to add your active research projects (see format below)
- `data/previous_projects.json` — edit this to add your previous research projects (same format)
- `files/cv.pdf` — your CV, linked from the "CV" nav link (currently a placeholder)
- `images/profile.png` — your profile photo

## Things left as placeholders to fill in

- **Self introduction**: edit the `<p class="bio">` paragraph in `index.html` (under the `About` section).
- **Title / affiliation**: edit the `<p class="tagline">` line in `index.html`.
- **Google Scholar / LinkedIn links**: in `index.html`, replace the two `href="#"` values in the `.social-buttons` block with your real profile URLs.
- **Research projects**: edit `data/projects.json`. Each entry looks like:

```json
{
  "title": "Project Title",
  "period": "2024 -- Present",
  "description": "One or two sentence summary.",
  "image": "images/your-image.jpg",
  "link": "https://link-to-paper-or-project.com",
  "tags": ["Robotics", "RL"]
}
```

`image` and `link` can be left as empty strings if you don't have one yet.

- **CV**: replace `files/cv.pdf` with your real CV (keep the same filename).

## Previewing locally

Opening `index.html` directly by double-clicking may block the `fetch()` call that loads `projects.json` (browser CORS restriction on `file://`). Instead, serve the folder locally, e.g.:

```
python -m http.server 8000
```

then visit `http://localhost:8000`. This isn't an issue once hosted on GitHub Pages or any real web server.

## Deploying to GitHub Pages

1. Create a GitHub repo and push this folder to it.
2. In repo Settings → Pages, set the source to the `main` branch, root folder (`/`).
3. Your site will be live at `https://<username>.github.io/<repo>/` (or `https://<username>.github.io/` if the repo is named `<username>.github.io`).

Notes:
- A `.nojekyll` file is included so GitHub Pages serves the files as-is instead of running them through Jekyll (not needed for this plain static site, and avoids surprises from Jekyll's default processing).
- GitHub Pages' servers are case-sensitive (unlike Windows). All file/folder names here are lowercase and match their references exactly — keep it that way if you rename or add files.
- All asset paths (CSS, JS, images, `data/*.json`, `files/cv.pdf`) are relative, so the site works whether it's served at the domain root or under a `/<repo>/` subpath.
