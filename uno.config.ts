import { defineConfig, presetAttributify, presetIcons, presetTypography, presetUno } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({ extraProperties: { display: 'inline-block' } }),
    presetTypography()
  ],
});