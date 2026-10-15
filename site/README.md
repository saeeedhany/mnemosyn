# Website

The project website: plain HTML, CSS and JavaScript with no build step.

| File | Page |
|---|---|
| `index.html` | Home: overview, contributors band, FAQ |
| `download.html` | Install guide for Linux, macOS and Windows |
| `contributors.html` | Review process, everyone who contributed, data credits |
| `assets/contributors.js` | The people list and the review packet and form links |
| `assets/brain.js` | The point-cloud brain and the slice demo (the terminal viewer's 36-region brain) |
| `assets/site.js` | Theme switch, copy buttons, install tabs, contributor views |
| `assets/style.css` | All styles; colour tokens at the top |

## Preview locally

```bash
python -m http.server --directory site 8000
```

Then open http://localhost:8000. Add `?preview` to the home or contributors page
(`http://localhost:8000/contributors.html?preview`) to fill the contributor views with sample names
and see how they look with many people. Nothing links to it, and the page marks the names as samples.

## Credit a reviewer

1. Check that the person agreed in the review form to be named on the site.
2. Add an entry to `people` in `assets/contributors.js`, for example:

   ```js
   {
     name: 'Dr. Jane Doe',
     role: 'reviewer',
     title: 'Neuroanatomist',
     affiliation: 'Example University',
     country: 'Egypt',
     reviewed: ['Brainstem', 'Cranial nerves'],
     since: '2026-11',
     links: { orcid: 'https://orcid.org/0000-0000-0000-0000' },
   },
   ```

3. Push to `main`. The home page band and the contributors page update on their own.

Fields, all optional except `name` and `role`:

| Field | Meaning |
|---|---|
| `name` | Full name as the person wants it shown |
| `role` | `reviewer`, `developer`, `writer`, `translator` or `tester` |
| `title` | Specialty or position, for example `Neuroanatomist` |
| `affiliation` | University, hospital or lab |
| `country` | Country |
| `reviewed` | Parts of the atlas they reviewed, for example `['Hypothalamus', 'Brainstem']` |
| `since` | Year and month of the contribution, `YYYY-MM` |
| `photo` | Image URL; a GitHub avatar works: `https://github.com/<user>.png` |
| `links` | Any of `orcid`, `website`, `github`, `linkedin` |

Put the review packet (PDF) and Google Form URLs in `links` at the top of the same file. Until they
are set, the buttons read "Opens soon".

## Publish

`.github/workflows/pages.yml` deploys `site/` to GitHub Pages on every push to `main` that changes
it. Turn it on once in the repository settings: **Settings → Pages → Build and deployment → Source:
GitHub Actions**. The site is then at https://saeeedhany.github.io/mnemosyn/.
