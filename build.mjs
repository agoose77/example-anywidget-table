import * as esbuild from "esbuild";

// Bundle the plugin
await esbuild.build({
  entryPoints: ["src/search.tsx", "src/filter.tsx"],
  outdir: "dist",
  outExtension: { ".js": ".mjs" },
  bundle: true,
  format: "esm",
  minify: false,
});
