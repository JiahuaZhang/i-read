import { Radio, Space, Tabs } from "antd";
import { useRecoilState } from "recoil";
import { bookConfigState } from "~/utils/state/book.config";

const all_english_fonts = [
  "font-Arial",
  "font-Georgia",
  "font-Helvetica",
  "font-Tahoma"
];
const all_chinese_fonts = [
  "font-方正黑体",
  "font-方正书宋",
  "font-方正仿宋",
  "font-方正楷体",
  "font-思源黑体",
  "font-思源宋体"
];

export const FontFamilyConfig = () => {
  const [
    { config: { chinseFontFamily, englishFontFamily } },
    setConfig
  ] = useRecoilState(bookConfigState);

  return (
    <Tabs centered>
      <Tabs.TabPane tab="English" key="english">
        <Radio.Group
          value={englishFontFamily}
          className="grid w-full place-items-center"
        >
          <Space direction="vertical">
            {all_english_fonts.map((font) => (
              <Radio.Button
                key={font}
                value={font}
                className={`w-full text-center ${font}`}
                onClick={() => {
                  if (font === englishFontFamily) {
                    setConfig((prev) => ({
                      ...prev,
                      config: {
                        ...prev.config,
                        englishFontFamily: "",
                        fontFamily: prev.config.chinseFontFamily
                      }
                    }));
                  } else {
                    setConfig((prev) => ({
                      ...prev,
                      config: {
                        ...prev.config,
                        englishFontFamily: font,
                        fontFamily: `${font} ${prev.config.chinseFontFamily}`
                      }
                    }));
                  }
                }}
              >
                {font.split("-")[1]}
              </Radio.Button>
            ))}
          </Space>
        </Radio.Group>
        <p className={`px-2 indent-0 text-xl ${englishFontFamily}`}>
          The quick brown fox jumped over the lazy dog
        </p>
      </Tabs.TabPane>
      <Tabs.TabPane tab="中文" key="chinese">
        <Radio.Group
          className="grid w-full place-items-center"
          value={chinseFontFamily}
        >
          <Space direction="vertical">
            {all_chinese_fonts.map((font) => (
              <Radio.Button
                className={`w-full text-center ${font}`}
                key={font}
                value={font}
                onClick={() => {
                  if (font === chinseFontFamily) {
                    setConfig((prev) => ({
                      ...prev,
                      config: {
                        ...prev.config,
                        chinseFontFamily: "",
                        fontFamily: prev.config.englishFontFamily
                      }
                    }));
                  } else {
                    setConfig((prev) => ({
                      ...prev,
                      config: {
                        ...prev.config,
                        chinseFontFamily: font,
                        fontFamily: `${font} ${prev.config.englishFontFamily}`
                      }
                    }));
                  }
                }}
              >
                {font.split("-")[1]}
              </Radio.Button>
            ))}
          </Space>
        </Radio.Group>
        <p className={`text-center indent-0 text-2xl ${chinseFontFamily}`}>
          天地玄黄，宇宙洪荒。
          <br />
          日月盈昃，辰宿列张。
          <br />
          寒来暑往，秋收冬藏。
          <br />
          闰余成岁，律吕调阳。
        </p>
      </Tabs.TabPane>
    </Tabs>
  );
};
