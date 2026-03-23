import { createRoot } from "react-dom/client";
import { remove } from "unist-util-remove";
import { selectAll, select } from "unist-util-select";

// Styling
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";

import React, { useCallback, useMemo, useReducer, useEffect } from "react";

function parseKeyValueClass(prefix: string, cls: string): [string, string][] {
  const pattern = new RegExp(`${prefix}-([^-]+)-(.*)`);
  const tokens = cls.split(/\s+/);
  return tokens
    .map((token) => {
      const match = token.match(pattern);
      if (match === null) {
        return undefined;
      }
      const result: [string, string] = [match[1], match[2]];
      return result;
    })
    .filter((item) => item !== undefined);
}
type FilterGroup = {
  state: { [name: string]: boolean };
  kind: "category" | "tag";
};
type Filters = {
  [group: string]: FilterGroup;
};

type Action =
  | {
      type: "set-filter";
      group: string;
      name: string;
      value: boolean;
    }
  | {
      type: "set-filter-group";
      group: string;
      value: boolean;
    };

function filtersReducer(filters: Filters, action: Action) {
  console.log(action);
  switch (action.type) {
    case "set-filter": {
      const nextGroup = structuredClone(filters[action.group]);
      if (nextGroup.kind === "category") {
        for (const key of Object.keys(nextGroup.state)) {
          nextGroup.state[key] = false;
        }
      }
      nextGroup.state[action.name] = action.value;
      return { ...filters, [action.group]: nextGroup };
    }
    case "set-filter-group": {
      const nextGroup = structuredClone(filters[action.group]);
      for (const key of Object.keys(nextGroup.state)) {
        nextGroup.state[key] = action.value;
      }
      return { ...filters, [action.group]: nextGroup };
    }
    default: {
      throw new Error();
    }
  }
}

function buildRemovalSelector(filters: Filters): string {
  const classes = Object.entries(filters).flatMap(([groupName, group]) =>
    Object.entries(group.state)
      // Take inactive filters
      .filter(([name, value]) => !value)
      // Build string
      .map(
        ([name]) =>
          `:root[class*=flt-${group.kind === "category" ? "cat" : "tag"}-${groupName}-${name}]`,
      ),
  );
  return classes.join(",") || ":not(*)";
}

function App({ model }: { model: any }) {
  const initialAST = useMemo(
    () => ({ type: "root", children: model.get("myst#children") }),
    [model],
  );
  // Array of [key, value] tuples
  const setFactory = () => new Set();

  const maybeFilterNodes = useMemo(
    () => selectAll("[class*=flt-]", initialAST),
    [initialAST],
  );

  const initialFilters = useMemo(() => {
    // Compute categories from classes
    const categoryItems = new Map<string, Set<string>>();
    for (const node of maybeFilterNodes) {
      for (const [key, value] of parseKeyValueClass(
        "flt-cat",
        (node as any).class ?? "",
      )) {
        categoryItems.getOrInsertComputed(key, setFactory).add(value);
      }
    }
    const tagItems = new Map<string, Set<string>>();
    for (const node of maybeFilterNodes) {
      for (const [key, value] of parseKeyValueClass(
        "flt-tag",
        (node as any).class ?? "",
      )) {
        tagItems.getOrInsertComputed(key, setFactory).add(value);
      }
    }

    const filters: Filters = {};
    for (const [name, items] of categoryItems) {
      const state = {};
      let first = true;
      for (const item of items) {
        state[item] = first;
        first = false;
      }
      filters[name] = { kind: "category", state };
    }
    for (const [name, items] of tagItems) {
      const state = {};
      for (const item of items) {
        state[item] = true;
      }
      filters[name] = { kind: "tag", state };
    }

    return filters;
  }, [maybeFilterNodes]);

  const [filters, dispatch] = useReducer(filtersReducer, initialFilters);

  const onFilterChanged = useCallback(
    (group: string, name: string, value: boolean) =>
      dispatch({ type: "set-filter", group, name, value }),
    [dispatch],
  );
  const onFilterGroupChanged = useCallback(
    (group: string, value: boolean) =>
      dispatch({ type: "set-filter-group", group, value }),
    [dispatch],
  );

  useEffect(() => {
    const filteredAST = structuredClone(initialAST);
    const removalSelector = buildRemovalSelector(filters);

    remove(
      filteredAST,
      { cascade: false },
      (node) => select(removalSelector, node) !== undefined,
    );
    model.set("myst#children", filteredAST.children);
  }, [filters]);

  return (
    <FilterForm
      filters={filters}
      onFilterChanged={onFilterChanged}
      onFilterGroupChanged={onFilterGroupChanged}
    />
  );
}

function FilterForm({
  filters,
  onFilterChanged,
  onFilterGroupChanged,
}: {
  filters: Filters;
  onFilterChanged: (group: string, name: string, value: boolean) => void;
  onFilterGroupChanged: (group: string, value: boolean) => void;
}) {
  const components: JSX.Element[] = [];

  for (const [name, group] of Object.entries(filters)) {
    switch (group.kind) {
      case "category": {
        const items = Object.keys(group.state);
        const allChecked = !Object.values(group.state).some((x) => !x);
        components.push(
          <div>
            <span style={{ marginRight: "1em" }}>{name}</span>
            <Form.Check
              inline
              name={name}
              type="radio"
              label="all"
              key="all"
              checked={allChecked}
              onChange={() => onFilterGroupChanged(name, true)}
            />
            {...Array.from(items).map((item) => (
              <Form.Check
                inline
                name={name}
                type="radio"
                label={item}
                key={item}
                checked={group.state[item] && !allChecked}
                onChange={(e) => onFilterChanged(name, item, e.target.checked)}
              />
            ))}
          </div>,
        );
        break;
      }
      case "tag": {
        const items = Object.keys(group.state);
        components.push(
          <div>
            <span style={{ marginRight: "1em" }}>{name}</span>
            {...Array.from(items).map((item) => (
              <Form.Check
                inline
                name={name}
                type="switch"
                label={item}
                key={item}
                checked={group.state[item]}
                onChange={(e) => onFilterChanged(name, item, e.target.checked)}
              />
            ))}
          </div>,
        );
        break;
      }
    }
  }

  return <Form data-bs-theme="light">{components}</Form>;
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
