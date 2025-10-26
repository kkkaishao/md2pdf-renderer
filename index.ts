#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();

program
    .name("md2pdf")
    .description("Convert Markdown files to PDF via HTML rendering.")
    .version("1.0.0")
    .option("-i, --input <file>", "Input markdown file", "sample.md")
    .option("-o, --output [file]", "Output PDF file", "output.pdf")
    .option("--css [file]", "Custom CSS file to style the HTML", "styles.css")
    .parse(process.argv);

import md2html from "./md2html.ts";
import { parseConfigFile } from "./config_parse.ts";
import { readFileSync, writeFileSync } from "fs";

async function main() {
    // read file from input option
    const options = program.opts();
    const markdownContent = readFileSync(options.input, "utf-8");
    const cssContent = readFileSync(options.css, "utf-8");
    const config = parseConfigFile();

    const html = await md2html(markdownContent, config);
    const finalHtml = `
    <html>
      <head>
        <meta charset="utf-8">
        <title>${config.title || ''}</title>
        <style>
          ${cssContent}
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
    `;
    const outputHtmlPath = options.output.endsWith(".pdf")
        ? options.output.slice(0, -4) + ".html"
        : options.output + ".html";
    writeFileSync(outputHtmlPath, finalHtml, "utf-8");
}

main();