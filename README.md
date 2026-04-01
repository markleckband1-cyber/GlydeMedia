# Glyde Media

Website for [glydemedia.com](https://glydemedia.com)
Built with plain HTML, CSS, and JavaScript. Hosted on GitHub Pages.

---

## Full Site Map

```
1. Header / Nav
2. Intro Hero
3. Get to Know Glyde
4. Get to Know Mark
5. Video Portfolio
6. Web Design Portfolio   ✅ built
7. Call to Action         ✅ built
8. Location & Details
9. Footer
```

---

## Folder Structure

```
GlydeMedia/
├── index.html                       ← homepage (all sections assembled here)
├── README.md
└── assets/
    ├── css/
    │   ├── global.css               ← shared variables + reset, always load first
    │   ├── web-portfolio.css        ← ✅ built
    │   ├── cta.css                  ← ✅ built
    │   └── (header, intro, about-glyde, about-mark,
    │         video-portfolio, location, footer — add as built)
    ├── js/
    │   ├── web-portfolio.js         ← ✅ built
    │   └── (video-portfolio.js etc — add as built)
    ├── sections/
    │   ├── web-portfolio.html       ← ✅ built  ← YOUR WORKING FILE
    │   ├── cta.html                 ← ✅ built  ← YOUR WORKING FILE
    │   ├── header.html              ← not built yet
    │   ├── intro.html               ← not built yet
    │   ├── about-glyde.html         ← not built yet
    │   ├── about-mark.html          ← not built yet
    │   ├── video-portfolio.html     ← not built yet
    │   ├── location.html            ← not built yet
    │   └── footer.html              ← not built yet
    └── img/                         ← screenshots, headshots, logos
```

---

## Section Status

| # | Section              | Status        |
|---|----------------------|---------------|
| 1 | Header / Nav         | 🔲 Not built  |
| 2 | Intro Hero           | 🔲 Not built  |
| 3 | Get to Know Glyde    | 🔲 Not built  |
| 4 | Get to Know Mark     | 🔲 Not built  |
| 5 | Video Portfolio      | 🔲 Not built  |
| 6 | Web Design Portfolio | ✅ Built      |
| 7 | Call to Action       | ✅ Built      |
| 8 | Location & Details   | 🔲 Not built  |
| 9 | Footer               | 🔲 Not built  |

---

## How to work on a section with Claude

1. Open `assets/sections/web-portfolio.html` (or whichever section)
2. Copy the whole file
3. Paste it into a new Claude chat
4. Describe your changes
5. Replace the file with the updated code
6. Double-click `index.html` to preview

## Preview locally

Double-click `index.html` — no server needed.

## Deploy

Push to `main` — GitHub Pages publishes automatically.
