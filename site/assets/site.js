(() => {
  const data = window.MNEMOSYN || { links: {}, people: [] };
  const root = document.documentElement;

  const preview = new URLSearchParams(location.search).has('preview');
  const SAMPLE = [
    ['Dr. Lina Haddad', 'reviewer', 'Neuroanatomist', 'Cairo University', 'Egypt', ['Brainstem', 'Cranial nerves']],
    ['Prof. Jonas Weber', 'reviewer', 'Neuroradiologist', 'Charité Berlin', 'Germany', ['Slices', 'Basal ganglia']],
    ['Dr. Amara Okafor', 'reviewer', 'Neurosurgeon', 'University of Lagos', 'Nigeria', ['Tracts']],
    ['Dr. Mei Tanaka', 'reviewer', 'Neuroscience researcher', 'Kyoto University', 'Japan', ['Hypothalamus']],
    ['Dr. Rafael Costa', 'reviewer', 'Medical educator', 'USP', 'Brazil', ['Cortex', 'Limbic system']],
    ['Sara Lindqvist', 'writer', 'Medical student', 'Karolinska Institutet', 'Sweden', ['Descriptions']],
    ['Dr. Omar Farouk', 'reviewer', 'Neurologist', 'Ain Shams University', 'Egypt', ['Cerebellum']],
    ['Elena Rossi', 'translator', 'Translator', 'Independent', 'Italy', ['Italian']],
    ['Dr. Priya Nair', 'reviewer', 'Anatomy lecturer', 'AIIMS Delhi', 'India', ['Thalamus']],
    ['Tom Becker', 'tester', 'Anatomy student', 'LMU Munich', 'Germany', []],
  ].map(([name, role, title, affiliation, country, reviewed]) => ({
    name, role, title, affiliation, country, reviewed, since: '2026-11', sample: true,
  }));
  const people = preview ? [...data.people, ...SAMPLE] : data.people.slice();

  const ROLES = {
    reviewer: 'Specialist reviewer',
    developer: 'Developer',
    writer: 'Writer',
    translator: 'Translator',
    tester: 'Tester',
  };

  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  const initials = (name) =>
    name
      .replace(/^(dr|prof)\.?\s+/i, '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');

  const avatar = (p, cls = '') =>
    `<span class="avatar ${cls}" aria-hidden="true">${
      p.photo ? `<img src="${esc(p.photo)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : esc(initials(p.name))
    }</span>`;

  const themeBtn = document.querySelector('[data-theme-toggle]');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next;
      try {
        localStorage.setItem('mnemosyn-theme', next);
      } catch {}
      document.dispatchEvent(new Event('themechange'));
    });
  }

  document.querySelectorAll('[data-link]').forEach((a) => {
    const url = data.links[a.dataset.link];
    if (url) {
      a.href = url;
    } else {
      a.removeAttribute('href');
      a.setAttribute('aria-disabled', 'true');
      a.title = 'Opens soon';
      const text = a.querySelector('[data-link-text]');
      if (text) text.textContent = 'Opens soon';
    }
  });

  document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

  const COPY_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
  document.querySelectorAll('.code').forEach((block) => {
    const pre = block.querySelector('pre');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy';
    btn.innerHTML = `${COPY_ICON}<span>Copy</span>`;
    btn.setAttribute('aria-label', 'Copy command');
    btn.addEventListener('click', async () => {
      const text = [...pre.querySelectorAll('[data-cmd]')].map((l) => l.textContent).join('\n') || pre.textContent;
      try {
        await navigator.clipboard.writeText(text.trim());
        btn.classList.add('done');
        btn.querySelector('span').textContent = 'Copied';
        setTimeout(() => {
          btn.classList.remove('done');
          btn.querySelector('span').textContent = 'Copy';
        }, 1600);
      } catch {
        const range = document.createRange();
        range.selectNodeContents(pre);
        const sel = getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        btn.querySelector('span').textContent = 'Press Ctrl+C';
      }
    });
    block.appendChild(btn);
  });

  const install = document.querySelector('[data-install]');
  if (install) {
    const state = { os: 'linux', kind: 'full' };
    const ua = navigator.userAgent;
    if (/Windows/i.test(ua)) state.os = 'windows';
    else if (/Mac OS X|Macintosh/i.test(ua)) state.os = 'macos';
    const fromHash = location.hash.replace('#', '');
    if (['linux', 'macos', 'windows'].includes(fromHash)) state.os = fromHash;

    const apply = () => {
      install.querySelectorAll('[data-os]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.os === state.os)));
      install.querySelectorAll('[data-kind]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.kind === state.kind)));
      install.querySelectorAll('[data-only-os]').forEach((el) => {
        el.hidden = !el.dataset.onlyOs.split(' ').includes(state.os);
      });
      install.querySelectorAll('[data-only-kind]').forEach((el) => {
        el.hidden = el.dataset.onlyKind !== state.kind;
      });
      install.querySelectorAll('[data-detected]').forEach((el) => {
        el.textContent = { linux: 'Linux', macos: 'macOS', windows: 'Windows' }[state.os];
      });
    };
    install.querySelectorAll('[data-os]').forEach((b) =>
      b.addEventListener('click', () => {
        state.os = b.dataset.os;
        history.replaceState(null, '', `#${state.os}`);
        apply();
      }),
    );
    install.querySelectorAll('[data-kind]').forEach((b) =>
      b.addEventListener('click', () => {
        state.kind = b.dataset.kind;
        apply();
      }),
    );
    apply();
  }

  const band = document.querySelector('[data-marquee]');
  if (band) {
    const reviewers = people.filter((p) => p.role !== 'developer');
    const OPEN = ['Neuroanatomist', 'Neuroradiologist', 'Neurosurgeon', 'Neurologist', 'Neuroscience researcher', 'Anatomy lecturer', 'Medical educator', 'Medical student'];
    const pill = (p) =>
      `<span class="person-pill">${avatar(p)}<span class="who"><span class="name">${esc(p.name)}</span><span class="what">${esc(p.title || ROLES[p.role])}${p.country ? ` · ${esc(p.country)}` : ''}</span></span></span>`;
    const openPill = (title) =>
      `<a class="person-pill open" href="contributors.html#review">${avatar({ name: '+' })}<span class="who"><span class="name">Your name here</span><span class="what">${esc(title)}</span></span></a>`;

    let items = reviewers.length ? reviewers.map(pill) : OPEN.map(openPill);
    if (reviewers.length && reviewers.length < 12) items = items.concat(OPEN.slice(0, 4).map(openPill));
    const rows = [items.filter((_, i) => i % 2 === 0), items.filter((_, i) => i % 2 === 1)];
    band.innerHTML = rows
      .map((row, r) => {
        let filled = row.slice();
        while (filled.length < 8) filled = filled.concat(row);
        const clone = filled.map((h) => h.replace(/^<(\w+) /, '<$1 data-clone aria-hidden="true" tabindex="-1" '));
        return `<div class="marquee-row${r ? ' reverse' : ''}" style="--duration:${45 + filled.length * 3}s">${filled.join('')}${clone.join('')}</div>`;
      })
      .join('');

    const count = document.querySelector('[data-reviewer-count]');
    if (count) {
      count.textContent = reviewers.length
        ? `${reviewers.length} ${reviewers.length === 1 ? 'person has' : 'people have'} reviewed or contributed`
        : 'No specialist has reviewed the atlas yet. The first seats are open.';
    }
  }

  const dir = document.querySelector('[data-directory]');
  if (dir) {
    const searchEl = document.querySelector('#people-search');
    const filterEl = document.querySelector('[data-filters]');
    let role = 'all';

    const present = ['all', ...Object.keys(ROLES).filter((r) => people.some((p) => p.role === r))];
    filterEl.innerHTML = present
      .map((r) => {
        const n = r === 'all' ? people.length : people.filter((p) => p.role === r).length;
        return `<button type="button" data-role="${r}" aria-pressed="${r === 'all'}">${r === 'all' ? 'Everyone' : ROLES[r] + 's'} <span class="num muted">${n}</span></button>`;
      })
      .join('');
    filterEl.addEventListener('click', (e) => {
      const b = e.target.closest('[data-role]');
      if (!b) return;
      role = b.dataset.role;
      filterEl.querySelectorAll('[data-role]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      render();
    });
    searchEl.addEventListener('input', render);

    const LINKS = { orcid: 'ORCID', website: 'Website', github: 'GitHub', linkedin: 'LinkedIn' };
    const card = (p) => {
      const meta = [];
      if (p.affiliation || p.country) {
        meta.push(`<div><dt class="label">Affiliation</dt><dd>${esc([p.affiliation, p.country].filter(Boolean).join(', '))}</dd></div>`);
      }
      if (p.reviewed && p.reviewed.length) {
        meta.push(`<div><dt class="label">${p.role === 'reviewer' ? 'Reviewed' : 'Worked on'}</dt><dd class="tags">${p.reviewed.map((t) => `<span class="chip">${esc(t)}</span>`).join('')}</dd></div>`);
      }
      if (p.since) meta.push(`<div><dt class="label">Since</dt><dd class="mono num">${esc(p.since)}</dd></div>`);
      const links = Object.entries(p.links || {})
        .filter(([k, v]) => v && LINKS[k])
        .map(([k, v]) => `<a class="chip" href="${esc(v)}" target="_blank" rel="noopener noreferrer">${LINKS[k]} ↗</a>`)
        .join('');
      return `<article class="person">
        <span class="role"><span class="dot" style="color: var(--sys-${p.role === 'reviewer' ? 'parietal' : p.role === 'developer' ? 'frontal' : 'temporal'})"></span>${ROLES[p.role] || p.role}${p.sample ? ' · sample' : ''}</span>
        <div class="person-top">${avatar(p, 'lg')}<div><h3>${esc(p.name)}</h3>${p.title ? `<div class="title">${esc(p.title)}</div>` : ''}</div></div>
        ${meta.length ? `<dl>${meta.join('')}</dl>` : ''}
        ${links ? `<div class="person-links">${links}</div>` : ''}
      </article>`;
    };

    function render() {
      const q = searchEl.value.trim().toLowerCase();
      const shown = people.filter((p) => {
        if (role !== 'all' && p.role !== role) return false;
        if (!q) return true;
        return [p.name, p.title, p.affiliation, p.country, ...(p.reviewed || [])].join(' ').toLowerCase().includes(q);
      });
      const reviewers = shown.filter((p) => p.role === 'reviewer');
      const others = shown.filter((p) => p.role !== 'reviewer');
      let html = '';
      if (role === 'all' || role === 'reviewer') {
        html += `<div class="group-head"><h2>Specialist reviewers</h2><span class="label num">${reviewers.length}</span></div>`;
        html += reviewers.length
          ? `<div class="people">${reviewers.map(card).join('')}</div>`
          : q
            ? `<p class="muted">No reviewer matches “${esc(q)}”.</p>`
            : `<div class="empty"><span class="label">Open</span><h3>No specialist has reviewed the atlas yet</h3><p>Reviewers who finish the review form appear here with their specialty, affiliation and the parts of the atlas they checked.</p><a class="btn" href="#review">Review the atlas</a></div>`;
      }
      if (role !== 'reviewer' && (others.length || !q)) {
        html += `<div class="group-head"><h2>Builders</h2><span class="label num">${others.length}</span></div>`;
        html += others.length ? `<div class="people">${others.map(card).join('')}</div>` : `<p class="muted">Nobody matches “${esc(q)}”.</p>`;
      }
      dir.innerHTML = html;
    }
    render();
  }

  if (preview) {
    document.querySelectorAll('[data-preview-badge]').forEach((el) => (el.hidden = false));
  }
})();
