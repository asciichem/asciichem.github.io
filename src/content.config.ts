import { defineCollection } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

/**
 * Starlight's `docs` content collection. MDX/Markdown files in
 * `src/content/docs/` are picked up by `docsLoader()`, and frontmatter
 * is validated against `docsSchema()`.
 */
const docs = defineCollection({ loader: docsLoader(), schema: docsSchema() });

export const collections = { docs };
