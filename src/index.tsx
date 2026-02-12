import { MyST, DEFAULT_RENDERERS } from "myst-to-react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, Theme } from "@myst-theme/providers";
import { filter } from "unist-util-filter";
import { select } from "unist-util-select";
import { toText } from "myst-common";
import { TableRow } from "mdast";

import React, { useDeferredValue, useState, useMemo } from "react";

function matchesSearch(tableRow: TableRow, query: string): boolean {
  const corpus = toText(tableRow);
  return corpus.includes(query);
}

function App({ ast }: { ast: any }) {
  const [text, setText] = useState("");
  const deferredText = useDeferredValue(text);
  const filteredAST = useMemo(() => {
    return filter(
      ast,
      (node) =>
        node.type !== "tableRow" ||
        select("tableCell[header]", node) !== undefined ||
        matchesSearch(node as TableRow, deferredText),
    );
  }, [ast, deferredText]);
  return (
    <>
      <input placeholder="search" onChange={(e) => setText(e.target.value)} />
      <ThemeProvider
        theme={Theme.light}
        setTheme={() => undefined}
        renderers={DEFAULT_RENDERERS}
      >
        <MyST ast={filteredAST} />
      </ThemeProvider>
    </>
  );
}

export default {
  render({ model, el }) {
    const ast = model.get("ast");

    const node = document.createElement("div");
    const root = createRoot(node);
    root.render(<App ast={ast} />);
    el.appendChild(node);

    return () => {
      node.remove();
      root.unmount();
    };
  },
};
