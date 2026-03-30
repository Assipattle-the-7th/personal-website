# Personal Website — Healthcare Tech Founder

A minimalist personal website for a healthcare tech founder building AI-powered staffing systems. Emphasis on thought leadership writing with a clean, professional aesthetic inspired by brianlovin.com and leerob.io.

---

## ✅ Completed Features

### Design & UX
- **Dark mode default** with user-controlled light/dark toggle (persisted in `localStorage`)
- **Work Sans** typography throughout — headings and body
- **Steel blue accent** (`#6b8cae`) for links and interactive elements
- **Sticky floating header** with blur/border on scroll
- **Fully responsive** — mobile-first layout, tested down to 320px
- **Subtle animations** — `fadeInUp` entrance animations with `prefers-reduced-motion` support
- **Accessible** — semantic HTML, ARIA labels, focus-visible indicators, `aria-current` on active nav items

### Pages
| Page | Path | Description |
|------|------|-------------|
| Homepage | `/index.html` | Hero, 3 featured posts, projects, contact |
| Writing Archive | `/writing.html` | All posts with tag filter |
| Blog Post | `/blog/{slug}.html` | Full post with share buttons and prev/next nav |

### Homepage Sections
- **Hero** — Name, positioning statement, social links (LinkedIn, X, Email)
- **Recent Writing** — 3 featured posts loaded from `content/posts.json`
- **Projects** — Chronological list with active badge, loaded from `content/posts.json`
- **Contact** — Short bio + email link

### Blog Post Features
- Back to writing navigation
- Post metadata (date, read time, tags)
- Share buttons: X, LinkedIn, Copy link (with clipboard feedback)
- Previous / Next post navigation
- Clean article typography with `max-width: 680px`

### Writing Archive Features
- Full post list sorted newest-first
- Tag filter buttons (dynamically generated from post tags)
- `aria-live` region for accessible filtering

---

## 📁 File Structure

```
/
├── index.html                  # Homepage
├── writing.html                # Writing archive
├── blog/
│   ├── why-ai-staffing-is-broken.html
│   ├── from-agency-to-saas.html
│   ├── healthcare-automation-ethics.html
│   ├── building-ai-first-culture.html
│   └── orchestration-vs-automation.html
├── css/
│   └── style.css               # All styles (CSS custom properties, dark/light themes)
├── js/
│   └── main.js                 # Theme toggle, post/project rendering, tag filter
└── content/
    └── posts.json              # Posts and projects data source
```

---

## 📊 Data Structure

### `content/posts.json`

```json
{
  "posts": [
    {
      "id": "unique-id",
      "title": "Post Title",
      "date": "YYYY-MM-DD",
      "tags": ["Tag1", "Tag2"],
      "description": "SEO description",
      "readTime": "5 min read",
      "excerpt": "First 1-2 sentences shown on card",
      "slug": "url-slug",
      "featured": true
    }
  ],
  "projects": [
    {
      "id": "unique-id",
      "name": "Project Name",
      "year": "2024–Present",
      "description": "One-line description",
      "url": "https://... or null",
      "active": true
    }
  ]
}
```

### Adding a New Blog Post

1. Add an entry to `content/posts.json` with `featured: true` to show on homepage
2. Create `blog/{slug}.html` using an existing post as a template
3. Update `prev`/`next` navigation links in adjacent posts

---

## 🔧 Customization Checklist

Replace all placeholder values before publishing:

- [ ] `Doug Watson` → your real name (search & replace across all files)
- [ ] `connect@dougwatson.ca` → your real email
- [ ] `https://dougwatson.ca` → your real domain
- [ ] `https://linkedin.com` → your LinkedIn profile URL
- [ ] `https://x.com` → your X/Twitter profile URL
- [ ] Hero bio text in `index.html`
- [ ] Project details in `content/posts.json`
- [ ] OG image meta tags (add `og:image` with a real image URL)

---

## 🚀 Deployment

Deploy to **Vercel**, **Netlify**, or **Cloudflare Pages** — this is a fully static site with no build step required.

**Netlify drag-and-drop**: Zip the project folder and drop onto netlify.com/drop  
**Vercel CLI**: `vercel` in the project root  
**GitHub Pages**: Push to a repo and enable Pages from the root

> Or use the **Publish tab** in this editor for one-click deployment.

---

## 🤖 AI/Automation Integration Notes

The site is structured for easy programmatic content management:

### Adding Posts via Automation
1. Append a new post object to the `posts` array in `content/posts.json`
2. Create the corresponding HTML file in `/blog/` using the standard template
3. Set `featured: true` to surface it on the homepage (auto-demotes older posts)

### Template Variables in Blog Posts
Each blog post HTML uses a consistent pattern. An AI agent or script can substitute:
- `{{title}}` → post title in `<title>`, `<h1>`, og:title
- `{{date}}` → ISO date in meta + display date in header
- `{{readTime}}` → read time string
- `{{tags}}` → array rendered as `<span class="post-tag">` elements
- `{{content}}` → article body HTML
- `{{slug}}` → used in share links and file paths
- `{{prevTitle}}` / `{{nextTitle}}` → adjacent post navigation

### Future API Endpoint (recommended)
Add a `/api/publish` webhook that:
1. Receives a POST with post frontmatter + Markdown body
2. Converts Markdown to HTML
3. Generates the blog post HTML file
4. Updates `content/posts.json`

---

## ⏳ Not Yet Implemented

- [ ] RSS feed (`/rss.xml`)
- [ ] OG image generation for posts
- [ ] Newsletter/email capture
- [ ] Search across posts
- [ ] Reading progress indicator
- [ ] Estimated reading time auto-calculated from word count
- [ ] Markdown-to-HTML pipeline (posts are currently hand-written HTML)
- [ ] Sitemap (`sitemap.xml`)

---

## 🎨 Design Tokens

| Token | Dark | Light |
|-------|------|-------|
| Background | `#1a1a1a` | `#f5f5f5` |
| Text primary | `#e8e8e8` | `#2a2a2a` |
| Text secondary | `#888888` | `#666666` |
| Accent | `#6b8cae` | `#6b8cae` |
| Border | `#2e2e2e` | `#e0e0e0` |

Font: [Work Sans](https://fonts.google.com/specimen/Work+Sans) via Google Fonts

---

*Built as a static website. No frameworks, no build step, no dependencies beyond Google Fonts.*
