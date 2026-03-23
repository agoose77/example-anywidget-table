import { filter } from "unist-util-filter";

const filterDirective = {
  name: "filterable",
  doc: "A filtering directive",
  body: { type: "myst", doc: "The content to filter." },
  run(data) {
    return [
      {
        type: "anywidget",
        esm: "/dist/filter.mjs",
        css: "/dist/filter.css",
        model: {},
        children: data.body,
      },
    ];
  },
};
const searchDirective = {
  name: "searchable",
  doc: "A searchable directive",
  body: { type: "myst", doc: "The content to search through." },
  options: {
    selector: { type: String, doc: "Node type to filter." },
  },
  run(data) {
    const selector = data.options.selector || "paragraph";
    return [
      {
        type: "anywidget",
        esm: "/dist/search.mjs",
        css: "/dist/search.css",
        model: {
          selector,
        },
        children: data.body,
      },
    ];
  },
};

const plugin = {
  name: "AST enhancer",
  directives: [filterDirective, searchDirective],
};

export default plugin;
