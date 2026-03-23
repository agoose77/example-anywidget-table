import { createRoot } from "react-dom/client";
import { remove } from "unist-util-remove";
import { selectAll, select } from "unist-util-select";
import type { GenericNode } from "myst-common";

// Styling
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";

import React, { useCallback, useMemo, useReducer, useEffect } from "react";

/**
 * Parse a class name of the form "xxx yyy zzz" into an array of key-value tuples
 *
 * @param prefx prefix for class name components of the form <prefix>-<class>-<name>
 * @param cls class name
 */
function parseKeyValueClass(prefix: string, cls: string): [string, string][] {
  const pattern = new RegExp(`${prefix}([^-]+)-(.*)`);
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

/**
 * A set of filter options belonging to the same group
 */
type FilterGroup = {
  state: { [name: string]: boolean };
  mutuallyExclusive?: boolean;
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
  switch (action.type) {
    case "set-filter": {
      const nextGroup = structuredClone(filters[action.group]);
      if (nextGroup.mutuallyExclusive) {
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

const setFactory = () => new Set();

/**
 * Build a Filter object from a set of filterable nodes
 */
function buildFilters(
  filterNodes: GenericNode[],
  prefix: string,
  categorical: string[],
): Filters {
  // Compute categories from classes
  const filterItems = new Map<string, Set<string>>();
  for (const node of filterNodes) {
    const cls = (node as any).class ?? "";
    for (const [key, value] of parseKeyValueClass(prefix, cls)) {
      filterItems.getOrInsertComputed(key, setFactory).add(value);
    }
  }

  const filters: Filters = {};
  for (const [name, items] of filterItems) {
    const state = {};
    for (const item of items) {
      state[item] = false;
    }
    filters[name] = { mutuallyExclusive: categorical.includes(name), state };
  }

  return filters;
}

function buildRemovalSelector(prefix: string, filters: Filters): string {
  const groupSelectors = Object.entries(filters).map(([groupName, group]) => {
    const groupSelector =
      Object.entries(group.state)
        // Take active selections
        .filter(([name, value]) => value)
        // Build string
        .map(([name]) => `[class*=${prefix}${groupName}-${name}]`)
        .join(", ") || "*";

    // Treat no selectors as wildcard
    return `:is(${groupSelector})`;
  });
  const selector = groupSelectors.join("");
  return `:root[class*=${prefix}]:not(${selector})`;
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
    const noneChecked = !Object.values(group.state).some((x) => x);
    const items = Object.keys(group.state);
    if (group.mutuallyExclusive) {
      components.push(
        <div>
          <span style={{ marginRight: "1em" }}>{name}</span>
          <Form.Check
            inline
            name={name}
            type="radio"
            label="all"
            key="all"
            checked={noneChecked}
            onChange={() => onFilterGroupChanged(name, false)}
          />
          {...Array.from(items).map((item) => (
            <Form.Check
              inline
              name={name}
              type="radio"
              label={item}
              key={item}
              checked={group.state[item] && !noneChecked}
              onChange={(e) => onFilterChanged(name, item, e.target.checked)}
            />
          ))}
        </div>,
      );
    } else {
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
    }
  }

  return <Form data-bs-theme="light">{components}</Form>;
}
function App({ model }: { model: any }) {
  const initialAST = useMemo(
    () => ({ type: "root", children: model.get("myst#children") }),
    [model],
  );

  const categorical = (model.get("categorical") as string[] | undefined) ?? [];
  const prefix = model.get("prefix") as string | undefined;
  if (prefix === undefined) {
    throw new Error("Undefined prefix");
  }

  const maybeFilterNodes = useMemo(
    () => selectAll(`[class*=${prefix}]`, initialAST),
    [initialAST],
  );

  const initialFilters = useMemo(
    () => buildFilters(maybeFilterNodes, prefix, categorical),
    [maybeFilterNodes],
  );

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
    const removalSelector = buildRemovalSelector(prefix, filters);

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
