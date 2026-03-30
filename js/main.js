/**
 * main.js
 * Core JavaScript for the personal website.
 * Handles: theme toggle, header scroll, post/project rendering, tag filtering.
 */

// ============================================================
// THEME MANAGEMENT
// ============================================================

const THEME_KEY = 'preferred-theme';

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY);
}

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

function initTheme() {
  const stored = getStoredTheme();
  const theme = stored || getSystemTheme();
  applyTheme(theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// ============================================================
// HEADER SCROLL BEHAVIOR
// ============================================================

function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on init
}

// ============================================================
// DATE FORMATTING
// ============================================================

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// ============================================================
// LOAD CONTENT DATA
// ============================================================

async function loadPostsData() {
  try {
    const res = await fetch('content/posts.json');
    if (!res.ok) throw new Error('Failed to load posts');
    return await res.json();
  } catch (err) {
    console.error('Error loading posts:', err);
    return { posts: [], projects: [] };
  }
}

// ============================================================
// RENDER POST CARD
// ============================================================

function renderPostCard(post, index = 0) {
  const tagsHTML = post.tags
    .map(tag => `<span class="post-tag">${tag}</span>`)
    .join('');

  return `
    <a href="blog/${post.slug}.html" class="post-card fade-in fade-in-delay-${Math.min(index + 1, 4)}" aria-label="Read: ${post.title}">
      <div class="post-card-inner">
        <div class="post-card-meta">
          <span class="post-date">${formatDate(post.date)}</span>
          <span class="post-read-time">${post.readTime}</span>
          <div class="post-tags" aria-label="Tags">${tagsHTML}</div>
        </div>
        <h3 class="post-title">${post.title}</h3>
        <p class="post-excerpt">${post.excerpt}</p>
      </div>
    </a>
  `;
}

// ============================================================
// RENDER PROJECT ITEM
// ============================================================

function renderProjectItem(project, index = 0) {
  const activeBadge = project.active
    ? `<span class="project-active-badge" aria-label="Active project">Active</span>`
    : '';

  const nameWrap = `
    <div class="project-name-wrap">
      <span class="project-name">${project.name}</span>
      ${activeBadge}
      ${project.url && project.url !== '#'
        ? `<span class="project-link-icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </span>`
        : ''}
    </div>
    <p class="project-description">${project.description}</p>
  `;

  const inner = `
    <div class="project-left fade-in fade-in-delay-${Math.min(index + 1, 4)}">${nameWrap}</div>
    <span class="project-year">${project.year}</span>
  `;

  if (project.url && project.url !== '#') {
    return `
      <div class="project-item">
        <a href="${project.url}" class="project-item-link" target="_blank" rel="noopener noreferrer" aria-label="${project.name} project">
          ${inner}
        </a>
      </div>
    `;
  }

  return `<div class="project-item">${inner}</div>`;
}

// ============================================================
// HOMEPAGE: RENDER POSTS & PROJECTS
// ============================================================

async function initHomepage() {
  const postsGrid = document.getElementById('posts-grid');
  const projectsList = document.getElementById('projects-list');

  if (!postsGrid && !projectsList) return;

  const data = await loadPostsData();

  // Render featured posts (up to 3)
  if (postsGrid) {
    const featured = data.posts.filter(p => p.featured).slice(0, 3);
    if (featured.length === 0) {
      postsGrid.innerHTML = '<p class="posts-loading">No posts yet. Check back soon.</p>';
    } else {
      postsGrid.innerHTML = featured.map((p, i) => renderPostCard(p, i)).join('');
    }
  }

  // Render projects
  if (projectsList) {
    if (data.projects.length === 0) {
      projectsList.innerHTML = '<p class="posts-loading">Projects coming soon.</p>';
    } else {
      projectsList.innerHTML = data.projects.map((p, i) => renderProjectItem(p, i)).join('');
    }
  }
}

// ============================================================
// WRITING ARCHIVE PAGE
// ============================================================

async function initArchivePage() {
  const archiveContainer = document.getElementById('archive-posts');
  const tagFilterContainer = document.getElementById('tag-filter');

  if (!archiveContainer) return;

  const data = await loadPostsData();
  const allPosts = data.posts;
  let activeTag = 'all';

  // Collect all unique tags
  const allTags = ['all', ...new Set(allPosts.flatMap(p => p.tags))];

  // Render tag filter buttons
  if (tagFilterContainer) {
    tagFilterContainer.innerHTML =
      `<span class="tag-filter-label">Filter:</span>` +
      allTags.map(tag => `
        <button
          class="tag-filter-btn ${tag === 'all' ? 'active' : ''}"
          data-tag="${tag}"
          aria-pressed="${tag === 'all'}"
        >
          ${tag === 'all' ? 'All' : tag}
        </button>
      `).join('');

    tagFilterContainer.addEventListener('click', e => {
      const btn = e.target.closest('.tag-filter-btn');
      if (!btn) return;

      activeTag = btn.dataset.tag;

      // Update button states
      tagFilterContainer.querySelectorAll('.tag-filter-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.tag === activeTag);
        b.setAttribute('aria-pressed', b.dataset.tag === activeTag);
      });

      renderFilteredPosts();
    });
  }

  function renderFilteredPosts() {
    const filtered = activeTag === 'all'
      ? allPosts
      : allPosts.filter(p => p.tags.includes(activeTag));

    if (filtered.length === 0) {
      archiveContainer.innerHTML = '<p class="posts-loading">No posts found for this filter.</p>';
      return;
    }

    archiveContainer.innerHTML = filtered.map((p, i) => renderPostCard(p, i)).join('');
  }

  renderFilteredPosts();
}

// ============================================================
// BLOG POST PAGE
// ============================================================

function initPostPage() {
  // Copy link button
  const copyBtn = document.getElementById('copy-link-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Copied!
        `;
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copy link
          `;
        }, 2000);
      } catch {
        // Fallback for older browsers
        const el = document.createElement('textarea');
        el.value = window.location.href;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
    });
  }
}

// ============================================================
// SET FOOTER YEAR
// ============================================================

function setFooterYear() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ============================================================
// ACTIVE NAV LINK
// ============================================================

function setActiveNavLink() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const isActive =
      (href === 'writing.html' && (path.includes('writing') || path.includes('blog'))) ||
      (href === 'index.html' && (path === '/' || path.endsWith('index.html')));
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
  });
}

// ============================================================
// INIT
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // Theme
  initTheme();

  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTheme);
  }

  // Header
  initHeaderScroll();

  // Footer year
  setFooterYear();

  // Active nav
  setActiveNavLink();

  // Page-specific init
  const body = document.body;
  if (document.getElementById('posts-grid') || document.getElementById('projects-list')) {
    initHomepage();
  }
  if (document.getElementById('archive-posts')) {
    initArchivePage();
  }
  if (document.querySelector('.post-body')) {
    initPostPage();
  }
});
