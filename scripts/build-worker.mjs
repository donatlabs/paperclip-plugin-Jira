// Bundles the worker and the manifest into one file each, on top of the tsc
// output. The package is mounted into a hosted workspace from a ConfigMap,
// which cannot hold directories, so the worker's module tree (jira/,
// services/, sync/, tools/, webhooks/) is inlined. The SDK and the shared
// package stay external: the host provides them next to the mount.
import esbuild from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const common = {
  bundle: true,
  format: "esm",
  platform: "node",
  target: ["node24"],
  sourcemap: false,
  logLevel: "info",
  external: ["@paperclipai/plugin-sdk", "@paperclipai/shared"],
};
await esbuild.build({ ...common, entryPoints: [path.join(root, "src/manifest.ts")], outfile: path.join(root, "dist/manifest.js") });
await esbuild.build({ ...common, entryPoints: [path.join(root, "src/worker.ts")], outfile: path.join(root, "dist/worker.js") });
