const plugin = {
  name: "Table enhancer",
  transforms: [
    {
      name: "table-enhance",
      doc: "An example transform that replaces tables with enhanced versions.",
      stage: "document",
      plugin: (_, utils) => (node) => {
        utils.selectAll("table", node).forEach((tableNode) => {
          const ast = JSON.parse(JSON.stringify(tableNode));
          // Remove state
          for (const key in tableNode) {
            if (tableNode.hasOwnProperty(key)) {
              delete tableNode[key];
            }
          }

          tableNode.type = "anywidget";
          tableNode.esm = "http://localhost:5000/widget.mjs";
          tableNode.model = {
            ast,
          };
        });
      },
    },
  ],
};

export default plugin;
