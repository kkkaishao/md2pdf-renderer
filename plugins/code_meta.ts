import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export const remarkCodeMeta: Plugin = () => {
    return (tree) => {
        visit(tree, 'code', (node: any) => {
            if (node.meta) {
                node.data = node.data || {};
                node.data.hProperties = node.data.hProperties || {};
                node.data.hProperties.metastring = node.meta;
            }
        });
    };
}