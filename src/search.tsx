import { createRoot } from "react-dom/client";
import { remove } from "unist-util-remove";
import { select } from "unist-util-select";
import { toText, GenericNode } from "myst-common";

// Styling
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";

import React, { useDeferredValue, useState, useMemo, useEffect } from "react";

function matchesSearch(node: GenericNode, query: string): boolean {
  const corpus = toText(node);
  return corpus.toLowerCase().includes(query.toLowerCase());
}

function App({ model }: { model: any }) {
  const initialAST = useMemo(
    () => ({ type: "root", children: model.get("myst#children") }),
    [],
  );
  const [text, setText] = useState("");
  const deferredText = useDeferredValue(text);
  useEffect(() => {
    const selector = `:root:is(${model.get("selector")})`;
    const filteredAST = structuredClone(initialAST);
    remove(
      filteredAST,
      { cascade: false },
      (node) => select(selector, node) && !matchesSearch(node, deferredText),
    );
    model.set("myst#children", filteredAST.children);
  }, [initialAST, deferredText]);
  return (
    <Form data-bs-theme="light">
      <Form.Control
        type="search"
        placeholder="Search"
        onChange={(e) => setText(e.target.value)}
      />
    </Form>
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
