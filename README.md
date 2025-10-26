# A Markdown to PDF Converter via HTML rendering

This is a self-used simple tool (Node.js script) to convert Markdown files to PDF via HTML rendering.

Main tools used:
1. [remark](https://github.com/remarkjs/remark) for Markdown parsing
2. [rehype](https://github.com/rehypejs/rehype) for HTML generation
3. [paged.js](https://github.com/pagedjs/pagedjs) for paged media rendering (PDF generation)
4. [shiki](https://github.com/shikijs/shiki) for syntax highlighting (my main motivation to create this tool)

## Features
- Syntax highlighting with Shiki (with a lot of useful transformers)
- Customizable styles via CSS (with a beautiful default style, handcrafted by myself 😎)
- Support for various Markdown features(GFM, filetree, blockquote, math, etc.)(In progress)

## Installation

```bash
git clone https://github.com/kkkaishao/md2pdf-renderer.git
cd md2pdf-renderer
npm install
# for rehype-mermaid
npx playwright install --with-deps chromium
```

## Usage

```bash
node index.ts -i input.md -o output.html
npx pagedjs-cli -i output.html -o output.pdf
```

Some settings can be configured in `config.yaml`. 

Styles can be customized in `styles.css`.



