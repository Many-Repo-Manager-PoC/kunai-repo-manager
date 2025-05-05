// TODO: Delete once we can use the kunai design system as a plugin in global.css

/** @type {import('tailwindcss').Config} */

import kunai from "@kunai-consulting/kunai-design-system";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@kunai-consulting/kunai-design-system/lib/**/*",
    "./node_modules/@kunai-consulting/kunai-design-system/src/**/*",
  ],
  presets: [kunai.tailwindConfig],
};
