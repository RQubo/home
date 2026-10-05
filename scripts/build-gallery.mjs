import { build } from "esbuild";
import { copyFile, mkdir, rename } from "node:fs/promises";

await build({
  entryPoints: ["src/projects/gallery.jsx"],
  bundle: true,
  minify: true,
  format: "iife",
  jsx: "automatic",
  outfile: "js/projects-gallery.js",
  legalComments: "linked",
  define: { "process.env.NODE_ENV": '"production"' }
});
await rename("js/projects-gallery.css", "css/projects-gallery.css");
await mkdir("src/projects/licenses", { recursive: true });
for (const dependency of ["react", "react-dom", "scheduler"]) {
  await copyFile(`node_modules/${dependency}/LICENSE`, `src/projects/licenses/${dependency}.txt`);
}
