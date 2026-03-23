import { filter } from "unist-util-filter";

const galleryDirective = {
  name: "gallery",
  doc: "A filtering directive",
  run() {
    return [
      {
        type: "grid",
        children: [
          {
            type: "div",
            class:
              "flt-domain-climate flt-pkg-intake flt-pkg-xarray flt-pkg-dask",
            children: [
              {
                type: "card",
                url: "https://projectpythia.org/cesm-lens-aws-cookbook",
                children: [
                  {
                    type: "cardTitle",
                    children: [
                      {
                        type: "text",
                        value: "CESM LENS on AWS Cookbook",
                      },
                    ],
                  },
                  {
                    type: "div",
                    children: [
                      {
                        type: "image",
                        url: "https://raw.githubusercontent.com/projectpythia/cesm-lens-aws-cookbook/main/thumbnail.png",
                      },
                      {
                        type: "div",
                        children: [
                          {
                            type: "span",
                            children: [
                              {
                                type: "text",
                                value: "climate",
                              },
                            ],
                            style: {
                              background: "#7A77B4",
                              display: "inline-block",
                              borderRadius: 8,
                              color: "white",
                              padding: 5,
                              margin: 5,
                            },
                          },
                          {
                            type: "span",
                            children: [
                              {
                                type: "text",
                                value: "intake-esm",
                              },
                            ],
                            style: {
                              background: "#B83BC0",
                              display: "inline-block",
                              borderRadius: 8,
                              color: "white",
                              padding: 5,
                              margin: 5,
                            },
                          },
                          {
                            type: "span",
                            children: [
                              {
                                type: "text",
                                value: "xarray",
                              },
                            ],
                            style: {
                              background: "#B83BC0",
                              display: "inline-block",
                              borderRadius: 8,
                              color: "white",
                              padding: 5,
                              margin: 5,
                            },
                          },
                          {
                            type: "span",
                            children: [
                              {
                                type: "text",
                                value: "dask",
                              },
                            ],
                            style: {
                              background: "#B83BC0",
                              display: "inline-block",
                              borderRadius: 8,
                              color: "white",
                              padding: 5,
                              margin: 5,
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
                urlSource: "https://projectpythia.org/cesm-lens-aws-cookbook",
              },
            ],
          },
          {
            type: "div",
            class: "flt-domain-climate flt-pkg-intake flt-pkg-xesmf",
            children: [
              {
                type: "card",
                url: "https://projectpythia.org/cmip6-cookbook",
                children: [
                  {
                    type: "cardTitle",
                    children: [
                      {
                        type: "text",
                        value: "CMIP6 Cookbook",
                      },
                    ],
                  },
                  {
                    type: "div",
                    children: [
                      {
                        type: "image",

                        url: "https://raw.githubusercontent.com/projectpythia/cmip6-cookbook/main/thumbnail.png",
                      },
                      {
                        type: "div",
                        children: [
                          {
                            type: "span",
                            children: [
                              {
                                type: "text",
                                value: "climate",
                              },
                            ],
                            style: {
                              background: "#7A77B4",
                              display: "inline-block",
                              borderRadius: 8,
                              color: "white",
                              padding: 5,
                              margin: 5,
                            },
                          },
                          {
                            type: "span",
                            children: [
                              {
                                type: "text",
                                value: "intake-esm",
                              },
                            ],
                            style: {
                              background: "#B83BC0",
                              display: "inline-block",
                              borderRadius: 8,
                              color: "white",
                              padding: 5,
                              margin: 5,
                            },
                          },
                          {
                            type: "span",
                            children: [
                              {
                                type: "text",
                                value: "xesmf",
                              },
                            ],
                            style: {
                              background: "#B83BC0",
                              display: "inline-block",
                              borderRadius: 8,
                              color: "white",
                              padding: 5,
                              margin: 5,
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
                urlSource: "https://projectpythia.org/cmip6-cookbook",
              },
            ],
          },
          {
            type: "div",
            class:
              "flt-domain-hrrr flt-domain-aws flt-domain-zarr flt-pkg-xarray",
            children: [
              {
                type: "card",
                url: "https://projectpythia.org/HRRR-AWS-cookbook",
                class: "foo",
                children: [
                  {
                    type: "cardTitle",
                    children: [
                      {
                        type: "text",
                        value: "HRRR-AWS Cookbook",
                      },
                    ],
                  },
                  {
                    type: "div",
                    children: [
                      {
                        type: "image",

                        url: "https://raw.githubusercontent.com/projectpythia/HRRR-AWS-cookbook/main/thumbnail.png",
                      },
                      {
                        type: "div",
                        children: [
                          {
                            type: "span",
                            children: [
                              {
                                type: "text",
                                value: "HRRR model",
                              },
                            ],
                            style: {
                              background: "#7A77B4",
                              display: "inline-block",
                              borderRadius: 8,
                              color: "white",
                              padding: 5,
                              margin: 5,
                            },
                          },
                          {
                            type: "span",
                            children: [
                              {
                                type: "text",
                                value: "AWS cloud",
                              },
                            ],
                            style: {
                              background: "#7A77B4",
                              display: "inline-block",
                              borderRadius: 8,
                              color: "white",
                              padding: 5,
                              margin: 5,
                            },
                          },
                          {
                            type: "span",
                            children: [
                              {
                                type: "text",
                                value: "zarr",
                              },
                            ],
                            style: {
                              background: "#7A77B4",
                              display: "inline-block",
                              borderRadius: 8,
                              color: "white",
                              padding: 5,
                              margin: 5,
                            },
                          },
                          {
                            type: "span",
                            children: [
                              {
                                type: "text",
                                value: "xarray",
                              },
                            ],
                            style: {
                              background: "#B83BC0",
                              display: "inline-block",
                              borderRadius: 8,
                              color: "white",
                              padding: 5,
                              margin: 5,
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
                urlSource: "https://projectpythia.org/HRRR-AWS-cookbook",
              },
            ],
          },
        ],
      },
    ];
  },
};

const filterDirective = {
  name: "filterable",
  doc: "A filtering directive",
  body: { type: "myst", doc: "The content to filter." },
  options: {
    categorical: {
      type: String,
      doc: "List of whitespace-separated categories.",
    },
    prefix: {
      type: String,
      doc: "Prefix for class names indicating group members of the form <prefix><group>-<name>",
    },
  },
  run(data) {
    const categorical = (data.options?.categorical || "")
      .split(/\s+/)
      .filter((item) => !!item);
    const prefix = data.options?.prefix || "flt-";
    return [
      {
        type: "anywidget",
        esm: "/dist/filter.mjs",
        css: "/dist/filter.css",
        model: { categorical, prefix },
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
  directives: [filterDirective, searchDirective, galleryDirective],
};

export default plugin;
