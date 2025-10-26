import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

export const rehypeWrapCodeblock: Plugin = () => {
    return (tree) => {
        visit(tree, 'element', (node: any, index, parent) => {
            const isCodeBlock = node.tagName === 'pre' && node.children.length === 1 && node.children[0].type === 'element' && node.children[0].tagName === 'code';
            const isShiki = node.properties.class && node.properties.class.includes('shiki');
            if (isCodeBlock && isShiki) {
                const codeNode = node.children[0];
                const title = codeNode.properties.title || '';

                const wrapper = {
                    type: 'element',
                    tagName: 'div',
                    properties: {
                        class: 'code-block',
                    },
                    children: [
                        {
                            type: 'element',
                            tagName: 'div',
                            properties: {
                                className: 'code-header',
                            },
                            children: [
                                {
                                    type: 'element', tagName: 'div', properties: { className: 'code-buttons' }, children: [
                                        { type: 'element', tagName: 'div', properties: { className: 'red' } },
                                        //w-3 h-3 rounded-full bg-[#ff5f56]
                                        { type: 'element', tagName: 'div', properties: { className: 'yellow' } },
                                        // w - 3 h - 3 rounded - full bg - [#ffbd2e]
                                        { type: 'element', tagName: 'div', properties: { className: 'green' } }
                                        // w-3 h-3 rounded-full bg-[#27c93f]
                                    ]
                                },
                                {
                                    type: 'element', tagName: 'div', properties: { className: 'code-title' }, children: [
                                        {
                                            type: 'element', tagName: 'span', properties: {}, children: [
                                                { type: 'text', value: title }
                                            ]
                                        }]
                                }

                            ]
                        },
                        { ...node }
                    ]
                }
                if (parent && index != null) {
                    parent.children.splice(index, 1, wrapper);
                }
            }
        })
    }
}