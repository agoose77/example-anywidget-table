import { createRoot } from "react-dom/client";
import { filter } from "unist-util-filter";
import { select } from "unist-util-select";
import { toText } from "myst-common";
import { TableRow } from "mdast";

import React, { useDeferredValue, useState, useMemo, useEffect } from "react";

function matchesSearch(tableRow: TableRow, query: string): boolean {
  const corpus = toText(tableRow);
  return corpus.toLowerCase().includes(query.toLowerCase());
}

function App({ model }: { model: any }) {
  const initialAST = useMemo(() => model.get("myst#children"), []);
  const [text, setText] = useState("");
  const deferredText = useDeferredValue(text);
  useEffect(() => {
    const filteredAST = initialAST.map((root) =>
      filter(
        root,
        (node) =>
          node.type !== "tableRow" ||
          select("tableCell[header]", node) !== undefined ||
          matchesSearch(node as TableRow, deferredText),
      ),
    );
    model.set("myst#children", filteredAST);
  }, [initialAST, deferredText]);
  return (
    <input placeholder="Search" onChange={(e) => setText(e.target.value)} />
  );
}

export default {
  render({ model, el }) {
    const node = document.createElement("div");
    const root = createRoot(node);
    root.render(<App model={model} />);
    el.appendChild(node);

    return () => {
      node.remove();
      root.unmount();
    };
  },
};
