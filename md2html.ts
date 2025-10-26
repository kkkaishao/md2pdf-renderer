import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import remarkFrontmatter from 'remark-frontmatter'
import remarkDirective from 'remark-directive'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'
import rehypeShiki from '@shikijs/rehype'
import rehypeMermaid from 'rehype-mermaid'
import rehypeMathjax from 'rehype-mathjax/chtml'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
// shiki transformers
import {
    transformerColorizedBrackets
} from '@shikijs/colorized-brackets'
import {
    transformerNotationDiff,
    transformerNotationHighlight,
    transformerMetaHighlight,
    transformerNotationErrorLevel
} from '@shikijs/transformers'

// fs utils
import { readFileSync } from 'fs';

// extra remark/rehype plugins
import { remarkCodeMeta } from './plugins/code_meta.ts'; // preserve custom code block meta during md to html conversion
import { rehypeWrapCodeblock } from './plugins/code_wrap.ts'; // wrap code blocks with custom HTML structure

const mlir = JSON.parse(readFileSync('./extras/mlir.json', 'utf8'));
const tblgen = JSON.parse(readFileSync('./extras/tablegen.json', 'utf8'));


const langs = ['c', 'cpp', 'python', 'js', 'ts', 'java', 'rust', 'go', 'bash', 'json', 'yaml', 'markdown', 'bash', 'plaintext', 'cmake', 'css', 'diff', 'docker', 'fish', 'jsx', 'tsx', 'xml', 'latex', 'makefile', 'regexp', 'scala', 'tcl', 'verilog', 'system-verilog', 'vhdl', 'llvm', mlir, tblgen];

const processor = unified()
    .use(remarkParse)
    .use(remarkToc, { maxDepth: 3, ordered: true })
    .use(remarkFrontmatter)
    .use(remarkDirective)
    .use(remarkCodeMeta)
    .use(remarkMath)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeMermaid, {
        strategy: 'img-svg',
        mermaidConfig: { fontFamily: 'Menlo, Consolas, monospace' }
    })
    .use(rehypeMathjax, {
        chtml: {
            fontURL: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2'
        }
    })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
        behavior: 'wrap',
    });

export async function md2html(markdown: string, config: any): Promise<string> {
    // configure shiki
    langs.push(...(config.langs || []));
    processor.use(rehypeShiki, {
        theme: config.theme || 'github-light',
        addLanguageClass: true,
        langs: langs,
        transformers: [
            {
                code(hast: any) {
                    const metaString = this.options.meta?.__raw || ''
                    const meta = metaString.split(' ').filter((item: string) => item !== '');
                    const kv = meta.map((item: string) => item.split('='));
                    kv.map(([k, v]: [any, any]) => {
                        hast.properties[k] = v;
                    })
                }
            },
            transformerColorizedBrackets(),
            transformerMetaHighlight(),
            transformerNotationDiff(),
            transformerNotationErrorLevel(),
            transformerNotationHighlight(), 
        ]
    })
    .use(rehypeWrapCodeblock)
    .use(rehypeStringify, { allowDangerousHtml: true });
    const file = await processor.process(markdown);
    return String(file)
}

export default md2html;