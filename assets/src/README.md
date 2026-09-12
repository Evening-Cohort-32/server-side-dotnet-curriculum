# Diagram sources

Editable HTML/CSS source for the flattened PNG diagrams in `assets/`. GitHub's markdown sanitizer strips too much CSS to render these reliably as live HTML in a chapter, so each one is rendered once with a headless browser and committed as a plain image instead.

To regenerate a diagram after editing its `.html` file, with Playwright installed globally:

```bash
NODE_PATH=$(npm root -g) node render.js <source>.html ../<output>.png
```

This screenshots the `#wrap` element at 2x device scale and writes a cropped PNG. `render.js` is shared by both diagrams.

| Source | Renders to |
|---|---|
| `request-lifecycle.html` | `../request-lifecycle.png` |
| `vertical-vs-horizontal-development.html` | `../vertical-vs-horizontal-development.png` |
