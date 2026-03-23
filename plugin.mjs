import { filter } from "unist-util-filter";

const filterDirective = {
  name: "filterable",
  doc: "A filtering directive",
  body: { type: "myst", doc: "The content to filter." },
  options: {
    categorical: {
      type: String,
      doc: "List of whitespace-separated categories.",
    },
  },
  run(data) {
    const categorical = (data.options.categorical || "")
      .split(/\s+/)
      .filter((item) => !!item);
    return [
      {
        type: "anywidget",
        esm: "/dist/filter.mjs",
        css: "/dist/filter.css",
        model: { categorical },
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
        model: { selector },
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
