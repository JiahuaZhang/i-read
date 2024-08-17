import { defineConfig, presetAttributify, presetIcons, presetTypography, presetUno } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({ extraProperties: { display: 'inline-block' } }),
    presetTypography()
  ],
  theme: {
    fontFamily: {
      Arial: ["Arial"],
      Georgia: ["Georgia"],
      Helvetica: ["Helvetica"],
      Tahoma: ["Tahoma"],
      方正黑体: ["方正黑体"],
      方正书宋: ["方正书宋"],
      方正仿宋: ["方正仿宋"],
      方正楷体: ["方正楷体"],
      思源黑体: ["思源黑体"],
      思源宋体: ["思源宋体"],
    },
  }
});