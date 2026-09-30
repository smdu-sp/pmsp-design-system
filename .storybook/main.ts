import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  // Adicione esta linha apontando para a pasta pública:
  staticDirs: ["../public"],
  addons: ["@storybook/addon-a11y", "@chromatic-com/storybook", "@storybook/addon-docs"],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
};

export default config;
