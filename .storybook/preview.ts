import type { Preview } from "@storybook/nextjs-vite";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "default",
      values: [
        { name: "default", value: "var(--bg-layer-default)" },
        { name: "weak", value: "var(--bg-neutral-weak)" },
        { name: "dark", value: "var(--bg-neutral-solid)" },
      ],
    },
    options: {
      storySort: {
        order: ["Foundations", ["Color", "Typography", "Spacing", "Radius & Shadow"], "Atoms", "Molecules", "Organisms"],
      },
    },
    controls: { expanded: true },
  },
};

export default preview;
