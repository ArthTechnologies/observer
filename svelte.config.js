import preprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-node";

/** @type {import('@sveltejs/kit').Config}*/
const config = {
  preprocess: [
    preprocess({
      postcss: true,
      scss: true,
    }),
  ],
  kit: {
    adapter: adapter(),
  },
};

export default config;
