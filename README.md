# intropage

A front page that links to my browser games and demos. It's a static site for GitHub Pages with no build step.
All content lives in [`projects.yaml`](projects.yaml).

## Add a project

Append an entry to `projects.yaml` and push:

```yaml
  - title: My New Demo
    url: https://mykkro.github.io/my-new-demo/
    repo: https://github.com/mykkro/my-new-demo
    description: What it is, in one or two sentences.
    image: images/my-new-demo.png   # or an absolute URL
    tags: [game, WebGL2]
    languages: [JavaScript, HTML]
```

The comment at the top of `projects.yaml` lists the optional fields: `image_fit`, `image_bg`, `hosted_on`, `featured` and `hidden`.
Leave out `url` for a project with no live demo: its card then links to the GitHub repo.
Order in the file is order on the page. Entries without an image get a lettered placeholder.

## Preview locally

The browser fetches `projects.yaml`, which doesn't work from `file://`. Serve the folder instead:

```bash
python -m http.server 8000
# open http://localhost:8000
```

## Deploy

Push to GitHub and enable **Settings → Pages → Deploy from a branch → `main` / root**.
The `.nojekyll` file makes Pages serve the files exactly as they are.
