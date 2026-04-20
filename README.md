# alexanderjamesking.github.io

https://www.alexanderjamesking.com

Personal site built with [Hugo](https://gohugo.io). Deployed to GitHub Pages via GitHub Actions on push to `master`.

## Local development

```
hugo server
```

Open http://localhost:1313

## Adding a post

Create a new file in `content/posts/`:

```
hugo new posts/my-post-title.md
```

Or manually create `content/posts/my-post-title.md`:

```yaml
---
title: "My post title"
date: 2026-04-20
description: "A short summary shown in the post list."
tags: ["work"]
---

Post content in markdown here.
```

Front matter fields for posts:

| Field | Required | Description |
|-------|----------|-------------|
| `title` | yes | Post title |
| `date` | yes | Publish date (YYYY-MM-DD) |
| `description` | no | Shown as excerpt in the post list |
| `tags` | no | e.g. `["work"]` or `["life"]` |
| `type_label` | no | Shown in post meta, e.g. "Essay", "Talk" |
| `reading_time` | no | Shown in post meta, e.g. "6 min" |
| `heading` | no | Override the rendered h1 (supports HTML like `<em>`) |
| `draft` | no | Set `true` to hide from production build |

## Editing pages

Pages live at the root of `content/`:

- `content/_index.md` -- homepage heading/subtitle
- `content/work.md` -- work/experience (experience list is YAML in front matter)
- `content/life.md` -- life page
- `content/contact.md` -- contact links (links are YAML in front matter)

## Deploying

Push to `master`. GitHub Actions builds Hugo and deploys to GitHub Pages automatically.

## Project structure

```
hugo.toml                    -- site config
content/                     -- markdown content
  _index.md                  -- homepage
  work.md                    -- work/experience
  life.md                    -- life
  contact.md                 -- contact
  posts/                     -- blog posts
themes/ajk/                  -- custom theme
  layouts/                   -- Hugo templates
  static/style.css           -- stylesheet
  static/site.js             -- theme toggle
static/CNAME                 -- custom domain
.github/workflows/deploy.yml -- CI/CD
```
