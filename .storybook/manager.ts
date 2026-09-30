import { addons } from "storybook/manager-api";
import { create } from "storybook/theming/create";

addons.setConfig({
  theme: create({
    base: "dark", // ou "light" (conforme seu tema preferido)

    // Nome textual que substitui "Storybook" (e aparece na aba do navegador)
    brandTitle: "PMSP Design System",

    // Link ao clicar no nome/logo
    brandUrl: "/",
    brandTarget: "_self",

    // Caminho da sua imagem/ícone que substitui o ícone rosa do Storybook:
    // (pode ser um .svg, .png ou até um data:image/svg+xml)
    brandImage: "./smul_azul.png",
  }),
});
